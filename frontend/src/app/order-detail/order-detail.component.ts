import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AppService } from '../services/app.service';
import { DataService } from '../services/data.service';
import { Url } from '../url';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnChanges {

  @Output() toggleSideNav = new EventEmitter();
  @Input() selectedRow: any;
  orderForm: FormGroup;
  isDataLoaded = false;
  options: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private dataService: DataService,
    private dialog: MatDialog,
  ) { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedRow' in changes) {
      this.selectedRow = changes['selectedRow'].currentValue;
      if (this.options.itemNameOptionList) {
        this.reset();
      }
    }
  }
  
  ngOnInit(): void {
    if (!this.options.itemNameOptionList || this.options.outletNameOptionList || this.options.warehouseNameOptionList) {
      this.appService.getOptionItemList().subscribe((data: any) => {
        this.options.itemNameOptionList = data.values;
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.appService.getOptionOutletList().subscribe((data: any) => {
          this.options.outletNameOptionList = data.values;
        }, error => {
          const dialogRef = this.dialog.open(DialogComponent, {
                              data       : {
                                message: error.error.error,
                              },
                            });
        }).add(() => {
          this.appService.getOptionWarehouseList().subscribe((data: any) => {
            this.options.warehouseNameOptionList = data.values;
          }, error => {
            const dialogRef = this.dialog.open(DialogComponent, {
                                data       : {
                                  message: error.error.error,
                                },
                              });
          }).add(() => {
            this.reset();
            this.isDataLoaded = true;
          });
        });
      });
    } else {
      this.reset();
      this.isDataLoaded = true;
    }
  }

  reset() {
    this.orderForm = this.formBuilder.group({
      'item_name': [this.selectedRow?.item_name? this.selectedRow.item_name: '', Validators.required],
      'quantity': [this.selectedRow?.quantity? this.selectedRow.quantity: 0, Validators.required],
      'package': [this.selectedRow?.package? this.selectedRow.package: '', Validators.required],
      'target_received_date': [this.selectedRow?.target_received_date? new Date(this.selectedRow.target_received_date * 1000): '', Validators.required],
      'outlet_name': [this.selectedRow?.outlet_id? this.selectedRow.outlet_id: '', Validators.required],
      'remark': [this.selectedRow?.remark? this.selectedRow.remark: '', Validators.required],
      'warehouse_name': [this.selectedRow?.warehouse_name? this.selectedRow.warehouse_name: '', Validators.required],
      'order_id': [this.selectedRow?.order_id? this.selectedRow.order_id: '', Validators.required],
      'order_date': [{ value: this.selectedRow?.order_date? new Date(this.selectedRow.order_date * 1000): null, disabled: true }, Validators.required],
      'order_by': [this.selectedRow?.order_by? this.selectedRow.order_by: sessionStorage.getItem('id'), Validators.required],
      'arrived_date': [{ value: this.selectedRow?.arrived_date? this.selectedRow.arrived_date: null, disabled: true }, Validators.required],
    });
    console.log(this.selectedRow);
  }

  submit() {
    console.log(this.orderForm.value);
    if (!this.selectedRow) {
      this.appService.addOrder(this.orderForm.value).subscribe((data: any) => {
        console.log('Data successfully added!');
        this.toggleSideNav.emit('added');
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.isDataLoaded = true;
      });
    }
    // this.appService.addOrder()
  }

  getTitle() {
    return this.selectedRow? 'Order Detail - '.concat(this.selectedRow.order_id): 'New Order';
  }

  close() {
    if (this.orderForm.dirty) {

    } else {
      this.toggleSideNav.emit('close');
    }
  }
}
