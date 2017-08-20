import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmService } from '../../services/confirm.service';
import cnst from '../../../../tools/constants';


@Component({
  selector: 'app-profile-confirm-payment',
  templateUrl: 'payment-confirm.component.html',
  styleUrls: ['payment-confirm.component.scss'],
})
export class ProfileCnfrmPaymentComponent implements OnInit, OnDestroy {
	subscriptions: Subscription[] = [];
	loading: boolean;
	step: number;
	payCode: string;
	isOpenRenewPopup: boolean;
	error: string;
	urls: Object = cnst.URLS;

	constructor (
		private cnfrmSrvc: ConfirmService,
		private router: Router,
	){
		this.step = 1;
		this.loading = false;
		this.payCode = '';
		this.isOpenRenewPopup = false;	
	}

	ngOnInit() {
		this.getPayCode();
	}

	ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

	getPayCode() {
		this.error = '';
		this.loading = true;

		this.subscriptions.push(
			this.cnfrmSrvc.getPayCode().subscribe((payCode) => {
				this.loading = false;
				this.payCode = payCode;
			}, err => {
				this.loading = false;
				// this.error = err;
			})
		);
	}

	generatePayCode() {
		this.error = '';
		this.loading = true;

		this.subscriptions.push(
			this.cnfrmSrvc.generatePayCode().subscribe((newPayCode) => {
				this.loading = false;
				this.step++;
				this.payCode = newPayCode;
			}, err => {
				this.loading = false;
				this.error = err;
			})
		);
	}

	openRenewCodePopup(isOpen:boolean) {
		this.isOpenRenewPopup = isOpen;
		if (!isOpen) this.router.navigate([cnst.URLS.profile.confirm]);
	}
}