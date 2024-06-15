import { TestBed } from '@angular/core/testing';

import { PortfolioEvolutionStateService } from './portfolio-evolution-state.service';

describe('PortfolioEvolutionStateService', () => {
  let service: PortfolioEvolutionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioEvolutionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
