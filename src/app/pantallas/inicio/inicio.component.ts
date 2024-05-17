import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { User } from '../../models/user';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent implements OnInit {
  loginService = inject(LoginService)
  router = inject(Router)
  usuario = signal({} as User)
  pantallaActual = signal('')
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if(user){
      this.loginService.obtenerUsuario(user.id).subscribe((res: any) => {
        this.usuario.set(res.body)
        console.log(res.body)
      })
    }
   }

   cerrarAplicacion(): void{
      this.router.navigate(['/login'])
      this.loginService.cerrarAplicacion()
    }

}
