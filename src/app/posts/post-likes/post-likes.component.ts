import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-likes',
  templateUrl: './post-likes.component.html',
  styleUrls: ['./post-likes.component.css']
})
export class PostLikesComponent implements OnInit {
  @Input()
  postId: string;
  @Input()
  postCreator: string;
  @Input()
  postLiked: boolean;
  @Input()
  userId: string;
  @Input()
  isAuthenticated: boolean;
  @Output()
  like: EventEmitter<any> = new EventEmitter();

  likeStatus: string;

  constructor(private postsService: PostsService, private router: Router) {}

  ngOnInit() {}

  likePost() {
    if (!this.isAuthenticated) {
      this.router.navigate(['auth/login']);
      return;
    }
    this.postsService
      .likePost(this.postId, this.postCreator, this.userId)
      .subscribe(result => {
        this.like.emit(result.likeCount);
        this.postLiked = true;
      });
  }

  unlikePost() {
    if (!this.isAuthenticated) {
      return;
    }

    this.postsService
      .unlikePost(this.postId, this.postCreator, this.userId)
      .subscribe(result => {
        this.like.emit(result.likeCount);
        this.postLiked = false;
      });
  }
}
