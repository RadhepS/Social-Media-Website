import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostsService } from '../posts.service';

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
  userId: string;
  @Output()
  like: EventEmitter<any> = new EventEmitter();

  constructor(public postsService: PostsService) {}

  ngOnInit() {}

  likePost() {
    this.postsService
      .likePost(this.postId, this.postCreator, this.userId)
      .subscribe(result => {
        this.like.emit(result.likeCount);
      });
  }
}
