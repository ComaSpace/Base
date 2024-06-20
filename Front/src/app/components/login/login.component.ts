import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (      response: any) => {
        // Handle successful login response (e.g., store token, redirect, etc.)
        console.log('Login successful:', response);
      },
      (      error: any) => {
        // Handle login error (e.g., show error message)
        console.error('Login error:', error);
      }
    );
  }
}
