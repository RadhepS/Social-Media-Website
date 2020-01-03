import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  isUserPage = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isUserPage = paramMap.has("username"); // Checks to see whether we're on the user page
    });
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    if (!this.isUserPage) {
      if (this.userId) {
        this.postsService.getPosts(this.posts.length, this.userId);
      } else {
        this.postsService.getPosts(this.posts.length);
      }
    }
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postData: { posts: Post[] }) => {
        this.isLoading = false;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onEdit(postId: string, isUserPage: boolean, username: string) {
    if (isUserPage) {
      this.router.navigate(["/edit", postId, username]);
    } else {
      this.router.navigate(["/edit", postId]);
    }
  }

  onDelete(postId: string, isUserPage: boolean, creator: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        if (isUserPage) {
          this.postsService.getUserPosts(this.posts.length, creator);
        } else {
          this.postsService.getPosts(this.posts.length);
        }
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onLike(likeCount: number, post: Post) {
    post.likeCount = likeCount;
  }

  onUserClick(post: Post) {
    this.router.navigate(["/user", post.username]);
  }

  onScroll() {
    let isScrolled;
    if (isScrolled) {
      return;
    }
    isScrolled = true;
    if (this.isUserPage) {
      this.postsService.getUserPosts(this.posts.length, this.posts[0].creator);
    } else {
      this.postsService.getPosts(this.posts.length);
    }
    isScrolled = false;
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
