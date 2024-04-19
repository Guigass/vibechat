import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AudioBubbleComponent } from './audio-bubble.component';

describe('AudioBubbleComponent', () => {
  let component: AudioBubbleComponent;
  let fixture: ComponentFixture<AudioBubbleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AudioBubbleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
