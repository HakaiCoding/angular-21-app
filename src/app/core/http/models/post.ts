export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface JsonPlaceholderPostDto {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const mapPostDto = (dto: JsonPlaceholderPostDto): Post => ({
  id: dto.id,
  title: dto.title,
  body: dto.body,
  userId: dto.userId,
});
