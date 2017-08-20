import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { environment } from '../../../environments/environment';
import { StorageService } from '../../services/storage.service';
import AuthHttpService from '../../services/authHttp.service';
import BaseService from '../../services/base.service';


@Injectable()
export class LoginService {
  public token: string;
  public isAuth: boolean;

  private apiHost: string;

  constructor(
    private http: Http,
    private authHttpSrvc: AuthHttpService,
    private strgSrvc: StorageService,
    private baseSrvc: BaseService
  ) {
    this.apiHost = environment.api;
    this.token = this.strgSrvc.get('token');
    this.isAuth = this.token ? true : false;
  }

  register(phone, password, gender, captcha):Observable<boolean>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let object = {phone: phone, password: password, gender: gender, g_recaptcha_response:captcha};

    return this.http.post(this.apiHost + '/auth/signup', object, {headers:headers}).map((resp: Response) => {
      console.log(resp);
      let token:string = resp.headers.get("authorization");
      if(token) {
        this.token = token;
        this.strgSrvc.set('token', token);
        console.log('token', this.token);
      }
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  checkCaptchaNeeded(phone) : Observable<boolean>{
    let obj = {phone: phone};
    return this.http.post(this.apiHost + '/auth/captcha', obj).map((resp:Response) => {
      return resp.json().captcha as boolean;
    })
  }

  activateAccount(code): Observable<boolean>{
    let obj = {code: code};
    return this.authHttpSrvc.post('/auth/activate', obj).map((resp:Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  repeatActivateCode():Observable<boolean>{
    return this.authHttpSrvc.get('/auth/activate/code').map((resp:Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  forgotPasswordCode(phone:string):Observable<boolean>{
    return this.http.post(this.apiHost + '/auth/password/reset/code', {phone:phone}).map((resp:Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  getForgotKey(phone:string, code:string):Observable<string>{
    return this.http.post(this.apiHost + '/auth/password/reset', {phone:phone, code:code}).map((resp:Response) => {
      return resp.json().key;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  changePassword(password:string, key:string):Observable<boolean>{
    return this.http.put(this.apiHost + '/auth/password/reset/'+key, {password:password}).map((resp:Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));

  }

}
