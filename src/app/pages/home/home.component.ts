import { Component, OnInit } from '@angular/core';
import { TransactionsApiService } from 'src/app/services/api/transactions-api.service';
import { PortfolioService, TransactionItem } from 'src/app/services/state/portfolio/portfolio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private transactionsApiService: TransactionsApiService, private portfolioService: PortfolioService) { }

  ngOnInit(): void {
    this.transactionsApiService.fetchTransactions().subscribe( (transactions: TransactionItem[]) => { 
      this.portfolioService.computePortfolioState(transactions);
      console.warn("WARNING: State management noot yet implemented!");
    })
  }

}
