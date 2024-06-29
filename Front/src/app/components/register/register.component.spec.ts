import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule] // Import FormsModule for testing
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the RegisterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.firstName).toEqual('');
    expect(component.lastName).toEqual('');
    expect(component.email).toEqual('');
    expect(component.password).toEqual('');
  });

  it('should have a register method', () => {
    expect(component.register).toBeDefined();
  });

  // Add more specific tests for register method if needed

});
