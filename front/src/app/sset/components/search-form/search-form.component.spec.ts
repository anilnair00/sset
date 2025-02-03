// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { SearchFormComponent } from './search-form.component';
// import { SsetStoreService } from '../../sset-store.service';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
// import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
// import { DatepickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
// import { By } from '@angular/platform-browser';
// import { DeviceService } from 'src/app/shared/services/device.service';
// import { EMPTY } from 'rxjs';
// import { TranslateCutPipe } from 'src/app/shared/pipes/translate-cut.pipe';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { ModalModule } from 'ngx-bootstrap/modal';

// describe('SearchFormComponent', () => {
//   let component: SearchFormComponent;
//   let fixture: ComponentFixture<SearchFormComponent>;
//   let dateInput: HTMLInputElement;
//   let datepickerFixture: DebugElement;

//   const todayStr = new Date().toISOString().split('T')[0];

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [SearchFormComponent, DatepickerComponent, TranslateCutPipe],
//       imports: [
//         TranslateModule.forRoot(),
//         ReactiveFormsModule,
//         BsDatepickerModule.forRoot(),
//         BsDatepickerModule.forRoot(),
//         ModalModule.forRoot()
//       ],
//       providers: [
//         { provide: SsetStoreService, useClass: StoreSpy },
//         { provide: DeviceService, useClass: DeviceSpy }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SearchFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();

//     datepickerFixture = fixture.debugElement.query(By.directive(DatepickerComponent));
//     dateInput = datepickerFixture.nativeElement.querySelector('input');
//   });

//   const emulateUserInput = (input, value) => {
//     input.value = value;
//     input.dispatchEvent(new Event('input'));
//     input.dispatchEvent(new Event('change'));
//     fixture.detectChanges();
//   };

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should invalidate form with empty fields', () => {
//     expect(component.form.invalid).toBeTrue();
//   });

//   it('should validate form with valid values (PNR)', () => {
//     component.form.controls.pnrTicket.setValue('TEST01');
//     component.form.controls.lastName.setValue('Doe');
//     component.form.controls.firstName.setValue('John');
//     component.form.controls.date.setValue(todayStr);

//     expect(component.form.controls.pnrTicket.valid).toBeTrue();
//     expect(component.form.controls.lastName.valid).toBeTrue();
//     expect(component.form.controls.firstName.valid).toBeTrue();
//     expect(component.form.controls.date.valid).toBeTrue();
//     expect(component.form.valid).toBeTrue();
//   });

//   it('should validate form with valid values (Ticket Number)', () => {
//     component.form.controls.pnrTicket.setValue('1234567890123');
//     component.form.controls.lastName.setValue('Doe');
//     component.form.controls.firstName.setValue('John');
//     component.form.controls.date.setValue(todayStr);

//     expect(component.form.controls.pnrTicket.valid).toBeTrue();
//     expect(component.form.controls.lastName.valid).toBeTrue();
//     expect(component.form.controls.firstName.valid).toBeTrue();
//     expect(component.form.controls.date.valid).toBeTrue();
//     expect(component.form.valid).toBeTrue();
//   });

//   it('should invalidate pnr or ticket number required', () => {
//     const pnrTicket = component.form.controls.pnrTicket;
//     pnrTicket.setValue('');
//     pnrTicket.updateValueAndValidity();
//     expect(pnrTicket.valid).toBeFalsy();
//     expect(pnrTicket.errors.required).toBeTruthy();
//   });

//   it('should invalidate pnr too long', () => {
//     const pnrTicket = component.form.controls.pnrTicket;
//     pnrTicket.setValue('TE');
//     pnrTicket.updateValueAndValidity();
//     expect(pnrTicket.valid).toBeFalsy();
//     console.log(pnrTicket.errors);
//     expect(pnrTicket.errors.invalidInputLength).toBeTruthy();
//   });

//   it('should invalidate pnr too long', () => {
//     const pnrTicket = component.form.controls.pnrTicket;
//     pnrTicket.setValue('TEST123');
//     pnrTicket.updateValueAndValidity();
//     expect(pnrTicket.valid).toBeFalsy();
//     expect(pnrTicket.errors.invalidInputLength).toBeTruthy();
//   });

//   it('should invalidate ticket number with letters', () => {
//     const pnrTicket = component.form.controls.pnrTicket;
//     pnrTicket.setValue('123456789A123');
//     pnrTicket.updateValueAndValidity();
//     expect(pnrTicket.valid).toBeFalsy();
//     expect(pnrTicket.errors.pattern).toBeTruthy();
//   });

//   it('should invalidate ticket number too long', () => {
//     const pnrTicket = component.form.controls.pnrTicket;
//     pnrTicket.setValue('12345678901234');
//     pnrTicket.updateValueAndValidity();
//     expect(pnrTicket.valid).toBeFalsy();
//     expect(pnrTicket.errors.invalidInputLength).toBeTruthy();
//   });

