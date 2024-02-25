import { Component, OnInit ,ViewChild} from '@angular/core';
import { Cliente } from './cliente';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { ClienteService } from './cliente.service';
import { RouterModule } from '@angular/router'; //importar routerModule para poder usar routerLink en la plantilla
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { AuthService } from '../users/auth.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],

})
export class ClientesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'email', 'createAt', 'foto','acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource=new MatTableDataSource<any>;
  
  constructor(private clienteService: ClienteService,
    private activatedRoute :ActivatedRoute,
    public authService: AuthService) { }

  clientes: Cliente[];
   paginador:any;

  ngOnInit(): void {
    this.getAll();

    if (!this.authService.hasRole("ROLE_ADMIN")) {
      this.displayedColumns.splice(6,1);
      this.displayedColumns.splice(5,1);
      this.displayedColumns.splice(0,1);
    }
  }

  
   
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAll() {
    this.activatedRoute.paramMap.subscribe(params=>{
    let page:number = +params.get('page'); //convierte de string a number
    if (!page){
      page=0;
    }
    this.clienteService.getClientes(page).subscribe(response => {
      if (response.length>0) {
      this.dataSource.data=response
      }
      console.log(   response)
    });
  }
  )
  }



  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes;
            this.getAll();
            Swal.fire(
              'Eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito.`,
              'success'
            )
          }
        )

      }

    })
  }


//metodo para validar que existen registros en el listado de clientes
  hayRegistros(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }
}



