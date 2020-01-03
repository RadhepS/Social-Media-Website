import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";
import { Router } from "@angular/router";

const BACK_END_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[] }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(listSize: number, id?: string) {
    const URL = id ? BACK_END_URL + id : BACK_END_URL;
    this.http
      .get<{ message: string; posts: any }>(`${URL}/${listSize}`)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                likeCount: post.likeCount,
                liked: post.liked,
                username: post.username
              };
            })
          };
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts] });
      });
  }

  getUserPosts(listSize: number, id: string, loginId?: string) {
    this.http
      .get<{ message: string; posts: any }>(
        BACK_END_URL + "userposts/" + listSize + "/" + id + "/" + loginId
      )
      // .subscribe((response) => {
      //   this.posts = response.posts;
      //   this.postsUpdated.next( {posts: [...this.posts]} );
      // });
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                username: post.username,
                isUserPage: true,
                likeCount: post.likeCount,
                liked: post.liked
              };
            })
          };
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts] });
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
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(BACK_END_URL, postData)
      .subscribe(() => {
        // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string,
    username: string
  ) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
        username: null
      };
    }
    this.http
      .put<{ message: string }>(BACK_END_URL + id, postData)
      .subscribe(() => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {id: id, title: title, content: content, imagePath: ''};
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        if (username) {
          this.router.navigate(["/user/", username]);
        } else {
          this.router.navigate(["/"]);
        }
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACK_END_URL + postId);
  }

  likePost(postId: string, postCreator: string, userId: string) {
    const postLikeData = new FormData();
    postLikeData.append("postId", postId);
    postLikeData.append("postCreator", postCreator);
    postLikeData.append("userId", userId);
    return this.http.post<{ message: string; likeCount: number }>(
      BACK_END_URL + "likes",
      postLikeData
    );
  }

  getLikedUsers(postId: string) {
    return this.http.get<{ message: string; likedUsers: any }>(
      BACK_END_URL + "getLikedUsers" + "/" + postId
    );
  }

  unlikePost(postId: string, postCreator: string, userId: string) {
    const postUnlikeData = new FormData();
    postUnlikeData.append("postId", postId);
    postUnlikeData.append("postCreator", postCreator);
    postUnlikeData.append("userId", userId);
    return this.http.post<{ message: string; likeCount: number }>(
      BACK_END_URL + "unlikes",
      postUnlikeData
    );
  }
}
