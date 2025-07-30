export interface BaseResponse<T = unknown> {
  metaData: {
    code: number;
    message: string;
  };
  responseMessage: string;
  data: T;
}
