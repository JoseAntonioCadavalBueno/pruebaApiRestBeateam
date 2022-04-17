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
    public estado: Array<String> = [];

    constructor(
      private api: ApiService,
    ) { }
    /*Array de datos */
    public tipos: Array<any> = [];
    public estados: Array<any> = [];
    public data: Tareas[] = [];
    public dataPruebas: Tareas[] = [];

    /*Pagina actual de la paginación */
    public page!: number;

    ngOnInit(){
      this.api.getTareas().subscribe((resp: any) => {
        this.data = resp;
      });
      this.api.getTipos().subscribe((resp: any) => {
        this.tipos = resp;
      });
      this.api.getEstados().subscribe((resp: any) => {
        this.estados = resp;
      });

      this.estado = new Array<String>();
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
        for(const row of resp){
          if(
            row.alias_cliente.toUpperCase().includes(this.cliente.toUpperCase())
            && row.referencia.toUpperCase().includes(this.referencia.toUpperCase())
            && row.usuario.toUpperCase().includes(this.usuario.toUpperCase())
            && row.fecha > fechaInicio
            && row.fecha < fechaFin
            && row.tipo.includes(this.tipo)
          ){
            if(!(this.estado.length==0)){
              for(const rowE of this.estado){
                if(row.estado.includes(rowE)){
                  this.data.push(row);
                };
            };
            }else{
              this.data.push(row);
            }
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
    tipoClear(){
      this.tipo="Todos";
    }; 
    /*Lista de estados seleccionados*/
    getEstadoValue(event: any, estadoChecked: string){
      if(event.target.checked){
        this.estado.push(estadoChecked);
      }else{;
        this.estado = this.estado.filter(x=>x!=estadoChecked);
      }
    }
}
