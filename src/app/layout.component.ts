import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TallerService } from './talleres/taller.service';
import { TemasService } from './temas/temas.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: []
})
export class LayoutComponent implements OnInit {

  constructor(private router: Router, 
              public tallerService: TallerService,
              public temasService: TemasService) { }

  ngOnInit() {
    //Borra los queryParams si se da refresh al browser.
    if(window.location.href.indexOf('?') > 0){
      let url = window.location.href.split("?")[0];
      url = url.split("#")[1];
      this.router.navigateByUrl(url);
    }    
  }
}
