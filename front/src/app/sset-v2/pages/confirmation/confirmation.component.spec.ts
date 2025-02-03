import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { EMPTY, Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { SsetStoreService } from '../../sset-store.service';
import { TranslateCutPipe } from 'src/app/shared/pipes/translate-cut.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnavailableComponent } from 'src/app/shared/components/unavailable/unavailable.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let router: Router;
  let testRoutes = [
    ...routes,
    {
      path: 'en/confirmation',
      component: ConfirmationComponent,
      pathMatch: 'full'
    },
    { path: 'undefined', component: UnavailableComponent }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(testRoutes as Routes),
        TranslateModule.forRoot()
      ],
      declarations: [ConfirmationComponent, TranslateCutPipe],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteSpy },
        { provide: AssessmentService, useClass: AssessmentServiceSpy },
        { provide: Router, useClass: RouterSpy },
        { provide: SsetStoreService, useClass: SsetStoreServiceSpy },
        { provide: TranslateService, useClass: TranslateServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class ActivatedRouteSpy {
  paramMap = EMPTY;
}

class AssessmentServiceSpy {
  error$: Observable<boolean> = of(true);
  addedClaims$: Observable<Claim[]> = of([]);
}

class RouterSpy {
  navigateByUrl = (url) => {};
  events = EMPTY;
}

class SsetStoreServiceSpy {}

class TranslateServiceSpy {
  setDefaultLang = (lang: string) => {};
  addLangs = (langs: string[]) => {};
  instant = (text: string) => {};
  get onLangChange() {
    return of({ lang: 'en' });
  }
}
