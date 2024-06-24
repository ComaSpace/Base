
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: any[] = [];
  groups: any[] = [];
  newStudent: any = {
    groupIds: [] 
  };

  constructor(private studentService: StudentService, private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadGroups();
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe(
      (data: any[]) => {
        this.students = data;
      },
      (error: any) => {
        console.error('Error loading students:', error);
      }
    );
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

  createStudent() {
    this.studentService.createStudent(this.newStudent).subscribe(
      () => {
        console.log('Student created successfully');
        this.loadStudents();
        this.resetForm();
      },
      (error: any) => {
        console.error('Error creating student:', error);
      }
    );
  }

  resetForm() {
    this.newStudent = {
      groupIds: []
    };
  }
}
