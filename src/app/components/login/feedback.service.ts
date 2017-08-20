import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { environment } from '../../../environments/environment';
import AuthHttpService from '../../services/authHttp.service';
import BaseService from '../../services/base.service';


@Injectable()
export class FeedbackService {
  private apiHost: string;

  constructor(
    private http: Http,
    private authHttpSrvc: AuthHttpService,
    private baseSrvc: BaseService,
  ) {
    this.apiHost = environment.api;
  }

  sendFeedback(form:any):Observable<boolean>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.apiHost + '/app/feedback', form, {headers:headers}).map((resp: Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

}

