import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecycleComponent } from './admin-recycle';

describe('AdminRecycle', () => {
  let component: AdminRecycleComponent;
  let fixture: ComponentFixture<AdminRecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecycleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRecycleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
