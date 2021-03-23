import fetch from 'isomorphic-unfetch';
import { HTTPClient, RequestOptions } from './HTTPClient';

interface FetchOptions {
  method: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
}

export class HTTPFetchClient implements HTTPClient {
  private buildFetchOptions({ method, body, headers }: RequestOptions): FetchOptions {
    const fetchOptions: FetchOptions = {
      method
    };

    if (body) fetchOptions.body = body;
    if (headers) fetchOptions.headers = headers;

    return fetchOptions;
  }

  public async request(options: RequestOptions): Promise<Response> {
    const fetchOptions = this.buildFetchOptions(options);

    const response = await fetch(options.url, fetchOptions);

    if (response.ok) return response;

    throw new Error(`${response.status} ${response.statusText}`);
  }

  public async requestJson<T>(options: RequestOptions): Promise<T> {
    const response = await this.request(options);

    const jsonBodyContent = await response.json();

    return jsonBodyContent;
  }

  public async requestText(options: RequestOptions): Promise<string> {
    const response = await this.request(options);

    const textBodyContent = await response.text();

    return textBodyContent;
  }
}
