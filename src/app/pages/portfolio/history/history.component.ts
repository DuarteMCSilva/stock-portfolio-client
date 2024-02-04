import { Component, OnInit } from '@angular/core';
import { EvaluationsApiService } from 'src/app/services/evaluations-api.service';
import { Simulation } from '../calculator/calculator.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  evaluations: Simulation[] = [];

  constructor(private evaluationsApi: EvaluationsApiService) { }

  ngOnInit(): void {
    this.evaluationsApi.getEvaluations()
      .subscribe( (evals) => {
        this.evaluations = evals;
    })
  }
}
