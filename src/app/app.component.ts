import { Component } from '@angular/core';
import { JogoListaComponent } from './jogos/jogo-lista/jogo-lista.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, JogoListaComponent ]
})
export class AppComponent {
  title = 'Pipi Games';
}
