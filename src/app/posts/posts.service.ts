import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { User } from '../user/user.model';

const BACK_END_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {

    this.http.get<{message: string, posts: any}>(BACK_END_URL)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        })};
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts]});
      });
  }

  getUserPosts(id: string) {
    this.http.get<{message: string, posts: any}>(BACK_END_URL + 'userposts/' + id)
      // .subscribe((response) => {
      //   this.posts = response.posts;
      //   this.postsUpdated.next( {posts: [...this.posts]} );
      // });
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            username: post.username,
            isUserPage: true
          };
        })};
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts]});
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
       title: string;
       content: string;
       imagePath: string;
       creator: string;
       username: string;
      }>(BACK_END_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>(BACK_END_URL, postData)
      .subscribe((responseData) => {
        // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string, username: string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id: id, title: title, content: content, imagePath: image, creator: null, username: null};
    }
    this.http.put<{message: string}>(BACK_END_URL + id, postData)
      .subscribe((response) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {id: id, title: title, content: content, imagePath: ''};
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        if (username) {
          this.router.navigate(['/user/', username]);
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  deletePost(postId: string) {
   return this.http.delete(BACK_END_URL + postId);
  }
}
