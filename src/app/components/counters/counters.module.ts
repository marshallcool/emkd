/* modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

/* services */
import { GuardService } from '../../services/guard.service';

/* components */
import { CountersComponent } from './counters.component';
import { CountersHistoryComponent } from './history/history.component';


import cnst from '../../tools/constants';
const urls = cnst.URLS;


export const counterRoutes: Routes = [
  {path: urls.counters.index, component: CountersComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.counters.history, component: CountersHistoryComponent, canActivate: [GuardService], data: {auth: true} },
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(counterRoutes),
  ],
  declarations: [
		CountersComponent,
    CountersHistoryComponent,
  ],
  providers: [
  ]
})
export class CountersModule {}
