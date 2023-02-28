import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country, CountrySmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com'

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesRegion(region:string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this._baseUrl}/v3.1/region/${region}`);
  }


  getPaisPorCodigo(code: string): Observable<Country | null> {
    
    if(!code){
      return of(null);
    }

    return this.http.get<Country>(`${this._baseUrl}/v2/alpha/${code}`);
  }

  getPaisPorCodigoSmall(code: string): Observable<CountrySmall> {
    
    // if(!code){
    //   return of(null);
    // }

    return this.http.get<CountrySmall>(`${this._baseUrl}/v2/alpha/${code}?fields=name,alpha3Code`);
  }

  getPaisesPorCodigos(borders: string[]): Observable<CountrySmall[]>{
    
    if(!borders) {
      return of( [] );
    }

    const peticiones: Observable<CountrySmall>[] = [];

    borders.forEach(codigo => {
      const request = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( request );
    });

    return combineLatest( peticiones );
  }

}
