import { TestBed } from '@angular/core/testing';

import { ChatRepository } from './chat.repository';

describe('MessageService', () => {
  let service: ChatRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
