import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppServerModule } from './src/app/app.server.module'

// Define RenderOptions as per your requirements
interface RenderOptions {
  req?: any; // Adjust this as per your server request object type
  bootstrap: any; // Use AppServerModule here or your desired module
  // Add any other necessary properties
}

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/front/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule, // Ensure this matches your AppServerModule import
    providers: [
      // Add any additional providers here if needed
    ]
  }) as any); // Cast to 'any' to avoid TypeScript error

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/*', (req, res) => {
    res.render(indexHtml, { req });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}



if (require.main === module) {
  run();
}

export * from './src/app/app.server.module'
