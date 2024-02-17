import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'isAuthenticated']);
    
    await TestBed.configureTestingModule({
      declarations: [ RegistrationComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize registrationForm with email and password fields', () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.email).toBeDefined();
    expect(component.password).toBeDefined();
  });

  it('should mark email field as invalid if empty', () => {
    const emailControl = component.registrationForm.controls['email'];
    emailControl.setValue('');
    expect(emailControl.valid).toBeFalsy();
  });

  it('should mark email field as invalid if email format is incorrect', () => {
    const emailControl = component.registrationForm.controls['email'];
    emailControl.setValue('invalidemail');
    expect(emailControl.valid).toBeFalsy();
  });

  it('should mark password field as invalid if empty', () => {
    const passwordControl = component.registrationForm.controls['password'];
    passwordControl.setValue('');
    expect(passwordControl.valid).toBeFalsy();
  });

  it('should mark password field as invalid if length is less than 6', () => {
    const passwordControl = component.registrationForm.controls['password'];
    passwordControl.setValue('12345');
    expect(passwordControl.valid).toBeFalsy();
  });
});
