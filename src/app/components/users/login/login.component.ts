import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
}) 
export class LoginComponent  implements OnInit {

  form: FormGroup;
  hide = true;
  
  private user: User = new User();
  constructor(private fb: FormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute,private authService:AuthService){


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
  login():void{
    console.log(this.user = this.form.value);
    this.authService.login(this.user).subscribe(response =>{
      let objeto=JSON.parse(atob(response.access_token.split(".")[1]));
      console.log(objeto);
      this.router.navigate(['/clientes']);
    })
  }
}
