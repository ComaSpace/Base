import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: any[] = [];
newCourse: any;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error loading courses:', error);
      }
    );
  }

  createCourse(course: any) {
    this.courseService.createCourse(course).subscribe(
      () => {
        console.log('Course created successfully');
        this.loadCourses();
      },
      (error) => {
        console.error('Error creating course:', error);
      }
    );
  }

  updateCourse(id: string, updates: any) {
    this.courseService.updateCourse(id, updates).subscribe(
      () => {
        console.log('Course updated successfully');
        this.loadCourses();
      },
      (error) => {
        console.error('Error updating course:', error);
      }
    );
  }

  deleteCourse(id: string) {
    this.courseService.deleteCourse(id).subscribe(
      () => {
        console.log('Course deleted successfully');
        this.loadCourses();
      },
      (error) => {
        console.error('Error deleting course:', error);
      }
    );
  }
}
