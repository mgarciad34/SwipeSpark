import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-activo',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <span id="activoBurbuja">
  
  </span>
  `,
  styles: `
    :host {
      display: block;
    }

    #activoBurbuja {
      position: absolute;
      top: -5px; /* Ajusta según sea necesario */
      right: -5px; /* Ajusta según sea necesario */
      background-color: green;
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
export class ActivoComponent { }
