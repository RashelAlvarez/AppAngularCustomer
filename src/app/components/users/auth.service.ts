import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user:User;
  private _token:string;

  constructor( private http: HttpClient) {}

  public get user():User{
    if (this._user!=null) {
      return this._user;
    }else if (this._user==null && sessionStorage.getItem('user')!=null) {
     this._user= JSON.parse(sessionStorage.getItem('user')) as User;
    return this._user;
    }
    return new User();
  }

  public get token():string{
    if (this._token!=null) {
    return this._token;
    }else if (this._token==null && sessionStorage.getItem('token')!=null) {
     this._token= sessionStorage.getItem('token') ;
     return this._token;
    }
    return null;
  }

  login(user:User):Observable<any>{

    const urlEndpoint = 'http://localhost:8009/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credenciales});

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', user.username);
    params.set('password', user.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndpoint ,params.toString(), {headers:httpHeaders});
  }

  guardarUsuario(accessToken:string):void{
    let objeto=this.obtenerDatosToken(accessToken);
    this._user=new User();
    this._user.username=objeto.user_name;
    this._user.roles=objeto.authorities;
    sessionStorage.setItem('user', JSON.stringify(this._user)); //stringify convierte un objeto en string
  }
  
  guardarToken(accessToken:string):void{
    this._token=accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken:string):any{
    if(accessToken!=null){
      return JSON.parse(atob(accessToken.split(".")[1])); //parse convierte un string en objeto
    }
    return null;
  }

  isAuthenticated():boolean{
    let objeto=this.obtenerDatosToken(this.token); //obtener token desde el metodo getter 
    //console.log('autenticado', objeto);
    if(objeto !=null && objeto.user_name && objeto.user_name.length>0){
      return true;
      
    }
    return false;
  }

  logout():void{
    this._token=null;
    this._user=null;
    sessionStorage.clear();
  }

  hasRole(role:string):boolean{
    if (this.user.roles.includes(role)) {
      return true;
    }
    return false;
  }

}
