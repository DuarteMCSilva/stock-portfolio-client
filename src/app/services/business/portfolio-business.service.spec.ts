import { TestBed } from '@angular/core/testing';
import { HoldingState } from '../state/portfolio/portfolio.model';
import { PortfolioBusinessService } from './portfolio-business.service';
import { HttpClientModule } from '@angular/common/http';

describe('PortfolioBusinessService', () => {
  let service: PortfolioBusinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(PortfolioBusinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should be created', () => {
    const transactionsMock =  [
          { date: "19971301:13:01:59", orderType: "buy", ticker: "AAPL", quantity: 3, price: 79.00, fees: 5.99 },
          { date: "19971301:13:02:59", orderType: "buy", ticker: "PG", quantity: 3, price: 158.00, fees: 5.99 },
          { date: "19971302:13:03:59", orderType: "buy", ticker: "PGR", quantity: 2, price: 158.00, fees: 5.99 },
          { date: "19971304:13:04:59", orderType: "sell", ticker: "AAPL", quantity: 2, price: 158.00, fees: 5.99 },
          { date: "19971305:13:05:59", orderType: "buy", ticker: "PGR", quantity: 6, price: 170.00, fees: 5.99 },
          { date: "19971306:13:06:59", orderType: "sell", ticker: "AAPL", quantity: 1, price: 158.00, fees: 5.99 },
      ]

    const expOutputs: {date: string, snapshot: HoldingState[] }[] = [
      { date: "19971301", snapshot: [ // with multiple entries in a day
        { ticker: 'AAPL', quantity: 3, avgPrice: 79.00, totalPrice: 79.00*3 },
        { ticker: 'PG', quantity: 3, avgPrice: 158.00, totalPrice: 158.00*3 }
      ]
      },
      { date: "19971302", snapshot: [ // with adding new entries
        { ticker: 'AAPL', quantity: 3, avgPrice: 79.00, totalPrice: 79.00*3 },
        { ticker: 'PG', quantity: 3, avgPrice: 158.00, totalPrice: 158.00*3 },
        { ticker: 'PGR', quantity: 2, avgPrice: 158.00, totalPrice: 158.00*2 },
      ] 
      },
      { date: "19971304", snapshot: [ // with sell
        { ticker: 'AAPL', quantity: 1, avgPrice: 79.00, totalPrice: 79.00*1 },
        { ticker: 'PG', quantity: 3, avgPrice: 158.00, totalPrice: 158.00*3 },
        { ticker: 'PGR', quantity: 2, avgPrice: 158.00, totalPrice: 158.00*2 },
      ]
      },
      { date: "19971305", snapshot: [ // with recalculation of price
        { ticker: 'AAPL', quantity: 1, avgPrice: 79.00, totalPrice: 79.00*1 },
        { ticker: 'PG', quantity: 3, avgPrice: 158.00, totalPrice: 158.00*3 },
        { ticker: 'PGR', quantity: 8, avgPrice: 167.00, totalPrice: 167.00*8 },
      ]
      },
      { date: "19971306", snapshot: [ // with liquidation of asset
        { ticker: 'PG', quantity: 3, avgPrice: 158.00, totalPrice: 158.00*3 },
        { ticker: 'PGR', quantity: 8, avgPrice: 167.00, totalPrice: 167.00*8 },
      ]
      }
    ];

    const output = service['computePortfolioState'](transactionsMock);
    
    let firstDay = output[0];
    let secondDay = output[1];
    let thirdDay = output[2];
    let fourthDay = output[3];
    let fifthDay = output[4];

    expect(firstDay!.date).toEqual(expOutputs[0].date);
    expect(firstDay!.snapshot.get('AAPL')).toEqual(expOutputs[0].snapshot[0]);
    expect(firstDay!.snapshot.get('PG')).toEqual(expOutputs[0].snapshot[1]);

    expect(secondDay!.date).toEqual(expOutputs[1].date);
    expect(secondDay!.snapshot.get('AAPL')).toEqual(expOutputs[1].snapshot[0]);
    expect(secondDay!.snapshot.get('PG')).toEqual(expOutputs[1].snapshot[1]);
    expect(secondDay!.snapshot.get('PGR')).toEqual(expOutputs[1].snapshot[2]);

    expect(thirdDay!.date).toEqual(expOutputs[2].date);
    expect(thirdDay!.snapshot.get('AAPL')).toEqual(expOutputs[2].snapshot[0]);
    expect(thirdDay!.snapshot.get('PG')).toEqual(expOutputs[2].snapshot[1]);
    expect(thirdDay!.snapshot.get('PGR')).toEqual(expOutputs[2].snapshot[2]);

    expect(fourthDay!.date).toEqual(expOutputs[3].date);
    expect(fourthDay!.snapshot.get('AAPL')).toEqual(expOutputs[3].snapshot[0]);
    expect(fourthDay!.snapshot.get('PG')).toEqual(expOutputs[3].snapshot[1]);
    expect(fourthDay!.snapshot.get('PGR')).toEqual(expOutputs[3].snapshot[2]);

    expect(fifthDay!.date).toEqual(expOutputs[4].date);
    expect(fifthDay!.snapshot.get('AAPL')).toEqual(undefined);
    expect(fifthDay!.snapshot.get('PG')).toEqual(expOutputs[4].snapshot[0]);
    expect(fifthDay!.snapshot.get('PGR')).toEqual(expOutputs[4].snapshot[1]);
  });
});
