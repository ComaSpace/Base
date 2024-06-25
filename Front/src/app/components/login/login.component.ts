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
      (response: any) => {
        
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        
      },
      (error: any) => {
        
        console.error('Login error:', error);
        
      }
    );
  }
}
