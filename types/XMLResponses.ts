export interface MultiStatusResponse {
  'd:multistatus': {
    'd:response': [{
      'd:href': { _text: string; };
      'd:propstat': {
        'd:prop': {
          'd:getetag': { _text: string; };
          'cal:calendar-data': { _text: string; };
        };
        'd:status': { _text: string };
      };
    }];
  };
}
