import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage
  ],
  exports: [
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule
  ],
   entryComponents: [
    LoginPage
  ],
  bootstrap: [IonicApp],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class LoginModule {}
