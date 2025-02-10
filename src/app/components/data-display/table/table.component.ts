import { Component, Input, OnChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ComponentsSharedModule } from '../../components-shared.module';
import { TableEntryComponent } from './table-entry/table-entry.component';

interface TableData {
  columns?: string[] | TableColumn[],
  rows: any[]
}

interface TableColumn {
  label: string,
  name?: string,
  options?: ColumnOptions
}

interface ColumnOptions {
  decimalPlaces?: number,
  percentage?: boolean,
  currency?: boolean,
  options?: ColumnOptions
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ComponentsSharedModule, TableModule, TableEntryComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnChanges {

  
  @Input() data: TableData = {
    columns: [],
    rows: []
  };

  ngOnChanges() {
    const data = this.data;
    if(!data.columns && data.rows.length){
      const firstRow = this.data.rows[0];
      this.data.columns = Object.keys(firstRow);
    }
  }
}
