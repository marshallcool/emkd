import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class EventService {
    private listeners;
    private eventSubject;
    private event;

    constructor() {
        this.listeners = {};
        this.eventSubject = new Rx.Subject();

        this.event = Rx.Observable.from(this.eventSubject);

        this.event.subscribe(
            ({name, args}) => {
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener.init(...args);
                    }
                }
            });
    }

    on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    broadcast(name, ...args) {
        this.eventSubject.next({
            name,
            args
        });
    }
}