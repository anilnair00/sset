import { AddedClaimComponent } from './components/added-claim/added-claim.component';
import { AssessmentComponent } from './pages/assessment/assessment.component';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { ErrorComponent } from './components/error/error.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ExpensesReviewComponent } from './components/expenses-review/expenses-review.component';
import { ExpensesSummaryComponent } from './components/expenses-summary/expenses-summary.component';
import { FlightAddedComponent } from './components/flight-added/flight-added.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { FlightDetailsFormComponent } from './components/flight-details-form/flight-details-form.component';
import { FlightDetailsInfoComponent } from './components/flight-details-info/flight-details-info.component';
import { FlightLegComponent } from './components/flight-leg/flight-leg.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IncompleteComponent } from './pages/incomplete/incomplete.component';
import { ItineraryComponent } from './components/itinerary/itinerary.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PassengerDetailsComponent } from './components/passenger-details/passenger-details.component';
import { PassengerDetailsFormComponent } from './components/passenger-details/passenger-details-form/passenger-details-form.component';
import { PassengerDetailsReviewComponent } from './components/passenger-details-review/passenger-details-review.component';
import { PassengerEligibilityComponent } from './components/passenger-eligibility/passenger-eligibility.component';
import { ReviewClaimsComponent } from './components/review-claims/review-claims.component';
import { ReviewExpensesComponent } from './components/review-expenses/review-expenses.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SharedModule } from '../shared/shared.module';
import { SsetComponent } from './pages/sset/sset.component';
import { SsetRoutingModule } from './sset-routing.module';

@NgModule({
  declarations: [
    AddedClaimComponent,
    AssessmentComponent,
    ConfirmationComponent,
    ErrorComponent,
    ExpensesComponent,
    ExpensesReviewComponent,
    ExpensesSummaryComponent,
    FlightAddedComponent,
    FlightDetailsComponent,
    FlightDetailsFormComponent,
    FlightDetailsInfoComponent,
    FlightLegComponent,
    IncompleteComponent,
    ItineraryComponent,
    PassengerDetailsComponent,
    PassengerDetailsFormComponent,
    PassengerDetailsReviewComponent,
    PassengerEligibilityComponent,
    ReviewClaimsComponent,
    ReviewExpensesComponent,
    SearchFormComponent,
    SsetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    NgxCaptchaModule,
    SharedModule,
    SsetRoutingModule
  ]
})
export class SsetV2Module {}
