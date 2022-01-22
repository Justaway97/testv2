import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-span-box',
  templateUrl: './span-box.component.html',
  styleUrls: ['./span-box.component.scss']
})
export class SpanBoxComponent implements OnInit {

  tiles = [
    // {header2: null, color: 'grey', cols: 1, rows: 1, footer1: null, header1: null, footer2: null},
    {header2: 'Confirmed', color: 'grey', cols: 5, rows: 1, footer1: 13, header1: null, footer2: null},
    // {header2: null, color: 'grey', cols: 1, rows: 1, footer1: null, header1: null, footer2: null},
    {header2: 'Pending', color: 'grey', cols: 5, rows: 1, footer1: 23, header1: null, footer2: null},
    // {header2: null, color: 'grey', cols: 1, rows: 1, footer1: null, header1: null, footer2: null},
    {header2: 'Delivered', color: 'grey', cols: 5, rows: 1, footer1: 33, header1: null, footer2: null},
    // {header2: null, color: 'grey', cols: 1, rows: 1, footer1: null, header1: null, footer2: null},
    {header2: 'Cancelled', color: 'grey', cols: 5, rows: 1, footer1: 43, header1: null, footer2: null},
    // {header2: null, color: 'grey', cols: 1, rows: 1, footer1: null, header1: null, footer2: null},
  ];
  @Input() data: any[] = [];
  totalCols = 0;

  constructor() { }

  ngOnInit(): void {
    this.calTotalCols();
  }

  calTotalCols() {
    for (const d of this.data) {
      this.totalCols += d.cols;
    }
    console.log('cols ', this.totalCols, this.data);
  }
  // data = {
  //   header1:
  //   header2:
  //   footer1:
  //   footer2;
  // }
}
