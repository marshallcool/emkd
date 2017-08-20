import { DropdownModule } from 'primeng/primeng';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
/* modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


/* services */
import { GuardService } from '../../services/guard.service';
import { TimelineService } from './timeline.service';
import { EstateService } from './estate.service';

/* components */
import { TimelineComponent } from './timeline.component';
import { AddEstateComponent } from './add-estate/add-estate.component';


import cnst from '../../tools/constants';
const urls = cnst.URLS;

export const timelineRoutes: Routes = [
  {path: urls.timeline, component: TimelineComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.estate.add, component: AddEstateComponent, canActivate: [GuardService], data: {auth: true} },
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    DropdownModule,
    RouterModule.forChild(timelineRoutes),
  ],
  declarations: [
  	TimelineComponent,
  	AddEstateComponent,
  ],
  providers: [
    TimelineService,
  	EstateService,
  ]
})
export class TimelineModule {}