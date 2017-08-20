import { Component, AfterViewInit, OnDestroy, EventEmitter,
         Input, Output, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CstmValidator } from '../../../tools/validators';
import { ProfileService } from '../services/profile.service';

import cnst from '../../../tools/constants';


@Component({
  selector: 'app-pswrd-edit-popup',
  templateUrl: 'edit-password.component.html',
})
export class ProfileEditPswrdPopupComponent implements AfterViewInit, OnDestroy {
	@Output() onClose = new EventEmitter();
  @ViewChild('popup') popup:ElementRef;

  subscriptions: Subscription[] = [];
	pswrdForm: FormGroup;
	step: number;
	loading: boolean;
  oldPswrd: string;
	newPswrd: string;
  newPswrdRpt: string;
	cnst: Object = cnst;
  error: string = '';

	constructor(
    private fb: FormBuilder,
    private prflService: ProfileService,
    private elementRef: ElementRef,
  ) {
		this.step = 1;
		this.loading = false;

		this.pswrdForm = this.fb.group({
			'old_pswrd': [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(32)] ],
      'new_pswrd': [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(32)] ],
      'new_pswrd_rpt': [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(32)] ],
		});
    this.subscriptions.push(
		  this.pswrdForm.valueChanges.subscribe(x => this.onPswrdValueChanged(x))
    );
	}

  ngAfterViewInit() {
    const cntntEl = this.popup.nativeElement.querySelector('.popup-content');
    if (cntntEl) {
      cntntEl.style.marginTop = "-" + (cntntEl.offsetHeight / 2) + "px";
    }
    
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

  onPswrdValueChanged(values) {
    if (this.pswrdForm.controls['old_pswrd'].valid) {
      this.oldPswrd = values['old_pswrd'];
    }

    if (this.pswrdForm.controls['new_pswrd'].valid) {
      this.newPswrd = values['new_pswrd'];
    }

    if (this.pswrdForm.controls['new_pswrd_rpt'].valid) {
      this.newPswrdRpt = values['new_pswrd_rpt'];
    }
  }	

	changePassword() {
    if (this.newPswrd !== this.newPswrdRpt) {
      this.error = "Новые пароли не совпадают";
      return false;
    }

		this.loading = true;

    this.subscriptions.push(
  		this.prflService.changePassword(this.oldPswrd, this.newPswrd).subscribe(x => {
        this.loading = false;
        this.step = 2;
        this.error = '';
      }, err => {
        this.loading = false;
        this.error = err;
      })
    );
	}

  closePopup() {
    this.onClose.emit(true);
  }
}