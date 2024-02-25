import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { AuthService } from '../users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8009/clientes';
  private HttpHeaders=new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http:HttpClient, private router:Router, 
    private authService:AuthService) { }

  private agregarAuthorizationHeader(){
    let token=this.authService.token;
    if (token!=null) {
      return this.HttpHeaders.append('Authorization', 'Bearer ' + token );
    }
    return this.HttpHeaders;
  }

  //metodo para redirigir al login si el usuario no esta autorizado
  private isNoAutorizado(e): boolean {
    if (e.status == 401 ) {

      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login'])
      return true;
    }

   

    if ( e.status == 403) {
      Swal.fire('Acceso denegado', 'No tienes acceso a este recurso', 'warning' );
      this.router.navigate(['/clientes'])
      return true;
    }
    return false;
  }

  getClientes(page:number): Observable<any> {
    //return of(CLIENTES); //se convierte el listado de clientes en un observable
    return this.http.get(this.urlEndPoint ).pipe(
      map((response:any)=>{
        let clientes =response as Cliente[];
        return clientes.map(cliente => {
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return cliente;
        }) }

      )
    );
  }

  createCliente(cliente: Cliente):Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje, e.error.error, 'error'

        );
        return throwError(e);
      })
    )
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{ //el catchError para capturar el error desde el banckend
        this.router.navigate(['/clientes']);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(
          'Error al editar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    )
  }

  update(id:number,cliente: Cliente): Observable<any>{
    //  console.log("updateservice" + id);
    return this.http.put<any>(`${this.urlEndPoint}/${id}`, cliente, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje, e.error.error, 'error'

        );
        return throwError(e);
      })
    )
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire(
          e.error.mensaje, e.error.error, 'error'

        );
        return throwError(e);
      })
    )
  }

  subirFoto(archivo:File , id):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeader=new HttpHeaders();
    let token =this.authService.token;
    if (token!=null) {
      httpHeader=httpHeader.append('Authorization', 'Bearer ' + token);
    }

    const req=new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData, {
      reportProgress:true,
      headers:httpHeader
    });

    return this.http.request(req).pipe(
      catchError(e=> {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );



  }
}
