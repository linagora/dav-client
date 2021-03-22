# DAV Client

A DAV client to send requests to DAV servers.

## Usage

Here's an example usage:

```javascript
import { DAVClient, getInbox, HTTPFetchClient } from 'dav-client';

const [username, password] = ['admin@open-paas.org', 'secret'];
const httpClient = new HTTPFetchClient();
const davClient = new DAVClient({ baseURL: 'http://0.0.0.0:8001', httpClient, headers: { Authorization: `Basic ${Buffer.from([username, password].join(':')).toString('base64')}`} });

getInbox(davClient)('5f60334e78d1b021351f9f6e')
  .then(inbox => {
    console.log('inbox =', inbox);
  });
```

You can replace the default `HTTPFetchClient` (which uses [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)) with any http client as long as it follows the following interface:

```typescript
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
```

## Build

To build the library, run the following command:

```bash
npm run build
```

The built code will reside in the **./build/** folder.

## Test

To run tests, run the following command:

```bash
npm run test
```
