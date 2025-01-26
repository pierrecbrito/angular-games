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

  getJogos(): Observable<Jogo[]> {
    return this.http.get<Jogo[]>(this.apiUrl);
  }

  getJogosFilter(term: string): Observable<Jogo[]> {
    return this.http.get<Jogo[]>(`${this.apiUrl}?titulo=${term}`);
  }

  getJogoById(id: string): Observable<Jogo> {
    return this.http.get<Jogo>(`${this.apiUrl}/${id}`);
  }

  addJogo(jogo: Jogo): Observable<Jogo> {
    return this.http.post<Jogo>(this.apiUrl, jogo);
  }

  updateJogo(id: string, jogo: Jogo): Observable<Jogo> {
    return this.http.put<Jogo>(`${this.apiUrl}/${id}`, jogo);
  }

  deleteJogo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}