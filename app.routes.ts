import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { HomeComponent } from './home/home';
import { FormComponent } from './form/form';
import { TableComponent } from './table/table';
import { AboutComponent } from './about/about';
import { AdminComponent } from './admin/admin';
import { AdminUsersComponent } from './admin/admin-users';
import { AwarenessComponent } from './awareness/awareness';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ProfileComponent } from './profile/profile';
import { AdminRecycleComponent } from './admin/admin-recycle/admin-recycle';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';

export const routes: Routes = [

  { path: '', component: LoginComponent },

  { path: 'signup', component: SignupComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  { path: 'checker', component: FormComponent, canActivate: [authGuard] },

  { path: 'table', component: TableComponent, canActivate: [authGuard] },

  { path: 'about', component: AboutComponent, canActivate: [authGuard] },

  { path: 'awareness', component: AwarenessComponent, canActivate: [authGuard] },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },

  { path: 'admin-users', component: AdminUsersComponent, canActivate: [adminGuard] },

  { path: 'admin-recycle', component: AdminRecycleComponent, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }

];
