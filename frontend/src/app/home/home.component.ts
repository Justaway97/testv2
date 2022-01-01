import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import { editableOrderList, itemListHeader, orderListHeader } from './home.component.constant';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { Url } from '../url';
import { DataService } from '../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  itemList = [];
  searchOptions!: any[];
  isDataLoaded = false;
  orderList = [];
  outletList = [];
  warehouseList = [];
  approvalUserList: any[] = [];
  editableOrderList: any[] = editableOrderList;
  selectedRow: any;
  filterOption: any;
  access: any;
  isAddAction = false;
  isUpdateAction = false;
  searchCriteria: any;
  currentTable: string;
  userId: string | null;
  approvalCheckBoxButtonList: any[];
  tableSize: number;
  title: string = 'Item';
  checkBoxList: any[] = [];
  
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('rightDrawer', { static: false }) rightDrawer: MatDrawer;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.access = localStorage.getItem('access');
    this.userId = localStorage.getItem('id');
    this.searchCriteria = {
      pageIndex: this.dataService.PAGE_INDEX,
      pageSize: this.dataService.PAGE_SIZE,
    }
    if (this.router.url === '/home') {
      this.title = 'Item';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['item_name']
      };
      this.currentTable = 'item';
      this.getItemList();
    } else if (this.router.url === '/order') {
      this.title = 'Order';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['id']
      };
      this.currentTable = 'order';
      this.getOrderList();
    } else if (this.router.url === '/outlet') {
      this.title = 'Outlet';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['outlet_name']
      };
      this.currentTable = 'outlet';
      this.getOutletList();
    } else if (this.router.url === '/approval/user') {
      this.title = 'Approval';
      this.currentTable = 'approval';
      this.getApprovalUserList();
    } else if (this.router.url === '/order/warehouse') {
      this.title = 'Order';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['target_received_date']
      };
      this.currentTable = 'order/warehouse';
      this.getOrderWarehouseList();
    } else if (this.router.url === '/warehouse') {
      this.title = 'Warehouse';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['warehouse_name']
      };
      this.currentTable = 'warehouse';
      this.getWarehouseList();
    }
  }

  getWarehouseList() {
    this.appService.getWarehouseList(this.searchCriteria).subscribe((data: any) => {
      this.warehouseList = data.values;
      this.tableSize = data.size;
    }).add(() => {
      this.isDataLoaded = true;
    });
  }

  getOrderWarehouseList() {
    this.appService.getOrderWarehouseList(this.searchCriteria).subscribe((data: any) => {
      this.orderList = this.formatOrderList(data.values);
      this.tableSize = data.size;
    }).add(() => {
      this.isDataLoaded = true;
    });
  }

  getApprovalUserList() {
    this.appService.getApprovalUserList().subscribe((data: any) => {
      this.approvalUserList = data.values;
      // (data.values as Array<any>).forEach(element => {
      //   this.approvalUserList.push(
      //     {
      //       'checkButton': false,
      //       ...element,
      //     }
      //   )
      // });
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

  getItemList() {
    this.appService.getItemList(this.searchCriteria).subscribe(data => {
      this.itemList = data.values;
      this.tableSize = data.size;
    }).add(() => {
      this.isDataLoaded = true;
    });
  }

  getOutletList() {
    this.appService.getOutletList(this.searchCriteria).subscribe((data: any) => {
      this.outletList = data.values;
      this.tableSize = data.size;
    }).add(() => {
      this.isDataLoaded = true;
    });
  }

  goToOrder(event: any) {
    if (this.router.url !== '/order') {
      this.isDataLoaded = false;
      this.router.navigateByUrl(Url.getOrderURL());
    }
  }

  goToWarehouse(event: any) {
    if (this.router.url !== '/warehouse') {
      this.isDataLoaded = false;
      this.router.navigateByUrl(Url.getWarehouseURL());
    }
  }

  goToHome(event: any) {
    if (this.router.url !== '/home') {
      this.isDataLoaded = false;
      this.router.navigateByUrl(Url.getHomeURL());
    }
  }

  goToOutlet(event: any) {
    if (this.router.url !== '/outlet') {
      this.isDataLoaded = false;
      this.router.navigateByUrl(Url.getOutletURL());
    }
  }

  goToOrderWarehouse(event: any) {
    if (this.router.url !== '/order/warehouse') {
      this.isDataLoaded = false;
      this.router.navigateByUrl(Url.getOrderWarehouseURL());
    }
  }

  goToUserApproval(event: any) {
    if (this.router.url !== '/approval/user') {
      this.isDataLoaded = false;
      this.router.navigateByUrl(Url.getApprovalURL());
    }
  }

  getOrderList() {
    this.appService.getOrderList(localStorage.getItem('id') as string, this.searchCriteria).subscribe((data: any) => {
      this.orderList = this.formatOrderList(data.values);
      this.tableSize = data.size;
    }).add(() => {
      this.isDataLoaded = true;
    });
  }

  closeRightSideNav() {
    this.rightDrawer.close();
    this.selectedRow = null;
    this.isAddAction = false;
    this.isUpdateAction = false;
  }

  toggleAddPanel() {
    this.isAddAction = true;
    this.selectedRow = null;
    this.rightDrawer.toggle();
  }

  toggleOrderDetailPanel(row: any) {
    this.selectedRow = row;
    if (this.access === 'admin') {
      this.toggleUpdatePanel();
    } else {
      this.rightDrawer.toggle();
    }
  }

  toggleOutletDetailPanel(row: any) {
    this.selectedRow = row;
    if (this.access === 'admin') {
      this.toggleUpdatePanel();
    } else {
      this.rightDrawer.toggle();
    }
  }

  toggleApprovalUserPanel(row: any) {
    this.selectedRow = row;
    this.rightDrawer.toggle();
  }

  toggleWarehousePanel(row: any) {
    this.selectedRow = row;
    if (this.access === 'admin') {
      this.toggleUpdatePanel();
    } else {
      this.rightDrawer.toggle();
    }
  }

  toggleUpdatePanel() {
    if (this.currentTable === 'item') {
      this.appService.getItem(this.selectedRow.item_id).subscribe((data: any) => {
        this.selectedRow = data.values;
        this.isUpdateAction = true;
        this.rightDrawer.toggle();
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      });
    }
    if (this.currentTable === 'outlet') {
      // standardize all id
      this.appService.getOutlet(this.selectedRow.outlet_id).subscribe((data: any) => {
        this.selectedRow = data.values;
        this.isUpdateAction = true;
        this.rightDrawer.toggle();
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      });
    }
    if (this.currentTable === 'order') {
      // standardize all id
      this.appService.getOrder(this.selectedRow.order_id).subscribe((data: any) => {
        this.selectedRow = cloneDeep(data.values);
        this.isUpdateAction = true;
        this.rightDrawer.toggle();
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      });
    }
    if (this.currentTable === 'warehouse') {
      // standardize all id
      this.appService.getWarehouse(this.selectedRow.warehouse_id).subscribe((data: any) => {
        this.selectedRow = cloneDeep(data.values);
        this.isUpdateAction = true;
        this.rightDrawer.toggle();
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      });
    }
  }

  formatOrderList(values: any[]) {
    values.forEach((element: any) => {
      let d = new Date( element.order_date );
      delete element.order_date;
      element.order_by = d.getHours() + ':' + d.getMinutes() + ' ' + (d.getHours()<12?'AM': 'PM') + ', ' + d.toLocaleDateString() + ' (' + element.order_by + ')';
      d = new Date( element.arrived_date );
      element.arrived_date = d.getHours() + ':' + d.getMinutes() + ' ' + (d.getHours()<12?'AM': 'PM') + ', ' + d.toLocaleDateString();
      element.target_received_date = new Date( element.target_received_date ).toLocaleDateString();
    });
    return values as never[];
  }

  pageChange(event: any) {
    this.searchCriteria = this.dataService.setSearchCriteria(this.searchCriteria, event);
    if (this.router.url === '/home') {
      this.getItemList();
    }
    if (this.router.url === '/order') {
      this.getOrderList();
    }
    if (this.router.url === '/outlet') {
      this.getOutletList();
    }
    if (this.router.url === '/approval/user') {
      this.getApprovalUserList();
    }
    if (this.router.url === '/order/warehouse') {
      this.getOrderList();
    }
  }

  onChangeCheckBoxList(event: any) {
    const selected = event.row.username;
    if (event.event.checked) {
      this.checkBoxList.push(selected);
    } else {
      this.checkBoxList.filter(record => record !== selected);
    }
  }

  approval(action: any) {
    this.appService.userApproval({ usernames: this.checkBoxList, action:action, approveBy: localStorage.getItem('id')}).subscribe((data: any) => {
      console.log('done approval');
    }, error => {
      const dialogRef = this.dialog.open(DialogComponent, {
                          data       : {
                            message: error.error.error,
                          },
                        });
    });
  }
}

