
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  getAllCourses() {
    return this.http.get<any[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/courses/${id}`);
  }

  createCourse(course: any) {
    return this.http.post<any>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(id: string, updates: any) {
    return this.http.put<any>(`${this.apiUrl}/courses/${id}`, updates);
  }

  deleteCourse(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/courses/${id}`);
  }
}
