import { AssessmentService } from '../../services/assessment/assessment.service';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-flight-details-info',
  templateUrl: './flight-details-info.component.html',
  styleUrls: ['./flight-details-info.component.scss']
})
export class FlightDetailsInfoComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  assessmentCode: number;

  constructor(private assessmentService: AssessmentService) {}

  ngOnInit(): void {
    this.assessmentService.assessmentResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.assessmentCode = result?.errorCode));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
