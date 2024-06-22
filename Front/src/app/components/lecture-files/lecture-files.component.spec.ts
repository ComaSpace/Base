import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureFilesComponent } from './lecture-files.component';

describe('LectureFilesComponent', () => {
  let component: LectureFilesComponent;
  let fixture: ComponentFixture<LectureFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
