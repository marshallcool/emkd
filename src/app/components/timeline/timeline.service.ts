import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import AuthHttpService from '../../services/authHttp.service';
import BaseService from '../../services/base.service';
import { EventResponse } from './timeline.interfaces';


@Injectable()
export class TimelineService {

  constructor(
    private authHttpSrvc: AuthHttpService,
    private baseSrvc: BaseService
  ){}

  /** Получить параметры фильтра */
  getFilterParams():Observable<any>{
    return this.authHttpSrvc.get('/events/filter/options').map((resp:Response) => {
      return resp.json();
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Поменить евент прочитанным */
  /** Если параметр ID Не задан - то помечаются все записи */
  markAsReaded(id?:number):Observable<boolean>{
    return this.authHttpSrvc.put(id? '/event/read/'+id : '/event/read').map((rsp:Response)=>{
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Удалить событие из ленты*/
  delete(id:number):Observable<boolean>{
    return this.authHttpSrvc.delete('/event/'+id).map((rsp:Response) => {
      return true;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  getHouse(houses:number[] = null, limit:number = null):Observable<EventResponse> {
    let query = "/events?";
    if(houses){
      query += "realty="+houses+'&';
    }
    if(limit){
      query += "limit="+limit+'&';
    }
    return this.authHttpSrvc.get(query).map((rsp:Response)=>{
      if(rsp.status == 204){
        let er = <EventResponse>{};
        er.events = [];
        return er;
      }
      return rsp.json() as EventResponse;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  getModules(modules:number[] = null, limit:number = null):Observable<EventResponse> {
    let query = "/events?";
    if(modules){
      query += "modules="+modules+'&';
    }
    if(limit){
      query += "limit="+limit+'&';
    }
    return this.authHttpSrvc.get(query).map((rsp:Response)=>{
      if(rsp.status == 204){
        let er = <EventResponse>{};
        er.events = [];
        return er;
      }
      return rsp.json() as EventResponse;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  /** Вернуть все евенты
   * @param onlyUnread Только не прочитанные
   * @param dateFrom Период с (2016.01.01 or 2016-01-01)
   * @param dateTo Период по (2016.01.01 or 2016-01-01)
   * @param houses Дома (1,2,3,4)
   * @param modules Модули (1,2,3,4)
   * @param limit (Пагинация) Количество записей
   * @param page (Пагинация) Страница выборки
   * */
  get(
    onlyRead:number = null,
    // onlyUnread:boolean = false,
    dateFrom:string = null,
    dateTo:string = null,
    houses:number[] = null,
    modules:number[] = null,
    limit:number = null,
    page:number = null
  ):Observable<EventResponse>{
   let query = "/events?";
    if(onlyRead){
      query += "unread="+onlyRead+'&';
    }
    if(dateFrom){
      query += "date_from="+dateFrom+'&';
    }
    if(dateTo){
      query += "date_to="+dateTo+'&';
    }
    if(houses){
      query += "realty="+houses+'&';
    }
    if(modules){
      query += "modules="+modules+'&';
    }
    if(limit){
      query += "limit="+limit+'&';
    }
    if(page){
      query += "page="+page;
    }
    return this.authHttpSrvc.get(query).map((rsp:Response)=>{
      if(rsp.status == 204){
        let er = <EventResponse>{};
        er.events = [];
        return er;
      }
      return rsp.json() as EventResponse;
    }).catch(err => this.baseSrvc.handleError(err));
  }

  //Автоподгрузка событий
  load(limit:number = null) {
    let query = "/events?";
    return this.authHttpSrvc.get(query + "limit="+limit+'&').map((rsp:Response)=>{
      if(rsp.status == 204){
        let er = <EventResponse>{};
        er.events = [];
        return er;
      }
      return rsp.json() as EventResponse;
    }).catch(err => this.baseSrvc.handleError(err));
  }

}
