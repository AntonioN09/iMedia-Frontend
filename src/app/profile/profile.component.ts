import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() userId!: string;
  userEmail: string | null = null;
  username: string | null = null;
  userData: User | null = null;
  posts!: Observable<any>;
  constructor(public postService: PostService, 
    public userService: UserService,
    public route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
    });
  }

  ngOnInit(): void {
    this.posts = this.postService.getPostsByUserId(this.userId);
    this.userService.getUserById(this.userId).subscribe((userData) => {
      console.log(userData);
      this.userData = userData;
    });
}
}
