import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  getGroupById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/${id}`);
  }

  createGroup(group: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups`, group);
  }

  updateGroup(id: string, updates: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${id}`, updates);
  }

  deleteGroup(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${id}`);
  }
}
