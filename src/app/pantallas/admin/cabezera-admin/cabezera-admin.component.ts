import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabezera-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cabezera-admin.component.html',
  styleUrl: './cabezera-admin.component.css'
})
export class CabezeraAdminComponent {
  currentSubMenu: string | null = null;

  constructor(private router: Router) {}

  showSubmenu(submenuName: string, defaultShow?: boolean): void {
    this.currentSubMenu = submenuName;
    if (defaultShow!== undefined && defaultShow) {
      console.log(`Mostrando submenu ${submenuName} por defecto`);
    }
  }

  hideSubmenu(): void {
    this.currentSubMenu = null;
  }

  cerrarAplicacion() {
    this.router.navigate(['/login']);
  }
}
