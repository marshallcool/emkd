import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';

import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { RouteService } from './route.service';

import cnst from '../tools/constants';
const urls = cnst.URLS;


@Injectable()
export class GuardService implements CanActivate {
    constructor(
        private router: Router,
        private locationStrategy: LocationStrategy,
        private routeService: RouteService,
        private eventService: EventService,
        private authService: AuthService
    ) {
        this.eventService.on('auth_user', this);
        this.init();
    }

    init() {
        let path = this.locationStrategy.path();

        if (path[0] == '/') {
            path = path.replace(/\//, '');
        }

        let routes = this.routeService.getRoutes();
        if (path in routes) {
            for (let i = 0; i < routes[path].auth.length; i++) {
                if (!this.auth(routes[path].auth[i], path, true)) {
                    break;
                }
            }
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if ('auth' in route.data) {
            let auth = route.data['auth'];
            return this.auth(auth, state.url, true);
        }

        return true;
    }

    auth(auth: any, routerLink: string, navigate:boolean = false): boolean {
      // authorization user redirect from 'login' to 'timeline'
      if (routerLink.localeCompare(urls.index) === 0 || routerLink.localeCompare(urls.login) === 0) {
        if (this.authService.isAuth()) {
          if (navigate) {
            this.router.navigate([urls.timeline]);
          }                    
          return false;
        }
      }

      if (auth) {
        if (!this.authService.isAuth()) {
          if (routerLink.localeCompare(urls.login) !== 0) {
            if (navigate) {
              this.authService.signOut();
            }
            return false;
          }
         }
      }

        // if (auth) {
        //     if (this.authService.isAuth()) {
        //         if (routerLink.localeCompare(urls.login) !== 0) {
        //             if (this.authService.role('guest', true)) {
        //                 if (navigate) {
        //                     this.router.navigate([urls.login]);
        //                 }
        //                 return false;
        //             } else {
        //                 if (navigate) {
        //                     this.router.navigate([urls.timeline]);
        //                 }
        //                 return false;
        //             }
        //         }
        //     } else {
        //         if (navigate) {
        //             this.router.navigate([urls.login]);
        //         }
        //         return false;
        //     }

        //     if (auth instanceof Object) {
        //         if ('role' in auth) {
        //             for (let id in auth.role) {
        //                 if (!this.authService.role(auth.role[id].roles, auth.role[id].require)) {
        //                     if (navigate) {
        //                         this.router.navigate(['**']); //403
        //                     }
        //                     return false;
        //                 }
        //             }
        //         }

        //         if ('permission' in auth) {
        //             for (let id in auth.permission) {
        //                 if (!this.authService.permission(auth.permission[id].permissions, auth.permission[id].require)) {
        //                     if (navigate) {
        //                         this.router.navigate(['**']); //403
        //                     }
        //                     return false;
        //                 }
        //             }
        //         }

        //         if ('ability' in auth) {
        //             for (let id in auth.ability) {
        //                 if (!this.authService.ability(auth.ability[id].roles, auth.ability[id].permissions, auth.ability[id].require)) {
        //                     if (navigate) {
        //                         this.router.navigate(['**']); //403
        //                     }
        //                     return false;
        //                 }
        //             }
        //         }
        //     }
        // } else {
        //     if (this.authService.isAuth()) {
        //         if (navigate) {
        //             this.router.navigate([urls.timeline]);
        //         }
        //         return false;
        //     }
        // }

        return true;
    }
}