import { TestBed } from '@angular/core/testing';

import { XmppServicesService } from './xmpp-services.service';

describe('XmppServicesService', () => {
  let service: XmppServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmppServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
