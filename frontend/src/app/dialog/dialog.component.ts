import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(
    public dialog: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onConfirmClick(): void {
    this.dialog.close(true);
  }

  ngOnInit(): void {
  }

}