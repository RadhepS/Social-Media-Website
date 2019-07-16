import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './userPage/user.component';
import { PostsModule } from '../posts/posts.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    UserRoutingModule,
    PostsModule
  ]
})
export class UserModule {}
