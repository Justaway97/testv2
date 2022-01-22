import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {

  searchCriteria: any[] = [];
  searchForm: FormGroup;
  // {
  //   Name: ['Item Name'],
  // }

  constructor(
    public dialog: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) {
    (data.field as []).forEach((value, index) => {
      this.searchCriteria[index] = undefined;
    });
    this.reset();
  }

  onConfirmClick(): void {
    this.dialog.close(true);
  }

  ngOnInit(): void {
  }

  clear(index: any) {
    this.searchCriteria[index] = undefined;
  }

  reset() {
    this.searchForm = new FormGroup({});
    if (this.data) {
      for (const field of this.data.field) {
        this.searchForm.addControl(field, new FormControl('', Validators.required));
      }
    }
    // this.searchForm = this.formBuilder.group({
    //   'item_name': [this.selectedRow?.item_name? this.selectedRow.item_name: '', Validators.required],
    //   'quantity': [this.selectedRow?.quantity? this.selectedRow.quantity: 0, Validators.required],
    //   'package': [this.selectedRow?.package? this.selectedRow.package: '', Validators.required],
    //   'image': [{ filename:'.png',
    //               content:this.selectedRow?.image? 'data:image/png;base64,'.concat(this.selectedRow.image): ''
    //             }, Validators.required],
    //   'remark': [this.selectedRow?.remark? this.selectedRow.remark: '', Validators.required],
    //   // image: new FormControl(null, [Validators.required, requiredFileType('png')]),
    // });
  }
}
