import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RosterUserItemComponent } from './roster-user-item.component';

describe('RosterUserItemComponent', () => {
  let component: RosterUserItemComponent;
  let fixture: ComponentFixture<RosterUserItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RosterUserItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterUserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
