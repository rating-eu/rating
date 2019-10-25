/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Injectable} from '@angular/core';
import {JhiLanguageService} from 'ng-jhipster';

import {Principal} from '../auth/principal.service';
import {AuthServerProvider} from '../auth/auth-jwt.service';
import {LocalStorageService, SessionStorageService} from '../../../../../../node_modules/ngx-webstorage';

@Injectable()
export class LoginService {

    constructor(
        private languageService: JhiLanguageService,
        private principal: Principal,
        private authServerProvider: AuthServerProvider,
        private sessionStorage: SessionStorageService,
        private localStorage: LocalStorageService
    ) {
    }

    login(credentials, callback?) {
        const cb = callback || function() {
        };

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe((data) => {
                this.principal.identity(true).then((account) => {
                    // After the login the language will be changed to
                    // the language selected by the user during his registration
                    if (account !== null) {
                        this.languageService.changeLanguage(account.langKey);
                    }
                    resolve(data);
                });
                return cb();
            }, (err) => {
                this.logout();
                reject(err);
                return cb(err);
            });
        });
    }

    loginWithToken(jwt, rememberMe) {
        return this.authServerProvider.loginWithToken(jwt, rememberMe);
    }

    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
        this.sessionStorage.clear();
        this.localStorage.clear();
        this.sessionStorage.store('isAfterLogin', true);
    }

    checkLogin(): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {
            if (account) {
                return true;
            }else{
                return false;
            }
        }).catch((error: any) => {
            return false;
        }));
    }
}
