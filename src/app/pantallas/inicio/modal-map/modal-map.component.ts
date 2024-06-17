import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Map, marker, tileLayer } from 'leaflet';
import { mapaData } from '../../../models/mapa';

@Component({
  selector: 'app-modal-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalMapComponent implements OnInit {
  @Input() mapaData: mapaData = {
    nombre: 'Ubicación Default',
    latitud: 38.90853,
    longitud: -3.65933,
  };
  @Output() cerrarModal = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<boolean>();
  private map: any;
  private marker: any;

  constructor() {}

  cerrarModalFn = () => this.cerrarModal.emit(false);

  ngOnInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = new Map('map').setView(
      [this.mapaData.latitud, this.mapaData.longitud],
      13
    );
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
      this.map
    );
    this.marker = marker([this.mapaData.latitud, this.mapaData.longitud])
      .addTo(this.map)
      .bindPopup(this.mapaData.nombre || 'Ubicación Default');
    this.updateMarkerPosition();
  }

  updateMarkerPosition() {
    if (this.marker) {
      this.marker.remove(); // Elimina el marcador existente
      this.marker = marker([this.mapaData.latitud, this.mapaData.longitud])
        .addTo(this.map)
        .bindPopup(this.mapaData.nombre || 'Ubicación Default');
    }
  }

  cargarMapa(item: any) {
    this.mapaData = item; // Actualiza los datos del mapa
    this.updateMarkerPosition(); // Actualiza la posición del marcador
  }
}
