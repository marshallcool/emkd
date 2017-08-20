import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { StorageService } from './storage.service';
import { SocketService } from './socket.service';
import { EventService } from './event.service';

import { User } from '../interfaces/user.interfaces';
import { environment } from '../../environments/environment';

import cnst from '../tools/constants';


@Injectable()
export class AuthService {
    private user: User;
    private apiHost: string;

    constructor(
        private http: Http,
        private storageService: StorageService,
        private socketService: SocketService,
        private eventService: EventService,
        private router: Router,
    ) {
        this.apiHost = environment.api;
    }

    private getSocket()
    {
        let connect = this.socketService.connect();

        connect.on('reconnect', reconnect => {
            console.log('socket reconnect');
            this.initialize();
        });

        connect.on('token', token => {
            console.log('socket send token');
            this.initialize();
            connect.emit('user', {'token': this.storageService.get('token')});
        });

        connect.on('user', user => {
            console.log('socket get user' + JSON.stringify(user));
            this.setUser(user);
        });
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body.error || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

    initialize(): Promise<any> {
        if (this.storageService.is('token')) {
            return this.http.get(this.apiHost + '/user?include=roles.permissions')
                .toPromise()
                .then(response => {
                    this.getSocket();
                    let body = response.json();
                    this.setUser(body.user);
                })
                .catch(this.handleError);
        }
    }

    role(roles, requireAll = false)
    {
        if (roles instanceof Array) {
            for (let id in roles) {
                var hasRole = this.role(roles[id], requireAll);

                if (hasRole && !requireAll) {
                    return true;
                }

                if (!hasRole && requireAll) {
                    return false;
                }
            }

            return requireAll;
        } else {
            if (this.isAuth()) {
                var userRoles = this.user.roles;
            } else {
                return false;
            }

            for (let id in userRoles) {
                if (userRoles[id].name == roles) {
                    return true;
                }
            }
        }

        return false;
    }

    permission(permissions, requireAll = false)
    {
        if (permissions instanceof Array) {
            for (let id in permissions) {
                var hasPermission = this.permission(permissions[id], requireAll);

                if (hasPermission && !requireAll) {
                    return true;
                }

                if (!hasPermission && requireAll) {
                    return false;
                }
            }

            return requireAll;
        } else {
            if (this.isAuth()) {
                var userRoles = this.user.roles;
            } else {
                return false;
            }

            for (let roleId in userRoles) {
                if ('permissions' in userRoles[roleId]) {
                    for (let permissionId in userRoles[roleId].permissions) {
                        if (userRoles[roleId].permissions[permissionId].name == permissions) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    ability(roles, permissions, requireAll = false)
    {
        for (let id in roles) {
            var hasRole = this.role(roles[id], requireAll);

            if (hasRole && !requireAll) {
                return true;
            }

            if (!hasRole && requireAll) {
                return false;
            }
        }

        for (let id in permissions) {
            var hasPermission = this.permission(permissions[id], requireAll);

            if (hasPermission && !requireAll) {
                return true;
            }

            if (!hasPermission && requireAll) {
                return false;
            }
        }

        return true;
    }

    isAuth(): boolean {
        return this.storageService.get('token') ? true : false;
        // return this.user ? true : false;
    }

    setUser(user) {
        this.user = user;
        // todo: uncomment
        // this.eventService.broadcast('auth_user');
    }

    signIn(user, remember): Observable<any> {
        return this.http.post(this.apiHost + '/auth/signin', user)
            .map(response => {
                this.getSocket();

                const token = response.headers.get('Authorization');
                this.storageService.set('token', token, remember);
                this.storageService.set('phone', user.phone, remember);

                const body = response.json();
                this.setUser(body.user);

                return true;

            })
            .catch(this.handleError);
    }

    signOut() {
        this.socketService.disconnect();
        this.storageService.clear('token');
        this.storageService.clear('phone');
        this.setUser(null);
        this.router.navigate([cnst.URLS.login]);
    }
}