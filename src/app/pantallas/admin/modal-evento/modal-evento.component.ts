import { EventosService } from './../../../servicios/eventos.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../../models/eventos';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { firstValueFrom } from 'rxjs';
import { mapaData } from '../../../models/mapa';
import { Map, marker, tileLayer, Marker } from 'leaflet';


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
     map: any;
     markers: Marker[] = [];
     editandoMapa = false;

     @Input() mapaData: mapaData = {
       nombre: 'Ubicacion',
       latitud: 38.90655,
       longitud: -3.65765,
     };

  @Input() evento!: Evento;
  @Output() cerrarModal = new EventEmitter<boolean>();
  clavesExcluidas = ["createdAt", "updatedAt", "id"];
  usuarios = signal({} as { [key: number]: string })

  constructor(private eventosServicio: EventosService, private main: AppComponent, private usuariosService: UsuariosService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log(this.evento);
    this.cargarUsuarios();
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

  cambiarOpcion(opcion: boolean) {
     console.log("Cambiando opcion a: ", opcion);
     this.editandoMapa = opcion;
     this.cdr.detectChanges();
     if (this.editandoMapa) {
       setTimeout(() => {
         this.cargarMapa(this.mapaData);
       }, 0);
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

