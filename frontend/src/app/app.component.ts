import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
import { Url } from './url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';
  timer: any;
  isLoading: Boolean = false;

  constructor(
    private appService: AppService,
    private router: Router,
  ) {
  }

  setLoading() {
    this.isLoading = this.appService.getLoadingStatus();
  }

  ngOnInit() { 
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.setLoading();
    this.timer = setInterval(() => this.setLoading(), 1000);
    // this.check();
  }
  ngOnDestroy() {if (this.timer) clearInterval(this.timer);}

  check() {
    if (this.router.url !== '/register' && this.router.url !== '/login') {
      this.appService.isLoggedIn(sessionStorage.getItem('username') as string).subscribe((data : any) => {
      }, error => {
        window.open(Url.getLoginURL(), '_self');
      });
    }
  }


}
