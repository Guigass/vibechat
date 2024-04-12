import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RosterContactItemComponent } from './roster-contact-item.component';

describe('RosterContactItemComponent', () => {
  let component: RosterContactItemComponent;
  let fixture: ComponentFixture<RosterContactItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RosterContactItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterContactItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
