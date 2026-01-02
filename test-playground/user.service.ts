import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all users from the API
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get a single user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Create a new user
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Update existing user
  updateUser(id: number, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, updates);
  }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Login and set current user
  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  // Logout
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('authToken');
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.currentUserSubject.getValue();
    return user?.role === 'admin';
  }
}
