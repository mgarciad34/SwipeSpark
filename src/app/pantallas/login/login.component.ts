import { LoginService } from './../../servicios/login.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../../app.component';
import { HttpResponse } from '@angular/common/http';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LoginComponent, CommonModule,RouterLink, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  formulario: FormGroup;
  user: any;
  eyePass = signal(false)
  constructor(
    private formBuilder: FormBuilder,
    private LoginService: LoginService,
    private main: AppComponent,
    private router: Router

  ) {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
    });
  }


  login() {
    if (this.formulario.valid) {
      const data = {
        email: this.formulario.value.email,
        contrasena: this.formulario.value.contrasena
      };
      this.LoginService.login(data).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.user = response.body.usuario;
            let token = response.body.token;
            localStorage.setItem('user', JSON.stringify(this.user));
            localStorage.setItem('token', token);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          if(error.status === 401){
            this.main.changeModal('error', 'Contraseña incorrecta');
          }
          if(error.status === 404){
            this.main.changeModal('error', 'Usuario no encontrado');
          }
          if(error.status === 500){
            this.main.changeModal('error', 'Error en el servidor');
          }
        }
      );
    } else {
      this.main.changeModal('error', 'Por favor, verifique los datos ingresados');
    }
  }

}
