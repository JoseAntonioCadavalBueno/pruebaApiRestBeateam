import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { Tareas } from '../interfaces/tareas';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) {}
  url='https://www.azurglobal.es/intranet/apiTest/';
  /*En estas lineas se genera la fecha actual de forma automatica */
  fechaHoy = new Date().toISOString();
  añoHoy = this.fechaHoy.substring(0,4);
  mesHoy = this.fechaHoy.substring(5,7);
  diaHoy = this.fechaHoy.substring(8,10);
  /*Se construye el string x-auth y se encripta para validar la conexión con el API rest */
  usuario = "JCADAVAL"+this.añoHoy+this.mesHoy+this.diaHoy;
  usuarioEncriptado = CryptoJS.SHA384(this.usuario).toString();
  /*Cabecera de todas las conexiones que se utilizan tal y como se detalla en la documentación */
  getTipos(): Observable<any>{
    let header = new HttpHeaders({
      'funcion':'getTipos',
      'X-Auth': this.usuarioEncriptado
    });
    
    return this.http.get(this.url, {headers: header})
    .pipe(
      map((resp: any) => resp.data)
    );
  };

  getEstados(): Observable<any>{
    let header = new HttpHeaders({
      'funcion':'getEstados',
      'X-Auth': this.usuarioEncriptado
    });
    
    return this.http.get(this.url, {headers: header})
    .pipe(
      map((resp: any) => resp.data)
    );
  };

  getTareas(): Observable<Tareas[]>{
    let header = new HttpHeaders({
      'funcion':'getTareas',
      'X-Auth': this.usuarioEncriptado
    });

    return this.http.get<Tareas[]>(this.url, {headers: header})
    .pipe(
      map((resp: any) => resp.data)
    );
  };
}
