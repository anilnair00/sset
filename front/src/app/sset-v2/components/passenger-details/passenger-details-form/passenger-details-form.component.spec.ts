import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PassengerDetailsFormComponent } from './passenger-details-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('PassengerDetailsFormComponent', () => {
  let component: PassengerDetailsFormComponent;
  let fixture: ComponentFixture<PassengerDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassengerDetailsFormComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
