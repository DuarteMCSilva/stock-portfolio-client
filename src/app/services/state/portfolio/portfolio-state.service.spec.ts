import { TestBed } from '@angular/core/testing';
import { PortfolioStateService } from './portfolio-state.service';

describe('PortfolioService', () => {
  let service: PortfolioStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
