import { AssessmentComponent } from './assessment.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './../../../../app/app-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UnavailableComponent } from './../../../../app/shared/components/unavailable/unavailable.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('AssessmentComponent', () => {
  let component: AssessmentComponent;
  let fixture: ComponentFixture<AssessmentComponent>;
  let router: Router;
  let testRoutes = [
    ...routes,
    {
      path: 'en/assessment',
      component: AssessmentComponent,
      pathMatch: 'full'
    },
    { path: 'undefined', component: UnavailableComponent }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentComponent],
      imports: [
        RouterTestingModule.withRoutes(testRoutes as Routes),
        TranslateModule.forRoot(),
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
