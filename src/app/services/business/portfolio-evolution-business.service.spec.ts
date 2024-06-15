import { TestBed } from '@angular/core/testing';

import { PortfolioEvolutionBusinessService } from './portfolio-evolution-business.service';

describe('PortfolioEvolutionBusinessService', () => {
  let service: PortfolioEvolutionBusinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioEvolutionBusinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
