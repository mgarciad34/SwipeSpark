import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, type OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { PreferenciasService } from '../../../servicios/preferencias.service';
import { AppComponent } from '../../../app.component';
import { read } from '@popperjs/core';
import { UsuariosService } from '../../../servicios/usuarios.service';

@Component({
  selector: 'app-modal-cambiar-foto',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './modal-cambiar-foto.component.html',
  styleUrl: './modal-cambiar-foto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCambiarFotoComponent implements OnInit {
  @Input() usuario!: User;
  @Output() cerrarModal = new EventEmitter<boolean>();
  @Output() actualizarUsuario = new EventEmitter<User>();
  foto = signal('' as string)
  constructor(private main:AppComponent, private usuarioService:UsuariosService) {}
  ngOnInit(): void { }

  guardarCambios() {
    if(this.foto() === '' || this.foto() === null || this.foto() === undefined){
      this.main.changeModal('error', 'Debes seleccionar una foto');
      return;
    }
    if(this.usuario.Foto === this.foto()){
      this.main.changeModal('error', 'Debes seleccionar una foto diferente');
      return;
    }
    this.usuario.Foto = this.foto();
    this.usuarioService.actualizarUsuario(this.usuario.id, this.usuario).subscribe((res) => {
      if(res.status === 200){
        this.main.changeModal('success', 'Foto actualizada correctamente');
        this.actualizarUsuario.emit();
        this.cerrarModal.emit(true);
      }
      if(res.status === 404){
        this.main.changeModal('error', 'Usuario no encontrado');
      }
      if(res.status === 500){
        this.main.changeModal('error', 'Error al actualizar la foto en el servidore');
      }
    }, (err) => {
      this.main.changeModal('error', 'Error al actualizar la foto');
    });
  }

  cambiarFoto($event: any) {
    const file = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.foto.set(reader.result as string);
    };
  }
}
