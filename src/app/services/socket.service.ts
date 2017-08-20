import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { StorageService } from './storage.service';
import cnst from '../tools/constants';


@Injectable()
export class SocketService {
    private socket = null;

    constructor (
        private storage: StorageService
    ) { }

    connect() {
        if (!this.socket) {
            this.socket = io.connect(cnst.SOCKET_API_URL);

            this.socket.on('connect', connect => {
                console.log('connect');
                this.socket.emit('user', {'token': this.storage.get('token').replace(/Bearer /g, '')});
            });
        }
        return this.socket;
    }

    disconnect() {
        console.log('disconnect');
        this.socket ? this.socket.disconnect() : null;
    }
}