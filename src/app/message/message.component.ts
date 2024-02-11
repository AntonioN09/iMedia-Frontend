import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from '../../services/message/message.service';
import { Message } from '../../models/message.model';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  messageForm!: FormGroup;
  currentUserId!: string | null;
  currentUserEmail!: string | null;
  userData!: User | null;

  constructor(private fb: FormBuilder, 
              private authService: AuthService, 
              private messageService: MessageService, 
              private userService: UserService) {
    this.messageForm = this.fb.group({
      emailTo: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserId().subscribe((userId) => {
      this.currentUserId = userId;
      if (this.currentUserId) {
        this.userService.getUserById(this.currentUserId).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });

    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.currentUserEmail = userEmail;
    });
  }

  
  onSubmit(): void {
    if (this.messageForm.valid) {
      const userId = this.currentUserId;
      const userEmail = this.currentUserEmail;
      const userAvatar = this.userData?.avatar;
      if (userId) {
        const newMessage: Message = {
          subject: this.messageForm.value.subject,
          body: this.messageForm.value.body,
          userId: userId,
          userAvatar: userAvatar,
          senderEmail: userEmail,
          receiverEmail: this.messageForm.value.emailTo,
          createDate: new Date(),
        };
        console.log(newMessage);
        this.messageService.addMessage(newMessage).then(() => {
          this.messageForm.reset();
        });
      }
    }
  }
}
