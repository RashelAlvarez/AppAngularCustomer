import { Component } from '@angular/core';
import { AuthService } from '../users/auth.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router:Router) {
    
  }
  logout():void{
    this.authService.logout();
    console.log('cerrado sesion')
    this.router.navigate(['/login']);
  }
}
