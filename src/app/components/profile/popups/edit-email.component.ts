import { AfterViewInit, OnDestroy, Component, EventEmitter, 
         Input, Output, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CstmValidator } from '../../../tools/validators';
import { ProfileService } from '../services/profile.service';

import cnst from '../../../tools/constants';


@Component({
  selector: 'app-email-edit-popup',
  templateUrl: 'edit-email.component.html',
})
export class ProfileEditEmailPopupComponent implements AfterViewInit, OnDestroy {
	@Output() onClose = new EventEmitter();

  subscriptions: Subscription[] = [];
	emailForm: FormGroup;
	step: number;
	loading: boolean;
	newEmail: string;
	cnst: Object = cnst;
  error: string;

	constructor(
    private fb:FormBuilder,
    private prflService: ProfileService,
    private elementRef: ElementRef,
  ) {
		this.step = 1;
		this.loading = false;
		this.newEmail = '';
    this.error = '';

		this.emailForm = this.fb.group({
			'email': [ '', [Validators.required, CstmValidator.email] ],
		});
    this.subscriptions.push(
		  this.emailForm.valueChanges.subscribe(x => this.onEmailValueChanged(x))
    );
	}

  ngAfterViewInit() {
    setTimeout(() => {
      $('html').css({'overflow-y': 'hidden'});
      this.elementRef.nativeElement.firstChild.className += ' is-shown';
    }, 4);
  }
  
  ngOnDestroy() {
    $('html').css({'overflow-y': 'auto'});
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onEmailValueChanged(values) {
    if (this.emailForm.controls['email'].valid) {
      this.newEmail = values['email'];
    }
  }	

	sendKeyToNewEmail() {
		this.loading = true;

    this.subscriptions.push(
  		this.prflService.changeEmail(this.newEmail).subscribe(x => {
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