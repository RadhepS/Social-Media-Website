import { Component, Input } from '@angular/core';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-like-counter',
  templateUrl: './post-like-counter.component.html',
  styleUrls: ['./post-like-counter.component.css']
})
export class PostLikeCounterComponent {
  @Input()
  likeCount: number;
  @Input()
  postId: string;

  constructor(private postsService: PostsService) {}

  getLikedUsers() {
    this.postsService.getLikedUsers(this.postId).subscribe(result => {
      console.log(result);
    });
  }
}
