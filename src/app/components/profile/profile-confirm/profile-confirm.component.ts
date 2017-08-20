import { Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ProfileService } from '../services/profile.service';
import { User } from '../../../interfaces/user.interfaces';
import { ConfirmService } from '../services/confirm.service';
import { ConfirmRequests } from '../interfaces/confirm.interfaces';

import Helpers from '../../../tools/helpers';
import cnst from '../../../tools/constants';


@Component({
  selector: 'app-profile-confirm',
  templateUrl: 'profile-confirm.component.html',
  styleUrls: ['profile-confirm.component.scss'],
})
export class ProfileConfirmComponent implements OnInit, OnDestroy {
  @ViewChild('fioFormEl') fioFormEl: ElementRef;
  subscriptions: Subscription[] = [];
  user: User;
  logEvents: ConfirmRequests;
  status: string;
  confirmPopupIsOpen: boolean;
  cnfrmWay: string;
  fioForm: FormGroup;
  cnst: Object;
  urls: Object = cnst.URLS;

  private logHeaders: Array<{text:string, key: string}> = [
    { text: "Дата запроса", key: 'created' },
    { text: "Дата ответа", key: 'answer' },
    { text: "Тип запроса", key: 'type'},
    { text: "Статус", key: 'status'},
    { text: "Результат", key: 'result' }
  ];

  constructor(
    private fb: FormBuilder,
    private prflService: ProfileService,
    private cnfrmSrvc: ConfirmService,
    private router: Router
  ) {
    this.cnfrmWay = 'letter';
    this.confirmPopupIsOpen = false;
    this.buildForm();
    this.cnst = cnst;
  }

  buildForm() {
    this.fioForm = this.fb.group({
      'first_name': ['', [Validators.required, Validators.maxLength(128)] ],
      'middle_name': ['', [Validators.required, Validators.maxLength(128)] ],
      'last_name': ['', [Validators.required, Validators.maxLength(128)] ]
    })
  }

  setFormValues() {
    const prfl = this.user.profile;
    if (prfl) {
      this.fioForm.patchValue({'first_name': prfl.first_name});
      this.fioForm.patchValue({'middle_name': prfl.middle_name});
      this.fioForm.patchValue({'last_name': prfl.last_name});
    }
  }

  ngOnInit() {
    this.loadUserData();
    this.subscriptions.push(
      this.cnfrmSrvc.getRequests().subscribe(x => this.logEvents = x)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadUserData() {
    this.subscriptions.push(
      this.prflService.get().subscribe(x => {
        this.user = x;
        this.setFormValues();
      })
    )
  }

  getFullName() {
    let fullName:string = '';

    if (this.user && this.user.profile) {
      const profile = this.user.profile;

      if (profile.last_name) fullName += profile.last_name;
      if (profile.first_name) fullName += ' ' + profile.first_name;
      if (profile.middle_name) fullName += ' ' + profile.middle_name;
    }

    return fullName || 'не указан';
  }

  getPhone() {
    if (!this.user || !this.user.phone) return '';
    return Helpers.formatPhone(this.user.phone);
  }

  openConfirmPopup(isOpen:boolean) {
    this.confirmPopupIsOpen = isOpen;
    if (!isOpen) this.loadUserData();
  }

  setCnfrmWay(cnfrmWay:string) {
    this.cnfrmWay = cnfrmWay;
  }

  toConfirm() {
    const cntrls = this.fioForm.controls;
    if (!cntrls) return false;

    const first_name = cntrls['first_name'].value,
      middle_name = cntrls['middle_name'].value,
      last_name = cntrls['last_name'].value;

    switch(this.cnfrmWay){
      case 'letter':
        this.router.navigate([cnst.URLS.profile.cnfrmLetter, 
          first_name, middle_name, last_name
        ]);
        break;
      
      case 'payment':
        this.router.navigate([cnst.URLS.profile.cnfrmPayment]);
        break;

      default:
        return false;
    }
  }

  onInputEnter(el) {
    if (el) el.focus();
  }

  onSubmitClick() {
    if (!this.fioForm.valid) {
      const $fioFormEl = $(this.fioFormEl.nativeElement);
      $fioFormEl.find('input').each(function(){
        $(this).focus().blur();
      })
      return false;
    }
  }

  getEventCell(evnt, lghdr) {    
    let value = evnt[lghdr.key];

    switch (lghdr.key) {
      case 'type': 
        return evnt.type === 'letter' ? 'заказное письмо' : 'оплата';

      case 'status':
        if (value) {
          return evnt.type === 'letter' ? 'отправлен' : 'сформирован';
        } else {
          return evnt.type === 'letter' ? 'не отправлено' : 'не сформирован';
        }
    }

    return value || cnst.TABLE_CELL_PLCHLDR;
  }

}
