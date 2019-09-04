import { Component, Input } from '@angular/core';
import { PostsService } from '../posts.service';
import { ListModalComponent } from 'src/app/shared/list-modals/list-modal.component';
import { MatDialog } from '@angular/material';
import { UserListData } from 'src/app/user/user-list-data';
import { ListType } from 'src/app/user/list-type.enum';

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

  constructor(private postsService: PostsService, public dialog: MatDialog) {}

  getLikedUsers() {
    this.postsService.getLikedUsers(this.postId).subscribe(result => {
      this.openListDialog(result.likedUsers, ListType.Likes);
    });
  }

  openListDialog(list: UserListData[], listType: ListType): void {
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
}
