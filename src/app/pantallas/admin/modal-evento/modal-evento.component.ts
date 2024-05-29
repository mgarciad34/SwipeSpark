  import { EventosService } from './../../../servicios/eventos.service';
  import { CommonModule } from '@angular/common';
  import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
  import { AppComponent } from '../../../app.component';
  import { FormsModule } from '@angular/forms';

  @Component({
    selector: 'app-modal-evento',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule
    ],
    templateUrl: './modal-evento.component.html',
    styleUrl: './modal-evento.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ModalEventoComponent implements OnInit {
    @Input() evento: any;
    @Output() cerrarModal = new EventEmitter<boolean>();
    clavesExcluidas = ["createdAt", "updatedAt", "id"]; // Claves a excluir
    constructor(private eventosServicio: EventosService, private main:AppComponent) {}
    ngOnInit(): void {
      console.log(this.evento)
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
          this.main.changeModal('success', 'Cambios guardados correctamente')
          this.cerrarModalFn();
        }
        if (response.status === 404) {
          this.main.changeModal('error', 'No se realizó ningún cambio')
          this.cerrarModalFn();
        }
        if (response.status === 500) {
          this.main.changeModal('error', 'Error al guardar los cambios')
          this.cerrarModalFn();
        }
      }
      )
    }

  }
