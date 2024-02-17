import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModifyCvComponent } from '../modify-cv/modify-cv.component';
import { CvComponent } from '../cv/cv.component';
import { UserService } from 'src/services/user/user.service';
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


describe('Integration Test: ModifyCvComponent and CvComponent', () => {
    let modifyCvComponent: ModifyCvComponent;
    let cvComponent: CvComponent;
    let fixtureModify: ComponentFixture<ModifyCvComponent>;
    let fixtureProfile: ComponentFixture<CvComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ ModifyCvComponent, CvComponent ],
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
  
      fixtureModify = TestBed.createComponent(ModifyCvComponent);
      modifyCvComponent = fixtureModify.componentInstance;
      fixtureModify.detectChanges();
  
      fixtureProfile = TestBed.createComponent(CvComponent);
      cvComponent = fixtureProfile.componentInstance;
      fixtureProfile.detectChanges();
    });
  
    it('should create ModifyCvComponent and cvComponent', () => {
      expect(modifyCvComponent).toBeTruthy();
      expect(cvComponent).toBeTruthy();
    });
  
    it('should update cv when onSubmit is called', () => {
      spyOn(modifyCvComponent.userService, 'updateCv').and.callThrough();
  
      modifyCvComponent.onSubmit();
  
      expect(modifyCvComponent.userService.updateCv).toHaveBeenCalled();
    });
  
    it('should reflect changes in CvComponent', () => {
      spyOn(cvComponent.userService, 'getUserById').and.callThrough();
  
      cvComponent.ngOnInit();
  
      expect(cvComponent.userService.getUserById).toHaveBeenCalled();
      expect(cvComponent.cvData).toEqual(modifyCvComponent.cvData);
    });
});