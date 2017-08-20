import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { environment } from '../../../../environments/environment';
import AuthHttpService from '../../../services/authHttp.service';
import BaseService from '../../../services/base.service';

import { ConfirmRequests, ConfirmLetter } from '../interfaces/confirm.interfaces';


@Injectable()
export class ConfirmService {
	constructor(
    private authHttpSrvc: AuthHttpService,
    private baseSrvc: BaseService
  ){}

  // список запросов
  getRequests():Observable<ConfirmRequests> {
  	return this.authHttpSrvc.get('/user/profile/confirmation/requests')
  		.map((resp:Response) => {
  			return resp.json().requests as ConfirmRequests;
  		})
  		.catch(err => this.baseSrvc.handleError(err));
  }

  // активация кода подтверждения по письму
  activateLetterCode(code: string):Observable<boolean> {
    return this.authHttpSrvc.post('/user/profile/confirmation/letter/code', {code})
      .map((resp:Response) => {
        return true;
      })
      .catch(err => this.baseSrvc.handleError(err))
  }

  // выслать письмо с кодом по адресу
  sendLetter(data: ConfirmLetter):Observable<boolean> {
    return this.authHttpSrvc.post('/user/profile/confirmation/letter', data)
      .map((resp:Response) => {
        return true;
      })
      .catch(err => this.baseSrvc.handleError(err))
  }

  // запросить текущий идентификатор для оплаты
  getPayCode():Observable<string> {
    return this.authHttpSrvc.get('/user/profile/confirmation/payment/code')
      .map((resp:Response) => {
        return resp.json().code;
      })
      .catch(err => this.baseSrvc.handleError(err));
  }

  // запросить новый идентификатора для оплаты
  generatePayCode():Observable<string> {
    return this.authHttpSrvc.get('/user/profile/confirmation/payment/code/generate')
      .map((resp:Response) => {
        return resp.json().code;
      })
      .catch(err => this.baseSrvc.handleError(err));
  }


}