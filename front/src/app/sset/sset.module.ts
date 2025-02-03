import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SsetRoutingModule } from './sset-routing.module';
import { SsetComponent } from './pages/sset/sset.component';
import { SharedModule } from '../shared/shared.module';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { PassengerEligibilityComponent } from './components/passenger-eligibility/passenger-eligibility.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    SsetComponent,
    SearchFormComponent,
    PassengerEligibilityComponent,
    ErrorComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    SsetRoutingModule,
    SharedModule,
    NgxCaptchaModule
  ]
})
export class SsetModule {}
