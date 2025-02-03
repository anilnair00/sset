import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DatepickerComponent } from '../../../shared/components/datepicker/datepicker.component';
import { DeviceService } from '../../../shared/services/device.service';
import { EMPTY } from 'rxjs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../../../app/app-routing.module';
import { Routes } from '@angular/router';
import { SearchFormComponent } from './search-form.component';
import { SsetStoreService } from '../../sset-store.service';
import { TranslateCutPipe } from '../../..//shared/pipes/translate-cut.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { UnavailableComponent } from '../../../../app/shared/components/unavailable/unavailable.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let testRoutes = [
    ...routes,
    { path: 'en', component: SearchFormComponent, pathMatch: 'full' },
    { path: 'undefined', component: UnavailableComponent }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatepickerComponent,
        SearchFormComponent,
        TranslateCutPipe
      ],
      imports: [
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(testRoutes as Routes),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: DeviceService, useClass: DeviceSpy },
        { provide: SsetStoreService, useClass: StoreSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form with empty fields', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should validate form with valid values (Ticket Number)', () => {
    component.form.controls.ticket.setValue('1234567890123');
    component.form.controls.lastName.setValue('Doe');

    expect(component.form.controls.ticket.valid).toBeTrue();
    expect(component.form.controls.lastName.valid).toBeTrue();
    expect(component.form.valid).toBeTrue();
  });

  it('should invalidate ticket number required', () => {
    const ticket = component.form.controls.ticket;
    ticket.setValue('');
    ticket.updateValueAndValidity();
    expect(ticket.valid).toBeFalsy();
    expect(ticket.errors.required).toBeTruthy();
  });

  it('should invalidate ticket number with letters', () => {
    const ticket = component.form.controls.ticket;
    ticket.setValue('123456789A123');
    ticket.updateValueAndValidity();
    expect(ticket.valid).toBeFalsy();
    expect(ticket.errors.pattern).toBeTruthy();
  });

  it('should invalidate ticket number too long', () => {
    const ticket = component.form.controls.ticket;
    ticket.setValue('12345678901234');
    ticket.updateValueAndValidity();
    expect(ticket.valid).toBeFalsy();
    expect(ticket.errors.invalidInputLength).toBeTruthy();
  });

  it('should validate last name with numbers', () => {
    const lastName = component.form.controls.lastName;
    lastName.setValue('Doe02');
    lastName.updateValueAndValidity();
    expect(lastName.valid).toBeTruthy();
    expect(lastName.errors).toBeFalsy();
  });

  it('should invalidate last name with unauthorized special characters', () => {
    const lastName = component.form.controls.lastName;
    lastName.setValue('Doe$');
    lastName.updateValueAndValidity();
    expect(lastName.valid).toBeFalsy();
    expect(lastName.errors.pattern).toBeTruthy();
  });

  it('should validate last name with authorized special characters', () => {
    const lastName = component.form.controls.lastName;
    lastName.setValue("O'Neil");
    lastName.updateValueAndValidity();
    expect(lastName.valid).toBeTruthy();
    expect(lastName.errors).toBeFalsy();
  });

  it('should invalidate last name too long', () => {
    const lastName = component.form.controls.lastName;
    lastName.setValue(
      'Wolfe­schlegel­stein­hausen­berger­dorff­welche­vor­altern­waren­gewissen­haft­schafers­wessen­schafe­waren­wohl­gepflege­und­sorg­faltig­keit­be­schutzen­vor­an­greifen­durch­ihr­raub­gierig­feinde­welche­vor­altern­zwolf­hundert­tausend­jah­res­voran­die­er­scheinen­von­der­erste­erde­mensch­der­raum­schiff­genacht­mit­tung­stein­und­sieben­iridium­elek­trisch­motors­ge­brauch­licht­als­sein­ur­sprung­von­kraft­ge­start­sein­lange­fahrt­hin­zwischen­stern­artig­raum­auf­der­suchen­nach­bar­schaft­der­stern­welche­ge­habt­be­wohn­bar­planeten­kreise­drehen­sich­und­wo­hin­der­neue­rasse­von­ver­stand­ig­mensch­lich­keit­konnte­fort­pflanzen­und­sicher­freuen­an­lebens­lang­lich­freude­und­ru­he­mit­nicht­ein­furcht­vor­an­greifen­vor­anderer­intelligent­ge­schopfs­von­hin­zwischen­stern­art­ig­raum'
    );
    lastName.updateValueAndValidity();
    expect(lastName.valid).toBeFalsy();
    expect(lastName.errors.maxlength).toBeTruthy();
  });
});

class DeviceSpy {
  search = jasmine.createSpy('search').and.callFake(() => undefined);
}

class StoreSpy {
  search = jasmine.createSpy('search').and.callFake(() => undefined);
  loading$ = EMPTY;
  validationExceptions$ = EMPTY;
  formReset$ = EMPTY;
  result$ = EMPTY;
}
