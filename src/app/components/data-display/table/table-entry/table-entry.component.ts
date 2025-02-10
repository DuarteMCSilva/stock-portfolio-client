import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ComponentsSharedModule } from 'src/app/components/components-shared.module';

enum EntryTypes {
  Simple,
  Composite,
  Input,
  Button
}

@Component({
  selector: 'app-table-entry',
  standalone: true,
  imports: [ComponentsSharedModule],
  templateUrl: './table-entry.component.html',
  styleUrl: './table-entry.component.scss'
})
export class TableEntryComponent implements OnChanges {

  public entryTypes = EntryTypes;
  public entryType = signal(EntryTypes.Simple);

  @Input() entry: any;
  @Input() opts: any;

  ngOnChanges(){
    this.entryType.set(this.getEntryType());
  }

  private getEntryType(): EntryTypes {
    if(this.opts?.composite) {
      return EntryTypes.Composite
    }
    return EntryTypes.Simple
  }
}
