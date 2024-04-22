import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageBubbleComponent } from './image-bubble.component';

describe('ImageBubbleComponent', () => {
  let component: ImageBubbleComponent;
  let fixture: ComponentFixture<ImageBubbleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ImageBubbleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});