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

  constructor(
    private appService: AppService,
    private router: Router,
  ) {
    this.appService.getHome().subscribe((data:any) => {
      console.log(data);
    }, error => {
      console.log('error here');
    })
  }

  ngOnInit() { 
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    // this.timer = setInterval(() => this.check(), 30*1000);
    // this.check();
  }
  ngOnDestroy() {if (this.timer) clearInterval(this.timer);}

  check() {
    console.log('here');
    this.appService.isLoggedIn().subscribe((data : any) => {
      if (!data.result) window.open(Url.getLoginURL(), '_self');
    }, error => {
      window.open(Url.getLoginURL(), '_self');
    });
  }


}
