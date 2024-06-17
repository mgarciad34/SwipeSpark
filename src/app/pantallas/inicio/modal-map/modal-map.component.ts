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
  styleUrl: './modal-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalMapComponent implements OnInit {
  @Input() mapaData: mapaData = {
    nombre: 'Ubicación Default',
    latitud: 40.387183111568596,
    longitud: -82.66667223256182,
  };
  @Output() cerrarModal = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<boolean>();
  map: any;

  constructor() {}
  cerrarModalFn = () => this.cerrarModal.emit(false);

  ngOnInit(): void {
    this.cargarMapa(this.mapaData);
  }

  cargarMapa(item: any) {
    const mapaData = item;

    if (!this.map) {
      // Verificar si el mapa ya está inicializado
      this.map = new Map('map').setView(
        [mapaData.latitud, mapaData.longitud],
        13
      );

      // Agregar capa de tiles
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
        this.map
      );

      // Agregar un marcador
      marker([mapaData.latitud, mapaData.longitud])
        .addTo(this.map)
        .bindPopup(mapaData.nombre)
        .openPopup();
    } else {
      // Si el mapa ya está inicializado, simplemente cambia el centro y el marcador
      this.map.setView([mapaData.latitud, mapaData.longitud], 13);
      marker([mapaData.latitud, mapaData.longitud])
        .addTo(this.map)
        .bindPopup(mapaData.nombre)
        .openPopup();
    }
  }
}
