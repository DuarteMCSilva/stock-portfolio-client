import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    component.entries = [
      { ticker: 'BABA', name: 'Alibaba', sector: 'ECommerce', quantity: 10, lastPrice: 72.82, avgPrice: 148.90 },
      { ticker: 'GOOGL', name: 'Alphabet', sector: '', quantity: 3, lastPrice: 149.02, avgPrice: 142.53 },
      { ticker: 'INTC', name: 'Intel Corp', sector: '', quantity: 16, lastPrice: 43.30, avgPrice: 35.25 },
      { ticker: 'META', name: 'Meta Platforms', sector: '', quantity: 1, lastPrice: 468.39, avgPrice: 140.10 },
      { ticker: 'PLTR', name: 'Palantir', sector: '', quantity: 10, lastPrice: 24.38, avgPrice: 19.89 },
      { ticker: 'PYPL', name: 'Paypal', sector: 'Financials', quantity: 15, lastPrice: 58.90, avgPrice: 60.26 },
      { ticker: 'PEP', name: 'PepsiCo', sector: 'Consumer Def.', quantity: 1, lastPrice: 167.69 , avgPrice: 158.49 },
      { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Def.', quantity: 1, lastPrice: 157.54, avgPrice: 142.50},
      { ticker: 'TGT', name: 'Target Corp', sector: 'Consumer Def.', quantity: 4, lastPrice: 146.52, avgPrice: 128.43 }
    ];

    const expectedFormat = {
      labels: ['BABA', 'GOOGL', 'INTC', 'META', 'PLTR', 'PYPL', 'PEP', 'PG', 'TGT'],
      datasets: []
    };

    expect(component.portfolioPieChartData).toEqual(expectedFormat);
  });

  
});
