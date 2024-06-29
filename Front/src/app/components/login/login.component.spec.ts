import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../auth.service';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, HttpClientModule], // Include HttpClientModule
      providers: [AuthService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method of AuthService with correct parameters', () => {
    const authService = TestBed.inject(AuthService); // Inject AuthService
    const email = 'test@example.com';
    const password = 'password';

    spyOn(authService, 'login').and.callThrough(); // Spy on login method

    // Set component properties
    component.email = email;
    component.password = password;

    // Trigger login method
    component.login();

    // Check if login method was called with correct parameters
    expect(authService.login).toHaveBeenCalledWith(email, password);
  });

  it('should handle login error', () => {
    const authService = TestBed.inject(AuthService); // Inject AuthService
    const email = 'test@example.com';
    const password = 'wrongpassword';

    spyOn(authService, 'login').and.callFake((email: string, password: string) => {
      // Simulate an error response
      return throwError({ error: { message: 'Invalid credentials' } });
    });

    // Set component properties
    component.email = email;
    component.password = password;

    // Trigger login method
    component.login();

    // Expect an error message to be logged
    expect(console.error).toHaveBeenCalledWith('Login error:', jasmine.any(Object));
  });

  // Add more tests as needed for LoginComponent

});
