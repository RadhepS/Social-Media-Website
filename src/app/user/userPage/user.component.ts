import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { PostsService } from 'src/app/posts/posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FollowData } from '../follow-data.model';
import { MatDialog } from '@angular/material';
import { ListModalComponent } from '../list-modals/follower-list-modal.component';
import { FollowListData } from '../follow-list-data';
import { ListType } from '../list-type.enum';

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
  followingListData: FollowListData[];


  constructor(
    private userService: UserService,
    public route: ActivatedRoute,
    public router: Router,
    private postService: PostsService,
    private authService: AuthService,
    public dialog: MatDialog
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
    const unfollowData: FollowData = {loginId: this.loginId, followId: this.user.id};
    this.userService.unfollowUser(unfollowData).subscribe(() => {
      this.user.isFollowed = false;
    });
  }

  openListDialog(list: FollowListData[], listType: ListType): void {
    if (!list || list.length === 0) {
      return;
    }
    this.dialog.open(ListModalComponent, {
      width: '400px',
      data: {
        list,
        listType
      }
    });
  }

  getFollowerList() {
    this.userService.getFollowerList(this.user.id).subscribe((result) => {
      this.openListDialog(result.followerList, ListType.Followers);
    });
  }

  getFollowingList() {
    this.userService.getFollowingList(this.user.id).subscribe((result) => {
      this.openListDialog(result.followingList, ListType.Following);
    });
  }

  openFollowingDialog(followingList: FollowListData[]): void {
    console.log(followingList);
    if (!followingList || followingList.length === 0) {
      return;
    }
    this.dialog.open(ListModalComponent, {
      width: '400px',
      data: followingList
    });
  }
}


