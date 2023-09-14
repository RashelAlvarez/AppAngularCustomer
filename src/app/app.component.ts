import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'clientes-app';
  isDarkThemeActive=false;

  onChange(newValue: boolean):void{
    console.log(newValue);
  }
}
