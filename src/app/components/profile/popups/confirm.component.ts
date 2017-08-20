import { AfterViewInit, OnDestroy, Component, EventEmitter, 
         Input, Output, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmService } from '../services/confirm.service';


@Component({
  selector: 'payment-confirm-popup',
  templateUrl: 'confirm.component.html',
})
export class ProfileCnfrmPopupComponent implements AfterViewInit, OnDestroy {
	@Output() onClose = new EventEmitter();

  subscriptions: Subscription[] = [];
	form: FormGroup;
	step: number;
	loading: boolean;
  error: string;
  code: string;

	constructor(
    private fb:FormBuilder,
    private cnfrmService: ConfirmService,
    private elementRef: ElementRef,
  ) {
		this.step = 1;
		this.loading = false;
		this.code = '';
    this.error = '';

		this.form = this.fb.group({
			'code': [ '', [Validators.required, Validators.minLength(20), Validators.maxLength(64)] ],
		});
    this.subscriptions.push(
		  this.form.valueChanges.subscribe(x => this.onValueChanged(x))
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

  onValueChanged(values) {
    this.error = '';
    // console.log(values['code']);
  }	

	sendCode() {
    this.error = '';
    this.loading = true;
    const code = this.form.controls['code'].value;
    if (!code) return this.error = 'Неверный код';

    this.subscriptions.push(
  		this.cnfrmService.activateLetterCode(code).subscribe(x => {
        this.loading = false;
        this.step = 2;
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