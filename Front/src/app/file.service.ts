import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {}

  getFiles(lectureId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lecture/${lectureId}`);
  }

  uploadFile(file: File, lectureId: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('lectureId', lectureId);
    
    return this.http.post<any>(this.apiUrl, formData);
  }
}
