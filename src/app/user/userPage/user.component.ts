import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { PostsService } from 'src/app/posts/posts.service';
import { Subscription } from 'rxjs';



@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  isLoading = false;
  user: User;
  userSub: Subscription;

  constructor(private userService: UserService, public route: ActivatedRoute, public router: Router, private postService: PostsService ) {}

    ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const username = paramMap.get('username');
      this.isLoading = true;
      this.userService.getUser(username);
      this.userSub = this.userService.getUserUpdatedListener()
      .subscribe((postData: {user: User}) => {
        this.user = postData.user;
        this.isLoading = false;
      });
  });
}

}
