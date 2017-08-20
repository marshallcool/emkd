import { Component } from '@angular/core';
import cnst from '../../../tools/constants';


@Component({
	templateUrl: 'history.component.html',
	styleUrls: [ 'history.component.scss' ],
})
export class CountersHistoryComponent {
	urls: Object = cnst.URLS;
	params: Array<Object>;
	measures: Array<Object>;

	constructor() {
		this.params = [
			{title: 'Лицевой счёт (паспорт)', value: '01230123 (ХВС КПУ)'},
			{title: 'Дата установки', value: '02.27.2013'},
			{title: 'Комментарий', value: 'холодная вода'},
		];

		this.measures = [
			{date:'02.27.2013', value: 'Показния не внесены'},
			{date:'03.27.2013', value: '172.46'},
			{date:'03.27.2013', value: '172.46'},
			{date:'03.27.2013', value: '172.46'},
			{date:'03.27.2013', value: '172.46'},
			{date:'03.27.2013', value: '172.46'},
			{date:'03.27.2013', value: '172.46'},
			{date:'03.27.2013', value: '172.46'},
		];
	}

}
