import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { IncompleteComponent } from './incomplete.component';
import { TranslateModule } from '@ngx-translate/core';

describe('IncompleteComponent', () => {
  let component: IncompleteComponent;
  let fixture: ComponentFixture<IncompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientModule],
      declarations: [IncompleteComponent],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(IncompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  class ActivatedRouteSpy {
    paramMap = EMPTY;
  }
});
