import { TestBed } from '@angular/core/testing';

import { MarketstackApiService } from './marketstack-api.service';

describe('MarketstackApiService', () => {
  let service: MarketstackApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketstackApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
