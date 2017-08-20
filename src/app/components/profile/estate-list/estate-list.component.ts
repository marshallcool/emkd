import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RealtyResponse, Realty } from '../interfaces/realty.interfaces';
import { ProfileService } from '../services/profile.service';
import cnst from '../../../tools/constants';


@Component({
	selector: 'app-estate-list',
	templateUrl: 'estate-list.component.html',
	styleUrls: ['../scss/block-list.scss'],
})
export class EstateListComponent implements OnDestroy {
	private subscriptions: Subscription[] = [];
	private estateList: Realty[];
	private urls = cnst.URLS;

	constructor (
		private prflSrvc: ProfileService
	) {
		this.subscriptions.push(
			this.prflSrvc.getEstates().subscribe((x) => {
				this.estateList = x.realty;
			})
		);
	}

	ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
