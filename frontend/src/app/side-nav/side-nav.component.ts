import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  @Output() toggleSideNav = new EventEmitter();
  data: any[];
  @Input() username: string | null;
  searchCriteria: any;
  constructor(
    private appService: AppService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.data = [];
    this.getOrderBySearchCriteria();
  }

  onClose() {
    this.toggleSideNav.emit();
  }

  getOrderBySearchCriteria() {
    // this.appService.getOrderStatistic(this.username).subscribe((data: any) => {
    //   this.data = data.values;
    // }, error => {
    //   const dialogRef = this.dialog.open(DialogComponent, {
    //                       data       : {
    //                         message: error.error.error,
    //                       },
    //                     });
    // });
  }

}
