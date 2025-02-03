import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AssessmentService } from '../../services/assessment/assessment.service';
import {
  Claim,
  ClaimSubmissionResponse
} from '../../models/assessment.interface';
import { Component, OnInit } from '@angular/core';
import {
  DynamicsWebRequest,
  DynamicsWebRequestResponse,
  ExpenseRequest,
  OriginDestinationRequest
} from '../../models/api-dynamics-web-request.interface';
import { environment } from '../../../../environments/environment';
import { ExpenseDetails } from '../../models/expense.interface';
import { Pages } from '../../constants/common';
import { PassengerSubmission } from '../../models/passenger.interface';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { SsetStoreService } from '../../sset-store.service';
import { Subject, map, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PassengerDetailsService } from '../../services/passenger-details/passenger-details.service';

@Component({
  selector: 'app-incomplete',
  templateUrl: './incomplete.component.html',
  styleUrls: ['./incomplete.component.scss']
})
export class IncompleteComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  activeTranslation: string = 'en';
  addedPassengerList: PassengerSubmission[];
  assessmentCode: number;
  addedClaims: Claim[];
  claimsFailed: Claim[];
  claimsResult: ClaimSubmissionResponse[];
  claimsSuccess: Claim[];
  error: boolean = false;
  failed: number = 1;
  isManualFlow: boolean;
  loading: boolean = false;
  ticketNumber: string = '';
  translationDynamicsObj = {
    'en-CA': 948140000,
    'fr-CA': 948140001
  };
  validationError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private analytics: AnalyticsService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    public assessmentService: AssessmentService,
    public passengerDetailsService: PassengerDetailsService,
    public store: SsetStoreService
  ) {}

  ngOnInit(): void {
    this.assessmentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flag) => (this.loading = flag));

    this.assessmentService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flag) => (this.error = flag));

    this.assessmentService.manualFlow$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => (this.isManualFlow = value));

    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((addedClaims) => {
        if (addedClaims?.length) {
          this.addedClaims = [...addedClaims].sort(
            (c1, c2) => c1.index - c2.index
          );
          this.addedClaims = this.addedClaims.filter(
            (c) =>
              c.isClaimingCompensation || (c.expenses && c.expenses.length > 0)
          );
          this.filterClaims();
        } else {
          this.goToPage(Pages.Home);
        }
      });

    this.assessmentService.claimSubmissionResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response?.originDestinations?.length) {
          this.claimsResult = [...response.originDestinations];
          this.filterClaims();
        } else {
          this.goToPage(Pages.Home);
        }
      });

    this.passengerDetailsService.passengerSubmissionList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((passengerList) => {
        if (passengerList.length > 0) {
          this.addedPassengerList = passengerList;
        } else {
          this.goToPage(Pages.Home);
        }
      });

    this.assessmentService.ticketNumber$
      .pipe(takeUntil(this.destroy$))
      .subscribe((ticket) => (this.ticketNumber = ticket));

    this.assessmentService.assessmentResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.assessmentCode = result?.errorCode));

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.router.navigateByUrl('/' + e.lang + '/incomplete');
        document.documentElement.setAttribute('lang', e.lang);
      });

    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.translate.use(lang);
          this.activeTranslation = lang;
        } else {
          this.activeTranslation = this.translate.defaultLang;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  filterClaims(): void {
    this.claimsSuccess = [];
    this.claimsFailed = [];

    if (this.addedClaims?.length && this.claimsResult?.length) {
      this.addedClaims.forEach((claim) => {
        const result = this.claimsResult.find(
          (result) => result.index === claim.index
        );
        if (
          !result?.passengers.filter(
            (p) => p.compensationClaimWebRequestResponse.dynamicsWebRequestId
          ).length
        ) {
          this.claimsFailed.push(claim);
        } else if (result) {
          this.claimsSuccess.push(claim);
        }
      });
    }
  }

  formatExpensesToRequestType(
    expenses: ExpenseDetails[] | undefined
  ): ExpenseRequest[] | undefined {
    if (!expenses) return undefined;
    const expenseRequest: ExpenseRequest[] = expenses.map((e) => {
      return {
        amount: Number(e.amount),
        currencyCode: e.currencyCode,
        expenseTypeDynamicsId: e.expenseTypeDynamicsId,
        receipts: e.receiptFileRequest,
        ...(e.checkInDate && { checkInDate: e.checkInDate }),
        ...(e.checkOutDate && { checkOutDate: e.checkOutDate }),
        ...(e.disruptionCity && {
          disruptionCityAirportCode: e.disruptionCity.substring(0, 3)
        }),
        ...(e.mealTypeDynamicsId && {
          mealTypeDynamicsId: e.mealTypeDynamicsId
        }),
        ...(e.transactionDate && { transactionDate: e.transactionDate }),
        ...(e.transportationTypeDynamicsId && {
          transportationTypeDynamicsId: e.transportationTypeDynamicsId
        })
      };
    });
    return expenseRequest;
  }

  formatPassengers(passengerList: PassengerSubmission[]) {
    return passengerList.map((p) => {
      return {
        ...p,
        isClaimingCompensation: p.isClaimingCompensation
          ? p.isClaimingCompensation
          : this.addedClaims.filter((c) => c.isClaimingCompensation).length > 0,
        isClaimingExpenses:
          this.addedClaims.filter((c) => c?.expenses?.length).length > 0
      };
    });
  }

  private getClaimDetailsObject(): DynamicsWebRequest {
    const originDestinations: OriginDestinationRequest[] = [];

    this.claimsFailed.forEach((c) => {
      if (c?.flights) {
        const originDestination: OriginDestinationRequest = {
          arrivalAirportCode:
            this.assessmentCode === 30
              ? c?.flights[0]?.scheduledArrivalAirport?.slice(0, 3)
              : c?.flights[0]?.scheduledArrivalAirport,
          assessmentId: c?.assessmentId,
          departureAirportCode:
            this.assessmentCode === 30
              ? c?.flights[0]?.scheduledDepartureAirport?.slice(0, 3)
              : c?.flights[0]?.scheduledDepartureAirport,
          expenses: this.formatExpensesToRequestType(c?.expenses),
          flightDate:
            this.assessmentCode === 30
              ? new Date(c?.flights[0]?.scheduledDepartureDate)?.toISOString()
              : c?.flights[0]?.scheduledDepartureDate,
          flightNumber: c?.flights[0]?.flightNumber?.toString(),
          pnrNumber: c?.pnrNumber
        };
        originDestinations.push(originDestination);
      }
    });

    const dynamicsWebRequestPayload: DynamicsWebRequest = {
      isManualFlow: this.isManualFlow,
      originDestinations: [...originDestinations],
      passengers: this.formatPassengers(this.addedPassengerList),
      portalLanguageDynamicsId:
        this.translationDynamicsObj[this.activeTranslation + '-CA'],
      recaptchaResponseToken: '',
      sessionId: this.analytics.getSessionId()
    };
    return dynamicsWebRequestPayload;
  }

  goToPage(path: string): void {
    this.store.result = undefined;
    this.route.paramMap
      .pipe(map((p) => p.get('lang')))
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.translate.use(lang);
          this.router.navigateByUrl(
            `/${lang}${path === Pages.Home ? '' : `/${path}`}`
          );
        } else {
          this.router.navigateByUrl('/' + this.translate.defaultLang);
        }
      });
  }

  onClickResubmitClaim(): void {
    let claimDetailsObj = this.getClaimDetailsObject();

    this.reCaptchaV3Service.execute(
      environment.recaptchaSiteKey,
      'find',
      (token) => {
        claimDetailsObj = {
          ...claimDetailsObj,
          recaptchaResponseToken: token
        };
        this.assessmentService.loading = true;
        this.assessmentService
          .submitClaim$(claimDetailsObj)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data: DynamicsWebRequestResponse) => {
              this.assessmentService.loading = false;
              if (data) {
                if (data?.exceptionMessage) {
                  this.validationError = data?.exceptionMessage;
                } else {
                  this.validationError = '';
                  // data.originDestinations = data.originDestinations.map((claim, i) => ({ ...claim, index: claimDetailsObj?.originDestinations[i]?.index }));
                  this.assessmentService.claimSubmissionResponse = data;

                  let successfulDynamicsResponse = true;
                  for (let i = 0; i < data.originDestinations.length; i++) {
                    if (
                      data.originDestinations[i].passengers.some(
                        (p) =>
                          !p.compensationClaimWebRequestResponse
                            .dynamicsWebRequestId
                      )
                    ) {
                      successfulDynamicsResponse = false;
                      break;
                    }
                  }

                  if (successfulDynamicsResponse) {
                    this.goToPage(Pages.Confirmation.toLowerCase());
                  } else {
                    this.failed++;
                    if (this.failed > 3) {
                      this.assessmentService.error = true;
                    }
                  }
                }
              } else {
                this.assessmentService.error = true;
              }
            },
            error: (error) => {
              this.assessmentService.loading = false;
              this.assessmentService.error = true;
            }
          });
      },
      {
        useGlobalDomain: false
      }
    );
  }
}
