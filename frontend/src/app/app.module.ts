import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TableComponent } from './table/table.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { MatCardModule } from '@angular/material/card';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { DialogComponent } from './dialog/dialog.component';
import { OutletDetailComponent } from './outlet-detail/outlet-detail.component';
import { MatRadioModule } from '@angular/material/radio';
import { UserApprovalComponent } from './user-approval/user-approval.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SpanBoxComponent } from './span-box/span-box.component';
import { Order2Component } from './order2/order2.component';
import { Order2DetailComponent } from './order2-detail/order2-detail.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ToolBarComponent,
    SideNavComponent,
    TableComponent,
    OrderDetailComponent,
    ItemDetailComponent,
    DialogComponent,
    OutletDetailComponent,
    UserApprovalComponent,
    WarehouseComponent,
    DashboardComponent,
    FilterDialogComponent,
    SpanBoxComponent,
    Order2Component,
    Order2DetailComponent,
    Dashboard2Component,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
