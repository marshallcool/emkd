import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ProfileService } from '../services/profile.service';
import cnst from '../../../tools/constants';


@Component({
	templateUrl: 'confirm-email.component.html',
	styleUrls: ['confirm-email.component.scss'],
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
	subs: Subscription[] = [];
	key: string = '';
	success: boolean = false;
	error: string = '';
	urls = cnst.URLS;

	constructor(
		private route: ActivatedRoute,
		private prflSrvc: ProfileService,
	) {}

	ngOnInit() {
		this.subs.push(this.route.params.subscribe(params => {
			const key:string = params['key'];
			if (!key) return false;

			this.key = key;

			this.subs.push(this.prflSrvc.confirmEmail(key).subscribe(
				res => {
					if (res) this.success = true;
				},
				err => {
					if (err) this.error = err;
				}
			));
		}));
	}

	ngOnDestroy() {
		this.subs.forEach(s => s.unsubscribe());
	}

}