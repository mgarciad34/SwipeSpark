import { inject } from '@angular/core';
import { ActivatedRoute, Router, type CanActivateFn } from '@angular/router';
import { LoginService } from '../servicios/login.service';

export const authGuard: CanActivateFn  = async (route, _state) => {
  const loginS = inject(LoginService);
  const user = JSON.parse(localStorage.getItem('user')!);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let response = false;

  if (user && token) {
    if (loginS.verificarExpiracionToken(token)) {
        if(user.Estado === 'Activo' || user.Estado === 'activo'){
          if(user.RolID === 1){
            await router.navigate(['admin/dashboard']);
            return response = false;
          }else{
            await router.navigate(['/']);
            return response = false;
          }
        }else{
          await router.navigate(['/inactivo']);
          return response = false;
        }
    } else {
      return response = true;
    }
  } else {
    return response = true;
  }
};
