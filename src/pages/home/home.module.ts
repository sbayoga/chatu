import { HomePage } from './home';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    HomePage
  ],
  exports: [
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule
  ],
   entryComponents: [
    HomePage
  ],
  bootstrap: [IonicApp],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class HomeModule {}
