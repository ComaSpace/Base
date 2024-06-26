import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  emailExists: boolean = false;
  studentId: string = '1';
  studentData: any = {};
  profileForm!: FormGroup; 

  constructor(private fb: FormBuilder, private studentService: StudentService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchStudentProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  fetchStudentProfile(): void {
    this.studentService.getStudentProfile(this.studentId).subscribe(
      (response) => {
        this.studentData = response;
        
        this.profileForm.patchValue({
          firstName: this.studentData.firstName,
          lastName: this.studentData.lastName,
          phone: this.studentData.phone,
          email: this.studentData.email
        });
      },
      (error) => {
        console.error('Error fetching student profile:', error);
      }
    );
  }

  updateProfile(): void {
    this.studentService.updateStudentProfile(this.studentId, this.profileForm.value).subscribe(
      () => {
        console.log('Student profile updated successfully');
        
      },
      (error: any) => {
        console.error('Error updating student profile:', error);
      }
    );
  }

  onEmailChange(): void {
    
  }
}

