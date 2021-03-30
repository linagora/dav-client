import { DAVClient } from '../../lib/DAVClient';
import { getInbox, CalendarData } from '../../lib/api/calendars';
import { HTTPClient } from '../../lib/HTTPClient';
import { response } from './const';

describe('the getInbox method', () => {
  let davClient: DAVClient, httpClient: HTTPClient;

  const requestTextMock = jest.fn();
  requestTextMock.mockResolvedValue(response);

  beforeEach(() => {
    httpClient = {
      request: jest.fn(),
      requestJson: jest.fn(),
      requestText: requestTextMock,
    };

    davClient = new DAVClient({
      baseURL: 'http://url',
      httpClient,
      headers: {
        Authorization: 'Basic header',
      },
    });
  });

  it('should return the CalendarData for the given user id', () => {
    getInbox(davClient)('someuserid')
      .then((calendardata: CalendarData[]) => {
        const [firstResponse] = calendardata;

        // check if we have 2 responses like in the fake xml
        expect(calendardata).toHaveLength(2);
        // check the first href
        expect(firstResponse.href).toEqual('/calendars/5fbb828496e95069fd4d5114/inbox/sabredav-8c5d0154-75e3-45de-9f6f-da47e56a181e.ics');
        // the etag
        expect(firstResponse.etag).toEqual('"59be6bf1e12e937dfed81c547fc61a11"');
        // the ICS
        expect(firstResponse.ics.substring(0, 15)).toEqual('BEGIN:VCALENDAR');
        // check the parsed events from the ics 
        expect(firstResponse.events).toHaveLength(1);
      });
  });

  it('should have the parsed events from the ics within the calendarData response', () => {
    getInbox(davClient)('someuserid').then((calendardata: CalendarData[]) => {
      const [firstResponse] = calendardata;

      expect(firstResponse.events[0].id).toEqual('fae13cb1-a436-46de-b06f-7436f640e3d4');
      expect(firstResponse.events[0].title).toEqual('A');
      expect(firstResponse.events[0].allDay).toBeFalsy();
      // check the event times
      expect(firstResponse.events[0].start).toEqual('2020-11-27T14:00:00Z');
      expect(firstResponse.events[0].end).toEqual('2020-11-27T14:30:00Z');
      // check the duration
      expect(firstResponse.events[0].duration).toMatchObject({ minutes: 30});
      // check the attendess
      expect(firstResponse.events[0]?.attendees).toHaveLength(3);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(firstResponse.events[0].attendees![0]).toMatchObject({
        partstat: 'NEEDS-ACTION',
        email: 'mailto:user3@open-paas.org',
      });
      // check the extended properties
      expect(firstResponse.events[0].extendedProps['x-openpaas-videoconference']).toEqual('http://conference');
    });
  })
});
