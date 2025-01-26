import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Jogo } from '../../game.model';
import { JogoService } from '../../services/jogo.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-jogo-lista',
  templateUrl: './jogo-lista.component.html',
  styleUrls: ['./jogo-lista.component.css'],
  imports: [
    CommonModule, 
    FormsModule,  
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule, 
    MatDatepickerModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
    ],
  providers: [DatePipe]
})


export class JogoListaComponent implements OnInit, AfterViewInit {
  jogos: Jogo[] = [];
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
  jogoEditando: Jogo | null = null; 
  dataSource = new MatTableDataSource<Jogo>();
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  private ultimoId: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private jogoService: JogoService,  private snackBar: MatSnackBar, private dialog: MatDialog, private datePipe: DatePipe ) {}

  adicionarOuSalvarJogo(): void {

    if (
      !this.novoJogo.titulo?.trim() ||
      !this.novoJogo.genero?.trim() ||
      !this.novoJogo.plataforma?.trim() ||
      !this.novoJogo.dataLancamento ||
      !this.novoJogo.capa?.trim()
    ) {
      this.mostrarErro('Preencha todos os campos!');
      return;
    }
  
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(this.novoJogo.capa)) {
      this.mostrarErro('A URL da capa deve ser válida (começar com http:// ou https://)');
      return;
    }

    if (this.novoJogo.dataLancamento > new Date()) {
      this.mostrarErro('A data de lançamento não pode ser futura!');
      return;
    }

    if (this.jogoEditando) {
      this.jogoService.updateJogo(this.jogoEditando.id, this.novoJogo).subscribe(() => {
        this.carregarJogos();
        this.resetarFormulario();
        this.dataSource.data = [...this.dataSource.data];
        this.mostrarSucesso('Jogo atualizado com sucesso!');
      });
    } else {
      const novoId = this.obterProximoId().toString();
      const jogo = { ...this.novoJogo, id: novoId}; // ID gerado para teste
      this.jogoService.addJogo(jogo).subscribe(() => {
        this.resetarFormulario();
        this.jogos.push(jogo); // Atualiza a lista original
        this.dataSource.data = this.jogos; // Atualiza a tabela
        this.mostrarSucesso('Jogo adicionado com sucesso!');
      });
    }
  }

  private obterProximoId(): number {
    // Encontra o maior ID atual
    const maiorId = this.jogos.reduce((max, jogo) => {
      const idNumerico = Number(jogo.id);
      return idNumerico > max ? idNumerico : max;
    }, 0);

    return maiorId + 1;
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

  resetarPesquisa(): void {
    this.searchTerm = '';
    this.buscarJogos();
  }

  mostrarOuCancelarFormulario(): void {
    this.exibirFormulario = !this.exibirFormulario;
    this.novoJogo = { id: "0", titulo: '', genero: '', plataforma: '', dataLancamento: new Date(), capa: '' };
    this.jogoEditando = null;
  }

  ngOnInit(): void {
    this.carregarJogos();
    this.dataSource.filterPredicate = (data: Jogo, filter: string) => {
      const dataFormatada = this.datePipe.transform(data.dataLancamento, 'dd/MM/yyyy') || '';
      return data.titulo.toLowerCase().includes(filter) ||
             data.genero.toLowerCase().includes(filter) ||
             data.plataforma.toLowerCase().includes(filter) ||
             dataFormatada.includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: Jogo, property: string): string | number => {
      switch(property) {
        case 'dataLancamento':
          // Converte a data para timestamp numérico
          return new Date(item.dataLancamento).getTime();
        
        case 'titulo':
          // Padroniza para ordenação case-insensitive
          return item.titulo.toLowerCase();
        
        default:
          // Garante retorno de string ou number para outras propriedades
          return item[property as keyof Jogo] as string | number;
      }
    };
  }

  carregarJogos(): void {
    this.jogoService.getJogos().subscribe((data) => {
      this.jogos = data; // Mantém a lista completa
      this.dataSource.data = data; // Atualiza a fonte da tabela
    });
  }

  // Adicione o manipulador de eventos de paginação
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  buscarJogos(): void {
    const termo = this.searchTerm.trim().toLowerCase();
  
    // Reset para lista completa quando o campo estiver vazio
    if (!termo) {
      this.dataSource.filter = '';
      this.dataSource.data = [...this.jogos];
      return;
    }
  
    this.dataSource.filter = termo;
  }

  trackById(index: number, jogo: Jogo): string {
    return jogo.id;
  }

  removerJogo(jogo: Jogo): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Tem certeza que deseja excluir ${jogo.titulo} permanentemente?`
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.jogoService.deleteJogo(jogo.id).subscribe({
          next: () => {
            this.carregarJogos();
            this.mostrarSucesso('Jogo excluído com sucesso!');
          },
          error: (err) => this.mostrarErro(`Falha na exclusão: ${err.message}`)
        });
      }
    });
  }

  private mostrarErro(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      panelClass: ['erro-snackbar'],
      verticalPosition: 'top'
    });
  }

  private mostrarSucesso(mensagem: string): void {
    this.snackBar.open(mensagem, 'OK', {
      duration: 3000,
      panelClass: ['sucesso-snackbar'],
      verticalPosition: 'top'
    });
  }
}
