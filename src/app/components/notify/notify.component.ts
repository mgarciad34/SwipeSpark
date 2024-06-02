import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <span id="notificacionBurbuja">
    {{numeroDeNotificaciones}}
  </span>
  `,
  styles: `
    :host {
      display: block;
    }
    #notificacionBurbuja {
      position: absolute;
      top: -5px; /* Ajusta según sea necesario */
      right: -5px; /* Ajusta según sea necesario */
      background-color: red;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
}

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyComponent implements OnInit {
  @Input() numeroDeNotificaciones: number = 0;
  ngOnInit(): void {

   }
}
