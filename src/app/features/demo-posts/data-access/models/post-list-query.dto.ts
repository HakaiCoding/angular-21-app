import type { QueryParams } from '../../../../core/http/models/api-request';

export interface PostListQueryDto extends QueryParams {
  userId?: number;
  _limit?: number;
}
