export interface PostDto {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostCommentDto {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface PostListQuery {
  userId?: number;
  limit?: number;
}

export const toPost = (dto: PostDto): Post => ({
  userId: dto.userId,
  id: dto.id,
  title: dto.title,
  body: dto.body,
});

export const toPostComment = (dto: PostCommentDto): PostComment => ({
  postId: dto.postId,
  id: dto.id,
  name: dto.name,
  email: dto.email,
  body: dto.body,
});
