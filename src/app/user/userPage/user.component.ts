import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { PostsService } from 'src/app/posts/posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FollowData } from '../follow-data.model';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isLoading = false;
  user: User;
  userSub: Subscription;
  isFollowed = false;
  isSameUser = false;
  loginId: string;

  constructor(
    private userService: UserService,
    public route: ActivatedRoute,
    public router: Router,
    private postService: PostsService,
    private authService: AuthService
  ) {}


  ngOnInit() {
    this.loginId = this.authService.getUserId();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const username = paramMap.get('username');
      this.isLoading = true;
      this.userService.getUser(username, this.loginId);
      this.userSub = this.userService
        .getUserUpdatedListener()
        .subscribe((postData: { user: User }) => {
          this.user = postData.user;
          this.isLoading = false;
          this.checkIfSameUser(this.loginId, this.user.id);
        });
    });
  }

  // Checks to see if the user logged in is the same as the user on the user page
  checkIfSameUser(loggedInUser: string, viewingUser: string ) {
    this.isSameUser = loggedInUser === viewingUser;
  }

  followUser() {
    const followData: FollowData = {loginId: this.loginId, followId: this.user.id};
    this.userService.followUser(followData).subscribe(() => {
      this.user.isFollowed = true;
    });
  }

  unfollowUser() {
    this.user.isFollowed = false;
    console.log('unfollowing');
  }
}
