import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor( public postsService: PostsService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: {posts: Post[]}) => {
        this.isLoading = false;
        this.posts = postData.posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onEdit(postId: string, isUserPage: boolean, username: string) {
    if (isUserPage) {
      this.router.navigate(['/edit', postId, username]);
    } else {
    this.router.navigate(['/edit', postId]);
    }
  }


  onDelete(postId: string, isUserPage: boolean, creator: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      if (isUserPage) {
        this.postsService.getUserPosts(creator);
      } else {
      this.postsService.getPosts();
      }
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
