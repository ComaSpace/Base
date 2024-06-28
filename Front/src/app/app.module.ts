
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './components/course/course.component';
import { GroupComponent } from './components/group/group.component';
import { LectureComponent } from './components/lecture/lecture.component';
import { LoginComponent } from './components/login/login.component';
import { StudentDashboardComponent } from './components/dashboard/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './components/dashboard/teacher-dashboard/teacher-dashboard.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';

const appRoutes: Routes = [
  { path: 'courses', component: CourseComponent },
  { path: 'groups', component: GroupComponent },
  { path: 'lectures', component: LectureComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', loadChildren: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
];

@NgModule({
  declarations: [ 
    CourseComponent,
    GroupComponent,
    LectureComponent,
    LoginComponent,
    StudentDashboardComponent,
    TeacherDashboardComponent,
    StudentProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
})
export class AppModule { }
