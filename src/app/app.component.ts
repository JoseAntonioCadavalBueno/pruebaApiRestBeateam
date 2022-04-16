import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/api.service';

import { Tareas } from './interfaces/tareas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'pruebaBeateam';
  
    /*Valores predeterminados del filtro*/
    public cliente="";
    public referencia="";
    public usuario="";
    public fecha: Array<Date> = [new Date('2020-01-01'), new Date()];
    public tipo="";
    public estado ="";
  
    public tipos: Array<any> = [];
    public estados: Array<any> = [];
    public data: Array<Tareas> = [];
    public dataPruebas: Array<Tareas> = [];
  
    public page!: number;
  
  
    constructor(
      private api: ApiService
    ) { }
  
    ngOnInit(){
      this.api.getTareas().subscribe((resp: any) => {
        this.data = resp.data;
      });
      this.api.getTipos().subscribe((resp: any) => {
        this.tipos = resp.data;
      });
      this.api.getEstados().subscribe((resp: any) => {
        this.estados = resp.data;
      });
    }
    /*Función para filtrar los datos de la tabla con los valores del filtro */
    filterPost(){
      this.data.splice(0, this.data.length);
      if(this.tipo=="Todos"){
        this.tipo="";
      };
      const fechaInicio = this.fecha[0].toISOString();
      const fechaFin = this.fecha[1].toISOString();
      this.api.getTareas().subscribe((resp: any) => {
        for(const row of resp.data){
          if(
            row.alias_cliente.toUpperCase().includes(this.cliente.toUpperCase())
            && row.referencia.toUpperCase().includes(this.referencia.toUpperCase())
            && row.usuario.toUpperCase().includes(this.usuario.toUpperCase())
            && row.fecha > fechaInicio
            && row.fecha < fechaFin
            && row.tipo.includes(this.tipo)
            && row.estado.includes(this.estado)
          ){
            this.data.push(row);
          };
        };
      });
      /*Se limpia el campo estado por precaución aunque el filtro ya está aplicado*/
      this.page = 1;
      return this.data;
    };
    /*Funciones asignadas a los botones para borrar el contenido de los campos del filtro exceptuando el campo estado que se borra en filterPost() */
    clienteClear(){
      this.cliente="";
    };
    referenciaClear(){
      this.referencia="";
    };
    usuarioClear(){
      this.usuario="";
    };
    fechaClear(){
      this.fecha = [new Date('2020-01-01'), new Date()];
    };
    tipoClear(){;
      this.tipo="Todos";
    }; 

}
