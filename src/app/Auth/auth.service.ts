import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './authData';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) { }
  getToken() {
    return this.token;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuth;
  }
  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post('https://to-do-list95.herokuapp.com/api/user' + '/signup', authData)
      .subscribe(Response => {
        this.router.navigate(['auth/login']);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>('https://to-do-list95.herokuapp.com/api/user' + '/login', authData)
      .subscribe(Response => {
        this.token = Response.token;
        if (this.token) {
          const expiresInDuration = Response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          console.log(this.tokenTimer);
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, Response.userId);
          this.isAuth = true;
          this.userId = Response.userId;
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuth = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }

  }
  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    this.isAuth = false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return { token: token, expirationDate: new Date(expirationDate), userId };
  }
}
