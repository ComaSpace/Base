import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';  // Adjust the import path based on your app structure
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  console.log('Production mode enabled');
}

console.log('Bootstrapping application...');
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

