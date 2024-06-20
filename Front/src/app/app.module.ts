import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported here
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { GroupComponent } from './components/group/group.component';
import { CourseComponent } from './components/course/course.component';
import { LectureComponent } from './components/lecture/lecture.component';

const appRoutes: Routes = [
  { path: 'courses', component: CourseComponent },
  { path: 'groups', component: GroupComponent },
  { path: 'lectures', component: LectureComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', loadChildren: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GroupComponent,
    CourseComponent,
    LectureComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
