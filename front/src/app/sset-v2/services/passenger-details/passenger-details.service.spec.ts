import { HttpClientModule } from '@angular/common/http';
import { PassengerDetailsService } from './passenger-details.service';
import { TestBed } from '@angular/core/testing';

describe('PassengerDetailsService', () => {
  let service: PassengerDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(PassengerDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
