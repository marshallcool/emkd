import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, RequestMethod, Response, RequestOptions, Request } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';


@Injectable()
export default class AuthHttpService {
  private apiHost;

  constructor(
    private http: Http,
    private strgSrvc: StorageService
  ) {
    this.apiHost = environment.api;
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (typeof url === 'string') {
      return this.get(url, options); // Recursion: transform url from String to Request
    }
    // else if ( ! url instanceof Request ) {
    //   throw new Error('First argument must be a url string or Request instance.');
    // }

    // from this point url is always an instance of Request
    let req: Request = url as Request;
    let token: string = this.strgSrvc.get("token");
    return this.requestWithToken(req, token);
  }

  private requestWithToken(req: Request, token: string): Observable<Response> {
    /*if (!tokenNotExpired(undefined, token)) {
     if (!this.config.noJwtError) {
     return new Observable<Response>((obs: any) => {
     obs.error(new AuthHttpServiceError('No JWT present or has expired'));
     });
     }
     } else {
     }*/
    req.headers.set("Authorization", token);
    return this.http.request(req);
  }


  private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions?: RequestOptionsArgs): Observable<Response> {
    let options = new RequestOptions(requestArgs);
    if (additionalOptions) {
      options = options.merge(additionalOptions);
    }
    return this.request(new Request(options));
  }


  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Get, url: this.apiHost+url }, options);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: body, method: RequestMethod.Post, url: this.apiHost+url }, options);
  }

  public postFiles(url: string, formData: FormData): Observable<Response> {
    const token: string = this.strgSrvc.get("token");
    let headers = new Headers();
    headers.append('Authorization', token);
    return this.http.post(this.apiHost+url, formData, {headers: headers});
  }

  public put(url: string, body?: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: body, method: RequestMethod.Put, url: this.apiHost+url }, options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Delete, url: this.apiHost+url }, options);
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: body, method: RequestMethod.Patch, url: this.apiHost+url }, options);
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Head, url: this.apiHost+url }, options);
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ body: '', method: RequestMethod.Options, url: this.apiHost+url }, options);
  }

}
