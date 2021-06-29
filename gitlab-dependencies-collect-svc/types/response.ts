interface BaseResponse {
  success: boolean;
  message: string;
}

export declare interface Response<T> extends BaseResponse {
  data: T;
}

export declare interface ListResponse<T> extends BaseResponse {
  pageNo: number;
  pageSize: number;
  total: number;
  data: T[];
}