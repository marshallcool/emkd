import { AfterViewInit, OnDestroy, Component, 
         EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmService } from '../services/confirm.service';


@Component({
  selector: 'app-popup-renew-paycode',
  templateUrl: 'renew-paycode.component.html',
})
export class ProfileRenewPaycodePopupComponent implements AfterViewInit, OnDestroy {
	@Output() onClose = new EventEmitter();

  subscriptions: Subscription[] = [];
	step: number;
	loading: boolean;
  error: string;
  newPayCode: string;

	constructor(
    private cnfrmService: ConfirmService,
    private elementRef: ElementRef,
  ) {
		this.step = 1;
		this.loading = false;
    this.error = '';
    this.newPayCode = '';
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

	renewPayCode() {
    this.error = '';
    this.loading = true;

    this.subscriptions.push(
  		this.cnfrmService.generatePayCode().subscribe(newPayCode => {
        this.newPayCode = newPayCode;
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