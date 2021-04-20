import { DAVClient } from '../../lib/DAVClient';
import { getInbox, CalendarData, modifyEvent ,deleteEvent } from '../../lib/api/calendars';
import { HTTPClient } from '../../lib/HTTPClient';
import { response } from './const';
import { CalendarEventObject } from 'dav-parser';

let davClient: DAVClient, httpClient: HTTPClient;

describe('the getInbox method', () => {
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

describe('the modifyEvent method', () => {
  beforeEach(() => {
    httpClient = {
      request: jest.fn(),
      requestJson: jest.fn(),
      requestText: jest.fn(),
    };

    davClient = new DAVClient({
      baseURL: 'http://url',
      httpClient,
      headers: {
        Authorization: 'Basic header',
      },
    });
  });

  it('should send a PUT request to the event path with the event object ICS as body', () => {
    const path = 'events/123456.ics';
    const testEventObject: CalendarEventObject = {
      id: '123456',
      title: 'test',
      start: '2021-03-15T10:00:00',
      end: '2021-03-15T11:00:00',
      allDay: false,
      description: 'simple description',
      location: 'some location',
      duration: {
        hours: 1,
      },
      extendedProps: {},
    };

    modifyEvent(davClient)(path, testEventObject);
    expect(httpClient.requestText).toHaveBeenCalledWith({
      url: 'http://url/calendars/events/123456.ics',
      method: 'PUT',
      body: 'BEGIN:VCALENDAR\r\n\
VERSION:2.0\r\n\
CALSCALE:GREGORIAN\r\n\
BEGIN:VEVENT\r\n\
UID:123456\r\n\
SUMMARY:test\r\n\
LOCATION:some location\r\n\
DESCRIPTION:simple description\r\n\
DTSTART:20210315T100000\r\n\
DTEND:20210315T110000\r\n\
END:VEVENT\r\n\
END:VCALENDAR',
      headers: {
        Authorization: 'Basic header',
      }
    });
  });
});

describe('the deleteEvent method', () => {
  let davClient: DAVClient, httpClient: HTTPClient;
  beforeEach(() => {
    httpClient = {
      request: jest.fn(),
      requestJson: jest.fn(),
      requestText: jest.fn(),
    };

    davClient = new DAVClient({
      baseURL: 'http://url',
      httpClient,
      headers: {
        Authorization: 'Basic header',
      },
    });
  });

  it('should send a DELETE request to the event path', () => {
    const path = 'events/123456.ics';

    deleteEvent(davClient)(path);
    expect(httpClient.requestJson).toHaveBeenCalledWith({
      url: 'http://url/calendars/events/123456.ics',
      method: 'DELETE',
      headers: {
        Authorization: 'Basic header',
      }
    });
  });
});
