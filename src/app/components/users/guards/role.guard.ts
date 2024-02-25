import { CanActivateFn, Router , ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
 
  let role = route.data['role'] as string;
  console.log(role);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }


  if (authService.hasRole(role)) {
    return true;
  }
  Swal.fire('Acceso denegado', 'No tienes acceso a este recurso', 'warning' );
  router.navigate(['/clientes'])
  return false;
};
