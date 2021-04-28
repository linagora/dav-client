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

  describe('The requestJson method', () => {
    it('should send a request using the requestJson method of the http client with correct params', () => {
      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1' } };
      const davClient = new DAVClient({
        baseURL: 'http://url.com/',
        httpClient,
        headers: { Authorization: 'Bearer token' },
      });

      davClient.requestJson(requestOptions);

      expect(httpClient.requestJson).toHaveBeenCalledTimes(1);
      expect(httpClient.requestJson).toHaveBeenCalledWith({
        url: 'http://url.com/api/test',
        method: 'GET',
        headers: { Authorization: 'Bearer token', Depth: '1' },
      });
    });
  });

  describe('The requestText method', () => {
    it('should send a request using the requestText method of the http client with correct params', () => {
      const requestOptions: RequestOptions = { url: '/api/test', method: 'GET', headers: { Depth: '1' } };
      const davClient = new DAVClient({
        baseURL: 'http://url.com/',
        httpClient,
        headers: { Authorization: 'Bearer token' },
      });

      davClient.requestText(requestOptions);

      expect(httpClient.requestText).toHaveBeenCalledTimes(1);
      expect(httpClient.requestText).toHaveBeenCalledWith({
        url: 'http://url.com/api/test',
        method: 'GET',
        headers: { Authorization: 'Bearer token', Depth: '1' },
      });
    });
  });
});
