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
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { isMobile, message, status } from '../app.constant';
import { header } from '../order2/order2.component.constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filterNav: string[] = [];
  filterIconNav: string[] = [];
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
  currentTable: string | null;
  username: string | null;
  approvalCheckBoxButtonList: any[];
  tableSize: number;
  title: string = 'Item';
  checkBoxList: any[] = [];
  statusData: any[] = [];
  order2List = [];
  
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('leftDrawer', { static: false }) leftDrawer: MatDrawer;
  header: string[];

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.filterNav = ['Home', 'Item', 'Outlet', 'UserApproval', 'Order', 'Dashboard', 'Warehouse',
    'Order2', 'Dashboard2', 'Outlet2'];
    this.filterIconNav = ['home', 'shop', 'store', 'supervisor_account', 'description', 'dashboard',
    'storage', 'description', 'dashboard', 'store'];
    // this.access = localStorage.getItem('access');
    // this.username = localStorage.getItem('id');
    this.searchCriteria = {
      pageIndex: this.dataService.PAGE_INDEX,
      pageSize: this.dataService.PAGE_SIZE,
    }
    this.getStatus();
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
    } else if (this.router.url === '/dashboard') {
      this.title = 'dashboard';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['target_received_date']
      };
      this.currentTable = 'dashboard';
      this.getOrderWarehouseList();
    } else if (this.router.url === '/warehouse') {
      this.title = 'Warehouse';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['warehouse_name']
      };
      this.currentTable = 'warehouse';
      this.getWarehouseList();
    } else if (this.router.url === '/order2') {
      // const state$ = this.route.paramMap
      // .pipe(map(() => window.history.state))
      // console.log(state$, 'songming');
      // this.header = header;
      // this.title = 'Order2';
      // this.searchCriteria = {
      //   ...this.searchCriteria,
      //   orderBy: ['received_date'],
      //   findBy: 'outlet_id',
      // };
      // this.currentTable = 'order2';
      // this.getOrder2List();
    } else if (this.router.url === '/dashboard2') {
      this.header = header;
      this.title = 'Dashboard2';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['received_date'],
        findBy: null
      };
      this.currentTable = 'dashboard2';
      this.getDashboard2List();
    }
  }

  getDashboard2List() {
    this.appService.getDashboard2List(this.searchCriteria).subscribe((data: any) => {
      this.order2List = data.values;
      this.tableSize = data.size;
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

  getOrder2List() {
    this.appService.getOrder2List(this.findBy(), this.searchCriteria).subscribe((data: any) => {
      this.order2List = data.values;
      console.log(this.order2List);
      this.tableSize = data.size;
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

  reload() {
    this.currentTable = 'order2';
    this.toggleUpdatePanel();
  }

  goToOrder2(event: any) {
    this.selectedRow = event;
    console.log(event);
    this.searchCriteria = {
      ...this.searchCriteria,
      orderBy: ['received_date'],
      findBy: 'outlet_id',
    };
    this.isDataLoaded = false;
    this.currentTable = 'order2';
    this.header = header;
    this.title = 'Order2';
    this.getOrder2List();
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

  goToOutlet() {
    this.router.navigateByUrl(Url.getOutletURL());
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
    this.appService.getOrderList(sessionStorage.getItem('id') as string, this.searchCriteria).subscribe((data: any) => {
      this.orderList = this.formatOrderList(data.values);
      this.tableSize = data.size;
    }).add(() => {
      this.isDataLoaded = true;
    });
  }

  toggleAddPanel() {
    if (this.currentTable !== 'order2') {
      this.isAddAction = true;
      this.selectedRow = null;
    } else {
      this.currentTable = null;
      this.selectedRow = {
        outlet_id: this.selectedRow.outlet_id,
        outlet_name: this.selectedRow.outlet_name,
      };
    }
  }
  
  getMessage(key: any) {
    return message[key]? message[key]: key;
  }

  updateStatus(event: any) {
    const order2 = cloneDeep(event.value);
    const dialogRef = this.dialog.open(DialogComponent, {
      data       : {
        message: 'Are u want to update the status from '.concat(message[order2.status], ' to ', message[status[order2.status]], ' ?'),
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        order2.status = status[order2.status];
        this.appService.updateOrder2(order2, order2.order_id).subscribe((data: any) => {
          console.log(data); 
        }, error => {
                const dialogRef = this.dialog.open(DialogComponent, {
                              data       : {
                                message: error.error.error,
                              },
                            });
        });
      }
      this.router.navigateByUrl(Url.getOrder2URL());
    });
  }

  toggleOrderDetailPanel(row: any) {
    this.selectedRow = row;
    this.toggleUpdatePanel();
  }

  toggleOutletDetailPanel(row: any) {
    this.selectedRow = row;
    this.toggleUpdatePanel();
  }

  toggleApprovalUserPanel(row: any) {
    this.selectedRow = row;
  }

  toggleWarehousePanel(row: any) {
    this.selectedRow = row;
    this.toggleUpdatePanel();
  }

  toggleUpdatePanel() {
    if (this.currentTable === 'item') {
      this.appService.getItem(this.selectedRow.item_id).subscribe((data: any) => {
        this.selectedRow = data.values;
        this.isUpdateAction = true;
        // this.rightDrawer.toggle();
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
        // this.rightDrawer.toggle();
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
        // this.rightDrawer.toggle();
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
        // this.rightDrawer.toggle();
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      });
    }
    if (this.currentTable === 'order2') {
      // standardize all id
      this.appService.getOrder2(this.selectedRow.order_id).subscribe((data: any) => {
        this.selectedRow = cloneDeep(data.values);
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.title = 'Order2 Detail';
        this.currentTable = null;
      });
    }
  }

  toggleOrder2DetailPanel(row: any) {
    this.selectedRow = row;
    this.toggleUpdatePanel();
  }

  formatOrderList(values: any[]) {
    values.forEach((element: any) => {
      // timestamp required to multiply 1000 to get the actual timestamp
      if (element.order_date) {
        let d = new Date( element.order_date * 1000 );
        delete element.order_date;
        element.order_by = d.getHours() + ':' + d.getMinutes() + ' ' + (d.getHours()<12?'AM': 'PM') + ', ' + d.toLocaleDateString() + ' (' + element.order_by + ')';  
      } else {
        element.order_by = null;
      }
      if (element.arrived_date) {
        let d = new Date( element.arrived_date * 1000 );
        element.arrived_date = d.getHours() + ':' + d.getMinutes() + ' ' + (d.getHours()<12?'AM': 'PM') + ', ' + d.toLocaleDateString();
      } else {
        element.arrived_date = '-';
      }
      if (element.target_received_date) {
        let d = new Date( element.target_received_date * 1000 );
        element.target_received_date = d.toLocaleDateString();
      } else {
        element.target_received_date = null;
      }
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
    if (this.router.url === '/dashboard') {
      this.getOrderWarehouseList();
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
    this.appService.userApproval({ usernames: this.checkBoxList, action:action, approveBy: sessionStorage.getItem('id')}).subscribe((data: any) => {
    }, error => {
      const dialogRef = this.dialog.open(DialogComponent, {
                          data       : {
                            message: error.error.error,
                          },
                        });
    });
  }

  getNav(nav: string) {
    return nav.toLowerCase();
  }

  openFilterDialog() {
    this.dialog.open(FilterDialogComponent, {
      data : {
        field: ['Item Name', 'Quantity', 'Package', 'Remark'],
        dataType: ['text','number','text','longText'],
      },
      width: '80%',
    });
  }

  isMobileView() {
    return window.innerWidth <= isMobile.width;
  }

  getStatus() {
    this.appService.getOrderStatus(sessionStorage.getItem('id')).subscribe((data: any) => {
      const values = data.values;
      for (const v of values) {
        this.statusData.push({
          header2: v.title ? v.title : null,
          footer1: v.value ? v.value : null,
          color: 'grey',
          cols: 5,
          rows: 1,
          header1: v.title1 ? v.title1 : null,
          footer2: v.value1 ? v.value1 : null,
        })
      }
    }, error => {
      const dialogRef = this.dialog.open(DialogComponent, {
                          data       : {
                            message: error.error.error,
                          },
                        });
    });
  }

  findBy() {
    if (this.searchCriteria?.findBy) {
      if (this.searchCriteria.findBy === 'user_id') {
        return sessionStorage.getItem('id');
      }
      return this.selectedRow[this.searchCriteria.findBy];
    }
    return null;
  }
}

