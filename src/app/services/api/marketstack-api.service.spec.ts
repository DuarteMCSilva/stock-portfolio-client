import { TestBed } from '@angular/core/testing';

import { MarketstackApiService } from './marketstack-api.service';
import { HttpClientModule } from '@angular/common/http';

describe('MarketstackApiService', () => {
  let service: MarketstackApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(MarketstackApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
