import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class StorageService {
    phoneChange: Subject<string> = new Subject<string>();

    constructor(
        private cookieStorage: CookieService
    ) { }

    get(name: string): string {
        return localStorage.getItem(name) ? localStorage.getItem(name) : this.cookieStorage.get(name) ? this.cookieStorage.get(name) : null;
    }

    set(name: string, value: string, remember?: boolean): any {
        if (localStorage.getItem(name) || remember) {
            localStorage.setItem(name, value);
        }

        if (this.cookieStorage.get(name) || !remember) {
            this.cookieStorage.put(name, value);
        }

        if (name === 'phone' && value){
            this.phoneChange.next(value);
        }
    }

    clear(name)
    {
        if (localStorage.getItem(name)) {
            localStorage.removeItem(name);
        }

        if (this.cookieStorage.get(name)) {
            this.cookieStorage.remove(name);
        }
    }

    is(name): boolean {
        return this.get(name) ? true : false;
    }
}