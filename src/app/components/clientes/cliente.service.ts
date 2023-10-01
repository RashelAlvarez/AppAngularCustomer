import { Injectable } from '@angular/core';
import {Cliente } from './cliente';
import { of, Observable , throwError} from 'rxjs';
import { HttpClient , HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import { map, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8009/clientes';
  private HttpHeaders=new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http:HttpClient, private router:Router) { }

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
    return this.http.post<any>(this.urlEndPoint, cliente, {headers:this.HttpHeaders}).pipe(
      catchError(e=>{
      
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje, e.error.error, 'error'

        );
        return throwError(e);
      })
    )
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{ //el catchError para capturar el error desde el banckend
        this.router.navigate(['/clientes']);
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
    return this.http.put<any>(`${this.urlEndPoint}/${id}`, cliente, {headers: this.HttpHeaders}).pipe(
      catchError(e=>{
      /*  if (e.status=400){
          //console.log("error desde el service " + e.error.errors);
       
          return throwError(e);
        }*/
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje, e.error.error, 'error'

        );
        return throwError(e);
      })
    )
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.HttpHeaders}).pipe(
      catchError(e=>{
        console.error(e.error.mensaje);
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

    const req=new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData, {
      reportProgress:true
    });

    return this.http.request(req);



  }
}
