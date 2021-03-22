export interface RequestOptions {
  url: string;
  method: string;
  params?: Record<string, unknown>;
  headers?: HeadersInit;
  body?: BodyInit | null;
}

export interface HTTPClient {
  request(options: RequestOptions): Promise<Response>;
  requestJson<T>(options: RequestOptions): Promise<T>;
  requestText(options: RequestOptions): Promise<string>;
}
