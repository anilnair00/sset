import { AddedClaimComponent } from './added-claim.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('AddedClaimComponent', () => {
  let component: AddedClaimComponent;
  let fixture: ComponentFixture<AddedClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot()],
      declarations: [AddedClaimComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddedClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
