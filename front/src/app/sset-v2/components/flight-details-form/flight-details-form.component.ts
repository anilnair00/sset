import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Claim, Flight } from '../../models/assessment.interface';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { inputLengthValidator } from '../../../shared/validators/input-length.directive';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-flight-details-form',
  templateUrl: './flight-details-form.component.html',
  styleUrls: ['./flight-details-form.component.scss']
})
export class FlightDetailsFormComponent implements OnInit, OnDestroy {
  private alphaNumericPattern = '[a-zA-Z0-9]*';
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private numericPattern = '[0-9]*';

  addedClaim: Claim[] = [];
  airportOptions: string[] = [];
  allFieldsAreTouched = false;
  dateFormat: string;
  filteredOptions: Observable<any[]>;
  form = this.formBuilder.group({
    arrivalAirport: [
      '',
      [Validators.required, this.autocompleteStringValidator()]
    ],
    bookingReference: [
      '',
      [
        Validators.pattern(this.alphaNumericPattern),
        inputLengthValidator([6], true)
      ]
    ],
    departureAirport: [
      '',
      [Validators.required, this.autocompleteStringValidator()]
    ],
    flightDepartureDate: ['', Validators.required],
    flightNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(this.numericPattern),
        inputLengthValidator([1, 2, 3, 4])
      ]
    ],
    ticketNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(this.numericPattern),
        inputLengthValidator([13])
      ]
    ]
  });
  minDate: Date;
  maxDate: Date;
  modalRef: BsModalRef;
  showFlightNumberACText = false;

  constructor(
    private assessmentService: AssessmentService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const apprStartDate = new Date(Date.UTC(2019, 11, 15, 0, 0, 0));
    const dateObj = new Date();
    const d365 = new Date(
      Date.UTC(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate(),
        0,
        0,
        0
      )
    );
    d365.setDate(d365.getDate() - 366);

    this.minDate = d365 < apprStartDate ? d365 : apprStartDate;
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        this.commonService.getAirports(lang).subscribe((data) => {
          this.airportOptions = data.map(
            (o) =>
              `${o.airportCode} ${o.cityName} ${o.countryName} (${o.airportName})`
          );
        });
        this.form.controls.arrivalAirport.reset('');
        this.form.controls.departureAirport.reset('');
        this.dateFormat = lang === 'fr' ? 'YYYY-MM-DD' : 'YYYY/MM/DD';
      });

    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.addedClaim = [...result]));

    this.assessmentService.manualFlow = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  autocompleteStringValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.airportOptions.indexOf(control.value) !== -1) {
        return null;
      }
      return { invalidAutocompleteString: { value: control.value } };
    };
  }

  onBlurFlightNumber(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.showFlightNumberACText = false;
    }
  }

  onFocusFlightNumber(): void {
    this.showFlightNumberACText = true;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const flight: Flight = {
        airlineCarrierCode: 'AC',
        airlineName: 'Air Canada',
        bookingReference: this.form.value.bookingReference,
        flightNumber: Number(this.form.value.flightNumber),
        isCancelledFlight: false,
        scheduledArrivalAirport: this.form.value.arrivalAirport,
        scheduledArrivalAirportCityName: '',
        scheduledArrivalDate: '',
        scheduledArrivalTime: '',
        scheduledDepartureAirport: this.form.value.departureAirport,
        scheduledDepartureAirportCityName: '',
        scheduledDepartureDate: this.form.value.flightDepartureDate,
        scheduledDepartureTime: '',
        ticketNumber: this.form.value.ticketNumber
      };

      const claim: Claim = {
        addClaimButtonEnabled: true,
        flights: [flight],
        index: 0,
        isClaimingCompensation: true,
        isExpenseButtonEnabled: true,
        pnrNumber: flight.bookingReference,
        ticketNumber: flight?.ticketNumber
      };
      this.addedClaim.push(claim);
      this.assessmentService.addClaims = this.addedClaim;
      this.allFieldsAreTouched = true;
    } else if (!this.allFieldsAreTouched) {
      Object.keys(this.form.controls).forEach((c) => {
        if (c !== 'bookingReference') {
          this.form.controls[c].markAsTouched();
          this.form.controls[c].markAsDirty();
        }
      });
      this.allFieldsAreTouched = true;
    }
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }
}
