import { Component, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { SidebarActions } from '../../services/actions.service';
import Helpers from '../../tools/helpers';
import cnst from '../../tools/constants';


@Component({
  selector: 'app-topmenu',
  templateUrl: 'topmenu.component.html',
  styleUrls: ['topmenu.component.scss'],
})
export class TopmenuComponent implements OnDestroy {
  sidebarIsOpen: boolean;
  subscriptions: Subscription[] = [];
  phone: string;
  urls: Object = cnst.URLS;

  constructor(
    private scktAuthSrv: AuthService,
    private strgSrvc: StorageService,
    private sidebarActions: SidebarActions,
  ){
    const phone = strgSrvc.get('phone');
    if (phone) this.phone = Helpers.formatPhone(phone);

    this.subscriptions.push(
      this.strgSrvc.phoneChange.subscribe(newPhone => {
        if (newPhone) this.phone = Helpers.formatPhone(newPhone);
      })
    );

    this.sidebarIsOpen = this.sidebarActions.getState();
    this.subscriptions.push(
      this.sidebarActions.isOpenChange.subscribe(state => {
        this.sidebarIsOpen=state;
      })
    );

  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  logout() {
    this.scktAuthSrv.signOut();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sidebarActions.initState();
  }

  showSidebar() {
    this.sidebarActions.setOpen(true);
  }

}
