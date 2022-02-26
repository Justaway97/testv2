import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Url } from './url';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: Url.getRegisterURL(), component: LoginComponent },
  { path: Url.getLoginURL(), component: LoginComponent },
  { path: Url.getOutletURL(), component: HomeComponent },
  { path: Url.getDashboard2URL(), component: HomeComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
