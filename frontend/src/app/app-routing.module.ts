import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Url } from './url';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: Url.getItemURL(), redirectTo: Url.getHomeURL(), pathMatch: 'full' },
  { path: Url.getHomeURL(), component: HomeComponent },
  { path: Url.getOrderURL(), component: HomeComponent },
  { path: Url.getOutletURL(), component: HomeComponent },
  { path: Url.getApprovalURL(), component: HomeComponent },
  { path: Url.getOrderWarehouseURL(), component: HomeComponent },
  { path: Url.getWarehouseURL(), component: HomeComponent },
  { path: Url.getUserApprovalURL(), redirectTo: Url.getApprovalURL(), pathMatch: 'full' },
  // { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
