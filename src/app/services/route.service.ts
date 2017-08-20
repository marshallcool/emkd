import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';

import { appRoutes } from '../app.routing';


@Injectable()
export class RouteService {
    private routes = [];

    constructor() {
        this.routes = this.paths(appRoutes, this.routes);
    }

    getRoutes() {
        return this.routes;
    }

    paths(routes: Routes, paths, pathData = [], pathName = '') {
        for (let i = 0; i < routes.length; i++) {
            let name = '';
            if (pathName) {
                name = pathName + '/' + routes[i].path;
            } else {
                name = routes[i].path;
            }

            if ('data' in routes[i]) {
                if ('auth' in routes[i].data) {
                    pathData[pathData.length] = routes[i].data['auth'];
                }
            }

            if (pathData.length > 0) {
                paths[name] = {
                    auth: pathData
                };
            }

            if (routes[i].children) {
                paths = this.paths(routes[i].children, paths, pathData, name);
            }
            pathData = [];
        }

        return paths;
    }
}