import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service'
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import { MessageService } from 'src/services/message/message.service';
import { Chat } from 'src/models/chat.model';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {
  followForm: FormGroup;
  userEmail!: string | null
  searchEmail: string = '';
  userData!: User | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.followForm = this.fb.group({
      searchEmail: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.userEmail = userEmail;
    });

    this.authService.getCurrentUserId().subscribe((userId) => {
        this.userService.getUserById(userId).subscribe((userData) => {
          this.userData = userData;
        });
    });
  }

  followUser(): void {
    if (this.followForm.valid) {
      this.searchEmail = this.followForm.get('searchEmail')?.value;
      this.authService.getCurrentUserId().subscribe((userId) => {
        if (userId) {
          this.userService.getUserByEmail(this.searchEmail).subscribe((userData) => {
            if (userData) {
              this.messageService.getChatByUserEmails(this.userEmail, this.searchEmail).subscribe((existingChat) => {
                if (existingChat) {
                  console.log(`A chat already exists between ${this.userEmail} and ${this.searchEmail}`);
                } else {
                  this.userService.followUser(this.userEmail, this.searchEmail)
                    .then(() => {
                      const chat: Chat = {
                        userEmail1: this.userEmail,
                        userEmail2: this.searchEmail,
                        userEmails: [this.userEmail, this.searchEmail],
                        userAvatar1: this.userData?.avatar,
                        userAvatar2: userData.avatar ? userData.avatar : '../../assets/img/default.png',
                        latestMessage: new Date(),
                        unseenMessages1: 0,
                        unseenMessages2: 0, 
                        lastSeen1: new Date(),
                        lastSeen2: new Date()
                      };
                      this.messageService.createChat(chat);
                      console.log(`Successfully followed user with email: ${this.searchEmail}`);
                    })
                    .catch((error) => {
                      console.error(`Error following user: ${error}`);
                    });
                }
              });
            } else {
              console.error(`Error: Unable to retrieve user data for email ${this.searchEmail}`);
            }
          });
        } else {
          console.error(`Error: Unable to retrieve current user's ID`);
        }
      });
    }
  }
  
}
