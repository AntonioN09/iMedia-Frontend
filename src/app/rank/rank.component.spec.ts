import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from '../post/post.component';
import { RankComponent } from './rank.component';
import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { of } from 'rxjs';
import { MockPostService } from 'src/mock-services/mock-post.service';
import { MockAuthService } from 'src/mock-services/mock-auth.service';
import { MockUserService } from 'src/mock-services/mock-user.service';

describe('Integration Test: PostComponent and RankComponent', () => {
    let postComponent: PostComponent;
    let rankComponent: RankComponent;
    let fixturePost: ComponentFixture<PostComponent>;
    let fixtureRank: ComponentFixture<RankComponent>;
    let postService: PostService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PostComponent, RankComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: PostService, useClass: MockPostService },
                { provide: AuthService, useClass: MockAuthService },
                { provide: UserService, useClass: MockUserService },
            ],
        }).compileComponents();

        fixturePost = TestBed.createComponent(PostComponent);
        postComponent = fixturePost.componentInstance;
        fixturePost.detectChanges();

        fixtureRank = TestBed.createComponent(RankComponent);
        rankComponent = fixtureRank.componentInstance;
        fixtureRank.detectChanges();

        postService = TestBed.inject(PostService);
    });

    it('should create PostComponent and RankComponent', () => {
        expect(postComponent).toBeTruthy();
        expect(rankComponent).toBeTruthy();
    });

    it('should update posts in RankComponent when a post is added in PostComponent', (done) => {
        let postsLength : number = 0;
        postService.getPostsSortedByLikes().subscribe((posts) => {
            postsLength = posts.length;
        });
        
        const post = {
            body: 'test post',
            
            
            
            
        };

        postComponent.postForm.setValue(post);
        postComponent.onSubmit();
        fixturePost.detectChanges();
        postService.getPostsSortedByLikes().subscribe((posts) => {
            expect(posts.length).toBe(postsLength + 1);
            done();
        });
    });
});
