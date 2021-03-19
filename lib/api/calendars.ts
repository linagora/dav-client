import { DAVClient } from '../DAVClient';

const BASE_PATH = '/calendars';

export const getInbox = (client: DAVClient) => async (userId: string): Promise<string> => {
  return client.requestText({
    url: `${BASE_PATH}/${userId}/inbox`,
    method: 'REPORT',
    headers: {
      Depth: '1'
    },
    body: `<c:calendar-query
            xmlns:d="DAV:"
            xmlns:c="urn:ietf:params:xml:ns:caldav">
            <d:prop>
              <d:getetag />
              <c:calendar-data />
            </d:prop>
            <c:filter>
              <c:comp-filter name="VCALENDAR" />
            </c:filter>
          </c:calendar-query>`
  });
}
