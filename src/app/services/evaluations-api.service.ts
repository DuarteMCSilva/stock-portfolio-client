import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Simulation } from '../pages/portfolio/calculator/calculator.component';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsApiService {

  private readonly EVALUATIONS_ENDPOINT = 'assets/evaluations.json' 

  constructor( private httpClient: HttpClient ) { }


  public getEvaluations(){
    return this.httpClient.get<Simulation[]>(this.EVALUATIONS_ENDPOINT);
  }

  public postEvaluation() {
    const data = JSON.stringify({name: "bye!"})
    return this.httpClient.put(this.EVALUATIONS_ENDPOINT, data )
  }
}
