import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SwipeSpark';
  alert = signal('')
  message = signal('')

  changeModal(alert: string, message: string){
    this.alert.set(alert)
    this.message.set(message)
    setTimeout(() =>{
      this.alert.set('')
      this.message.set('')
    }, 3000);
  }


}
