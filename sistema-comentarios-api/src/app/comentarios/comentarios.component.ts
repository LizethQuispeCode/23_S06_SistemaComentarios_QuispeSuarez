import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Comentario } from '../services/api.service';

interface ComentarioConFecha extends Comentario {
  fecha?: string;
}

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit {
  // Lista de comentarios obtenidos desde la API
  comentarios: ComentarioConFecha[] = [];
  
  // Formulario reactivo
  formulario: FormGroup;
  
  // Bandera para mostrar/ocultar mensajes
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;
  
  // Contador de comentarios
  contadorComentarios: number = 0;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    // Crear el formulario con validaciones
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      comentario: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Cargar comentarios al inicializar el componente
    this.cargarComentarios();
  }

  /**
   * Obtiene los comentarios desde la API
   */
  cargarComentarios(): void {
    this.cargando = true;
    this.apiService.obtenerComentarios().subscribe({
      next: (datos) => {
        // Limitar a los primeros 10 comentarios para mejor visualización
        this.comentarios = datos.slice(0, 10);
        this.contadorComentarios = this.comentarios.length;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
        this.mensajeError = 'Error al cargar los comentarios';
        this.cargando = false;
      }
    });
  }

  /**
   * Envía un nuevo comentario
   */
  enviarComentario(): void {
    // Validar que el formulario sea válido
    if (this.formulario.invalid) {
      this.mensajeError = 'Por favor completa todos los campos correctamente';
      return;
    }

    const nuevoComentario: Comentario = {
      name: this.formulario.value.nombre,
      email: this.formulario.value.email,
      body: this.formulario.value.comentario,
      postId: 1
    };

    this.cargando = true;
    this.apiService.crearComentario(nuevoComentario).subscribe({
      next: (respuesta) => {
        // Agregar el comentario a la lista con fecha actual
        const comentarioConFecha: ComentarioConFecha = {
          ...respuesta,
          fecha: new Date().toLocaleDateString('es-ES')
        };
        this.comentarios.unshift(comentarioConFecha);
        this.contadorComentarios = this.comentarios.length;
        
        // Mostrar mensaje de éxito
        this.mensajeExito = '¡Comentario enviado exitosamente!';
        this.mensajeError = '';
        
        // Limpiar el formulario
        this.formulario.reset();
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          this.mensajeExito = '';
        }, 3000);
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al enviar comentario:', error);
        this.mensajeError = 'Error al enviar el comentario';
        this.mensajeExito = '';
        this.cargando = false;
      }
    });
  }

  /**
   * Acceso a los controles del formulario desde el template
   */
  get nombre() {
    return this.formulario.get('nombre');
  }

  get email() {
    return this.formulario.get('email');
  }

  get comentario() {
    return this.formulario.get('comentario');
  }
}
