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
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-order2-detail',
  templateUrl: './order2-detail.component.html',
  styleUrls: ['./order2-detail.component.scss']
})
export class Order2DetailComponent implements OnInit, OnChanges {

  form: FormGroup;
  isDataLoaded = false;
  options: any = {};
  itemNameOptionList: any[];
  @Input() selectedRow: any;
  @Output() goToOrder = new EventEmitter();
  @Output() reload = new EventEmitter();
  today = new Date();
  comments: any[] = [];
  oriItemNameOptionList: any[];
  selected: any[] = [];
  accesses: any[] = [];

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
    this.accesses = this.dataService.USER_ACCESS;
    if (!this.options.itemNameOptionList || !this.oriItemNameOptionList || !this.itemNameOptionList) {
      this.appService.getOptionItemList().subscribe((data: any) => {
        this.appService.setLoadingStatus(false);
        this.itemNameOptionList = data.values;
      }, error => {
        this.appService.setLoadingStatus(false);
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.reset();
        this.isDataLoaded = true;
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
      'remark': [''],
    });
    if (this.selectedRow?.order_detail) {
      const order_details: any[] = [];
      this.selectedRow.order_detail.forEach((value: any, index: any) => {
        this.orderDetails.push(this.createItem());
        this.orderDetails.controls[index].get('item_id')?.patchValue(value.item_id);
        this.orderDetails.controls[index].get('quantity')?.patchValue(value.quantity);
        this.orderDetails.controls[index].get('status')?.patchValue(value.status === 'C'? true: false);
        this.orderDetails.controls[index].get('order2_id')?.patchValue(value.order2_id);
      });
    }
    this.comments = [];
    if (this.selectedRow.remark) {
      const comment: string[] = this.selectedRow.remark.split('>>');
      comment.forEach((c: any) => {
        if (c.includes('::')) {
          const split = c.split('::');
          this.comments.push({
            name: split[0],
            comment: split[1],
          })
        } else {
          this.comments.push({
            comment: c,
          })
        }
      });
    }
  }

  createItem() {
    return this.formBuilder.group({
      'item_id': ['', Validators.required],
      'quantity': [0, Validators.required],
      'status': [false, Validators.required],
      'order2_id': [''],
    })
  }

  submit() {
    if (this.form.valid) {
      if (!this.selectedRow?.order_id) {
        this.appService.addOrder2(this.formatForm(this.form.value)).subscribe((data: any) => {
          this.appService.setLoadingStatus(false);
        }, error => {
          this.appService.setLoadingStatus(false);
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
          this.appService.setLoadingStatus(false);
        }, error => {
          this.appService.setLoadingStatus(false);
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
    } else {
      const dialogRef = this.dialog.open(DialogComponent, {
        data       : {
          message: 'Please fill in all mandatory field',
        },
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

  onSelectChange(event: any, index: number) {
    this.selected = [];
    this.orderDetails.value.forEach((order: any, index: number) => {
      if (index+1 !== this.orderDetails.value.length) {
        this.selected.push(order.item_id);
      }
    }); 
    if (this.selected.includes(event.value)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data       : {
          message: 'You should increase the amount of the item selected but not adding new duplicated item!',
        },
      });
      this.orderDetails.controls[index].get('item_id')?.patchValue('');
    }
  }

  removeItem(index: any) {
    this.orderDetails.removeAt(index);
    this.selectedRow.order_detail.forEach((detail: any, index: number) => {
      Object.keys(detail).forEach((key) => {
        if (detail[key] !== this.orderDetails.controls[index].value) {
          this.orderDetails.markAsDirty();
          return;
        }
      });
    });
 }

  onChangeQuantity(detail: any, value: number, index: number) {
    const quantity = detail.get('quantity').value;
    if (quantity === 0 && value === -1) {
      return;
    }
    detail.get('quantity').patchValue(detail.get('quantity').value + value);
    if (!this.selectedRow?.order_id || this.selectedRow.quantity !== detail.get('quantity').value) {
      detail.markAsDirty();
    }
    this.changeDetectorRef.markForCheck();
  }

  formatForm(value: any): any {
    value.order_detail.forEach((detail: any) => {
      if (detail.status === true) {
        detail.status = 'C';
      } else {
        detail.status = 'P';
      }
    });
    if(!this.selectedRow.order_id) {
      value.remark = sessionStorage.getItem('username')?.concat(' created the order');
    }
    Object.keys(this.selectedRow).forEach((key) => {
      if (!(key in value)) { // or obj1.hasOwnProperty(key)
          value[key] = this.selectedRow[key];
      }
    });let valueChange = false;
    Object.keys(value).forEach((key) => {
      if (key.endsWith('date')) {
        value[key] = this.datepipe.transform(value[key], 'yyyy-MM-dd');
        const date = value[key];
        value[key] = date;
      }
      if(this.selectedRow.order_id && this.selectedRow[key] !== 'remark' && value[key] !== this.selectedRow[key]) {
        valueChange = true;
      }
    });
    if(this.selectedRow.order_id) {
      value.remark = this.selectedRow.remark.concat((value.remark? '>>'.concat((sessionStorage.getItem('username') as string), '::', 
        value.remark): ''), '>>', sessionStorage.getItem('username'), ' update the order');
    }
    if (!('order_by' in value)) {
      value['order_by'] = sessionStorage.getItem('id');
    }
    return value;
  }
}

