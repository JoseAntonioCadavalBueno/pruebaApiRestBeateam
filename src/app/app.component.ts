import { Component } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'pruebaBeateam';
  /*Arrays para datos y paginación */
  public tipos: Array<any> = []
  public estados: Array<any> = []
  public data: Array<any> = [];
  public page!: number;
  public resultData:any[] = [];

  /*Valores predeterminados del filtro*/
  cliente="";
  referencia="";
  usuario="";
  fecha: Array<Date> = [new Date('2020-01-01'), new Date()];
  tipo="";
  estado ="";
  /*Constructor para inyectar los datos API REST*/
  constructor(
    private api: ApiService,
  ) {
    this.api.getTareas().subscribe((resp: any) => {
      this.data = resp.data;
    /*Este for se ejecuta para mostrar siempre los datos en la tabla aunque el filtro esté vacío*/   
      for(const row of this.data){
        this.resultData.push(row);
      };
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
    this.resultData.splice(0, this.resultData.length);
    if(this.tipo=="Todos"){
      this.tipo="";
    };
    const fechaInicio = this.fecha[0].toISOString()
    const fechaFin = this.fecha[1].toISOString()
    for(const row of this.data){
      /*Condicional donde se filtra finalmente los datos*/
      if(
        row.alias_cliente.toUpperCase().includes(this.cliente.toUpperCase())
        && row.referencia.toUpperCase().includes(this.referencia.toUpperCase())
        && row.usuario.toUpperCase().includes(this.usuario.toUpperCase())
        && row.fecha > fechaInicio
        && row.fecha < fechaFin
        && row.tipo.includes(this.tipo)
        && row.estado.includes(this.estado)
        ){
        this.resultData.push(row);
      };
    };
    /*Se limpia el campo estado por precaución aunque el filtro ya está aplicado*/
    this.estado="";
    return this.resultData;
  }
  /*Funciones asignadas a los botones para borrar el contenido de los campos del filtro exceptuando el campo estado que se borra en filterPost() */
  clienteClear(){
    this.cliente="";
  }
  referenciaClear(){
    this.referencia="";
  }
  usuarioClear(){
    this.usuario="";
  }
  fechaClear(){
    this.fecha = [new Date('2020-01-01'), new Date()];
  }
  tipoClear(){;
    this.tipo="Todos";
  }

}
