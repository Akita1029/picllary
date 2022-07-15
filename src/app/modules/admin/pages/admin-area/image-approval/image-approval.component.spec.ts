import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageApprovalComponent } from './image-approval.component';

describe('ImageApprovalComponent', () => {
  let component: ImageApprovalComponent;
  let fixture: ComponentFixture<ImageApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
