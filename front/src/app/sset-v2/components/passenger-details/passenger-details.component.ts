import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../services/assessment/assessment.service';
import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  DEFAULT_PASSENGER_DETAILS,
  DEFAULT_PASSENGER_DETAILS_LIST
} from '../../defaults/assessment.default';
import { map, Subject, take, takeUntil } from 'rxjs';
import { Passenger } from '../../models/passenger.interface';
import { PassengerDetailsFormComponent } from './passenger-details-form/passenger-details-form.component';
import { PassengerDetailsService } from '../../services/passenger-details/passenger-details.service';

@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.scss']
})
export class PassengerDetailsComponent implements OnInit, OnDestroy {
  @ViewChildren('additionalPassengerDetails')
  additionalPassengerDetails: QueryList<PassengerDetailsFormComponent>;
  @ViewChild('passengerDetails')
  passengerDetails: PassengerDetailsFormComponent;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  aeroplanStatusOptions: string[];
  countryDynamicsId: number;
  countryOptions: string[];
  formData: any;
  isAcknowledgementAgreed = false;
  isManualFlow: boolean;
  isPermissionsAgreed = false;
  manualFlowPrimaryApplicantTicketNumber: string;
  passengerDetailsList: Passenger[] = [...DEFAULT_PASSENGER_DETAILS_LIST];
  provinceDynamicsId: number;
  titleDynamicsId: number;
  titleOptions: string[];
  isAcknowledgementChecked = true;
  isPermissionChecked = true;

