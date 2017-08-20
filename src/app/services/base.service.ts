import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

import cnst from '../tools/constants';


@Injectable()
export default class BaseService {

  constructor(
    private strgSrvc: StorageService,
    private router: Router,
    private authSrvc: AuthService,
    private notifySrv: NotificationService,
  ){}

  public handleError(error: Response) {    
    let msg = 'Повторите запрос позднее';

    if (error && error.json && error.json().error){
      let val:any = error.json().error;

      console.error('http error,', error.json());

      const token = error.headers.get('Authorization');
      if (token) {
        console.log('set new token ' + token);
        this.strgSrvc.set('token', token);
      }

      this.notifySrv.error('[' + val.message + ']');

      if (val.status === 401 || val.status === 403 ||
        val.message === cnst.ERROR_MSGS.token_invalid ||
        val.message === cnst.ERROR_MSGS.token_blacklisted ||
        val.message === cnst.ERROR_MSGS.token_notprovide
      ) {
        this.authSrvc.signOut();
      }

      if (val.errors) {
        let errs:any = val.errors;
        let v:any = errs.validation;
        for (var i in v) {msg = v[i][0];}

      } else {
        msg = val.message;
      }
    }

    return Observable.throw(msg);
  }

}
