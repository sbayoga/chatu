import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { HttpSrvProvider } from './../../providers/http-srv/http-srv';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [HttpSrvProvider]
})
export class LoginPage {

  public loginForm: object = { 'email' : '', 'password': '' };

  constructor(private httpSrv: HttpSrvProvider,
              private loader: LoadingController,
              private alert: AlertController,
              private storage: Storage,
              public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewWillEnter(){
    this.checkSession();
  }

  private checkSession(): void {
    localStorage.getItem('nologin') !== null 
      ? this.navigateToChatArea()
      : console.log('User is logged: ', localStorage.getItem('nologin') !== null); 
  }

  private getUserInfo(callback: any): void {
      console.log('User info:');
      console.log(localStorage.getItem('user'));
  }

  private showErrorAlert(message: string): void{
    this.alert.create({
      title: '¡Error!',
      enableBackdropDismiss: false,
      message: message || 'Hubo un error desconocido',
      buttons: ['Vale']
    }).present();
  }

  public login(): void {
     this.httpSrv.call('post', 'user/login', this.loginForm)
     .subscribe(
      success => this.onSuccessLogin(success),
      fail => this.onErrorLogin(fail)
    );
  }

  private onSuccessLogin(response: Response | object): void {
    if(response['success'] 
      && response.hasOwnProperty('data')
      && response['data'].hasOwnProperty('token') 
      && response['data'].hasOwnProperty('user')) {
        localStorage.setItem('token', response['data']['token']);
        localStorage.setItem('nologin', 'true');
        localStorage.setItem('user', JSON.stringify(response['data']['user'][0]));
        this.navigateToChatArea();
    } else this.showErrorAlert(response['error']);
  }

  private showHideLoader(value: boolean){
    value 
      ? this.createLoaderComponent()
      : this.loader = null;
  }

  private createLoaderComponent(): void {
    this.loader.create({
      spinner: 'dots',
      content: 'Entrando...',
      dismissOnPageChange: true
    }).present();
  }
  private navigateToChatArea(): void {
    this.navCtrl.push(HomePage);
  }

   private onErrorLogin(response: Response | object): void {
    console.log(response);
  }
}
