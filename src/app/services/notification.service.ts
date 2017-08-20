import { Injectable } from '@angular/core';


@Injectable()
export class NotificationService {
  public error(text:string) {
    noty({text: text, theme:'relax', timeout: 3000, layout:'topCenter', type:'error'});
  }

  public success(text:string) {
    noty({text: text, theme:'relax', timeout: 3000, layout:'topCenter', type:'success'});
  }

  public warning(text:string) {
    noty({text: text, theme:'relax', timeout: 3000, layout:'topCenter', type:'warning'});
  }

  public info(text:string) {
  	noty({text: text, theme:'relax', timeout: 3000, layout:'topRight', type:'information'});	
  }
}
