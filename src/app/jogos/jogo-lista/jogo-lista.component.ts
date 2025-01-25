import { Component, OnInit} from '@angular/core';
import { Jogo } from '../../game.model';
import { JogoService } from '../../services/jogo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-jogo-lista',
  templateUrl: './jogo-lista.component.html',
  styleUrls: ['./jogo-lista.component.css'],
  imports: [CommonModule, FormsModule,  MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule, 
    MatDatepickerModule,
    MatCardModule
    ],
})


export class JogoListaComponent implements OnInit {
  jogos: Jogo[] = [];
  jogosFiltrados: Jogo[] = []; // Jogos filtrados
  searchTerm: string = '';
  displayedColumns: string[] = ['capa', 'titulo', 'genero', 'plataforma', 'dataLancamento', 'acoes'];
  exibirFormulario: boolean = false;
  novoJogo:Jogo = {
    id: "0",
    titulo: '',
    genero: '',
    plataforma: '',
    dataLancamento: new Date(),
    capa: ''
  };
  jogoEditando: Jogo | null = null; // Armazena o jogo em edição

  constructor(private jogoService: JogoService) {}

  adicionarOuSalvarJogo(): void {
    if (this.jogoEditando) {
      // Atualiza o jogo existente
      this.jogoService.updateJogo(this.jogoEditando.id, this.novoJogo).subscribe(() => {
        this.carregarJogos();
        this.resetarFormulario();
      });
    } else {
      // Adiciona um novo jogo
      const jogo = { ...this.novoJogo, id: `${Math.floor(Math.random() * 100) + 1}`}; // ID gerado para teste
      this.jogoService.addJogo(jogo).subscribe(() => {
        this.jogos.push(jogo);
        this.jogosFiltrados = [...this.jogos];
        this.resetarFormulario();
      });
    }
  }
  
  editarJogo(jogo: Jogo): void {
    this.jogoEditando = jogo;
    this.novoJogo = { ...jogo }; // Preenche o formulário com os dados do jogo
    this.exibirFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  resetarFormulario(): void {
    this.novoJogo = { id: "0", titulo: '', genero: '', plataforma: '', dataLancamento: new Date(), capa: '' };
    this.jogoEditando = null;
    this.exibirFormulario = false;
  }
  

  ngOnInit(): void {
    this.carregarJogos();
  }

  carregarJogos(): void {
    this.jogoService.getJogos().subscribe((data) => {
      console.log(data);
      this.jogos = data;
      this.jogosFiltrados = data; // Inicialmente, mostrar todos os jogos
    });
  }

  buscarJogos(): void {
    if (this.searchTerm) {
      this.jogosFiltrados = this.jogos.filter(jogo =>
        jogo.titulo.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.jogosFiltrados = [...this.jogos];
    }
  }

  removerJogo(id: string): void {
    this.jogoService.deleteJogo(id).subscribe(() => {
      this.jogos = this.jogos.filter((jogo) => jogo.id !== id);
    });
  }
}
