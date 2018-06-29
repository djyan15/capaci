import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesComponent } from './solicitudes.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SolicitudesComponent,
        pathMatch: 'full',
      }
    ]),
  ],
  declarations: [SolicitudesComponent],
  exports:[RouterModule]
})
export class SolicitudModule { }
