import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RegistroService } from '../../servicios/registro.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private registroService: RegistroService
  ) {
    this.formulario = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contraseña: ['', Validators.required],
      Nick: ['', Validators.required],
      Foto: ['', Validators.required],
      RolID: [2],
    });
  }


  async enviarRegistro() {
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
          console.log('Formulario enviado exitosamente', response);
          // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
        },
        (error) => {
          console.error('Error al enviar el formulario', error);
          // Aquí puedes mostrar un mensaje de error al usuario
        }
      );
    } else {
      console.log('Formulario inválido');
      // Aquí puedes mostrar mensajes de error específicos para cada campo inválido
    }
  }
}
