import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, type OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { AppComponent } from '../../../app.component';
import { PreferenciasService } from '../../../servicios/preferencias.service';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../servicios/usuarios.service';

@Component({
  selector: 'app-modal-cambiar-pass',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-cambiar-pass.component.html',
  styleUrl: './modal-cambiar-pass.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCambiarPassComponent implements OnInit {
  @Input() usuario!: any
  @Output() cerrarModal = new EventEmitter<boolean>();
  @Output() actualizarUsuario = new EventEmitter<User>();
  passActual = signal('')
  nuevaPass = signal('')
  confirmarPass = signal('')
  constructor(private main:AppComponent, private usuariosService: UsuariosService) {}
  ngOnInit(): void {

  }

  guardarCambios() {
    const esIgual =this.usuariosService.compararContraseñas(this.passActual(), this.usuario.contrasena)
    const esIgualAlaNueva = this.usuariosService.compararContraseñas(this.nuevaPass(), this.usuario.contrasena)
    if(!esIgual){
      this.main.changeModal('error', 'La contraseña actual no es correcta')
      return
    }else if(this.nuevaPass() !== this.confirmarPass()){
      this.main.changeModal('error', 'Las contraseñas no coinciden')
      return
    }else if(this.nuevaPass() === '' || this.confirmarPass() === '' || this.nuevaPass() === null || this.confirmarPass() === null ||
    this.nuevaPass() === undefined || this.confirmarPass() === undefined){
      this.main.changeModal('error', 'Las campos no pueden ser vacios')
      return
    }else if(esIgualAlaNueva){
      this.main.changeModal('error', 'La nueva contraseña no puede ser igual a la actual')
      return
    }
    this.usuariosService.cambiarContraseña(this.usuario.id, {contrasena: this.nuevaPass()}).subscribe((res) => {
        if(res.status === 200){
          this.main.changeModal('success', 'Contraseña actualizada correctamente')
          this.cerrarModal.emit(true)
        }
        if(res.status === 404){
          this.main.changeModal('error', 'Error al cambiar contraseña por usuario no encontrado')
        }
        if(res.status === 500){
          this.main.changeModal('error', 'Error al cambiar contraseña por error en el servidor')
        }

    }
    )
  }
}
