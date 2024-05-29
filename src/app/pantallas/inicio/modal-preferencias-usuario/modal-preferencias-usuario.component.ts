import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, type OnInit } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { AppComponent } from '../../../app.component';
import { FormsModule } from '@angular/forms';
import { Preferencias } from '../../../models/preferencias';
import { Preferencia } from '../../../models/preferencia';
import { User } from '../../../models/user';
import { PreferenciasService } from '../../../servicios/preferencias.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-modal-preferencias-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-preferencias-usuario.component.html',
  styleUrl: './modal-preferencias-usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalPreferenciasUsuarioComponent implements OnInit {
  @Input() usuario!: User;
  @Output() cerrarModal = new EventEmitter<boolean>();
  @Output() actualizarUsuario = new EventEmitter<User>();
  preferencias = signal<Preferencias>(
    {
      relacion: null,
      deportivos: null,
      artisticos: null,
      politicos: null,
      hijos: null,
      interes: null,
    }
  );
  preferenciasArray: Preferencia[]= []
  constructor(private main:AppComponent, private preferenciasService: PreferenciasService) {}
  ngOnInit(): void {
    // interval(1000).subscribe(() => {
    //   console.log(this.usuario)
    // } )
  }
  cerrarModalFn = () => this.cerrarModal.emit(false);
  actualizarUsuarioFn = () => this.actualizarUsuario.emit();

  guardarCambios() {
    for (const key in this.preferencias()) {
      if (this.preferencias()[key] === null) {
        this.main.changeModal('error', 'Faltan campos por llenar')
        return;
      }else{
        const preferencia:Preferencia = {
          tipo: key,
          valor: this.preferencias()[key],
          usuarioID: this.usuario.id
        }
        this.preferenciasArray.push(preferencia)
      }
    }
    this.preferenciasService.crearPreferenciasDelUsuario(this.preferenciasArray, this.usuario.id).subscribe((res) => {
      if (res.status === 201) {
        this.main.changeModal('success', 'Preferencias guardadas correctamente')
        this.cerrarModalFn()
      }else{
        this.main.changeModal('error', 'Error al guardar las preferencias' + res)
      }
    } , (error) => {
      this.main.changeModal('error', 'Error al guardar las preferencias ')
      console.log(error)
    }
    )
  }
}
