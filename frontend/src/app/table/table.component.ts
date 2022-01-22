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

  @Output() checkButtonResult: any[];
  @Output() page = new EventEmitter();
  @Output() selectedRow = new EventEmitter();
  @Output() selectedCheckBox = new EventEmitter();
  
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
    // if (this.dataSource.data.length > 0) {
    if (this.requiredCheckButton) {
      this.columns.push('select');
    }
    console.log(this.dataSource);
    if (this.dataSource.data.length > 0) {
      this.columns.push(...Object.keys(this.dataSource.data[0]));
    }
    // this.columns.forEach((x, i) => 
    //   this.columns[i] = message[x]? { key: x,
    //                                   value: message[x]}
    //                               : { key: x,
    //                                   value: x});
    // console.log(this.columns);
  }

  getMessage(key: any) {
    return message[key]? message[key]: key;
  }

  ngAfterViewInit() {
    console.log(this.paginator?.pageIndex, 'haha');
    this.sort.sortChange.subscribe((event: any) => {
      console.log(event, 'event');
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
    console.log(row);
    this.selectedRow.emit(row);
  }

  onSubmit() {

  }

  getDate(data: any) {
    console.log(new Date(data));
    return new Date(data);
  }
  // getFormElement(x: any) {
  //   const formGroup = Object.entries(x).forEach(
  //     ([key, value]) => console.log(key, value));
  // }

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
    console.log(event.pageIndex, event.pageSize);
    // this.paginator.pageIndex = event.pageIndex;
    this.page.emit({pageIndex: event.pageIndex, pageSize: event.pageSize});
  }
}
