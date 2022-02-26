import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { message } from '../app.constant';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  dataSource: MatTableDataSource<any>;
  @Input() tableData: any[] = [];
  @Input() editableField: any[];
  @Input() requiredCheckButton: Boolean;
  @Input() size: number;
  @Input() header: string[];
  @Input() action: string[];

  @Output() checkBoxSelected = new EventEmitter();
  @Output() page = new EventEmitter();
  @Output() selectedRow = new EventEmitter();
  @Output() selectedCheckBox = new EventEmitter();
  @Output() actionSelected = new EventEmitter();
  
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  columns: any[];

  constructor(
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('tableData' in changes) {
      this.tableData = changes['tableData'].currentValue;
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.columns = [];
    if (this.header) {
      this.columns = this.header;
    } else if (this.dataSource.data.length > 0) {
      this.columns.push(...Object.keys(this.dataSource.data[0]));
    }
  }

  getMessage(key: any) {
    return message[key]? message[key]: key;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((event: any) => {
      this.paginator.pageIndex = 0;
      this.page.emit({
        pageIndex: 0,
        pageSize: this.paginator.pageSize,
        orderBy: event.active.concat('|').concat(event.direction),
      });
    });

    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSelectedRow(row: any) {
    this.selectedRow.emit(row);
  }

  onSubmit() {

  }

  getDate(data: any) {
    return new Date(data);
  }

  checkboxChange(event: any, j: any) {
    this.selectedCheckBox.emit({'event': event, 'row':j});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPaginateChange(event: any) {
    // this.paginator.pageIndex = event.pageIndex;
    this.page.emit({pageIndex: event.pageIndex, pageSize: event.pageSize});
  }

  onClickCheckBox(element: any) {
    this.checkBoxSelected.emit({value: element});
  }

  onActionClick(index: number, rowIndex: number) {
    this.actionSelected.emit({action: index, row: rowIndex});
  }
}
