import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, style, state, 
       animate, transition, trigger, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { LoginService } from './login.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import Helpers from '../../tools/helpers';
import cnst from '../../tools/constants';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./scss/main.scss', 'login.component.scss'],
  host: {
    '(document:keyup)': '_keyup($event)',
  },
})
export class LoginPageComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription[] = [];

  private _keyup(event: KeyboardEvent) {
    if(event.keyCode == 27){
      this.hideSubPage();
      this.popup(false);
    }
  }

  pageMode: number = 0;
  showFeedback: boolean = false;
  @ViewChild('loginFormEl') loginFormRef: ElementRef;

  changePage(n: number) {
    this.pageMode = n;
    // console.log('pageMode ', this.pageMode);
    if (n == 0) {
      //clear login form
      this.buildLoginForm();
    }
    if (n == 1) {
      this.buildRegForm();
    }
    if (n == 2) {
      this.regSms = '';
    }
    if (n == 3) {
      this.forgotCodeSent = false;
      this.forgotPhone = '';
    }
    if (n == 4) {
      this.forgotNewPass = '';
      this.forgotNewPass2 = '';
    }
    // setTimeout(function () {$('[name="phone"]').inputmask('+7 (999) 999-99-99'); }, 500);
  }

  showSubPage(pageName: string) {
    var $subPage = $('.sub-page[data-name="' + pageName + '"]')

    $subPage.addClass('show u-overflow-hidden')
    setTimeout(function () {
      $subPage.removeClass('u-overflow-hidden')
    }, 1000)
    jQuery('body').addClass('show-sub-page')
  }

  hideSubPage() {
    $('.sub-page').removeClass('show')
    jQuery('body').removeClass('show-sub-page')
  }


  popup(show: boolean) {
    this.showFeedback = show;
  }

  phone: string = "";

  constructor(
    private authSrv: LoginService, 
    private scktAuthSrvs: AuthService,
    private fb: FormBuilder, 
    private notifySrv: NotificationService,
    private elmntRef: ElementRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildLoginForm();
    this.buildRegForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit() {
    // disable login form animation, when tabs between forms
    const loginFormNode = this.loginFormRef.nativeElement;
  
    if (loginFormNode && !loginFormNode.classList.contains('login-animated--disabled')) {
      setTimeout(() => {
        loginFormNode.classList.add('login-animated--disabled');
      }, 3000);
    }
  }

  onPhoneClick(e) {
    const $inpt = $(e.target);
    if ($inpt.length) {
      const $prev = $inpt.prev();
      
      $prev.css({'color': '#6d7b80'});
      $prev.find('em').css({'left':'38px'});
    }
  }

  //login
  loginForm: FormGroup;
  loginPhone: string;

  buildLoginForm() {
    this.loginForm = this.fb.group({
      'phone': ['', [Validators.required, Validators.minLength(12)]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'remember': [''],
    });
    this.subscriptions.push(this.loginForm.valueChanges.subscribe(data => this.onLoginFormValueChanged(data)));
  }

  onLoginFormValueChanged(data?: any) {
    //убираем вспомогательные символы плагина mask
    this.loginPhone = Helpers.unmaskPhone(data.phone);

    if (this.loginPhone.length == 10) {
      this.subscriptions.push(this.authSrv.checkCaptchaNeeded(this.loginPhone).subscribe(data => {
        this.isCaptchaIsNeeded = data;
      }));
    }
  }

  loginCaptchaCallback($event) {
    this.captchaForPhone = $event;
    console.log('captcha', $event);
  }

  captcha: string = '';
  captchaForPhone: string = '';
  isCaptchaIsNeeded: boolean = false;

  canLogin(): boolean {
    if (this.isCaptchaIsNeeded && this.captchaForPhone.length == 0) {
      return false;
    }
    return !this.loginForm.controls['password'].errors && !this.loginForm.controls['phone'].errors;
  }

  // '+', '7', ' ', '(',  removed for setting caret positon
  mask = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  onLoginSubmit() {
    let user = {
      phone: this.loginPhone,
      password: this.loginForm.value.password,
    };

    // // this.isCaptchaIsNeeded ? this.captchaForPhone : null

    this.subscriptions.push(this.scktAuthSrvs.signIn(user, this.loginForm.value.remember).subscribe(success => {
      if (success) {
        // this.notifySrv.success("Авторизация успешна.");
        this.router.navigate([cnst.URLS.timeline]);
      } else {
        this.notifySrv.error("<b>Неверный номер телефона или пароль.</b><br/>Пожалуйтса, проверьте правильность ввода.");  
      }
    }, error => {
      const errMsg = error.message ? error.message : error;
      this.notifySrv.error(errMsg);
      grecaptcha.reset();
    }));
  }

  //end of login

  //register
  regCaptchaCallback($event) {
    console.log('reg captcha', $event);
    this.regCaptchaToken = $event;
  }

  regForm: FormGroup;
  regCaptchaToken: string = '';

  buildRegForm() {
    this.regForm = this.fb.group({
      'phone': ['', [Validators.required, Validators.minLength(12)]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'repeatPassword': ['', [Validators.required, Validators.minLength(6)]],
      'gender': ['male', Validators.required],
      'accept': [false, Validators.required]
    });
//    this.regForm.valueChanges.subscribe(data => this.onRegFormValueChanged(data));
  }

  onRegSubmit() {
    let formatedPhone = Helpers.unmaskPhone(this.regForm.controls['phone'].value);
    this.subscriptions.push(this.authSrv.register(
      formatedPhone,
      this.regForm.controls['password'].value,
      this.regForm.controls['gender'].value,
      this.regCaptchaToken
    ).subscribe(result => {
      this.changePage(2);
    }, err => {
      this.notifySrv.error("<b>Ошибка:</b><br/>" + err);
    }));

  }

  //end of register

  //confirm reg
  regSms: string;

  confirmRegister() {
    this.subscriptions.push(
      this.authSrv.activateAccount(this.regSms).subscribe(result => {
        this.notifySrv.success("Аккаунт успешно подтвержден");
        this.router.navigate([cnst.URLS.timeline]);
      },
      err => {
        this.notifySrv.error("<b>Ошибка:</b><br/>" + err);
      })
    )
  }

  repeatCode() {
    this.subscriptions.push(
      this.authSrv.repeatActivateCode().subscribe(result => {
        this.notifySrv.success("Код успешно отправлен");
      },
      err => {
        this.notifySrv.error("<b>Ошибка:</b><br/>" + err);
      })
    )
  }

  //forgot password
  forgotPhone: string = '';
  forgotCode: string = '';
  forgotCaptcha: string = '';
  forgotCodeSent: boolean = false;

  forgotCaptchaCallback($event) {
    this.forgotCaptcha = $event;
  }

  canSendForgot(): boolean {
    return this.forgotPhone.length == 12 && this.forgotCode.length > 0 && this.forgotCaptcha.length > 0;
  }

  canSendForgotCode(): boolean {
    return this.forgotPhone.length == 12 && this.forgotCaptcha.length > 0;
  }

  forgotSendCode() {
    let phone = Helpers.unmaskPhone(this.forgotPhone);
    this.subscriptions.push(
      this.authSrv.forgotPasswordCode(phone).subscribe(resp => {
        this.forgotCodeSent = true;
      },
      err => {
        this.notifySrv.error("<b>Ошибка:</b><br/>" + err);
      })
    )
  }

  forgotKey: string = "";

  getForgotKey() {
    let phone = Helpers.unmaskPhone(this.forgotPhone);
    this.subscriptions.push(
      this.authSrv.getForgotKey(phone, this.forgotCode).subscribe(resp => {
        this.forgotKey = resp;
        console.log('forgotKey is ', this.forgotKey);
        this.changePage(4);
      },
      err => {
        this.notifySrv.error("<b>Ошибка:</b><br/>" + err);
      })
    )
  }

  //forgot: step2
  forgotNewPass: string = "";
  forgotNewPass2: string = "";

  forgotSavePassword() {
    this.subscriptions.push(
      this.authSrv.changePassword(this.forgotNewPass, this.forgotKey).subscribe(r => {
        this.changePage(0);
        this.notifySrv.success("Пароль успешно изменен");
      },
      err => {
        this.notifySrv.error("<b>Ошибка:</b><br/>" + err);
      })
    )

  }

  //questions
  faq:any[] = [
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {expanded: false,title: "Что требуется для того чтобы начать работать?", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
  ]


}


