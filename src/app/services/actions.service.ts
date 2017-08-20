import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import cnst from '../tools/constants';


@Injectable()
export class SidebarActions {
  private isOpen: boolean = true;
 	subject: Subject<boolean> = new Subject<boolean>();
  isOpenChange: Observable<boolean> = this.subject.asObservable();

  constructor() {
  	this.initState();
  }

  initState() {
  	const state = (screen.width > cnst.adaptive.mobile) ? true : false;
  	this.setOpen(state);
  }

  setOpen(state: boolean) {
    this.isOpen = state;
    this.subject.next(state);
  }

  getState(): boolean {
  	return this.isOpen;
  }
}