import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import AuthHttpService from '../../services/authHttp.service';
import BaseService from '../../services/base.service';

import { EstateType, EstateResponse } from './estate.interfaces';
 

@Injectable()
export class EstateService {

  constructor(
    private authHttpSrvc: AuthHttpService,
    private baseSrvc: BaseService
  ){}

  isUserHaveAnyEstate(type:number, address:string, number:string):Observable<boolean>{
    let params = `type=${type}&address=${address}&number=${number}`;
    return this.authHttpSrvc.get('/user/realty/exist/user?'+params).map((resp: Response) => {
      return resp.json() as boolean;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  getEstateTypes():Observable<EstateType[]>{
    return this.authHttpSrvc.get('/realty/types').map((resp:Response) => {
      return resp.json().types as EstateType[];
    }).catch(err => this.baseSrvc.handleError(err));
  }

  addEstate(type:number, address:string, number:string, comment:string):Observable<boolean>{
    let object = {type, address, number, comment};
    return this.authHttpSrvc.post('/realty', object).map((resp:Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  getUserEstates():Observable<EstateResponse>{
    return this.authHttpSrvc.get("/user/realty").map( (resp:Response) => {
       return resp.json() as EstateResponse;
    }).catch(err => this.baseSrvc.handleError(err));
  }
}

