import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LayoutComponent } from './layout.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TallerService } from './talleres/taller.service';
import { TemasService } from './temas/temas.service';
import { HttpClientModule } from '@angular/common/http';
import { ValidationService } from './validation.service';
import { RbTimepickerModule } from 'rb-material-timepicker';

@NgModule({
  declarations: [AppComponent, LayoutComponent, HomeComponent],
  imports: [
    HttpClientModule,
    RbTimepickerModule,
    NgSelectModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          component: LayoutComponent,
          children: [
            {
              path: 'home',
              component: HomeComponent,
            },
            {
              path: 'talleres',
              loadChildren: 'app/talleres/taller.module#TallerModule',
            },
            {
              path: 'temas',
              loadChildren: 'app/temas/tema.module#TemaModule',
            },
            {
              path: 'solicitudes',
              loadChildren: 'app/solicitudes/solicitud.module#SolicitudModule',
            },
          ],
        },
        {
          path: '**',
          redirectTo: '',
          pathMatch: 'full',
        },
    ], {useHash: true, initialNavigation: 'enabled'})
  ],
  providers: [
    TallerService, TemasService, ValidationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
