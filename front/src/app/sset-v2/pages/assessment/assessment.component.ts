import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {
  DynamicsWebRequest,
  DynamicsWebRequestResponse,
  ExpenseRequest,
  OriginDestinationRequest
} from '../../models/api-dynamics-web-request.interface';
import { environment } from '../../../../environments/environment';
import { ExpenseDetails } from '../../models/expense.interface';
import { map, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OriginDestinationGatewayResponse } from '../../models/api-gateway.interface';
import { Pages } from '../../constants/common';
import { PassengerDetailsComponent } from '../../components/passenger-details/passenger-details.component';
import { PassengerDetailsService } from '../../services/passenger-details/passenger-details.service';
import { PassengerSubmission } from '../../models/passenger.interface';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { ReviewExpensesComponent } from '../../components/review-expenses/review-expenses.component';
import { SsetStoreService } from '../../sset-store.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  @ViewChild(PassengerDetailsComponent)
  passengerDetailsComponent: PassengerDetailsComponent;
  @ViewChild(ReviewExpensesComponent)
  reviewExpenseComponent: ReviewExpensesComponent;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  activeTranslation: string = 'en-CA';
  addedClaims: Claim[] = [];
  addedPassengerList: PassengerSubmission[];
  addExpenseOnly: boolean = false;
  assessmentCode: number;
  assessmentPage: string;
  canClaimExpense: boolean = true;
  claimAdded: boolean = false;
  claimIndex: number = 0;
  confirmationResult: string = '';
  error: boolean = false;
  isManualFlow: boolean;
  loading: boolean = false;
  ODResponse: OriginDestinationGatewayResponse[];
  Pages = Pages;
  pnrNumber: string = '';
  ticketNumber: string = '';
  translationDynamicsObj = {
    'en-CA': 948140000,
    'fr-CA': 948140001
  };
  validationError: string = '';

  constructor(
    private analytics: AnalyticsService,
    private changeDirectorRef: ChangeDetectorRef,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public assessmentService: AssessmentService,
    public passengerDetailsService: PassengerDetailsService,
    public store: SsetStoreService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.assessmentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flag) => (this.loading = flag));

    this.assessmentService
      .getAssessmentPage$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((page) => (this.assessmentPage = page));

    this.assessmentService.manualFlow$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => (this.isManualFlow = value));

    this.assessmentService.assessmentResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.assessmentService.addClaims = [
          ...data.originDestination.map((o, i) => {
            return {
              ...o,
              isClaimingCompensation: false,
              index: i,
              pnrNumber: data.pnrNumber
            };
          })
        ];
        this.canClaimExpense = data.originDestination.some(
          (o) => o.isExpenseButtonEnabled
        );
        this.pnrNumber = data.pnrNumber;
        this.assessmentCode = data?.errorCode;
      });

    this.assessmentService.ticketNumber$
      .pipe(takeUntil(this.destroy$))
      .subscribe((ticket) => (this.ticketNumber = ticket));

    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((claims) => {
        this.claimAdded = claims.some((c) => c.isClaimingCompensation);
        this.addedClaims = [...claims].sort((c1, c2) => c1.index - c2.index);
      });

    this.passengerDetailsService.passengerSubmissionList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((passengerList) => {
        if (passengerList.length > 0) {
          this.addedPassengerList = passengerList;
        }
      });

    this.assessmentService.claimIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe((index) => (this.claimIndex = index));

    /* Retrieve language param from route and set lang if exists */
    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.translate.use(lang);
          this.activeTranslation = lang;
          this.store.result$
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
              if (result) {
                this.assessmentService.assessmentResponse = result;
              } else {
                this.router.navigateByUrl('/' + lang);
              }
            });
        } else {
          /* If lang is not supported, redirect to default lang */
          this.router.navigateByUrl('/' + this.translate.defaultLang);
        }
      });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.router.navigateByUrl('/' + e.lang + '/assessment');
        document.documentElement.setAttribute('lang', e.lang);
      });

    this.assessmentService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flag) => (this.error = flag));
  }

  ngAfterContentChecked(): void {
    this.changeDirectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  claimHasExpense(claimIndex: number): boolean {
    return (
      this.addedClaims[claimIndex]?.expenses &&
      this.addedClaims[claimIndex]?.expenses?.length > 0
    );
  }

  claimingCompensation(): boolean {
    return this.addedClaims.some((c) => c.isClaimingCompensation);
  }

  claimingExpense(): boolean {
    return this.addedClaims.some(
      (c) => c?.expenses?.length && c.expenses.length > 0
    );
  }

  confirmDialog(): string {
    let title = '';
    let text = '';
    this.translate
      .get('SSET_V2.ASSESSMENT.EXPENSE_DETAILS.CONFIRMATION_DIALOG.TITLE')
      .subscribe((translation: string) => {
        title = translation;
      });
    this.translate
      .get('SSET_V2.ASSESSMENT.EXPENSE_DETAILS.CONFIRMATION_DIALOG.TEXT')
      .subscribe((translation: string) => {
        text = translation;
      });
    const dialogData = new ConfirmDialogModel(title, text);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.confirmationResult = dialogResult;

      if (this.confirmationResult.toString() === 'true') {
        this.assessmentService.setAssessmentPage$(Pages.PassengerDetails);
      }
    });

    return this.confirmationResult.toString();
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

  private getDynamicsWebRequestPayload(): DynamicsWebRequest {
    const originDestinations: OriginDestinationRequest[] = this.addedClaims
      .filter(
        (c) => c?.flights && (c.isClaimingCompensation || c?.expenses?.length)
      )
      .map((c) => {
        return {
          arrivalAirportCode:
            this.assessmentCode === 30
              ? c.flights[0]?.scheduledArrivalAirport?.slice(0, 3)
              : c.flights[0]?.scheduledArrivalAirport,
          assessmentId: c.assessmentId,
          departureAirportCode:
            this.assessmentCode === 30
              ? c.flights[0]?.scheduledDepartureAirport?.slice(0, 3)
              : c.flights[0]?.scheduledDepartureAirport,
          expenses: this.formatExpensesToRequestType(c?.expenses),
          flightDate: c.flights[0]?.scheduledDepartureDate,
          flightNumber: c.flights[0]?.flightNumber?.toString(),
          pnrNumber: c.pnrNumber
        };
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
    this.route.paramMap
      .pipe(map((p) => p.get('lang')))
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.translate.use(lang);
          this.router.navigateByUrl(`/${lang}/${path}`);
        } else {
          this.router.navigateByUrl(`/${this.translate.defaultLang}/${path}`);
        }
      });
  }

  onClickHomePage(): void {
    this.store.result = undefined;
    this.assessmentService.resetSearch$();
    this.route.paramMap
      .pipe(map((p) => p.get('lang')))
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.translate.use(lang);
          this.router.navigateByUrl('/' + lang);
        } else {
          this.router.navigateByUrl('/' + this.translate.defaultLang);
        }
      });
  }

  onClickNavigateExpenseClaim(
    claimIndex: number,
    navigateToExpensesPage?: boolean
  ): void {
    this.assessmentService.claimIndex = claimIndex;
    if (navigateToExpensesPage) {
      this.assessmentService.setAssessmentPage$(Pages.Expenses);
    }
  }

  onClickNavigatePage(nextPage: string, currentPage?: string): void {
    if (currentPage === Pages.PassengerDetails && nextPage === Pages.Expenses) {
      if (this.passengerDetailsComponent.onSubmit()) {
        this.assessmentService.claimIndex = 0;
        this.assessmentService.setAssessmentPage$(nextPage);
      }
      return;
    }
    if (
      currentPage === Pages.ReviewExpenses &&
      nextPage === Pages.ReviewClaim &&
      !this.reviewExpenseComponent.onSubmit()
    ) {
      return;
    }
    if (
      currentPage === Pages.FlightDetails &&
      nextPage === Pages.PassengerDetails &&
      !this.claimAdded
    ) {
      var confirmationResult = this.confirmDialog();
      if (this.confirmationResult !== 'true') {
        this.confirmationResult = '';
        return;
      }
    }
    this.assessmentService.setAssessmentPage$(nextPage);
  }

  onClickSubmitClaim(): void {
    let dynamicsWebRequestPayload = this.getDynamicsWebRequestPayload();

    this.reCaptchaV3Service.execute(
      environment.recaptchaSiteKey,
      'find',
      (token) => {
        dynamicsWebRequestPayload = {
          ...dynamicsWebRequestPayload,
          recaptchaResponseToken: token
        };
        this.assessmentService.loading = true;
        this.assessmentService
          .submitClaim$(dynamicsWebRequestPayload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data: DynamicsWebRequestResponse) => {
              this.assessmentService.loading = false;
              if (data) {
                if (data?.exceptionMessage) {
                  this.validationError = data?.exceptionMessage;
                } else {
                  this.validationError = '';
                  this.assessmentService.claimSubmissionResponse = data;

                  let successfulDynamicsResponse = true;
                  for (let i = 0; i < data.originDestinations.length; i++) {
                    if (
                      data.originDestinations[i].passengers.some(
                        (p) =>
                          !p.compensationClaimWebRequestResponse.isSuccessful &&
                          !p.expenseClaimWebRequestResponse.isSuccessful
                      )
                    ) {
                      successfulDynamicsResponse = false;
                      break;
                    }
                  }

                  if (successfulDynamicsResponse) {
                    this.assessmentService.setAssessmentPage$(
                      Pages.Confirmation
                    );
                    this.goToPage(Pages.Confirmation.toLowerCase());
                  } else {
                    this.assessmentService.setAssessmentPage$(Pages.Incomplete);
                    this.goToPage(Pages.Incomplete.toLowerCase());
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
