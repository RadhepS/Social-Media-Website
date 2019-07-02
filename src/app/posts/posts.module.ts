import { NgModule } from '@angular/core';

import { PostCreateComponent } from './post-create/post-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostLikesComponent } from './post-likes/post-likes.component';
import { MatIconModule, MatBadgeModule } from '@angular/material';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, PostLikesComponent],
  exports: [PostListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatIconModule,
    MatBadgeModule
  ]
})
export class PostsModule {}
