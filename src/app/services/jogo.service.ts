import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jogo } from '../game.model';

@Injectable({
  providedIn: 'root',
})
export class JogoService {
  private readonly apiUrl = 'http://localhost:3000/jogos'; // Endpoint do json-server

  constructor(private http: HttpClient) {}

  // Retorna a lista de jogos
  getJogos(): Observable<Jogo[]> {
    return this.http.get<Jogo[]>(this.apiUrl);
  }

  // Buscar jogos pelo título ou outro termo
  getJogosFilter(term: string): Observable<Jogo[]> {
    return this.http.get<Jogo[]>(`${this.apiUrl}?titulo=${term}`);
  }

  // Retorna um jogo específico pelo ID
  getJogoById(id: string): Observable<Jogo> {
    return this.http.get<Jogo>(`${this.apiUrl}/${id}`);
  }

  // Adiciona um novo jogo
  addJogo(jogo: Jogo): Observable<Jogo> {
    return this.http.post<Jogo>(this.apiUrl, jogo);
  }

  // Atualiza um jogo existente
  updateJogo(id: string, jogo: Jogo): Observable<Jogo> {
    return this.http.put<Jogo>(`${this.apiUrl}/${id}`, jogo);
  }

  // Remove um jogo pelo ID
  deleteJogo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}