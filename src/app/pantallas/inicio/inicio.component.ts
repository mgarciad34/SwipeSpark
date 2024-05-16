import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { LoginService } from '../../servicios/login.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent implements OnInit {
  loginService = inject(LoginService)
  router = inject(Router)
  user = signal({})
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if(user){
      this.loginService.getUser(user.id).subscribe((res: any) => {
        this.user.set(res.body)
      })
    }
   }

   logOut(): void{
      this.router.navigate(['/login'])
      this.loginService.logOut()
    }

}
