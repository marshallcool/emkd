import { Component } from '@angular/core';
import cnst from '../../tools/constants';


@Component({
	templateUrl: 'payments.component.html',
	styleUrls: [ 'payments.component.scss' ],
})
export class PaymentsComponent {
	urls: Object = cnst.URLS;
	step: number = 1;
	estates: Array<string> = [];
	showAllData: boolean = false;

  private tblHdrs: Array<{text:string, key: string}> = [
    {text: "Дата", key: 'date'},
    {text: "Тип", key: 'type'},
    {text: "Описание", key: 'descrpt'},
    {text: "Сумма", key: 'summa'},
  ];

  private tblData: Array<Object> = [
  	{date: '02.12.2015', type: 'need', descrpt: 'ЕПД за Октябрь', summa: '-3233.32'},
  	{date: '02.12.2015', type: 'payd', descrpt: 'Банковский перевод', summa: '10000'},
  	{date: '02.12.2015', type: 'need', descrpt: 'ЕПД за Октябрь', summa: '-3233.32'},
  	{date: '02.12.2015', type: 'payd', descrpt: 'Банковский перевод', summa: '10000'},
  	{date: '02.12.2015', type: 'need', descrpt: 'ЕПД за Октябрь', summa: '-3233.32'},
  	{date: '02.12.2015', type: 'payd', descrpt: 'Банковский перевод', summa: '10000'},
  	{date: '02.12.2015', type: 'payd', descrpt: 'Банковский перевод', summa: '10000'},
  	{date: '02.12.2015', type: 'need', descrpt: 'ЕПД за Октябрь', summa: '-3233.32'},
  	{date: '02.12.2015', type: 'payd', descrpt: 'Банковский перевод', summa: '10000'},
  	{date: '02.12.2015', type: 'payd', descrpt: 'Банковский перевод', summa: '10000'},
  	{date: '02.12.2015', type: 'need', descrpt: 'ЕПД за Октябрь', summa: '-3233.32'},
  ];


	constructor() {
		this.estates = [
			'г. Москва, ул. Гарибальди, д1, кв.1',
			'г. Москва, ул. Гарибальди, д2, кв.1',
			'г. Москва, ул. Гарибальди, д3, кв.1',
		];
	}

	getTblData(showAllData){
		if (showAllData) return this.tblData;

		return this.tblData.slice(0,5);
	}

  getTblCell(data, hdr) {
    let value = data[hdr.key];

    switch (hdr.key) {
      case 'type': 
        return data.type === 'need' ? 'Начисление' : 'Оплата';
    }

    return value || cnst.TABLE_CELL_PLCHLDR;
  }

}
