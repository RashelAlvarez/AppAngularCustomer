import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],

})

export class FormComponent implements OnInit {
 
  private cliente: Cliente = new Cliente();
 
   ids : any;
  constructor(private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute, ) {
   
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.email, Validators.required] ],
      createAt: ['', [Validators.required]]

    })
  
  }



  ngOnInit(): void {
    //llamar al metodo para obtener todos los datos del cliente por id
    this.cargarCliente()

  }

  getDateFormatString(): string {
    return 'DD/MM/YYYY';
  }
  nombre: FormControl = new FormControl('');
  apellido: FormControl = new FormControl('');
  email: FormControl = new FormControl('');
  createAt : FormControl = new FormControl();


  form: FormGroup;


  //cargar cliente y obtener por id
  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
     this.ids = params['id'];
   
      console.log(this.ids);
      if (this.ids) {
        this.clienteService.getCliente(this.ids).subscribe((cliente) => {
          this.cliente = cliente;
          this.form.patchValue({
            nombre: this.cliente.nombre,
            apellido: this.cliente.apellido,
            email: this.cliente.email,
            createAt:this.cliente.createAt

          })
        });


      }
    })
  }
  //crear cliente desde el formulario
  onSubmit():void {
   
    console.log(this.cliente = this.form.value);
    this.clienteService.createCliente(this.cliente)
      .subscribe(json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo cliente', `${json.mensaje} : ${json.cliente.nombre}`, 'success')
      })

    this.form.reset();
  }

  update():void{
    this.ids=this.cliente.id;
    this.cliente = this.form.value;
    console.log("update" + this.ids);
    this.clienteService.update(this.ids,this.cliente)
    .subscribe(json=>{
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente actualizado', ` ${json.mensaje} : ${json.cliente.nombre}`, 'success') //en el servicio el metodo update() debe retornar un tipo de dato any
    }
   /* ,
    err => {
      this.errores=err.error.errors as string[];
      console.log("error desde el form " + err);
      Swal.fire(
        err.error.errors, err.error.errors, 'error'

      );
    }*/
    )
  }
}
