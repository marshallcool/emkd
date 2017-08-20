import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';

import AuthHttpService from '../../../services/authHttp.service';
import BaseService from '../../../services/base.service';

import { User } from '../../../interfaces/user.interfaces';
import { RealtyResponse } from '../interfaces/realty.interfaces';
import { CompanyResponse } from '../interfaces/company.interfaces';


@Injectable()
export class ProfileService {

  constructor(
    private authHttpSrvc: AuthHttpService,
    private baseSrvc: BaseService
  ) {}

  /** Данные пользователя **/
  get():Observable<User> {
    return this.authHttpSrvc.get("/user?include=profile,passport,roles.permissions,realty,image,companies.roles")
    .map((resp: Response) => {
      return resp.json().user as User;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Отправить код подтверждения номера телефона **/
  sendPhoneCode(phone:string, password:string):Observable<boolean>{
    return this.authHttpSrvc.post("/user/phone/code", {phone,password}).map( (resp:Response) =>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Отправка письма подтверждения электронной почты (Email) **/
  sendEmailCode():Observable<boolean>{
    return this.authHttpSrvc.get("/user/email/confirm").map( (resp:Response) =>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Подтверждение электронной почты (Email) */
  confirmEmail(key:string):Observable<boolean>{
    return this.authHttpSrvc.get("/user/email/confirm/"+key).map( (resp:Response) =>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Получить недвижимость **/
  getEstates():Observable<RealtyResponse>{
    return this.authHttpSrvc.get("/user/realty").map( (resp:Response) =>{
      return resp.json() as RealtyResponse;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Получить компании **/
  getCompanies():Observable<CompanyResponse>{
    return this.authHttpSrvc.get("/user/companies?include=roles").map( (resp:Response) =>{
      return resp.json() as CompanyResponse;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Смена номера телефона **/
  changePhone(phone:string, code:string){
    return this.authHttpSrvc.put("/user/phone", {phone, code}).map( (resp:Response) =>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Смена пароля **/
  changePassword(password_old:string, password:string){
    return this.authHttpSrvc.put("/user/password", {password, password_old}).map( (resp:Response) =>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Смена Email **/
  changeEmail(email:string){
    return this.authHttpSrvc.put("/user/email", {email}).map( (resp:Response) =>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Смена аватар **/
  changeAvatar(file:File){
    let formData:FormData = new FormData();
    formData.append("image", file, file.name);

    return this.authHttpSrvc.postFiles("/user/image", formData).map( (resp:Response) =>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }
  
  //Сохранить персональные и паспортные данные
  sendPersonal(data) {
    return this.authHttpSrvc.put("/user/profile", data).map((resp:Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

}