  constructor(
    private assessmentService: AssessmentService,
    private passengerDetailsService: PassengerDetailsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const assessmentDomElement = document.getElementById(
      'assessmentPageContainer'
    );
    if (assessmentDomElement) {
      assessmentDomElement.scrollIntoView({ behavior: 'smooth' });
    }

    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        this.assessmentService.loading = true;
        this.passengerDetailsService
          .getPassengerFormData$(lang)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              this.assessmentService.loading = false;
              this.formData = { ...data };
              this.assessmentService.error = false;
              this.titleOptions = data?.titles?.map(
                (title) => title?.description
              );
              this.countryOptions = data?.countries?.map(
                (country) => country?.description
              );
              this.aeroplanStatusOptions = data?.starAllianceTiers?.map(
                (aeroplanStatus) => aeroplanStatus?.description
              );
            },
            error: (error) => {
              this.assessmentService.loading = false;
              this.assessmentService.error = true;
            }
          });
      });

    this.assessmentService.manualFlow$.pipe(take(1)).subscribe((value) => {
      if (value) {
        this.assessmentService.addedClaims$
          .pipe(take(1))
          .subscribe((result) => {
            this.manualFlowPrimaryApplicantTicketNumber =
              result[0].ticketNumber;
          });
      }
      this.isManualFlow = value;
    });

    this.passengerDetailsService.passengerDetailsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((passengerDetailsList) => {
        if (passengerDetailsList.length > 0) {
          this.passengerDetailsList = [...passengerDetailsList];
          return;
        }
        this.assessmentService.assessmentResponse$
          .pipe(takeUntil(this.destroy$))
          .subscribe((result) => {
            if (result?.passenger) {
              this.passengerDetailsList[0] = {
                ...DEFAULT_PASSENGER_DETAILS,
                aeroplanDynamicsId: this.setAeroplanDynamicsId(result?.passenger?.acStarAllianceTierDynamicsId),
                firstName: result?.passenger?.firstName,
                freqFlyerNumber: result?.passenger?.aeroPlanNumber,
                isClaimingCompensation: this.isManualFlow,
                lastName: result?.passenger?.lastName,
                order: 0,
                ticketNumber: result?.passenger?.ticketNumber
              };
              result?.additionalPassengers
                ?.filter((p) => p?.firstName)
                ?.forEach((p, i) => {
                  const order = i + 1;
                  this.passengerDetailsList[order] = {
                    ...DEFAULT_PASSENGER_DETAILS,
                    firstName: p.firstName,
                    isClaimingCompensation: this.isManualFlow,
                    isPrimaryApplicant: false,
                    lastName: p.lastName,
                    isSelected: false,
                    order,
                    ticketNumber: p?.ticketNumber
                  };
                });
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  get additionalPassengerDetailsList() {
    return this.passengerDetailsList?.length > 1
      ? this.passengerDetailsList.slice(1)
      : [];
  }

  get primaryPassengerDetail() {
    return this.passengerDetailsList[0];
  }

  get isSelected() {
    return (
      this.additionalPassengerDetailsList.filter((p) => p.isSelected).length > 0
    );
  }

  checkAcknowlegmentAgreement(): boolean {
    if (!this.isAcknowledgementAgreed || !this.isPermissionsAgreed) {
      if (!this.isAcknowledgementAgreed) {
        this.isAcknowledgementChecked = false;
      }
      if (!this.isPermissionsAgreed) {
        this.isPermissionChecked = false;
      }
      return false;
    }
    return true;
  }

  onClickAddPassenger(): void {
    this.passengerDetailsService.passengerDetailsList = [
      ...this.passengerDetailsList,
      ...[
        {
          ...DEFAULT_PASSENGER_DETAILS,
          isPrimaryApplicant: false,
          isSelected: true,
          order: this.passengerDetailsList.length,
          ticketNumber: ''
        }
      ]
    ];
  }

  onClickRemovePassenger(order: number): void {
    this.passengerDetailsList = [
      ...this.passengerDetailsList.filter((p) => p?.order !== order)
    ];
  }

  onIsAcknowledgementAgreedClicked(): void {
    this.isAcknowledgementAgreed = !this.isAcknowledgementAgreed;
    this.isAcknowledgementChecked = true;
  }

  onIsPermissionsAgreedClicked(): void {
    this.isPermissionsAgreed = !this.isPermissionsAgreed;
    this.isPermissionChecked = true;
  }

  onPassengerChange(passenger): void {
    passenger.isSelected = !passenger.isSelected;
  }

  onSubmit(): boolean {
    const additionalPassengerComponents =
      this.additionalPassengerDetails.toArray();

    const primaryPassengerFormDetails = this.passengerDetails.onSubmit();
    const additionalPassengerFormsDetails = additionalPassengerComponents.map(
      (component) => component.onSubmit()
    );

    const allPassengersFormsDetails = [
      primaryPassengerFormDetails,
      ...additionalPassengerFormsDetails
    ];

    const isValid = (() => {
      const isSinglePassengerSelected =
        allPassengersFormsDetails.filter((details) => details.isSelected)
          .length === 1;

      const areAllSelectedPassengersValid = allPassengersFormsDetails
        .filter((details) => details.isSelected)
        .every((details) => details.isValid);

      return isSinglePassengerSelected
        ? areAllSelectedPassengersValid
        : this.checkAcknowlegmentAgreement() && areAllSelectedPassengersValid;
    })();

    if (!isValid) return false;

    const updatedFormsDetails = allPassengersFormsDetails.map(
      (details, index) => {
        const ticketNumber = details.isPrimaryApplicant
          ? this.isManualFlow
            ? this.manualFlowPrimaryApplicantTicketNumber
            : this.passengerDetailsList[index].ticketNumber
          : !this.isManualFlow
          ? this.passengerDetailsList[index].ticketNumber
          : undefined;

        return {
          ...details,
          ...(ticketNumber && { ticketNumber })
        };
      }
    );
    this.passengerDetailsService.passengerDetailsList = updatedFormsDetails;
    return true;
  }

  setAeroplanDynamicsId(acStarAllianceTierDynamicsId: number): number {
    if (acStarAllianceTierDynamicsId != null) {
      return acStarAllianceTierDynamicsId;
    }
  }
}
