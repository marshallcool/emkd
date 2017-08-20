import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';


@Directive({
    selector: '[role]'
})
export class RoleDirective implements OnDestroy, OnInit {
    private el: HTMLElement;

    private visibleDisplay: string;

    @Input()
    role: string;

    constructor(
        el: ElementRef,
        private eventService: EventService,
        private authService: AuthService
    ) {
        this.el = el.nativeElement;
        this.visibleDisplay = this.el.style.display;
    }

    ngOnDestroy() {

    }

    ngOnInit() {
        this.eventService.on('auth_user', this);
        this.init();
    }

    init() {
        let auth = this.authService.isAuth();

        let params:Array<any> = this.role.replace(/\s/g, '').split(/\[(.*)\]/);
        params = params.filter(e => {return e});

        let roles = params[0].replace(/\'/g, '').split(',');

        let require = null;
        if (params[1]) {
            require = (params[1].replace(/,/, '') === 'true') ? true : (params[1].replace(/,/, '') === 'false') ? false : null;
        }

        if (this.authService.isAuth()) {
            if (!this.authService.role(roles, require)) {
                auth = false;
            }
        }


        this.el.style.display = auth ? this.visibleDisplay : 'none';
    }
}