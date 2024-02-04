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
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { adminGuard } from 'src/guards/admin/admin.guard';
import { ModDashboardComponent } from './mod-dashboard/mod-dashboard.component';
import { modGuard } from 'src/guards/mod/mod.guard';

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
      }, 
      {
        path: 'post',
        component: PostComponent,
        canActivate: [privateGuard]
      },
      {
        path: 'feed',
        component: FeedComponent,
        canActivate: [privateGuard]
      },
      {
        path: 'follow',
        component: FollowComponent,
        canActivate: [privateGuard]
      },
      {
        path: 'rank',
        component: RankComponent,
        canActivate: [privateGuard]
      },
      {
        path: 'modify-profile',
        component: ModifyProfileComponent,
        canActivate: [privateGuard]
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: 'mod',
    children: [
      {
        path: 'dashboard',
        component: ModDashboardComponent,
        canActivate: [modGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
