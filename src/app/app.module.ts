/* modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';

/* services */
import { NotificationService } from './services/notification.service';
import AuthHttpService from './services/authHttp.service';
import BaseService from './services/base.service';
// socket authorization
import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { StorageService } from './services/storage.service';
import { SocketService } from './services/socket.service';
import { GuardService } from './services/guard.service';
import { RouteService } from './services/route.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
// actions
import { SidebarActions } from './services/actions.service';

/* components */
import { AppComponent } from './app.component';
import { TopmenuComponent } from './components/topmenu/topmenu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
// service pages
import { UnderConstructionPageComponent } from './components/service-pages/develop.component';
import { Page404Component } from './components/service-pages/p404.component';
import { RestrictPageComponent } from './components/service-pages/auth.component';
import { Page500Component } from './components/service-pages/p500.component';


/* standalone modules */
import { LoginModule } from './components/login/login.module';
import { TimelineModule } from './components/timeline/timeline.module';
import { ProfileModule } from './components/profile/profile.module';
import { CountersModule } from './components/counters/counters.module';
import { PaymentsModule } from './components/payments/payments.module';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    LoginModule,
    TimelineModule,
    ProfileModule,
    CountersModule,
    PaymentsModule,
    routing
  ],
  declarations: [
    AppComponent,
    TopmenuComponent,
    SidebarComponent,
    UnderConstructionPageComponent,
    Page404Component,
    Page500Component,
    RestrictPageComponent,
  ],
  providers: [
    appRoutingProviders,
    NotificationService,
    BaseService,
    AuthHttpService,
    AuthService,
    EventService,
    StorageService,
    SocketService,
    CookieService,
    GuardService,
    RouteService,
    SidebarActions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
