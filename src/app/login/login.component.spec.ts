import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FeedComponent } from "../feed/feed.component";
import { LoginComponent } from "./login.component";
import { AuthService } from "src/services/auth/auth.service";
import { PostService } from "src/services/post/post.service";
import { UserService } from "src/services/user/user.service";
import { FormBuilder } from "@angular/forms";
import { MockAuthService } from "src/mock-services/mock-auth.service";
import { MockUserService } from "src/mock-services/mock-user.service";
import { MockPostService } from "src/mock-services/mock-post.service";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "../app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "src/environments/environment";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AngularFireModule } from "@angular/fire/compat";

describe('Integration Test: LoginComponent and FeedComponent', () => {
    let loginComponent: LoginComponent;
    let feedComponent: FeedComponent;
    let fixtureLogin: ComponentFixture<LoginComponent>;
    let fixtureFeed: ComponentFixture<FeedComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ LoginComponent, FeedComponent ],
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
  
      fixtureLogin = TestBed.createComponent(LoginComponent);
      loginComponent = fixtureLogin.componentInstance;
      fixtureLogin.detectChanges();
  
      fixtureFeed = TestBed.createComponent(FeedComponent);
      feedComponent = fixtureFeed.componentInstance;
      fixtureFeed.detectChanges();
    });
  
    it('should create LoginComponent and FeedComponent', () => {
      expect(loginComponent).toBeTruthy();
      expect(feedComponent).toBeTruthy();
    });
  
    it('should login and navigate to profile', () => {
      spyOn(loginComponent.authService, 'login').and.callThrough();
      spyOn(loginComponent.authService, 'isAuthenticated').and.callThrough();
      spyOn(loginComponent.router, 'navigate');
  
      loginComponent.loginWithEmailAndPassword();
  
      expect(loginComponent.authService.login).toHaveBeenCalled();
      expect(loginComponent.authService.isAuthenticated).toHaveBeenCalled();
      expect(loginComponent.router.navigate).toHaveBeenCalledWith(['/private/feed']);
    });
  
    it('should get posts and user data in FeedComponent', () => {
      spyOn(feedComponent.authService, 'getCurrentUserEmail').and.callThrough();
      spyOn(feedComponent.authService, 'getCurrentUserId').and.callThrough();
      spyOn(feedComponent.postService, 'getPostsByUserEmail').and.callThrough();
      spyOn(feedComponent.userService, 'getUserById').and.callThrough();
  
      feedComponent.ngOnInit();
  
      expect(feedComponent.authService.getCurrentUserEmail).toHaveBeenCalled();
      expect(feedComponent.authService.getCurrentUserId).toHaveBeenCalled();
      expect(feedComponent.postService.getPostsByUserEmail).toHaveBeenCalled();
      expect(feedComponent.userService.getUserById).toHaveBeenCalled();
    });
  });