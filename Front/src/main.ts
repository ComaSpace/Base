import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  console.log('Production mode enabled');
}

console.log('Bootstrapping application...');
bootstrapApplication(AppComponent).catch(err => console.error(err));
