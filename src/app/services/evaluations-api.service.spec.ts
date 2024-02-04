import { TestBed } from '@angular/core/testing';

import { EvaluationsApiService } from './evaluations-api.service';

describe('EvaluationsApiService', () => {
  let service: EvaluationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
