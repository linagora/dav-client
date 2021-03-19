import { HTTPFetchClient } from '../lib/HTTPFetchClient';
import fetch from 'isomorphic-unfetch';
import { RequestOptions } from '../lib/HTTPClient';

jest.mock('isomorphic-unfetch', () => jest.fn());

describe('The HTTPFetchClient class', () => {
  const fetchMockReturnValue: Partial<Response> = {};

  beforeEach(() => {
    fetchMockReturnValue.json = () => Promise.resolve({});
    fetchMockReturnValue.text = () => Promise.resolve('');

    (fetch as jest.Mock).mockReturnValue(Promise.resolve(fetchMockReturnValue));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('The request method', () => {
    it('should send a fetch request with the correct params without headers and body', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'GET' };

      await httpFetchClient.request(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method });
    });

    it('should send a fetch request with the correct params with headers but without body', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'GET', headers: { Authorization: 'Bearer whatever' } };

      await httpFetchClient.request(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method, headers: requestOptions.headers });
    });

    it('should send a fetch request with the correct params with headers and body', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'POST', headers: { Authorization: 'Bearer whatever' }, body: '{"a":1}' };

      await httpFetchClient.request(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method, headers: requestOptions.headers, body: requestOptions.body });
    });
  });

  describe('The requestJson method', () => {
    let jsonBodyContent: Record<string, unknown>;

    beforeEach(() => {
      jsonBodyContent = { a: 'b' };

      fetchMockReturnValue.json = () => Promise.resolve(jsonBodyContent);
    });
    
    it('should send a fetch request with the correct params without headers and body and return json content', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'GET' };

      const result = await httpFetchClient.requestJson(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method });
      expect(result).toBe(jsonBodyContent);
    });

    it('should send a fetch request with the correct params with headers but without body and return json content', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'GET', headers: { Authorization: 'Bearer whatever' } };

      const result = await httpFetchClient.requestJson(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method, headers: requestOptions.headers });
      expect(result).toBe(jsonBodyContent);
    });

    it('should send a fetch request with the correct params with headers and body and return json content', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'POST', headers: { Authorization: 'Bearer whatever' }, body: '{"a":1}' };

      const result = await httpFetchClient.requestJson(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method, headers: requestOptions.headers, body: requestOptions.body });
      expect(result).toBe(jsonBodyContent);
    });
  });

  describe('The requestText method', () => {
    let textBodyContent: string;

    beforeEach(() => {
      textBodyContent = '<xml></xml>';

      fetchMockReturnValue.text = () => Promise.resolve(textBodyContent);
    });
    
    it('should send a fetch request with the correct params without headers and body and return text content', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'GET' };

      const result = await httpFetchClient.requestText(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method });
      expect(result).toBe(textBodyContent);
    });

    it('should send a fetch request with the correct params with headers but without body and return text content', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'GET', headers: { Authorization: 'Bearer whatever' } };

      const result = await httpFetchClient.requestText(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method, headers: requestOptions.headers });
      expect(result).toBe(textBodyContent);
    });

    it('should send a fetch request with the correct params with headers and body and return text content', async () => {
      const httpFetchClient = new HTTPFetchClient();
      const requestOptions: RequestOptions = { url: 'http://url.com', method: 'POST', headers: { Authorization: 'Bearer whatever' }, body: '{"a":1}' };

      const result = await httpFetchClient.requestText(requestOptions);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(requestOptions.url, { method: requestOptions.method, headers: requestOptions.headers, body: requestOptions.body });
      expect(result).toBe(textBodyContent);
    });
  });
});
