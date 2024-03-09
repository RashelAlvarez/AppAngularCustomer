import { CanActivateFn, Router , ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //valida fecha  de expiracion del tolen
  let isTokenExpirado =()=>{
    let token = authService.token;
    let payload= authService.obtenerDatosToken(token);
    let now = new Date().getTime()/1000;
    if (payload.exp < now) {
      return true;
    }
    Swal.fire('Sesión expirada', 'Por favor ingresar nuevamente', 'warning' );
    return false;
  }

  if (authService.isAuthenticated()) {
    if (isTokenExpirado()) {
        authService.logout();
        router.navigate(['/login']);
        return false
    }
    return true;
  }
  router.navigate(['/login']);
  return false;

  
};
