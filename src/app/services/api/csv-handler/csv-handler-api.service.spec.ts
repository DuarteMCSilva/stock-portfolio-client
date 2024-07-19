import { TestBed } from '@angular/core/testing';

import { CsvHandlerApiService } from './csv-handler-api.service';
import { HttpClientModule } from '@angular/common/http';

describe('CsvHandlerApiService', () => {
  let service: CsvHandlerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(CsvHandlerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
