
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  private apiUrl = environment.apiUrl;  

  constructor(private http: HttpClient) { }

  getAllLectures() {
    return this.http.get<any[]>(`${this.apiUrl}/lectures`);
  }

  getLectureById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/lectures/${id}`);
  }

  createLecture(lecture: any) {
    return this.http.post<any>(`${this.apiUrl}/lectures`, lecture);
  }

  updateLecture(id: string, updates: any) {
    return this.http.put<any>(`${this.apiUrl}/lectures/${id}`, updates);
  }

  deleteLecture(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/lectures/${id}`);
  }
}
