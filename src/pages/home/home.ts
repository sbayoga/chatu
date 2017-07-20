import { LoginPage } from './../login/login';
import { HttpSrvProvider } from './../../providers/http-srv/http-srv';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ChatDetailsPage } from '../chat-details/chat-details';

import * as io from "socket.io-client";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpSrvProvider]
})
export class HomePage {

  private user;
  private tabSelectedIndex: number = 0;
  public chats: Array<object> = [];
  /**
   * 
   * @param navCtrl  {
      id: 1, 
      available: true,
      newMsgs: 3, 
      avatarUrl: 'assets/img/avatar/catty.png',
      title: 'Mi niña', 
      lastMsg: '¿Has hablado con tu madre de lo que te sugirió en tu casa el otro día?',
      lastConnection: 'Hoy'
    }
   * @param loader 
   * @param httpSrv 
   */

  constructor(public navCtrl: NavController,
              private loader: LoadingController,
              private httpSrv: HttpSrvProvider) {

  }

  ionViewDidEnter(): void {
    this.getAllRoomChats();
    this.getUserInfo();
  }

  

  private onSuccessCreatedNewConversation(response): void {
    this.openChatDetails(response['data']['roomId']);
  }

   private getUserInfo(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  private onFailCreatedNewConversation(response): void {
    console.log(response);
  }

  private getAllRoomChats(): void {
    this.httpSrv.call('get', 'chat')
    .subscribe(
      success => this.onSuccessGotAllConversations(success),
      fail => this.onErrorGotAllConversations(fail)
    );
  }

  private logout(): void {
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

  private onSuccessGotAllConversations(response): void {
    response['success'] 
      ? this.chats = response.data
      : this.onErrorGotAllConversations(response);
  }

  private onErrorGotAllConversations(response): void {
    console.log(response);
  }

  public createNewConversation(): void {
    this.httpSrv.call('post', 'chat',{
      contactId: 2
    }).subscribe(
      success => this.onSuccessCreatedNewConversation(success),
      fail => this.onFailCreatedNewConversation(fail)
    );
  }

  public openChatDetails(roomId: number) {
    this.navCtrl.push(ChatDetailsPage , roomId);
  }

  public getAvatar(person: object): string {
    return person 
    && person.hasOwnProperty('avatar') 
    && person['avatar'] !== null 
      ? person['avatar'] 
      : 'assets/img/avatar/avatar_user_default.png';
  }
  
  public getNameAccordingCreatorRolOnConversation(chat): string {
    return this.getPersonFullName(chat[ !this.iAmTheAutor(chat) ? 'creator' : 'contact' ]) 
  }

  public getPersonFullName(person): string {
    return person 
      && person.hasOwnProperty('name') 
        ? person.hasOwnProperty('lastName') 
          ? person.name + ' ' + person.lastName 
          : person['name']
      : person['name'];
  }

  public getLastMessage(roomId: Number): string {
    const chat = this.chats.find(chat => chat['roomId'] === roomId);
    return chat !== undefined && chat['messages'].length > 0
      ? chat['messages'].filter((msg) => msg['authorId'] !== this.user._id).slice(-1)[0]['text']
      : 'No hay mensajes';
  }

  public someChatIsAvailable(): boolean{
    return this.chats && this.chats.length > 0;
  }

  public tabSelected(index: number): boolean {
    return this.tabSelectedIndex === index;
  }

  public changeTab(index: number): void {
    this.tabSelectedIndex = index;
  }

  public isChatTabActive(): boolean {
    return this.tabSelectedIndex === 0;
  }
  
   public iAmTheAutor(chat): boolean {
    return this.user._id === chat['creator']['_id']
  }
}
