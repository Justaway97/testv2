import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  @Output() toggleSideNav = new EventEmitter();
  @Input() selectedRow: any;
  warehouseForm: FormGroup;

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
    this.warehouseForm = this.formBuilder.group({
      'warehouse_name': [this.selectedRow?.warehouse_name? this.selectedRow.warehouse_name: '', Validators.required],
      'warehouse_address': [this.selectedRow?.warehouse_address? this.selectedRow.warehouse_address: '', Validators.required],
    });
  }

  submit() {
    console.log(this.warehouseForm.value);
    if (this.selectedRow) {
      this.appService.updateOutlet({
        ...this.warehouseForm.value,
        'id': this.selectedRow.warehouse_id,
      }).subscribe((data: any) => {
        console.log('Data successfully added!');
        this.toggleSideNav.emit();
      })
    } else {
      this.appService.addOutlet(this.warehouseForm.value).subscribe((data: any) => {
        if (data.values.success) {
          console.log('Data successfully added!');
          this.toggleSideNav.emit();
        }
      })
    }
    // this.appService.addOrder()
  }
}
