import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedComponent } from './feed.component';
import { of } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';
import { PostService } from 'src/services/post/post.service';
import { UserService } from 'src/services/user/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockAuthService } from 'src/mock-services/mock-auth.service';
import { MockPostService } from 'src/mock-services/mock-post.service';
import { MockUserService } from 'src/mock-services/mock-user.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../app-routing.module';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      declarations: [FeedComponent],
      imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        RouterTestingModule
    ],
    providers: [
      { provide: AuthService, useClass: MockAuthService },
      { provide: PostService, useClass: MockPostService },
      { provide: UserService, useClass: MockUserService },
      FormBuilder
    ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to post comments when comment button is clicked', fakeAsync(() => {
    spyOn(router, 'navigate');

    // Assume the posts array has one post
    component.posts = of([{ id: 'post1', title: 'Post 1', content: 'Content 1' }]);

    fixture.detectChanges();

    // Find the comment button and click it
    const commentButton = fixture.debugElement.query(By.css('#comment-button'));
    commentButton.triggerEventHandler('click', null);

    tick();

    // Expect the router to navigate to the post's comments
    expect(router.navigate).toHaveBeenCalledWith(['private/comments', 'post1']);
  }));
});
