import { DAVClient } from '../../lib/DAVClient';
import { getInbox, CalendarData, modifyEvent, changeParticipation, deleteEvent, ChangeParticipationOptions } from '../../lib/api/calendars';
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

  it('should return the CalendarData for the given user id', async () => {
    const calendarData: CalendarData[] = await getInbox(davClient)('someuserid');
    const [firstResponse] = calendarData;

    expect(calendarData).toHaveLength(2);
    expect(firstResponse.href).toEqual('/calendars/5fbb828496e95069fd4d5114/inbox/sabredav-8c5d0154-75e3-45de-9f6f-da47e56a181e.ics');
    expect(firstResponse.etag).toEqual('"59be6bf1e12e937dfed81c547fc61a11"');
    expect(firstResponse.ics.substring(0, 15)).toEqual('BEGIN:VCALENDAR');
    expect(firstResponse.events).toHaveLength(1);
  });

  it('should have the parsed events from the ics within the calendarData response', async () => {
    const calendarData: CalendarData[] = await getInbox(davClient)('someuserid');
    const [firstResponse] = calendarData;

    expect(firstResponse.events[0].id).toEqual('fae13cb1-a436-46de-b06f-7436f640e3d4');
    expect(firstResponse.events[0].title).toEqual('A');
    expect(firstResponse.events[0].allDay).toBeFalsy();
    expect((firstResponse.events[0].start as Date).toUTCString()).toEqual('Fri, 27 Nov 2020 14:00:00 GMT');
    expect((firstResponse.events[0].end as Date).toUTCString()).toEqual('Fri, 27 Nov 2020 14:30:00 GMT');
    expect(firstResponse.events[0].duration).toMatchObject({ minutes: 30 });
    expect(firstResponse.events[0]?.attendees).toHaveLength(3);
    expect(firstResponse.events[0].attendees[0]).toMatchObject({
      partstat: 'NEEDS-ACTION',
      email: 'mailto:user3@open-paas.org',
    });
    expect(firstResponse.events[0].extendedProps['x-openpaas-videoconference']).toEqual('http://conference');
  });
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

  it('should send a PUT request to the event path with the event object ICS as body', async () => {
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

    await modifyEvent(davClient)(path, testEventObject);

    expect(httpClient.requestText).toHaveBeenCalledWith({
      url: 'http://url/calendars/events/123456.ics',
      method: 'PUT',
      body:
        'BEGIN:VCALENDAR\r\n\
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
      },
    });
  });
});

describe('the changeParticipation method', () => {
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

  it('should update partstat in event', async () => {
    const testEventObject: CalendarEventObject = {
      id: '123456',
      title: 'test',
      start: '2021-03-15T10:00:00',
      end: '2021-03-15T11:00:00',
      attendees: [
        {
          partstat: 'noaction',
          cn: 'cn',
          email: 'test@gmail.com',
        },
      ],
      allDay: false,
      description: 'simple description',
      location: 'some location',
      duration: {
        hours: 1,
      },
      extendedProps: {},
    };
    const testChangeParticipationObject: ChangeParticipationOptions = {
      eventPath: 'events/123456.ics',
      attendeeEmail: 'test@gmail.com',
      action: 'accept',
      event: testEventObject,
    };

    await changeParticipation(davClient)(testChangeParticipationObject);

    expect(modifyEvent).toHaveBeenCalled;
    expect(testEventObject).toStrictEqual({
      id: '123456',
      title: 'test',
      start: '2021-03-15T10:00:00',
      end: '2021-03-15T11:00:00',
      attendees: [
        {
          partstat: 'accept',
          cn: 'cn',
          email: 'test@gmail.com',
        },
      ],
      allDay: false,
      description: 'simple description',
      location: 'some location',
      duration: {
        hours: 1,
      },
      extendedProps: {},
    });
  });

  it('should reject if event does not contain attendee', async (done) => {
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

    const testChangeParticipationObject: ChangeParticipationOptions = {
      eventPath: 'events/123456.ics',
      attendeeEmail: 'test1@gmail.com',
      action: 'accept',
      event: testEventObject,
    };

    try {
      await changeParticipation(davClient)(testChangeParticipationObject);

      done(new Error('An error should have been thrown'));
    } catch (error) {
      expect(error.message).toEqual('Can not change participation');

      done();
    }
  });

  it('should reject if the attendee does not exist in the event', async (done) => {
    const testEventObject: CalendarEventObject = {
      id: '123456',
      title: 'test',
      start: '2021-03-15T10:00:00',
      end: '2021-03-15T11:00:00',
      allDay: false,
      attendees: [
        {
          partstat: 'accept',
          cn: 'cn',
          email: 'test@gmail.com',
        },
      ],
      description: 'simple description',
      location: 'some location',
      duration: {
        hours: 1,
      },
      extendedProps: {},
    };

    const testChangeParticipationObject: ChangeParticipationOptions = {
      eventPath: 'events/123456.ics',
      attendeeEmail: 'anotherUser@gmail.com',
      action: 'accept',
      event: testEventObject,
    };

    try {
      await changeParticipation(davClient)(testChangeParticipationObject);

      done(new Error('An error should have been thrown'));
    } catch (error) {
      expect(error.message).toEqual('No matching attendee found in the event');

      done();
    }
  });
});

describe('the deleteEvent method', () => {
  it('should send a DELETE request to the event path', async () => {
    const path = 'events/123456.ics';

    await deleteEvent(davClient)(path);

    expect(httpClient.requestJson).toHaveBeenCalledWith({
      url: 'http://url/calendars/events/123456.ics',
      method: 'DELETE',
      headers: {
        Authorization: 'Basic header',
      },
    });
  });
});
