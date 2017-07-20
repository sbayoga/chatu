import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ChatDetailsPage } from './chat-details';

@NgModule({
  declarations: [
    ChatDetailsPage
  ],
  exports: [
    ChatDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule
  ],
   entryComponents: [
    ChatDetailsPage
  ],
  bootstrap: [IonicApp],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class ChatDetailsModule {}
