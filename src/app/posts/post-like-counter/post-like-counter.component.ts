import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-like-counter',
  templateUrl: './post-like-counter.component.html',
  styleUrls: ['./post-like-counter.component.css']
})
export class PostLikeCounterComponent {
  @Input()
  likeCount: number;

  constructor() {}
}
