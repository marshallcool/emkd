import { OnDestroy, Component, EventEmitter, 
         Input, Output, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CstmValidator } from '../../../tools/validators';
import { ProfileService } from '../services/profile.service';

import Helpers from '../../../tools/helpers';
import cnst from '../../../tools/constants';


@Component({
  selector: 'app-phone-edit-popup',
  templateUrl: 'edit-phone.component.html',
})

export class ProfileEditPhonePopupComponent implements AfterViewInit, OnDestroy  {
  @Output() onClose = new EventEmitter();

  subscriptions: Subscription[] = [];
  phoneForm: FormGroup;
  cnfrmForm: FormGroup;
  step: number;
  cnst: Object = cnst;
  code: string;
  loading: boolean;
  newPhone: string;
  error: string;

  constructor(
    private fb:FormBuilder,
    private prflService: ProfileService,
    private elementRef: ElementRef,
  ) {
    this.step = 1;
    this.loading = false;
    this.newPhone = '';
    this.error = '';

    this.phoneForm = this.fb.group({
      'phone': [ '', [Validators.required, CstmValidator.phoneLength ] ],
      'passwd': [ '', [Validators.required, Validators.minLength(6) ] ],
    });
    this.subscriptions.push(
      this.phoneForm.valueChanges.subscribe(x => this.onPhoneValueChanged(x))
    );

    this.cnfrmForm = this.fb.group({
      'sms_code': [ '', [Validators.required, Validators.minLength(6) ] ],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('html').css({'overflow-y': 'hidden'});
      this.elementRef.nativeElement.firstChild.className += ' is-shown';
    }, 4);
  }
  
  ngOnDestroy() {
    $('html').css({'overflow-y': 'auto'});
    this.elementRef.nativeElement.firstChild.className = 'popup';
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onPhoneValueChanged(values){
    if (this.phoneForm.controls['phone'].valid) {
      this.newPhone = Helpers.unmaskPhone(values['phone']).slice(1);
    }
  }

  sendPhoneCode() {
    this.loading = true;

    const passwd = this.phoneForm.controls['passwd'].value;

    if (passwd) this.subscriptions.push(
      this.prflService.sendPhoneCode(this.newPhone, passwd).subscribe(x => {
        this.step = 2;
        this.loading = false;
        this.error = '';
      }, err => {
        this.loading = false;
        this.error = err;
      })
    );
  }

  confirmNewPhone() {
    this.loading = true;
    if (!this.code) return false;

    this.subscriptions.push(
      this.prflService.changePhone(this.newPhone, this.code).subscribe(x => {
        this.loading = false;
        this.step = 3;
        this.error = '';
      }, err => {
        this.loading = false;
        this.error = err;
      })
    );
  }

  formatPhone(phone) {
    return Helpers.formatPhone(phone);
  }

  closePopup() {
    this.onClose.emit(true);
  }
}
