import { AnalyticsSearchInfo } from '../../models/analytics.interface';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private _sessionId: string;

  constructor(private translate: TranslateService) {}

  formSubmit(info: AnalyticsSearchInfo): void {
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
          disruptionCode: info.disruptionCode,
          statusCode: info.statusCode,
          statusDescription: info.statusDescription
        }
      }
    };
    (<any>window).digitalDataAC.events.push(dtmEvent);
  }

  getSessionId(): string {
    if (!this._sessionId || this._sessionId.startsWith('_')) {
      const amcvCookie = document.cookie
        .split(';')
        .find((c) => c.trim().startsWith('AMCV_'));
      if (amcvCookie) {
        const cookieContent = decodeURI(amcvCookie).split('|');
        const idIndex = cookieContent.indexOf('MCMID') + 1;
        this._sessionId = cookieContent[idIndex];
      } else if (!this._sessionId || !this._sessionId.startsWith('_')) {
        console.log('No Adobe cookie detected, generating unique session id.');
        this._sessionId = '_' + uuidv4();
        console.log('Unique session id', this._sessionId);
      }
    }

    return this._sessionId;
  }

  pageView(): void {
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
        pageInfo: {
          accessibility: 'true',
          fullUrl: currentUrl,
          pageHierarchy: {
            level1: null,
            level2: null,
            level3: null,
            level4: null
          },
          pageName: 'azure|sset',
          pageTitle: 'Flight Disruption Compensation Eligibility',
          pageType: 'sset',
          previousPageLinkName: null,
          previousPageName: null,
          previousPageURL: null,
          timeStamp: moment().format('YYYY-MM-DD dddd_hh:mm_A'),
          url: currentUrl
        },
        siteInfo: {
          appVersion: '',
          buildDate: '',
          environment: 'azure',
          language: this.translate.currentLang,
          name: 'sset',
          siteEdition: 'ca',
          type: 'responsive',
          viewportSize: viewportSize,
          webProperty: 'aircanada.com'
        }
      }
    };

    // Uncomment to debug analytics console.log(dtmEvent);
    (<any>window).digitalDataAC.events.push(dtmEvent);
  }
}
