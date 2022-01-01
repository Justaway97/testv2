import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        this.toggleSideNav.emit();
      })
    } else {
      this.appService.addOutlet(this.outletDetailForm.value).subscribe((data: any) => {
        if (data.values.success) {
          console.log('Data successfully added!');
          this.toggleSideNav.emit();
        }
      })
    }
    // this.appService.addOrder()
  }
}
