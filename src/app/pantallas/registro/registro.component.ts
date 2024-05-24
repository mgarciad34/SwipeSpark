import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RegistroService } from '../../servicios/registro.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  formulario: FormGroup;
  eyePass = signal(false)

  constructor(
    private formBuilder: FormBuilder,
    private registroService: RegistroService,
    private main: AppComponent,
    private router: Router
  ) {
    this.formulario = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contraseña: ['', Validators.required],
      repetirContrasena: ['', Validators.required],
      Nick: ['', Validators.required],
      Foto: ['', Validators.required],
      RolID: [2],
    });
  }


  async enviarRegistro() {
    if(this.formulario.value.Contraseña !== this.formulario.value.repetirContrasena){
      this.main.changeModal('error', 'Las contraseñas no coinciden')
      return
    }
    if (this.formulario.valid) {
      const formData = new FormData();
      const keys = Object.keys(this.formulario.value);

      for (let key of keys) {
        if (key == 'Foto') {
          const inputElement = document.getElementById('foto-perfil') as HTMLInputElement;
          const file = inputElement.files![0];
          const reader = new FileReader();

          // Convertimos el evento onloadend a una promesa
          const result = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          formData.append('Foto', result as string);
        } else {
          formData.append(key, this.formulario.value[key]);
        }
      }

      this.registroService.crearRegistro(formData).subscribe(
        (response) => {
          this.main.changeModal('success', 'Registro exitoso');
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 400) {
            this.main.changeModal('error', 'El correo ya está en uso');
          } else {
            this.main.changeModal('error', 'Ha ocurrido un error'+ error.error.message);
          }
          // Aquí puedes mostrar un mensaje de error al usuario
        }
      );
    } else {
      this.main.changeModal('error', 'Por favor verifique todos los campos');
    }
  }
}
