import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();

    // Disable logs when in prod mode
    window.console.log = () => {};
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
