import { TestBed } from '@angular/core/testing';

import { ContactRepository } from './contact.repository';

describe('ContactService', () => {
  let service: ContactRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
