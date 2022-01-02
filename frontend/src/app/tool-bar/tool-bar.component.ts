import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { AppService } from '../services/app.service';
import { CommonService } from '../services/common.service';
import { DataService } from '../services/data.service';
import { Url } from '../url';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit, OnChanges {

  today: number = Date.now();
  @Output() displayOrderButton = new EventEmitter();
  @Output() displayHomeButton = new EventEmitter();
  @Output() displayAddButton = new EventEmitter();
  @Output() displayOutletButton = new EventEmitter();
  @Output() displayUserApprovalButton = new EventEmitter();
  @Output() displayOrderWarehouseButton = new EventEmitter();
  @Output() displayWarehouseButton = new EventEmitter();
  @Output() filterNav = new EventEmitter();

  @Input() access: string;
  @Input() colourSelection: string;
  @Input() allSearchOptions: any[];
  @Input() displayMyCart: boolean;
  @Input() title: string;
  searchControl: FormControl;
  searchOptions: Observable<any[]>;
  flag: boolean = false;
  isDataLoaded = false;
  username;

  constructor(
    private dialog: MatDialog,
    private appService: AppService,
    private dataService: DataService,
    private commonService: CommonService,
    private router: Router,
  ) {
    this.username = sessionStorage.getItem('username');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ('title' in changes) {
      this.title = changes['title'].currentValue;
    }
  }

  // async messageService(message: string) {
  //   console.log(await this.commonService.findMessage(message));
  //   return await this.commonService.findMessage(message) as unknown as string;
  // };

  ngOnInit(): void {
    console.log(this.colourSelection);
    if (this.colourSelection === 'primary') {
      this.flag = true;
    }
    this.searchControl = new FormControl();
    if (this.allSearchOptions) {
      this.searchOptions = new BehaviorSubject(this.allSearchOptions);
      this.getSearchOptions();
    } else {
      this.isDataLoaded = true;
    }
  }

  private filterOption(value: any) {
    const filterValue = value.toLowerCase();
    return this.allSearchOptions.filter(option => option.name.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }

  displayFn(subject: any) {
    return subject? subject.name : undefined;
  }

  goToOrder() {
    this.displayOrderButton.emit('Order');
  }

  getSearchOptions() {
    return new Promise<void>((resolve, reject) => {
      this.searchOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(option => option? this.filterOption(option): this.allSearchOptions.slice()),
      );
      this.isDataLoaded = true;
      resolve();
    });
  }

  goToHome() {
    this.displayHomeButton.emit('Item');
  }

  goToAdd() {
    this.displayAddButton.emit();
  }

  goToOutlet() {
    this.displayOutletButton.emit('Outlet');
  }

  goToUserApproval() {
    this.displayUserApprovalButton.emit('Approval');
  }

  goToOrderWarehouse() {
    this.displayOrderWarehouseButton.emit('Order');
  }

  goToWarehouse() {
    this.displayWarehouseButton.emit('Warehouse');
  }

  logOut() {
    this.appService.logout().subscribe((data: any) => {
    }).add(() => {
      this.router.navigateByUrl(Url.getLoginURL());
    });
  }

  goToSideNav() {
    this.filterNav.emit();
  }
}
