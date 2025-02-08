import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ComponentsSharedModule } from '../../components-shared.module';

interface TableData {
  columns: string[] | TableColumn[],
  rows: TableRow[]
}

interface TableRow {
  [param: string]: number | string
}

interface TableColumn {
  label: string,
  name?: string
}


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ComponentsSharedModule, TableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  
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
}
