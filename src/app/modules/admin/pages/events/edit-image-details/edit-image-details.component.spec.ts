import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageDetailsComponent } from './edit-image-details.component';

describe('EditImageDetailsComponent', () => {
  let component: EditImageDetailsComponent;
  let fixture: ComponentFixture<EditImageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditImageDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
