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
  breadcrumb: string[] = [];
  action: string[] = [];
  
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
    this.searchCriteria = {
      pageIndex: this.dataService.PAGE_INDEX,
      pageSize: this.dataService.PAGE_SIZE,
    }
    if (this.router.url === '/outlet' && this.dataService.USER_ACCESS.includes('OUTLET|VIEW')) {
      this.breadcrumb = ['Outlet'];
      this.title = 'Outlet';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['outlet_name']
      };
      this.currentTable = 'outlet';
      this.getOutletList();
    } else if (this.router.url === '/dashboard2' && this.dataService.USER_ACCESS.includes('DASHBOARD|VIEW')) {
      this.breadcrumb = ['Dashboard2'];
      this.header = header;
      this.title = 'Dashboard2';
      this.searchCriteria = {
        ...this.searchCriteria,
        orderBy: ['received_date'],
        findBy: null
      };
      this.currentTable = 'dashboard2';
      this.getDashboard2List();
    } else {
      const dialogRef = this.dialog.open(DialogComponent, {
        data       : {
          message: 'An error encounter, please relogin or contact the administrator!',
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigateByUrl(Url.getLoginURL());
      });
    }
  }

  getDashboard2List() {
    this.appService.getDashboard2List(this.searchCriteria).subscribe((data: any) => {
      this.appService.setLoadingStatus(false);
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
      this.appService.setLoadingStatus(false);
      this.order2List.forEach((order: any) => {
        order.checkbox = (this.dataService.USER_ACCESS.includes('STATUS|'.concat(order.status)))? true : false;
      })
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

  
  getOutletList() {
    this.appService.getOutletList(this.searchCriteria).subscribe((data: any) => {
      this.appService.setLoadingStatus(false);
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
    this.searchCriteria.pageIndex = this.dataService.PAGE_INDEX;
    this.searchCriteria.pageSize = this.dataService.PAGE_SIZE;
    this.breadcrumb = [this.router.url.substring(1).charAt(0).toUpperCase().concat(this.router.url.substring(2)), ' / ', 'Order'];
    this.selectedRow = event;
    this.action = ['Cancel'];
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

  toggleAddPanel() {
    if (this.currentTable !== 'order2') {
      this.isAddAction = true;
      this.selectedRow = null;
    } else {
      this.breadcrumb = [this.router.url.substring(1).charAt(0).toUpperCase().concat(this.router.url.substring(2)), ' / ', 'Order',
        ' / ', 'Order Detail'];
      this.currentTable = null;
      this.selectedRow = {
        outlet_id: this.selectedRow.outlet_id,
        outlet_name: this.selectedRow.outlet_name,
      };
    }
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
        }, error => {
                const dialogRef = this.dialog.open(DialogComponent, {
                              data       : {
                                message: error.error.error,
                              },
                            });
        }).add(() => {
          this.goToOrder2(this.selectedRow);
        });
      }
      this.goToOrder2(this.selectedRow);
    });
  }

  toggleUpdatePanel() {
    if (this.currentTable === 'order2') {
      // standardize all id
      this.appService.getOrder2(this.selectedRow.order_id).subscribe((data: any) => {
        this.appService.setLoadingStatus(false);
        this.selectedRow = cloneDeep(data.values);
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.breadcrumb = [this.router.url.substring(1).charAt(0).toUpperCase().concat(this.router.url.substring(2)), ' / ', 'Order',
          ' / ', 'Order Detail'];
        this.title = 'Order2 Detail';
        this.currentTable = null;
      });
    }
  }

  toggleOrder2DetailPanel(row: any) {
    this.selectedRow = row;
    this.toggleUpdatePanel();
  }

  pageChange(event: any) {
    this.searchCriteria = this.dataService.setSearchCriteria(this.searchCriteria, event);
    if (this.title === 'Outlet') {
      this.getOutletList();
    }
    if (this.title === 'Order2') {
      this.getOrder2List();
    }
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

  findBy() {
    if (this.searchCriteria?.findBy) {
      if (this.searchCriteria.findBy === 'user_id') {
        return sessionStorage.getItem('id');
      }
      return this.selectedRow[this.searchCriteria.findBy];
    }
    return null;
  }

  routeTo(event: any) {
    if (this.router.url === '/'.concat((event as string).toLowerCase())) {
      this.router.navigateByUrl((event as string).toLowerCase());
    } else {
      this.goToOrder2(this.selectedRow);
    }
  }

  menuAction(event: any) {
    const action = event.action;
    const row = event.row;
    if (action === 0) {
      this.appService.cancelOrder2(row).subscribe((data: any) => {
        this.appService.setLoadingStatus(false);
        // this.selectedRow.outlet_id = data.id;
      }, error => {
              const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
      }).add(() => {
        this.goToOrder2(this.selectedRow);
      });
    }
  }
}

