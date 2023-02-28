import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';
import { Country, CountrySmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
 
  miFormulario: FormGroup = this.fb.group({
    region:   ['', [Validators.required]],
    pais:     ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  })

  regiones: string[] = [];
  paises: Country[] = [];
  // fronteras: string[] = []
  fronteras: CountrySmall[] = [];

  cargando: boolean = false;

  ngOnInit(): void {
    this.regiones = this.ps.regiones;
    
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        switchMap( region => this.ps.getPaisesRegion( region ) ),
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
          // this.miFormulario.get('frontera')?.disable();
        })
      )
      .subscribe( paises => {
        console.log(paises);
        this.paises = paises
        this.cargando = false;
      })

      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          switchMap( code => this.ps.getPaisPorCodigo(code)),
          switchMap( pais => this.ps.getPaisesPorCodigos(pais?.borders!)),
          tap( (_) => {
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
            // this.miFormulario.get('frontera')?.enable();
          })
        )
        .subscribe( (paises) => {
          console.log(paises);
          this.fronteras = paises;
          // this.fronteras = pais?.borders || [];
          this.cargando = false;
        })
  }

  constructor(private fb: FormBuilder, private ps: PaisesService) {}

  guardar() {
    console.log(this.miFormulario.value);
  }
}
