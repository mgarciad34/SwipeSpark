import { inject } from '@angular/core';
import { ActivatedRoute, Router, type CanActivateFn } from '@angular/router';
import { LoginService } from '../servicios/login.service';

export const stateGuard: CanActivateFn = async (route, state) => {
  const loginS = inject(LoginService);
  const user = JSON.parse(localStorage.getItem('user')!);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let response = false;

  if (user && token) {
    if (loginS.verificarExpiracionToken(token)) {
        if(user.estado === 'Activo' || user.estado === 'activo'){
          if(user.rolID === 1){
            await router.navigate(['admin/dashboard']);
            return response = true;
          }else{
            return response = true;
          }
        }else{
          await router.navigate(['/inactivo']);
          return response = false;
        }
    } else {
      loginS.cerrarAplicacion();
      await router.navigate(['/login']);
      return response = false;
    }
  } else {
    await router.navigate(['/login']);
    return response = false;
  }

};
