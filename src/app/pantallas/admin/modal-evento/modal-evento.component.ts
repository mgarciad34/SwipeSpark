import { EventosService } from './../../../servicios/eventos.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../../models/eventos';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-modal-evento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-evento.component.html',
  styleUrls: ['./modal-evento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEventoComponent implements OnInit {
  @Input() evento!: Evento;
  @Output() cerrarModal = new EventEmitter<boolean>();
  clavesExcluidas = ["createdAt", "updatedAt", "id"]; // Claves a excluir
  usuarios = signal({} as { [key: number]: string })

  constructor(private eventosServicio: EventosService, private main: AppComponent, private usuariosService: UsuariosService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log(this.evento);
    this.cargarUsuarios();
  }

  cerrarModalFn = () => this.cerrarModal.emit(false);

  dataFiltrada() {
    return Object.entries(this.evento)
      .filter(([key, value]) => !this.clavesExcluidas.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  guardarCambios() {
    this.eventosServicio.actualizarEvento(this.evento.id, this.dataFiltrada()).subscribe((response) => {
      if (response.status === 200) {
        this.main.changeModal('success', 'Cambios guardados correctamente');
        this.cerrarModalFn();
      }
      if (response.status === 404) {
        this.main.changeModal('error', 'No se realizó ningún cambio');
        this.cerrarModalFn();
      }
      if (response.status === 500) {
        this.main.changeModal('error', 'Error al guardar los cambios');
        this.cerrarModalFn();
      }
    });
  }

  async cargarUsuarios(): Promise<void> {
    for (const inscrito of this.evento.inscripcioneseventos!) {
      const nombreUsuario = await this.obtenerUsuarioPorId(inscrito.usuarioID);
          this.usuarios()[inscrito.usuarioID] = nombreUsuario;
          this.cdr.detectChanges();
          this.cdr.markForCheck();
    }
  }

  async obtenerUsuarioPorId(id: number): Promise<string> {
    try {
      const response = await firstValueFrom(this.usuariosService.obtenerUsuario(id));
      return response.body?.nombre || 'Nombre de usuario no encontrado';
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return 'Error al obtener el usuario';
    }
  }

  eliminarUsuarioDelEvento(idUsuario:any, idEvento:any){
     this.eventosServicio.desinscribirseAEvento(idUsuario, idEvento).subscribe((response) => {
       if (response.status === 200) {
          this.main.changeModal('success', 'Usuario eliminado del evento');
          this.evento.inscripcioneseventos = this.evento.inscripcioneseventos?.filter((inscrito) => inscrito.usuarioID !== idUsuario);
          this.cargarUsuarios();
          this.cdr.detectChanges();
          this.cdr.markForCheck();
       }
       if (response.status === 404) {
          this.main.changeModal('error', 'No se realizó ningún cambio');
       }
       if (response.status === 500) {
          this.main.changeModal('error', 'Error al eliminar el usuario del evento');
       }
     });
  }
}

