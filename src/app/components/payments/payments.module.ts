/* modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

/* services */
import { GuardService } from '../../services/guard.service';

/* components */
import { PaymentsComponent } from './payments.component';


import cnst from '../../tools/constants';
const urls = cnst.URLS;


export const paymentsRoutes: Routes = [
  {path: urls.payments.index, component: PaymentsComponent, canActivate: [GuardService], data: {auth: true} },
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(paymentsRoutes),
  ],
  declarations: [
		PaymentsComponent,
  ],
  providers: [
  ]
})
export class PaymentsModule {}
