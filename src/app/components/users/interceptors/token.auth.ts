import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //este interceptor lo usamos para validar las respuestas
  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(e => {

        if (e.status == 401) {

          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login'])
          //  return true;
        }



        if (e.status == 403) {
          Swal.fire('Acceso denegado', 'No tienes acceso a este recurso', 'warning');
          this.router.navigate(['/clientes'])
          //  return true;
        }
        // return false;
        return throwError(e);
      }))



  }
}