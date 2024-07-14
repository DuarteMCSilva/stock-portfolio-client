import { TestBed } from '@angular/core/testing';

import { TransactionsApiService } from './transactions-api.service';
import { HttpClientModule } from '@angular/common/http';

describe('TransactionsApiService', () => {
  let service: TransactionsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(TransactionsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
