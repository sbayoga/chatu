import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

import { HttpSrvProvider } from './../../providers/http-srv/http-srv';

import * as io from "socket.io-client";

@IonicPage()
@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
  providers: [HttpSrvProvider]
})
export class ChatDetailsPage {
  private user;
  public chat: object = {};
  public msgToSend: string;

  @ViewChild('content') private content: Content;

  private socket: any;

  constructor(private httpSrv: HttpSrvProvider,
              public navCtrl: NavController, 
              public navParams: NavParams) {
    this.getChatInfo();
    this.getUserInfo();

    this.connectSocketIo();
    this.activateServicesOnSocketConnection();
    this.activateSocketGenericServices();
  };
  
  private ionViewDidLeave(){
    this.socket.emit('forceDisconnect');
  }

  private connectSocketIo(): void {
    this.socket = io.connect('http://localhost:8080', {'forceNew': true});
  }

  private activateServicesOnSocketConnection(): void {
    this.socket.on('connect', (data) => {
      this.socket.emit('roomConnection', {
        userInfo: this.user,
        userId: this.user._id,
        roomId: this.navParams.data
      }); 
    });
  }

  private activateSocketGenericServices(): void {
    console.log('activated');
    this.socket.on('messageraro', (data) =>  {
      console.log(data);
      this.getChatInfo();
    });
    this.socket.on('messages', function(data) {
       console.log('Me han enviado un mensaje!!! 2222')
    });
  }

  private getUserInfo(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  private getChatInfo(): void {
     this.httpSrv.call('get', 'chat/'+ this.navParams.data)
     .subscribe(
      success => this.onSuccessGotChatInformation(success),
      fail => this.onFailGotChatInformation(fail)
    );
  }
  private setInterval;
  private onSuccessGotChatInformation(response): void {
    this.scrollBottom();
    response['success'] 
      ? this.chat = response['data'] 
      : this.onFailGotChatInformation(response);
  }
 
  private onFailGotChatInformation(response): void {
    this.navCtrl.pop();
  }

  private scrollBottom(): void {
    if(this.content && this.content !== null){
      setTimeout( 
        () => this.content.scrollToBottom(300),
      500);
    }
  }

  private existsChatInformation(): boolean {
    return this.chat 
      && this.chat.hasOwnProperty('_id') 
      && this.chatHasMessages();
  }

  private chatHasMessages(): boolean {
    return this.chat 
      && this.chat.hasOwnProperty('messages') 
      && this.chat['messages'].length > 0;
  }
  private cleanMsgText(): void {
    this.msgToSend = null;
  }

  private sendMessage(): void {
    this.httpSrv.call('patch', 'chat/' + this.navParams.data + '/message', {
        text: this.msgToSend
    }).subscribe(
      success => this.onSuccessAddedNewMessage(success),
      fail => this.onFailAddedNewMessage(fail)
    );
  }

  private updateMessagesTimeline(): void {
    this.chat['messages'].push({ 
      created: Date.now(),
      authorId: this.user._id,
      text: this.msgToSend,
    });
  }

  private onSuccessAddedNewMessage(response): void {
    this.updateMessagesTimeline();
    this.scrollBottom();
    this.cleanMsgText();
  }

  private onFailAddedNewMessage(response): void {
    console.log(response);
  }

  public formatTimeStamp(timestamp: Date): string {
    const date = new Date(timestamp),
    diffDays = this.getDiffDaysInMessage(date);
   
    if(diffDays === 0) { return 'Hoy, a las ' + this.getFullTime(date); }
    else if(diffDays === 1) { return 'Ayer, a las ' + this.getFullTime(date); }
    else { return this.getFullDate(date) + '  ' + this.getFullTime(date); }
  }

  private getFullTime(date: Date): string {
    return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
  }
  /**
   * Return full formatted date from timestamp's message
   * @param date 
   * @return string
   */
  private getFullDate(date): string {
    return ('0' + date.getDate()).slice(-2) 
      + '/' 
      + ('0' + (date.getMonth() + 1)).slice(-2) 
      + '/' + date.getFullYear(); 
  }

   public getPersonFullName(person): string {
    return person 
      && person.hasOwnProperty('name') 
        ? person.hasOwnProperty('lastName') 
          ? person.name + ' ' + person.lastName 
          : person['name']
      : person['name'];
  }

  private getDiffDaysInMessage(date1: Date): number{
    return Math.round(Math.abs((new Date().getTime() - date1.getTime())/(24*60*60*1000)))
  }

  public showButtonSendMessage(): boolean {
    return this.msgToSend && this.msgToSend.length > 0;
  }

  public getRolClass(msg: object): object {
     return { [(this.thisIdIsCreator(msg['authorId']) 
                  ? 'sender' 
                  : 'receiver') + '-message-container']: true};
  }

  public getArrow(msg: object): string {
    return this.thisIdIsCreator(msg['authorId'])  ? 'left' : 'right';
  }
  
  public goToChatsList(): void {
    this.navCtrl.pop();
  }

  public thisIdIsCreator(id: number): boolean {
    return id === this.user._id
  }

  public iAmTheAutor(): boolean {
    return this.user._id === this.chat['creator']['_id'];
  }

  public getAvatarConversation(): string {
    return this.chatIsLoaded() 
      && this.avatarIsNotNull(this.chat[ this.iAmTheAutor() ? 'contact' : 'creator'])
        ? this.chat[ this.iAmTheAutor() ? 'contact' : 'creator']['avatar']
        : 'assets/img/avatar/avatar_user_default.png'; 
  }

  private chatIsLoaded(): boolean {
    return this.chat && this.chat.hasOwnProperty('_id');
  }

  private avatarIsNotNull(person): boolean {
    return this.chatIsLoaded() 
      && person
      && person.hasOwnProperty('avatar')
      && person['avatar'] !== null;
  }

  public getNameContact(): string {
    return this.chatIsLoaded() 
      ? this.getPersonFullName(this.chat[ this.iAmTheAutor() ? 'contact' : 'creator'])
      : 'Sin nombre';
  }

}
