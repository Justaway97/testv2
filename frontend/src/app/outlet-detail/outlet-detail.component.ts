import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-outlet-detail',
  templateUrl: './outlet-detail.component.html',
  styleUrls: ['./outlet-detail.component.scss']
})
export class OutletDetailComponent implements OnInit {

  @Output() toggleSideNav = new EventEmitter();
  @Input() selectedRow: any;
  outletDetailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private dialog: MatDialog,
  ) { 
  }

  ngOnInit(): void {
    console.log(this.selectedRow);
    this.reset();
  }

  reset() {
    this.outletDetailForm = this.formBuilder.group({
      'outlet_name': [this.selectedRow?.outlet_name? this.selectedRow.outlet_name: '', Validators.required],
      'outlet_address': [this.selectedRow?.outlet_address? this.selectedRow.outlet_address: '', Validators.required],
    });
  }

  submit() {
    console.log(this.outletDetailForm.value);
    if (this.selectedRow) {
      this.appService.updateOutlet({
        ...this.outletDetailForm.value,
        'id': this.selectedRow.outlet_id,
      }).subscribe((data: any) => {
        console.log('Data successfully added!');
        this.toggleSideNav.emit('added');
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      });
    } else {
      this.appService.addOutlet(this.outletDetailForm.value).subscribe((data: any) => {
        console.log('Data successfully added!');
        this.toggleSideNav.emit('added');
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      });
    }
    // this.appService.addOrder()
  }
}
