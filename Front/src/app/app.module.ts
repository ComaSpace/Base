import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; 
import { LoginComponent } from './components/login/login.component';
import { GroupComponent } from './components/group/group.component';
import { CourseComponent } from './components/course/course.component';
import { LectureComponent } from './components/lecture/lecture.component';
import { StudentComponent } from './components/student/student.component';

const appRoutes: Routes = [
  { path: 'courses', component: CourseComponent },
  { path: 'groups', component: GroupComponent },
  { path: 'lectures', component: LectureComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', loadChildren: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
];

@NgModule({
  declarations: [
    LoginComponent,
    GroupComponent,
    CourseComponent,
    LectureComponent,
    StudentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule { }
