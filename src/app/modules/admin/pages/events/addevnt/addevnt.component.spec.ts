import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddevntComponent } from './addevnt.component';

describe('AddevntComponent', () => {
  let component: AddevntComponent;
  let fixture: ComponentFixture<AddevntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddevntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddevntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
