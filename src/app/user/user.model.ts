export interface User {
  id: string;
  username: string;
  isFollowed: boolean;
  postCount: number;
  followerCount: number;
  followingCount: number;
}
