import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ComponentsSharedModule } from '../../components-shared.module';

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
  percentage?: boolean
}


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ComponentsSharedModule, TableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnChanges {

  
  @Input() data: TableData = {
    columns: [{label: 'code'}, {label: 'name'}, {label: 'age'}, {label: 'sex'}, {label: 'eyesColor'} ],
    rows: [
      {
        code: '1',
        name: 'Duarte',
        age: 28,
        sex: 'M',
        eyeColor: 'olive'
      },
      {
        code: '2',
        name: 'Joana',
        age: 24,
        sex: 'F',
        eyeColor: 'hazelnut'
      },
      {
        code: '3',
        name: 'Ekki',
        age: 6,
        sex: 'M',
        eyeColor: 'green'
      }
    ]
  };

  ngOnChanges() {
    if(!this.data.columns && this.data.rows.length){
      const firstRow = this.data.rows[0];
      this.data.columns = Object.keys(firstRow);
    }
  }
}
