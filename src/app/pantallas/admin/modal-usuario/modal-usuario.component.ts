import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalUsuarioComponent implements OnInit {
  @Input() usuario: any;
  @Output() cerrarModal = new EventEmitter<boolean>();
  clavesExcluidas = ["Contraseña", "Foto", "createdAt", "updatedAt", "id","amistades","inscripcioneseventos","mensajes","preferencia","Amigo_amistades"]; // Claves a excluir
  constructor(private usuariosServicio: UsuariosService, private main:AppComponent) {}
  ngOnInit(): void {}
  cerrarModalFn = () => this.cerrarModal.emit(false);


  dataFiltrada() {
    return Object.entries(this.usuario)
      .filter(([key, value]) => !this.clavesExcluidas.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  guardarCambios() {
    this.usuariosServicio.actualizarUsuario(this.usuario.id, this.dataFiltrada()).subscribe((response) => {
      if (response.status === 200) {
        this.main.changeModal('success', 'Usuario actualizado correctamente')
        this.cerrarModalFn();
      }
      if(response.status === 404) {
        this.main.changeModal('error', 'No se realizaron cambios porque el usuario no existe')
      }
      if(response.status === 500) {
        this.main.changeModal('error', 'Error en el servidor')
      }
    });
  }
}
