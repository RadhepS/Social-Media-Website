export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
  username: string;
  isUserPage?: boolean;
  likeCount?: number;
}
