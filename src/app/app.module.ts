import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { ChatDetailsModule } from '../pages/chat-details/chat-details.module';
import { LoginModule } from '../pages/login/login.module';
import { HomeModule } from '../pages/home/home.module';
import { HttpSrvProvider } from '../providers/http-srv/http-srv';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ChatDetailsModule,
    HttpModule,
    HomeModule,
    LoginModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpSrvProvider
  ]
})
export class AppModule {}
