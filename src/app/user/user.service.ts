import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from './user.model';
import { PostsService } from '../posts/posts.service';
import { Subject } from 'rxjs';
import { FollowData } from './follow-data.model';
import { UserListData } from './user-list-data';

const BACK_END_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {
  user: User;
  private userUpdated = new Subject<{ user: User }>();

  constructor(
    private postService: PostsService,
    private http: HttpClient,
    private router: Router
  ) {}

  getUser(username: string, loginId: string) {
    return this.http
      .get<{ message: string; user: User }>(
        BACK_END_URL + username + '/' + loginId
      )
      .subscribe(
        response => {
          this.user = response.user;
          this.userUpdated.next({ user: this.user });
          this.postService.getUserPosts(this.user.id);
        },
        () => {
          this.router.navigate(['/']);
        }
      );
  }

  followUser(followData: FollowData) {
    return this.http.post(BACK_END_URL + 'follow', followData);
  }

  unfollowUser(followData: FollowData) {
    return this.http.post(BACK_END_URL + 'unfollow', followData);
  }

  getFollowerList(userId: string) {
    return this.http.get<{ followerList: UserListData[] }>(
      BACK_END_URL + 'followerlist' + '/' + userId
    );
  }

  getFollowingList(userId: string) {
    return this.http.get<{ followingList: UserListData[] }>(
      BACK_END_URL + 'followingList' + '/' + userId
    );
  }

  getUserInfo() {
    return this.user;
  }

  getUserUpdatedListener() {
    return this.userUpdated.asObservable();
  }
}
