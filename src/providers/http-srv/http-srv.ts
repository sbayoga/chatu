import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpSrvProvider {
  protected baseUrl: string = 'http://localhost:8080/api/';
  private times = 0;

  constructor(protected http: Http) {
   
  }

  private buildUrl(endpoint: string = ''): string{
    return this.baseUrl.concat(endpoint);
  }

  private handleErrorOnApi(): Observable<Response> {
    this.logout();
    this.clearRegistries();
    return Observable.throw({success: false, error: 'Error en la api, desconectando...'})
  }

  public logout(): void {
    this.times++;
    this.call('get', 'user/logout')
    .subscribe(
      (success) => this.onSuccessLogout(success), 
      (error) => this.onErrorLogout(error)
    );
  }

  private onSuccessLogout(response: Response): void {
    this.times = 0;
    this.clearRegistries();
  }

  private onErrorLogout(response: Response): void {
    localStorage.clear();
    this.times === 10 
      ? setTimeout(this.logout, 500)
      : console.log('Tried to disconnect but it was failed. Please close the app');
  }

  private clearRegistries(): void {
    localStorage.clear();
  }

  private mapCall(response: Response): Observable<Response> {
    return (response.status === 200) 
      ? response.json() || {}
      : this.handleErrorOnApi();
  }

  private catchErroOnCall(response: Response): Observable<Response> {
    return [400,406,409,500].find( (error) => response.status === error) !== undefined
      ? Observable.throw(new Error(response['error']))
      : Observable.throw(response['error']);
  }

  private getHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'))
    return headers;
  }
 
  public call(method: string = 'get',
              endpoint: string,
              body: {} = {}): Observable<Response> {
      let http = (method === 'get') 
        ? this.http[method](this.buildUrl(endpoint), Object.assign(body, {headers: this.getHeaders()}))
        : this.http[method](this.buildUrl(endpoint), body, {headers: this.getHeaders()});

      return http
        .map(this.mapCall)
        .catch(this.catchErroOnCall);
  }

}
