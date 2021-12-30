import { Component } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private appService: AppService,
  ) {
    this.appService.getHome().subscribe((data:any) => {
      console.log(data);
    }, error => {
      console.log('error');
    })
  }


}
