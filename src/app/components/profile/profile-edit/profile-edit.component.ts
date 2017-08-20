import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { ProfileService } from '../services/profile.service';
import { User } from '../../../interfaces/user.interfaces';
import Helpers from '../../../tools/helpers';
import { DropdownValue } from '../../ui/dropdown/dropdown.component';
import { NotificationService } from '../../../services/notification.service';

import cnst from '../../../tools/constants';


@Component({
  selector: 'app-profile-edit',
  templateUrl: 'profile-edit.component.html',
  styleUrls: ['profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
	user: User;
  editForm: FormGroup;
  mask: Object;
  genderValues: DropdownValue[];
  loading: boolean = true;
  phoneEditPopupIsOpen: boolean = false;
  emailEditPopupIsOpen: boolean = false;
  pswrdEditPopupIsOpen: boolean = false;
  avatarEditPopupIsOpen: boolean = false;
  cnst:Object = cnst;
  error: string;
  urls: Object = cnst.URLS;

  constructor (private prflService: ProfileService, private fb: FormBuilder, private notifySrv: NotificationService) {
    this.error = '';
    
    this.mask = {
      snils: [/\d/, /\d/, /\d/,  '-',  /\d/, /\d/, /\d/,  '-',  /\d/, /\d/, /\d/,  ' ',  /\d/, /\d/], //123-456-789 01

      passport_series: [/\d/, /\d/, ' ', /\d/, /\d/], // 12 34
      passport_number: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/,], // 123456
      passport_issue_date: [/[0-3]/, /[1-9]/, '.', /[0-1]/, /\d/, '.', /[1-2]/, /[9,0]/, /\d/, /\d/,],
    }

    this.genderValues = [
      new DropdownValue('male', 'Мужской'),
      new DropdownValue('female', 'Женский')
    ]
  }

  ngOnInit() {
    this.loadUserData();
    this.buildEditForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadUserData() {
    this.subscriptions.push(
      this.prflService.get().subscribe(x => {
        this.user = x;
        this.loading = false;
      })
    )
  }

  getPhone() {
  	if (!this.user || !this.user.phone) return '';
  	return Helpers.formatPhone(this.user.phone);
  }

  buildEditForm() {
    this.editForm = this.fb.group({
      'last_name': ['', [Validators.maxLength(32)] ],
      'first_name': ['', [Validators.maxLength(32)] ],
      'middle_name': ['', [Validators.maxLength(32)] ],

      'phone': ['', [Validators.maxLength(32)] ],
      'email': ['', [Validators.maxLength(64)] ],
      'snils': [''],

      'passport_series': [''],
      'passport_number': [''],
      'passport_issue_date': [''],
      'passport_issued': ['', [Validators.maxLength(128)] ],
    });

    this.subscriptions.push(
      this.editForm.valueChanges.subscribe(controls => this.onEditFormValueChanged(controls))
    );
  }

  onEditFormValueChanged(controls) {
    this.error = '';
    // const snils = this.editForm.controls['snils'];
    // console.log(snils.value.length);
  }

  onEditSubmit() {
    const user = this.user;

    const data = {
       gender: user.profile.gender || ''
    };

    data['last_name'] = user.profile.last_name || '';
    data['first_name'] = user.profile.first_name || '';
    data['middle_name'] = user.profile.middle_name || '';
    
    data['snils_number'] = user.profile.snils || '';
    
    data['passport_series'] = user.passport.series || '';
    data['passport_number'] = user.passport.number || '';
    data['passport_issue_date'] = user.passport.issue_date || '';
    data['passport_issued'] = user.passport.issued || '';

    this.loading = true;

    this.subscriptions.push(
      this.prflService.sendPersonal(data).subscribe(
        result => {
          this.error = '';
          this.loading = false;
          this.notifySrv.success("Данные сохранены");
          this.loadUserData();
        },
        err => {
          this.error = err;
          this.loading = false;
        }
      )
    )
  }

  handleGenderUpdated(gender:string) {
    if (gender && this.user.profile) this.user.profile.gender = gender;
  }

  /* popups */
  openPhoneEditPopup(isOpen:boolean) {
    this.phoneEditPopupIsOpen = isOpen;
    if (!isOpen) this.loadUserData();
  }

  openEmailEditPopup(isOpen:boolean) {
    this.emailEditPopupIsOpen = isOpen;
    if (!isOpen) this.loadUserData();
  }

  openPswrdEditPopup(isOpen:boolean) {
    this.pswrdEditPopupIsOpen = isOpen;
    if (!isOpen) this.loadUserData();
  }

  openAvatarEditPopup(isOpen:boolean) {
    this.avatarEditPopupIsOpen = isOpen;
    if (!isOpen) this.loadUserData();
  }
}
