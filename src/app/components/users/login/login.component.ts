import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
}) 
export class LoginComponent  implements OnInit {

  form: FormGroup;
  hide = true;
  constructor(private fb: FormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute,){


    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]

    })
  }

  username: FormControl = new FormControl('');
  password: FormControl = new FormControl('');

  
  ngOnInit(): void {
 

  }
  onSubmit():void {
  }
}
