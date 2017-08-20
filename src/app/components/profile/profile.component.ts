import { Component, OnInit, OnDestroy, ElementRef, 
         ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { ProfileService } from './services/profile.service';
import { User } from '../../interfaces/user.interfaces';

import Helpers from '../../tools/helpers';
import cnst from '../../tools/constants';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('content') contentRef: ElementRef;
  subscriptions: Subscription[] = [];
  user: User;
  psprtBlockIsShown: boolean;
  profileExpanded: boolean;
  urls: Object = cnst.URLS;
  contentInitialHeight: number;

  constructor(private prflService: ProfileService) {
    this.profileExpanded = false;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.prflService.get().subscribe(x => {
        this.user = x;
        this.psprtBlockIsShown = this.isShowPassportBlock();
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getPhone() {
  	if (!this.user || !this.user.phone) return '';
  	return Helpers.formatPhone(this.user.phone);
  }

  getFullName() {
  	let fullName:string = '';

  	if (this.user && this.user.profile) {
  		const profile = this.user.profile;

  		if (profile.last_name) fullName += profile.last_name;
  		if (profile.first_name) fullName += ' ' + profile.first_name;
  		if (profile.middle_name) fullName += ' ' + profile.middle_name;
  	}

  	return fullName || 'не указан';
  }

  isShowPassportBlock():boolean {
    const passport = this.user.passport;

    return ( !Helpers.objIsEmpty(passport) && (
      passport.series !== '' ||
      passport.number !== '' ||
      passport.issue_date  !== '' ||
      passport.issued !== ''
    ));
  }

  getAccaountStatus():string {
    let status = '';
    
    const user = this.user;
    const activated = user.activated;
    const confirmed = user.confirmed;
    const prfl = user.profile;
    let nameIsFull = false;

    if (prfl.first_name != '' &&
      prfl.middle_name != '' &&
      prfl.last_name != ''
    ) {
      nameIsFull = true;
    }

    if (confirmed) {
      status = 'подтверждён';

    } else {
      status = 'не подтверждён';
    }

    return status;
  }

  profileToggle(){
    const $elmnt = $(this.contentRef.nativeElement);
    const intlHgth = this.contentInitialHeight;

    if (!this.profileExpanded) {
      const curHeight = intlHgth ? intlHgth : $elmnt.height();
      const autoHeight = $elmnt.css('height', 'auto').height();

      $elmnt.height(curHeight);
      $elmnt.stop().animate({ height: autoHeight }, 300);

      this.contentInitialHeight = curHeight;
    
    } else {
      $elmnt.stop().animate({ height: intlHgth }, 300);
    }

    this.profileExpanded = !this.profileExpanded;
  }

}
