
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = '/api/files'; 

  constructor(private http: HttpClient) {}

  uploadFile(file: File, lectureId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('lectureId', lectureId);

    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${fileId}`);
  }

  toggleFileVisibility(fileId: string, visibility: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/visibility/${fileId}`, { visible: visibility });
  }
}
