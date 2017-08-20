/* modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { TextMaskModule } from 'angular2-text-mask';

/* services */
import { GuardService } from '../../services/guard.service';
import { LoginService } from './login.service';
import { FeedbackService } from './feedback.service';

/* components */
import { LoginPageComponent } from './login.component';
import { FeedbackFormComponent } from './feedback/feedback-form.component';


import cnst from '../../tools/constants';
const urls = cnst.URLS;

export const loginRoutes: Routes = [
  {path: urls.login, component: LoginPageComponent, canActivate: [GuardService], data: {auth: false}},
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ReCaptchaModule,
    TextMaskModule,
    RouterModule.forChild(loginRoutes),
  ],
  declarations: [
		LoginPageComponent,
		FeedbackFormComponent,
  ],
  providers: [
  	LoginService,
    FeedbackService,
  ]
})
export class LoginModule {}