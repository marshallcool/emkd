import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
 
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { GuardService } from '../services/guard.service';
import { RouteService } from '../services/route.service';


@Directive({
    selector: '[auth]'
})
export class AuthDirective implements OnDestroy, OnInit {
    private el: HTMLElement;

    private visibleDisplay: string;

    private routes = [];

    @Input()
    routerLink: string;

    constructor(
        el: ElementRef,
        private eventService: EventService,
        private authService: AuthService,
        private guardService: GuardService,
        private routeService: RouteService
    ) {
        this.el = el.nativeElement;
        this.visibleDisplay = this.el.style.display;
        this.routes = this.routeService.getRoutes();
    }

    ngOnDestroy() {

    }

    ngOnInit() {
        this.eventService.on('auth_user', this);
        this.init();
    }

    init() {
        let auth = true;

        if (this.routerLink) {

            if (this.routerLink[0] == '/') {
                this.routerLink = this.routerLink.replace(/\//, '');
            }

            if (this.routerLink in this.routes) {

                for (let i = 0; i < this.routes[this.routerLink].auth.length; i++) {
                    if (!this.guardService.auth(this.routes[this.routerLink].auth[i], this.routerLink)) {
                        auth = false;
                        break;
                    }
                }
            }

        } else {
            auth = this.authService.isAuth();
        }

        this.el.style.display = auth ? this.visibleDisplay : 'none';
    }
}