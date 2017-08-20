import { Component } from '@angular/core';
import cnst from '../../tools/constants';

const enum Steps {
	Ban,
	Estates,
	Add,
};


@Component({
	templateUrl: 'counters.component.html',
	styleUrls: [ 'counters.component.scss' ],
})
export class CountersComponent {
	urls: Object = cnst.URLS;
	step: number = 0;
	estates: Array<string> = [];
	actvEstate: string = '';
	measures: Array<string> = [];

	constructor() {		
		this.estates = [
			'г. Москва, ул. Гарибальди, д1, кв.1',
			'г. Москва, ул. Гарибальди, д2, кв.1',
			'г. Москва, ул. Гарибальди, д3, кв.1',
		];

		this.measures = [
			'Холодная вода',
			'Горячая вода',
			'Газ'
		];
	}

	sendMeasures() {

	}

}
