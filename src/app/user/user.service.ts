import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from './user.model';

const BACK_END_URL = environment.apiUrl + '/user/';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) {}

  getUser(username: string) {
    return this.http.get<{message: string, user: User}>(BACK_END_URL + username);
  }

}



