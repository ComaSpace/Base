import { Component, OnInit } from '@angular/core';
import { LectureService } from '../../services/lecture.service';
import { CourseService } from '../../services/course.service';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular directives

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css'],
  providers: [CommonModule] // Ensure CommonModule is imported
})
export class LectureComponent implements OnInit {
  lectures: any[] = [];
  courses: any[] = [];
  groups: any[] = [];
  newLecture: any = {};

  constructor(private lectureService: LectureService, private courseService: CourseService, private groupService: GroupService) { }

  ngOnInit(): void {
    this.loadLectures();
    this.loadCourses();
    this.loadGroups();
  }

  loadLectures() {
    this.lectureService.getAllLectures().subscribe(
      (data) => {
        this.lectures = data;
      },
      (error) => {
        console.error('Error loading lectures:', error);
      }
    );
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

  loadGroups() {
    this.groupService.getAllGroups().subscribe(
      (data) => {
        this.groups = data;
      },
      (error) => {
        console.error('Error loading groups:', error);
      }
    );
  }

  createLecture() {
    this.lectureService.createLecture(this.newLecture).subscribe(
      () => {
        console.log('Lecture created successfully');
        this.loadLectures();
      },
      (error) => {
        console.error('Error creating lecture:', error);
      }
    );
  }

  updateLecture(id: string, updates: any) {
    this.lectureService.updateLecture(id, updates).subscribe(
      () => {
        console.log('Lecture updated successfully');
        this.loadLectures();
      },
      (error) => {
        console.error('Error updating lecture:', error);
      }
    );
  }

  deleteLecture(id: string) {
    this.lectureService.deleteLecture(id).subscribe(
      () => {
        console.log('Lecture deleted successfully');
        this.loadLectures();
      },
      (error) => {
        console.error('Error deleting lecture:', error);
      }
    );
  }
}