//   it('should invalidate names with invalid letters', () => {
//     const firstName = component.form.controls.firstName;
//     const lastName = component.form.controls.lastName;
//     firstName.setValue('John01');
//     lastName.setValue('Doe02');
//     firstName.updateValueAndValidity();
//     lastName.updateValueAndValidity();
//     expect(firstName.valid).toBeFalsy();
//     expect(lastName.valid).toBeFalsy();
//     expect(firstName.errors.pattern).toBeTruthy();
//     expect(lastName.errors.pattern).toBeTruthy();
//   });

//   it('should invalidate names with unauthorized special characters', () => {
//     const firstName = component.form.controls.firstName;
//     const lastName = component.form.controls.lastName;
//     firstName.setValue('John#');
//     lastName.setValue('Doe$');
//     firstName.updateValueAndValidity();
//     lastName.updateValueAndValidity();
//     expect(firstName.valid).toBeFalsy();
//     expect(lastName.valid).toBeFalsy();
//     expect(firstName.errors.pattern).toBeTruthy();
//     expect(lastName.errors.pattern).toBeTruthy();
//   });

//   it('should validate names with authorized special characters', () => {
//     const firstName = component.form.controls.firstName;
//     const lastName = component.form.controls.lastName;
//     firstName.setValue('John-Cat');
//     lastName.setValue("O'Neil");
//     firstName.updateValueAndValidity();
//     lastName.updateValueAndValidity();
//     expect(firstName.valid).toBeTruthy();
//     expect(lastName.valid).toBeTruthy();
//     expect(firstName.errors).toBeFalsy();
//     expect(lastName.errors).toBeFalsy();
//   });

//   it('should invalidate names too long', () => {
//     const firstName = component.form.controls.firstName;
//     const lastName = component.form.controls.lastName;
//     firstName.setValue(
//       'Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero Oliver Paul Quincy Randolph Sherman Thomas Uncas Victor William Xerxes Yancy Zeus'
//     );
//     lastName.setValue(
//       'Wolfe­schlegel­stein­hausen­berger­dorff­welche­vor­altern­waren­gewissen­haft­schafers­wessen­schafe­waren­wohl­gepflege­und­sorg­faltig­keit­be­schutzen­vor­an­greifen­durch­ihr­raub­gierig­feinde­welche­vor­altern­zwolf­hundert­tausend­jah­res­voran­die­er­scheinen­von­der­erste­erde­mensch­der­raum­schiff­genacht­mit­tung­stein­und­sieben­iridium­elek­trisch­motors­ge­brauch­licht­als­sein­ur­sprung­von­kraft­ge­start­sein­lange­fahrt­hin­zwischen­stern­artig­raum­auf­der­suchen­nach­bar­schaft­der­stern­welche­ge­habt­be­wohn­bar­planeten­kreise­drehen­sich­und­wo­hin­der­neue­rasse­von­ver­stand­ig­mensch­lich­keit­konnte­fort­pflanzen­und­sicher­freuen­an­lebens­lang­lich­freude­und­ru­he­mit­nicht­ein­furcht­vor­an­greifen­vor­anderer­intelligent­ge­schopfs­von­hin­zwischen­stern­art­ig­raum'
//     );
//     firstName.updateValueAndValidity();
//     lastName.updateValueAndValidity();
//     expect(firstName.valid).toBeFalsy();
//     expect(lastName.valid).toBeFalsy();
//     expect(firstName.errors.maxlength).toBeTruthy();
//     expect(lastName.errors.maxlength).toBeTruthy();
//   });

//   it('should invalidate dates with letter', () => {
//     const date = component.form.controls.date;

//     emulateUserInput(dateInput, 'not a date');
//     expect(date.valid).toBeFalsy();
//     expect(date.errors.invalid).toBeTruthy();
//   });

//   it('should invalidate dates before 2017-10-15', () => {
//     const date = component.form.controls.date;
//     const dateTest = new Date(2017, 10, 2);
//     emulateUserInput(dateInput, dateTest.toISOString().split('T')[0]);
//     expect(date.valid).toBeFalsy();
//     expect(date.errors.min).toBeTruthy();
//   });

//   it('should invalidate dates before 30 days in the future', () => {
//     const date = component.form.controls.date;
//     const futureDate = new Date();
//     futureDate.setDate(futureDate.getDate() + 50);
//     emulateUserInput(dateInput, futureDate.toISOString().split('T')[0]);
//     expect(date.valid).toBeFalsy();
//     expect(date.errors.max).toBeTruthy();
//   });

//   it('should validate date 20 days ago', () => {
//     const date = component.form.controls.date;
//     const pastDate = new Date();
//     pastDate.setDate(pastDate.getDate() - 20);
//     emulateUserInput(dateInput, pastDate.toISOString().split('T')[0]);
//     expect(date.valid).toBeTruthy();
//   });

//   it("should validate date today's date", () => {
//     const date = component.form.controls.date;
//     const now = new Date();
//     emulateUserInput(dateInput, now.toISOString().split('T')[0]);
//     expect(date.valid).toBeTruthy();
//   });
// });

// class StoreSpy {
//   search = jasmine.createSpy('search').and.callFake(() => undefined);
//   loading$ = EMPTY;
//   validationExceptions$ = EMPTY;
//   formReset$ = EMPTY;
//   result$ = EMPTY;
// }

// class DeviceSpy {
//   search = jasmine.createSpy('search').and.callFake(() => undefined);
// }
