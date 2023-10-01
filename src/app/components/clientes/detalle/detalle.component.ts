import { Component } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@Component({
  selector: 'app-detalle-client',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {
cliente:Cliente;
titulo:string = "Detalle del cliente";
imagenSeleccionada:File;
progreso: number=0;
constructor(private clienteService:ClienteService, private activatedRoute: ActivatedRoute){

}

ngOnInit(){
this.activatedRoute.paramMap.subscribe(params=>{
  let id:number=+params.get('id');
  if (id){
    this.clienteService.getCliente(id).subscribe(cliente =>{
      this.cliente=cliente;
    })
  }
})
}

seleccionarFoto(event){
  this.imagenSeleccionada=event.target.files[0];
  this.progreso=0;
  console.log(this.imagenSeleccionada);
  if (this.imagenSeleccionada.type.indexOf('image')<0) {
    Swal.fire('Error Seleccionar imagen: ', 'El archivo debe ser de tipo imagen!' ,'error')
    this.imagenSeleccionada=null;
  }

}

subirFoto(){
  if(!this.imagenSeleccionada){
    Swal.fire('Error Upload: ', 'Debe seleccionar una foto!' ,'error')
  }else{
  this.clienteService.subirFoto(this.imagenSeleccionada,this.cliente.id)
  .subscribe(event =>{
    if (event.type ===HttpEventType.UploadProgress){
      this.progreso=Math.round((event.loaded/event.total)*100);
    }else if (event.type===HttpEventType.Response){
      let response:any=event.body;
      this.cliente=response.cliente as Cliente;
      Swal.fire('La foto se ha subido correctamente!', `${response.mensaje} `, 'success')
    }
  //  this.cliente=cliente;
   
  })
  }
}
}
