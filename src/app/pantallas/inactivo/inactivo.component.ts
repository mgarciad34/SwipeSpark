import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/login.service';

@Component({
  selector: 'app-inactivo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './inactivo.component.html',
  styleUrl: './inactivo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InactivoComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router) {}
  user = JSON.parse(localStorage.getItem('user') || '{}');
  ngOnInit(): void {
    this.loginService.obtenerUsuario(this.user.id).subscribe((response) => {
      if (response.status === 200) {
         if (response.body.Estado === 'activo'  || response.body.Estado === 'Activo' ){
            localStorage.setItem('user', JSON.stringify(response.body));
            this.router.navigate(['/']);
         }
      }
    } );
  }






  cerrarAplicacion(){
    this.loginService.cerrarAplicacion();
  }
}
