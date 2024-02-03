import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-grid',
  templateUrl: './categories-grid.component.html',
  styleUrls: ['./categories-grid.component.scss']
})
export class CategoriesGridComponent implements OnInit {

  DUMMY_CATEGORIES = [
    {
        slug: 'blue-chip',
        title: 'Invest in Blue-chip companies',
        image: 'Blue-chip.jpeg',
        excerpt: 'Invest in the top 1% most reliable companies.',
        date: '2022-02-10',
    },
    {
        slug: 'bonds',
        title: 'Invest in Bonds',
        image: 'Bonds.jpeg',
        excerpt: 'Looking for safety?',
        date: '2022-02-11',
    },
    {
        slug: 'diversification',
        title: 'Diversify with ETFs!',
        image: 'Diversification.jpeg',
        excerpt: 'Never put all the eggs in the same basket!',
        date: '2022-02-11',
    },
    {
        slug: 'managed-funds',
        title: 'Subscribe to a Management fund!',
        image: 'Managed-funds.jpeg',
        excerpt: 'Feeling humble? Pay a fund manager his salary in exchange for average returns!',
        date: '2022-02-11',
    },
    {
        slug: 'options',
        title: 'Invest with options',
        image: 'Options.jpeg',
        excerpt: 'Think you can time the market? Or looking for a portfolio safety-net?',
        date: '2022-02-11',
    }
]

  constructor() { }

  ngOnInit(): void {
  }

}
