import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent {
  createCourseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService
  ) {
    this.createCourseForm = this.formBuilder.group({
      courseName: ['', Validators.required]
    });
  }

  createCourse() {
    if (this.createCourseForm.valid) {
      this.courseService.createCourse(this.createCourseForm.value).subscribe(
        (response: any) => {
          console.log('Course created:', response);
        },
        (error: any) => {
          console.error('Error creating course:', error);
        }
      );
    }
  }
}
