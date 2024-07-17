import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// bootstrapApplication(AppComponent)
//   .catch((err) => console.error(err));


const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule).then(() => {
});
