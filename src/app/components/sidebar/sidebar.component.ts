import { Component, OnDestroy, AfterViewInit, 
         ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SidebarActions } from '../../services/actions.service';

import Helpers from '../../tools/helpers';
import cnst from '../../tools/constants';
const urls = cnst.URLS;


@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidebar') sidebar: ElementRef;
  subscriptions: Subscription[] = [];
  urls: Object = urls;
  isOpen: boolean;

  menuItems = [
    {url: '/'+urls.timeline, title: 'Летопись', badges:0, icon:'letopis'},
    {url: '/'+urls.chessmate, title: 'Шахматка', icon:'letopis-icon'},
    {url: '/'+urls.payments.index, title: 'ЕПД, оплата', icon:'letopis-icon'},
    {url: '/'+urls.counters.index, title: 'Счетчики КПУ', badges: 0, icon:'letopis-icon'},
    {url: '/'+urls.forum, title: 'Форум', icon:'letopis-icon'},
    {url: '/'+urls.servicedesk, title: 'Заявки и обращения',badges:0, icon:'letopis-icon'},
    {url: '/'+urls.video, title: 'Видеонаблюдение ',badges:0, icon:'letopis-icon'},
    {url: '/'+urls.archive, title: 'Архив документов',badges:0, icon:'letopis-icon'},
    {url: '/'+urls.voting, title: 'Голосования ',badges:0, icon:'letopis-icon'},
    {url: '/'+urls.news, title: 'Новости ',badges:0, icon:'letopis-icon'},
    {url: '/'+urls.finance, title: 'Финансовая отчётность',badges:0, icon:'letopis-icon'}
  ];

  constructor(private sidebarActions: SidebarActions){
    this.isOpen = this.sidebarActions.getState();

    this.subscriptions.push(
      this.sidebarActions.isOpenChange.subscribe(state => {
        this.isOpen=state;
      })
    );
  }

  ngAfterViewInit() {
    const sdbrElmnt = this.sidebar.nativeElement;
    Helpers.onSwipeLeft(sdbrElmnt, () => this.hide());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  hide() {
    this.sidebarActions.setOpen(false);
  }

  onItemClick() {
    if (screen.width <= cnst.adaptive.mobile) {
      this.hide();
    }
  }

}
