import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ComentariosComponent } from './comentarios/comentarios.component';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, ComentariosComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
