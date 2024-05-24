import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { EventosService } from '../../../servicios/eventos.service';
import { AppComponent } from '../../../app.component';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../../models/eventos';

@Component({
  selector: 'app-modal-crear-evento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-crear-evento.component.html',
  styleUrl: './modal-crear-evento.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCrearEventoComponent implements OnInit {
  @Input() evento:Evento ={
    Nombre: '',
    Descripcion: '',
    FechaRealizacion: null,
    FechaCierreInscripcion: null,
    Geolocalizacion: ''
  };
  @Output() cerrarModal = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<boolean>();
  clavesExcluidas = ["createdAt", "updatedAt", "id"]; // Claves a excluir
  constructor(private eventosServicio: EventosService, private main:AppComponent) {}
  ngOnInit(): void {}
  cerrarModalFn = () => this.cerrarModal.emit(false);


  dataFiltrada() {
    return Object.entries(this.evento)
      .filter(([key, value]) => !this.clavesExcluidas.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  guardarCambios() {
    this.eventosServicio.crearEvento(this.evento.id, this.dataFiltrada()).subscribe((response) => {
      if (response.status === 201) {
        this.main.changeModal('success', 'Creado evento correctamente!')
        this.guardar.emit(true);
        this.cerrarModalFn();
      }
      if (response.status === 500) {
        this.main.changeModal('error', 'Error al crear el evento')
        this.cerrarModalFn();
      }
    }
    )
  }

}
