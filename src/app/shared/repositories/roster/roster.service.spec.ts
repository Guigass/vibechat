import { TestBed } from '@angular/core/testing';

import { RosterRepository } from './roster.repository';

describe('RosterService', () => {
  let service: RosterRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RosterRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
