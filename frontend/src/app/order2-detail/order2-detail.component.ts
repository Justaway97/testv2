import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AppService } from '../services/app.service';
import { DataService } from '../services/data.service';
import { Url } from '../url';
import { DatePipe } from '@angular/common'
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-order2-detail',
  templateUrl: './order2-detail.component.html',
  styleUrls: ['./order2-detail.component.scss']
})
export class Order2DetailComponent implements OnInit, OnChanges {

  form: FormGroup;
  isDataLoaded = false;
  options: any = {};
  @Input() selectedRow: any;
  @Output() goToOrder = new EventEmitter();
  @Output() reload = new EventEmitter();

  constructor(
    private datepipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private dataService: DataService,
    private dialog: MatDialog,
    private router: Router,
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedRow' in changes) {
      this.selectedRow = changes['selectedRow'].currentValue;
    }
  }

  ngOnInit(): void {
    if (!this.options.itemNameOptionList || this.options.warehouseNameOptionList) {
      this.appService.getOptionItemList().subscribe((data: any) => {
        this.options.itemNameOptionList = data.values;
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
    } else {
      this.reset();
      this.isDataLoaded = true;
    }
  }

  reset() {
    this.form = this.formBuilder.group({
      'order_detail': this.formBuilder.array(this.selectedRow?.order_detail? [] : [ this.createItem() ]),
      'received_date': [this.selectedRow?.received_date? new Date(this.selectedRow.received_date) : '', Validators.required],
      'outlet_name': [this.selectedRow?.outlet_name? this.selectedRow.outlet_name: '', Validators.required],
      'remark': [this.selectedRow?.remark? this.selectedRow.remark: ''],
    });
    if (this.selectedRow?.order_detail) {
      const order_details: any[] = [];
      this.selectedRow.order_detail.forEach((value: any, index: any) => {
        (this.form.get('order_detail') as FormArray).push(this.createItem());
        order_details.push({
          'item_id': value.item_id,
          'quantity': value.quantity,
          'status': value.status === 'C'? true: false,
        });
      });
      (this.form.get('order_detail') as FormArray).setValue(order_details);
    }
  }

  createItem() {
    return this.formBuilder.group({
      'item_id': ['', Validators.required],
      'quantity': [0, Validators.required],
      'status': [false, Validators.required],
    })
  }

  submit() {
    if (!this.selectedRow?.order_id) {
      this.appService.addOrder2(this.formatForm(this.form.value)).subscribe((data: any) => {
        console.log('Data successfully added!'); 
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.isDataLoaded = false;
        this.goToOrder.emit(this.selectedRow);
      });
    } else {
      this.appService.updateOrder2(this.formatForm(this.form.value), this.selectedRow.order_id).subscribe((data: any) => {
        console.log('Data successfully added!'); 
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.isDataLoaded = false;
        this.reload.emit();
      });
    }
  }

  getTitle() {
    return this.selectedRow?.order_id? 'Order Detail - '.concat(this.selectedRow.order_id): 'New Order';
  }

  routeToOrder2() {
    if (this.form.dirty) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data       : {
          message: 'You has unsaved changes, do you want to quit without saving the data?',
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {
          this.goToOrder.emit(this.selectedRow);
        }
      });
    } else {
      this.goToOrder.emit(this.selectedRow);
    }
  }

  get orderDetails() {
    return this.form.get('order_detail') as FormArray;
  }

  addItem() {
    this.orderDetails.push(this.createItem());
  }

  removeItem(index: any) {
    this.orderDetails.removeAt(index);
 }

  testing(abc: any) {
     console.log(abc);
    return false;
  }

  onStatusChange(detail: any) {
    detail.get('status').patchValue(detail.get('status').value==='C'?'P':'C');
    this.changeDetectorRef.markForCheck();
  }

  onChangeQuantity(detail: any, value: number) {
    const quantity = detail.get('quantity').value;
    if (quantity === 0 && value === -1) {
      return;
    }
    detail.get('quantity').patchValue(detail.get('quantity').value + value);
  }

  formatForm(value: any): any {
    value.order_detail.forEach((detail: any) => {
      if (detail.status === true) {
        console.log(detail.status);
        detail.status = 'C';
      } else {
        detail.status = 'P';
      }
    });
    Object.keys(this.selectedRow).forEach((key) => {
      if (!(key in value)) { // or obj1.hasOwnProperty(key)
          value[key] = this.selectedRow[key];
      }
    });
    Object.keys(value).forEach((key) => {
      if (key.endsWith('date')) {
        value[key] = this.datepipe.transform(value[key], 'yyyy-MM-dd');
        const date = value[key];
        value[key] = date;
        console.log(value[key]);
      }
    });
    if (!('order_by' in value)) {
      value['order_by'] = sessionStorage.getItem('id');
    }
    console.log(value);
    return value;
  }
}

