import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SsetStoreService } from '../../sset-store.service';
import { EligibilityStatus } from '../../models/eligibility-status.enum';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { IEligibilityResponse } from '../../models/api-gateway.interface';

@Component({
  selector: 'app-passenger-eligibility',
  templateUrl: './passenger-eligibility.component.html',
  styleUrls: ['./passenger-eligibility.component.scss']
})
export class PassengerEligibilityComponent implements OnInit, OnDestroy {
  @Output() tryAgain: EventEmitter<any> = new EventEmitter();
  @ViewChild('response') response: ElementRef;
  status: EligibilityStatus;
  eligibilityStatus = EligibilityStatus;

  icon: {
    title?: string;
    path?: string;
  } = {};

  action?: 'SUBMIT' | 'RETRY';

  reason?: string;

  failures = 0;

  pendingPeriod = undefined;

  caseNumber = undefined;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public store: SsetStoreService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.store.result$.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this.setEligibility(r);

      setTimeout(() => {
        if (this.response && this.response.nativeElement) {
          this.response.nativeElement.focus();
        }
      }, 0);
    });
  }

  setEligibility(r: IEligibilityResponse): void {
    // in case of error 500 or no responses, hide the content and reset local state
    if (typeof r === 'undefined') {
      this.status = undefined;
      this.reason = undefined;
      this.resetIcon();
      this.action = undefined;
      return;
    }

    if (
      r.disruptionCode === 70005 ||
      r.disruptionCode === 10002 ||
      r.disruptionCode === 21002
    ) {
      this.status = EligibilityStatus.ELIGIBLE;
    } else if (r.disruptionCode === 80001 || r.disruptionCode === 80002) {
      this.status = EligibilityStatus.UNABLEDETERMINATION;
    } else {
      this.status = r.statusDescription;
    }

    this.reason = r.arrivalDelayIATACode
      ? r.arrivalDelayIATACode.toString()
      : r.secondaryCancellationReasonCode
      ? r.secondaryCancellationReasonCode
      : undefined;

    switch (this.status) {
      case EligibilityStatus.ELIGIBLE:
        this.icon.title = 'CHECKMARK';
        this.icon.path = 'icn-confirmation-circle';
        this.action = 'SUBMIT';
        this.failures = 0;
        break;

      case EligibilityStatus.PENDING:
        this.icon.title = 'INFO';
        this.icon.path = 'icn-info';
        this.action = undefined;
        this.failures = 0;
        this.pendingPeriod =
          r.disruptionCode === 20004 || r.disruptionCode === 20003 ? 3 : 5;
        break;

      case EligibilityStatus.NOTELIGIBLE:
        this.icon.title = 'X';
        this.icon.path = 'icn-cancel-expand';
        this.action = undefined;
        this.failures = 0;
        break;

      case EligibilityStatus.DUPLICATEREQUEST:
        this.icon.title = 'X';
        this.icon.path = 'icn-cancel-expand';
        this.action = undefined;
        this.failures = 0;
        this.caseNumber = r.originalDynamicCaseNumber;
        break;

      case EligibilityStatus.OUTSIDEPERIOD:
        this.icon.title = 'X';
        this.icon.path = 'icn-cancel-expand';
        this.action = undefined;
        this.failures = 0;
        break;

      case EligibilityStatus.OUTSIDEAPPR:
        this.icon.title = 'Warning';
        this.icon.path = 'icn-error-warning';
        this.action = undefined;
        this.failures = 0;
        break;

      case EligibilityStatus.OAL:
        this.icon.title = 'Warning';
        this.icon.path = 'icn-error-warning';
        this.action = undefined;
        this.failures = 0;
        break;

      case EligibilityStatus.NODISRUPTION:
        this.icon.title = 'WARNING';
        this.icon.path = 'icn-error-warning';
        this.action = undefined;
        this.failures = 0;
        this.reason = undefined; // Don't display disruption reasons
        break;

      case EligibilityStatus.OVER365:
        this.icon.title = 'X';
        this.icon.path = 'icn-cancel-expand';
        this.action = undefined;
        this.failures = 0;
        this.reason = undefined; // Don't display disruption reasons
        break;

      case EligibilityStatus.UNABLEDETERMINATION:
        this.icon.title = 'X';
        this.icon.path = 'icn-info';
        this.action = undefined;
        this.failures = 0;
        break;

      case EligibilityStatus.NOMATCH:
      default:
        this.icon.title = 'WARNING';
        this.icon.path = 'icn-error-warning';
        this.action = undefined;
        this.failures++;
        break;
    }
    console.log(this.caseNumber);
    this.resetIcon();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onAction(action?: string) {
    if (typeof action === 'undefined') {
      action = this.action;
    }
    switch (action) {
      case 'SUBMIT':
        this.store.requestForm$.pipe(take(1)).subscribe((f) => {
          const formData = {
            ac_first_name: f.firstName,
            ac_last_name: f.lastName,
            ac_flight_date: f.date
          };
          formData[
            f.pnrTicket.length > 6 ? 'ac_ticket_number' : 'ac_booking_number'
          ] = f.pnrTicket;
          this.postToDynamics(formData);
        });

        break;
      case 'RETRY':
        this.tryAgain.emit();
        this.store.reset();
        this.status = undefined;
        this.action = undefined;
        this.reason = undefined;
        this.pendingPeriod = undefined;

        break;
      default:
        console.error('not implemented');
    }
  }

  postToDynamics(formData) {
    const form = document.createElement('form');

    const lang = (function (lang) {
      switch (lang) {
        case 'en':
          return 'en-CA';
        case 'fr':
          return 'fr-CA';
        case 'es':
          return 'es-ES';
        default:
          return 'en-CA';
      }
    })(this.translate.currentLang);
    form.method = 'POST';
    form.target = '_blank';
    form.classList.add('d-none');
    form.action = environment.dynamicsUrl + lang + '/post-redirect/';

    const params = {
      lang: lang,
      targetPage: 'flight-delay-or-cancellation',
      data: JSON.stringify(formData)
    };

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();

    // Remove hidden form from dom to avoid several refs
    setTimeout(() => form.remove());

    this.store.createCase();
  }

  resetIcon() {
    const icon = { ...this.icon };
    this.icon = {};
    setTimeout(() => (this.icon = icon));
  }
}
