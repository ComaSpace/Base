import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  createCourse(value: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}/teachers`;

  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTeacher(teacher: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, teacher);
  }

  updateTeacher(id: string, teacher: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, teacher);
  }

  deleteTeacher(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
