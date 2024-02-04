import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { PostComponent } from './post/post.component';
import { FeedComponent } from './feed/feed.component';
import { FollowComponent } from './follow/follow.component';
import { RankComponent } from './rank/rank.component';
import { HttpClientModule } from '@angular/common/http';
import { publicGuard } from '../guards/public/public.guard';
import { privateGuard } from '../guards/private/private.guard'
import { ModifyProfileComponent } from './modify-profile/modify-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/public/login', pathMatch: 'full' }, 
  {
    path: 'public',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [publicGuard]
      },
      {
        path: 'registration',
        component: RegistrationComponent,
        canActivate: [publicGuard]
      }
    ]
  },
  {
    path: 'private',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [privateGuard]
      }
    ]
  },
  {
    path: 'private',
    children: [
      {
        path: 'post',
        component: PostComponent,
        canActivate: [privateGuard]
      }
    ]
  },
  {
    path: 'private',
    children: [
      {
        path: 'feed',
        component: FeedComponent,
        canActivate: [privateGuard]
      }
    ]
  },
  {
    path: 'private',
    children: [
      {
        path: 'follow',
        component: FollowComponent,
        canActivate: [privateGuard]
      }
    ]
  },
  {
    path: 'private',
    children: [
      {
        path: 'rank',
        component: RankComponent,
        canActivate: [privateGuard]
      }
    ]
  },
  {
    path: 'private',
    children: [
      {
        path: 'modify-profile',
        component: ModifyProfileComponent,
        canActivate: [privateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
