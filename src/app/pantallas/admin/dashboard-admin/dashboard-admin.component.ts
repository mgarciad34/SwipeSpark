import { PieAdminComponent } from './../pie-admin/pie-admin.component';
import { CabezeraAdminComponent } from './../cabezera-admin/cabezera-admin.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [PieAdminComponent, CabezeraAdminComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

}
