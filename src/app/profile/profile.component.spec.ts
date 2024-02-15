import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModifyProfileComponent } from '../modify-profile/modify-profile.component';
import { ProfileComponent } from './profile.component';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth/auth.service';
import { PostService } from 'src/services/post/post.service';
import { MockAuthService } from 'src/mock-services/mock-auth.service';
import { MockPostService } from 'src/mock-services/mock-post.service';
import { MockUserService } from 'src/mock-services/mock-user.service';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('Integration Test: ModifyProfileComponent and ProfileComponent', () => {
    let modifyProfileComponent: ModifyProfileComponent;
    let profileComponent: ProfileComponent;
    let fixtureModify: ComponentFixture<ModifyProfileComponent>;
    let fixtureProfile: ComponentFixture<ProfileComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ ModifyProfileComponent, ProfileComponent ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            AngularFireModule.initializeApp(environment.firebase),
            ReactiveFormsModule,
            BrowserAnimationsModule,
            MatCardModule,
            MatButtonModule,
            MatFormFieldModule
        ],
        providers: [
            { provide: AuthService, useClass: MockAuthService },
            { provide: PostService, useClass: MockPostService },
            { provide: UserService, useClass: MockUserService },
            FormBuilder
          ]
      }).compileComponents();
  
      fixtureModify = TestBed.createComponent(ModifyProfileComponent);
      modifyProfileComponent = fixtureModify.componentInstance;
      fixtureModify.detectChanges();
  
      fixtureProfile = TestBed.createComponent(ProfileComponent);
      profileComponent = fixtureProfile.componentInstance;
      fixtureProfile.detectChanges();
    });
  
    it('should create ModifyProfileComponent and ProfileComponent', () => {
      expect(modifyProfileComponent).toBeTruthy();
      expect(profileComponent).toBeTruthy();
    });
  
    it('should update profile when onSubmit is called', () => {
      spyOn(modifyProfileComponent.userService, 'updateUser').and.callThrough();
  
      modifyProfileComponent.onSubmit();
  
      expect(modifyProfileComponent.userService.updateUser).toHaveBeenCalled();
    });
  
    it('should reflect changes in ProfileComponent', () => {
      spyOn(profileComponent.userService, 'getUserById').and.callThrough();
  
      profileComponent.ngOnInit();
  
      expect(profileComponent.userService.getUserById).toHaveBeenCalled();
      expect(profileComponent.userData).toEqual(modifyProfileComponent.userData);
    });
  });
  