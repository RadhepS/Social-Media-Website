import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';



@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  isLoading = false;
  user: User;

  constructor(private userService: UserService, public route: ActivatedRoute, public router: Router ) {}

    ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const username = paramMap.get('username');
      this.isLoading = true;
      this.userService.getUser(username)
        .subscribe((response) => {
          this.user = response.user;
          this.isLoading = false;
          console.log(this.user);
        }, error => {
          this.router.navigate(['/']);
        });
      });
  }

}
