import { TestBed } from '@angular/core/testing';

import { IpTrafficService } from './ip-traffic.service';

describe('IpTrafficService', () => {
  let service: IpTrafficService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpTrafficService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
