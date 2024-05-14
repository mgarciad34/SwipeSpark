import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../servicios/registro.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formularioService: RegistroService
  ) {
    this.formulario = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contraseña: ['', Validators.required],
      Nick: ['', Validators.required],
      Foto: ['', Validators.required],
    });
  }

  enviarRegistro() {
    if (this.formulario.valid) {
      const formData = new FormData();
      Object.keys(this.formulario.value).forEach((key) => {
        formData.append(key, this.formulario.value[key]);
      });

      this.formularioService.crearRegistro(formData).subscribe(
        (response) => {
          console.log('Formulario enviado exitosamente', response);
        },
        (error) => {
          console.error('Error al enviar el formulario', error);
        }
      );
    }
  }
}
