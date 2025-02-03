import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsSearchInfo } from '../models/analytics.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private translate: TranslateService) {}

  private _sessionId: string;

  getSessionId() {
    if (!this._sessionId || this._sessionId.startsWith('_')) {
      const amcvCookie = document.cookie
        .split(';')
        .find((c) => c.trim().startsWith('AMCV_'));
      if (amcvCookie) {
        const cookieContent = decodeURI(amcvCookie).split('|');
        const idIndex = cookieContent.indexOf('MCMID') + 1;
        this._sessionId = cookieContent[idIndex];
        console.info('Adobe ID', this._sessionId);
      } else if (!this._sessionId || !this._sessionId.startsWith('_')) {
        console.log('No Adobe cookie detected, generating unique session id.');
        this._sessionId = '_' + uuidv4();
        console.log('Unique session id', this._sessionId);
      }
    }

    return this._sessionId;
  }

  pageView() {
    const currentUrl = window.location.href;
    const viewportSize =
      window.innerWidth > 1200
        ? 'large'
        : window.innerWidth > 768
        ? 'medium'
        : 'small';

    const dtmEvent = {
      attributes: {
        event: 'pageview',
        siteInfo: {
          webProperty: 'aircanada.com',
          name: 'sset',
          type: 'responsive',
          environment: 'azure',
          viewportSize: viewportSize,
          appVersion: '',
          buildDate: '',
          siteEdition: 'ca',
          language: this.translate.currentLang
        },
        pageInfo: {
          pageName: 'azure|sset',
          pageTitle: 'Flight Disruption Compensation Eligibility',
          url: currentUrl,
          fullUrl: currentUrl,
          previousPageName: null,
          previousPageURL: null,
          previousPageLinkName: null,
          pageHierarchy: {
            level1: null,
            level2: null,
            level3: null,
            level4: null
          },
          pageType: 'sset',
          accessibility: 'true',
          timeStamp: moment().format('YYYY-MM-DD dddd_hh:mm_A')
        }
      }
    };

    // Uncomment to debug analytics console.log(dtmEvent);
    (<any>window).digitalDataAC.events.push(dtmEvent);
  }

  formSubmit(info: AnalyticsSearchInfo) {
    const dtmEvent = {
      eventInfo: {
        eventName: 'sset-form-cta',
        timeStamp: new Date()
      },
      attributes: {
        event: 'userAction',
        searchInfo: {
          bookingID: info.bookingID,
          departureDate: info.departureDate,
          statusCode: info.statusCode,
          statusDescription: info.statusDescription,
          disruptionCode: info.disruptionCode
        }
      }
    };

    (<any>window).digitalDataAC.events.push(dtmEvent);
  }
}
