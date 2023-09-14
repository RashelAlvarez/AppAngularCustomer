import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteService } from './components/clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { FormComponent } from './components/clientes/form/form.component';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {  MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localesES from '@angular/common/locales/es';

registerLocaleData(localesES, 'es');

const routes: Routes=[
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/form', component:FormComponent},
  {path: 'clientes/form/:id', component:FormComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FormComponent,
    ClientesComponent,
    
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,  
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,  
    MatInputModule,  
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(routes),
    
  ],
  providers: [ClienteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
