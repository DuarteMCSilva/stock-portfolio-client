import { TestBed } from '@angular/core/testing';

import { EvaluationsApiService } from './evaluations-api.service';
import { HttpClientModule } from '@angular/common/http';

describe('EvaluationsApiService', () => {
  let service: EvaluationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(EvaluationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
