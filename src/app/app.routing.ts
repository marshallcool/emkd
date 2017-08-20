import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { GuardService } from './services/guard.service';

import { UnderConstructionPageComponent } from './components/service-pages/develop.component';
import { Page404Component } from './components/service-pages/p404.component';
import { RestrictPageComponent } from './components/service-pages/auth.component';
import { Page500Component } from './components/service-pages/p500.component';


import cnst from './tools/constants';
const urls = cnst.URLS;


export const appRoutes: Routes = [
  {path: urls.chessmate, component: UnderConstructionPageComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.forum, component: UnderConstructionPageComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.servicedesk, component: UnderConstructionPageComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.video, component: UnderConstructionPageComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.archive, component: UnderConstructionPageComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.voting, component: Page500Component, canActivate: [GuardService], data: {auth: true} },
  {path: urls.news, component: RestrictPageComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.finance, component: UnderConstructionPageComponent, canActivate: [GuardService], data: {auth: true} },

  {path: '*', component: Page404Component},
  {path: '**', component: Page404Component},
  {path: '*path', component: Page404Component}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

export const appRoutingProviders: any[] = [

];

