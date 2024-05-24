import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/login.service';

@Component({
  selector: 'app-cabezera-admin',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './cabezera-admin.component.html',
  styleUrl: './cabezera-admin.component.css'
})
export class CabezeraAdminComponent {
  @Output() cambiandoSubMenu = new EventEmitter<string>();
  actualSubMenu = signal('eventos');

  constructor(private router: Router, private loginService: LoginService) {}

  cambiarSubMenu(subMenu: string) {
    this.cambiandoSubMenu.emit(subMenu);
    this.actualSubMenu.set(subMenu);
  }
  cerrarAplicacion() {
    this.loginService.cerrarAplicacion();
  }
}
