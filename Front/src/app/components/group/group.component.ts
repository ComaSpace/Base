
import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groups: any[] = [];
  courses: any[] = []; // To store courses for dropdown select
newGroup: any;

  constructor(private groupService: GroupService, private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadGroups();
    this.loadCourses();
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe(
      (data: any[]) => {
        this.groups = data;
      },
      (error: any) => {
        console.error('Error loading groups:', error);
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

  createGroup(group: any) {
    this.groupService.createGroup(group).subscribe(
      () => {
        console.log('Group created successfully');
        this.loadGroups();
      },
      (error: any) => {
        console.error('Error creating group:', error);
      }
    );
  }

  updateGroup(id: string, updates: any) {
    this.groupService.updateGroup(id, updates).subscribe(
      () => {
        console.log('Group updated successfully');
        this.loadGroups();
      },
      (error: any) => {
        console.error('Error updating group:', error);
      }
    );
  }

  deleteGroup(id: string) {
    this.groupService.deleteGroup(id).subscribe(
      () => {
        console.log('Group deleted successfully');
        this.loadGroups();
      },
      (error: any) => {
        console.error('Error deleting group:', error);
      }
    );
  }
}
