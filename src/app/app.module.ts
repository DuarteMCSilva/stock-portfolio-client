import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ChartModule } from 'primeng/chart';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeroComponent } from './pages/home/hero/hero.component';
import { CategoriesGridComponent } from './pages/home/categories-grid/categories-grid.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { CalculatorComponent } from './pages/portfolio/calculator/calculator.component';
import { HistoryComponent } from './pages/portfolio/history/history.component';
import { PieChartComponent } from './pages/portfolio/pie-chart/pie-chart.component';
import { TableComponent } from './components';
import { FinancialsComponent } from './pages/financials/financials.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'financials', component: FinancialsComponent },
  { path: '**', component: HomeComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeroComponent,
    CategoriesGridComponent,
    LayoutComponent,
    NavbarComponent,
    PortfolioComponent,
    CalculatorComponent,
    HistoryComponent,
    PieChartComponent,
    FinancialsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    ChipModule,
    ChartModule,
    FormsModule,
    RouterModule.forRoot(routes),
    TableComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
