import { TemasListaComponent } from './temas-lista.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { TemasComponent } from './crear-temas.component';

@NgModule({
  declarations: [TemasComponent, TemasListaComponent],
  imports: [
    MyDateRangePickerModule,
    NgxPaginationModule,
    FormsModule,
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: TemasListaComponent,
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: TemasComponent,
      },
    ]),
  ],
  exports: [RouterModule]
})
export class TemaModule {}





