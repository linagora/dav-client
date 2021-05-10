import urlJoin from 'url-join';
import { DAVClient } from '../lib/DAVClient';
import { HTTPClient, RequestOptions } from '../lib/HTTPClient';

describe('The DAVClient class', () => {
  let httpClient: HTTPClient;

  beforeEach(() => {
    httpClient = {
      request: jest.fn(),
      requestJson: jest.fn(),
      requestText: jest.fn(),
    };
  });

  describe('The changeBaseURL method', () => {
    it('should change the base URL correctly', async () => {
      const davClient = new DAVClient({ baseURL: 'http://url.com/', httpClient, headers: { Authorization: 'Bearer token' } });
      const newBaseURL = 'http://new-base-url.com/';

      davClient.changeBaseURL(newBaseURL);

      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1' } };

      await davClient.requestJson(requestOptions);

      expect(httpClient.requestJson).toHaveBeenCalledTimes(1);
      expect(httpClient.requestJson).toHaveBeenCalledWith({
        url: urlJoin(newBaseURL, requestOptions.url),
        method: 'GET',
        headers: { Authorization: 'Bearer token', Depth: '1' },
      });
    });
  });

  describe('The attachHeaders method', () => {
    it('should attach headers correctly', async () => {
      const davClient = new DAVClient({ baseURL: 'http://url.com/', httpClient, headers: { Authorization: 'Bearer token' } });
      const headers = { Authorization: 'Basic', 'Cache-Control': 'no-cache' };

      davClient.attachHeaders(headers);

      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1' } };

      await davClient.requestJson(requestOptions);

      expect(httpClient.requestJson).toHaveBeenCalledTimes(1);
      expect(httpClient.requestJson).toHaveBeenCalledWith({
        url: 'http://url.com/api/test',
        method: 'GET',
        headers: { Authorization: 'Basic', Depth: '1', 'Cache-Control': 'no-cache' },
      });
    });
  });

  describe('The requestJson method', () => {
    it('should send a request using the requestJson method of the http client with correct params', async () => {
      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1' } };
      const davClient = new DAVClient({
        baseURL: 'http://url.com/',
        httpClient,
        headers: { Authorization: 'Bearer token' },
      });

      await davClient.requestJson(requestOptions);

      expect(httpClient.requestJson).toHaveBeenCalledTimes(1);
      expect(httpClient.requestJson).toHaveBeenCalledWith({
        url: 'http://url.com/api/test',
        method: 'GET',
        headers: { Authorization: 'Bearer token', Depth: '1' },
      });
    });

    it('should override header options correctly', async () => {
      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1', Authorization: 'Basic' } };
      const davClient = new DAVClient({ baseURL: 'http://url.com/', httpClient, headers: { Authorization: 'Bearer token' } });

      await davClient.requestJson(requestOptions);

      expect(httpClient.requestJson).toHaveBeenCalledTimes(1);
      expect(httpClient.requestJson).toHaveBeenCalledWith({ url: 'http://url.com/api/test', method: 'GET', headers: { Authorization: 'Basic', Depth: '1' } });
    });
  });

  describe('The requestText method', () => {
    it('should send a request using the requestText method of the http client with correct params', async () => {
      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1' } };
      const davClient = new DAVClient({
        baseURL: 'http://url.com/',
        httpClient,
        headers: { Authorization: 'Bearer token' },
      });

      await davClient.requestText(requestOptions);

      expect(httpClient.requestText).toHaveBeenCalledTimes(1);
      expect(httpClient.requestText).toHaveBeenCalledWith({
        url: 'http://url.com/api/test',
        method: 'GET',
        headers: { Authorization: 'Bearer token', Depth: '1' },
      });
    });

    it('should override header options correctly', async () => {
      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1', Authorization: 'Basic' } };
      const davClient = new DAVClient({ baseURL: 'http://url.com/', httpClient, headers: { Authorization: 'Bearer token' } });

      await davClient.requestText(requestOptions);

      expect(httpClient.requestText).toHaveBeenCalledTimes(1);
      expect(httpClient.requestText).toHaveBeenCalledWith({ url: 'http://url.com/api/test', method: 'GET', headers: { Authorization: 'Basic', Depth: '1' } });
    });
  });
});
