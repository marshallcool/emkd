import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CompanyResponse, Company } from '../interfaces/company.interfaces';
import { ProfileService } from '../services/profile.service';
import cnst from '../../../tools/constants';


@Component({
	selector: 'app-companies-list',
	templateUrl: 'companies-list.component.html',
	styleUrls: ['../scss/block-list.scss'],
})
export class CompaniesListComponent implements OnDestroy, OnDestroy {
	private subscriptions: Subscription[] = [];
	private urls = cnst.URLS;
	private companiesList: Company[];

	constructor (
		private prflSrvc: ProfileService
	) {
		this.subscriptions.push(
			this.prflSrvc.getCompanies().subscribe((x) => {
				this.companiesList = x.companies;
			})
		);
	}

	ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}