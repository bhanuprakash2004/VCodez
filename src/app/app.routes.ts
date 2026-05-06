import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { HomeComponent } from './home/home';
import { FormComponent } from './form/form';
import { TableComponent } from './table/table';
import { AboutComponent } from './about/about';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },     // ✅ NEW
  { path: 'checker', component: FormComponent },  // ✅ FORM MOVED HERE
  { path: 'table', component: TableComponent },
  { path: 'about', component: AboutComponent }
];
