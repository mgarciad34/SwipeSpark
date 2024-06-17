import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { EventosService } from '../../../servicios/eventos.service';
import { AppComponent } from '../../../app.component';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../../models/eventos';
import { Map, marker, tileLayer, Marker } from 'leaflet';
import { mapaData } from '../../../models/mapa';

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
export class ModalCrearEventoComponent implements OnInit, AfterViewInit, OnDestroy {
  map: any;
  markers: Marker[] = []; // Array para almacenar los marcadores
  editandoMapa = false;

  @Input() mapaData: mapaData = {
    nombre: 'Ubicacion',
    latitud: 38.90655,
    longitud: -3.65765,
  };

  @Input() evento: Evento = {
    nombre: '',
    descripcion: '',
    fechaRealizacion: null,
    fechaCierreInscripcion: null,
    geolocalizacion: ''
  };

  @Output() cerrarModal = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<boolean>();
  clavesExcluidas = ["createdAt", "updatedAt", "id"]; // Claves a excluir

  constructor(private eventosServicio: EventosService, private main: AppComponent, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.editandoMapa) {
      this.cargarMapa(this.mapaData);
    }
  }

  ngOnDestroy(): void {
    this.destruirMapa();
  }

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
    })
  }

  cambiarOpcion(opcion: boolean) {
    console.log("Cambiando opcion a: ", opcion);
    this.editandoMapa = opcion;
    this.cdr.detectChanges();
    if (this.editandoMapa) {
      setTimeout(() => {
        this.cargarMapa(this.mapaData);
      }, 0);  // Asegura que el DOM se ha actualizado
    } else {
      this.destruirMapa();
    }
  }

  cargarMapa(item: any) {
    const mapaData = item;

    if (!this.map) { // Verificar si el mapa ya está inicializado
      this.map = new Map('map').setView([mapaData.latitud, mapaData.longitud], 13);

      // Agregar capa de tiles
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

      // Agregar un marcador inicial
      const initialMarker = marker([mapaData.latitud, mapaData.longitud]).addTo(this.map)
        .bindPopup(mapaData.nombre)
        .openPopup();
      this.markers.push(initialMarker);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        this.map.setView([lat, lng], 13);

        // Eliminar los marcadores existentes
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        // Agregar un nuevo marcador
        const newMarker = marker([lat, lng]).addTo(this.map)
          .bindPopup('Ubicación seleccionada')
          .openPopup();
        this.markers.push(newMarker);

        this.evento.geolocalizacion = `${lat},${lng}`;
        this.mapaData.latitud = lat;
        this.mapaData.longitud = lng;
      });
    } else { // Si el mapa ya está inicializado, simplemente cambia el centro y el marcador
      this.map.setView([mapaData.latitud, mapaData.longitud], 13);

      // Eliminar los marcadores existentes
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];

      // Agregar un nuevo marcador
      const newMarker = marker([mapaData.latitud, mapaData.longitud]).addTo(this.map)
        .bindPopup(mapaData.nombre)
        .openPopup();
      this.markers.push(newMarker);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        this.map.setView([lat, lng], 13);

        // Eliminar los marcadores existentes
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        // Agregar un nuevo marcador
        const newMarker = marker([lat, lng]).addTo(this.map)
          .bindPopup('Ubicación seleccionada')
          .openPopup();
        this.markers.push(newMarker);

        this.evento.geolocalizacion = `${lat},${lng}`;
        this.mapaData.latitud = lat;
        this.mapaData.longitud = lng;
      });
    }
  }

  destruirMapa() {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
      this.markers = [];
    }
  }
}
