import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AppService } from '../services/app.service';
import { Url } from '../url';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string = '';
  isRegister: boolean;
  // isDataLoaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private appService: AppService,
    private dialog: MatDialog,
  ) {
    this.title.setTitle('Login - Order');
  }

  ngOnInit(): void {
    // this.appService.getMessage().subscribe((data: any) => {
    //     this.dataService.MESSAGES = data.values;
    // }, error => {
    //     const dialogRef = this.dialog.open(DialogComponent, {
    //                         data       : {
    //                         message: error.error.error,
    //                         },
    //   });
    // }).add(() => {
    //   this.isDataLoaded = true;
    // });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    if (this.router.url === '/login') {
      this.isRegister = false;
    } else if (this.router.url === '/register') {
      this.isRegister = true;
    }
  }

  onSubmit() {
    if (!this.isRegister) {
      this.appService.login(this.loginForm?.value).subscribe((data: any) => {
        sessionStorage.setItem('username', data.values.username);
        sessionStorage.setItem('id', data.values.id);
        // console.log(data, 'login');
        // const token = this.dataService.getDecodedAccessToken(data.token);
        // sessionStorage.setItem('token', data.token);
        // console.log(token);
        this.router.navigateByUrl(Url.getHomeURL());
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: error.error.error,
                            },
                          });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigateByUrl(Url.getLoginURL());
        });
      });
    }
    if (this.isRegister) {
      this.appService.register(this.loginForm?.value).subscribe((data: any) => {
        const dialogRef = this.dialog.open(DialogComponent, {
                            data       : {
                              message: 'Register Successful! Please wait for the administrator to approve your registration.',
                            },
                          });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigateByUrl(Url.getLoginURL());
        });
      }, error => {
        const dialogRef = this.dialog.open(DialogComponent, {
          data       : {
            message: error.error.error,
          },
        });
      });
    }
  }

  reset() {
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      // image: new FormControl(null, [Validators.required, requiredFileType('png')]),
    });
  }

  goToLogin() {
    this.router.navigateByUrl(Url.getLoginURL());
  }

  goToRegister () {
    this.router.navigateByUrl(Url.getRegisterURL());
  }

  testing(loginForm: any) {
    console.log(loginForm.get('email').hasError('email'));
  }
}
