import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TallerListaComponent } from './taller-lista.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {CrearTallerComponent} from './crear-taller.component';
import { SharedModule } from '../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { SharedService } from '../shared/shared.service';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { RbTimepickerModule } from 'rb-material-timepicker';

@NgModule({
  imports: [
    CommonModule,
    MyDateRangePickerModule,
    RbTimepickerModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    NgxMyDatePickerModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: TallerListaComponent,
        pathMatch: 'full',
      },
      {
        path: ':id',
        component: CrearTallerComponent,
      },
    ]),
  ],
  declarations: [TallerListaComponent, CrearTallerComponent],
  providers: [SharedService],
  exports: [RouterModule],
})
export class TallerModule {}
