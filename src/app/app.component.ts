import { Component } from '@angular/core';
import { JogoListaComponent } from './jogos/jogo-lista/jogo-lista.component';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, JogoListaComponent, MatSnackBarModule, MatDialogModule, MatIconModule, MatButtonModule]
})
export class AppComponent {
  title = 'Pipi Games';
}
