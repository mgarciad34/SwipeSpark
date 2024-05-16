import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/login.service';

@Component({
  selector: 'app-inactivo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './inactivo.component.html',
  styleUrl: './inactivo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InactivoComponent implements OnInit {
  loginService = inject(LoginService)
  ngOnInit(): void { }


  logOut(){
    this.loginService.logOut();
  }
}
