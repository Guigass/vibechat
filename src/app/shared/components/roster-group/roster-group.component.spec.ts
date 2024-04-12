import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RosterGroupComponent } from './roster-group.component';

describe('RosterGroupComponent', () => {
  let component: RosterGroupComponent;
  let fixture: ComponentFixture<RosterGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RosterGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
