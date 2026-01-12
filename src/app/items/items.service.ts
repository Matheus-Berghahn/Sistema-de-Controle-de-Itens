import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = 'https://api-sistema-de-controle-de-itens.onrender.com/itens';


  constructor(private http: HttpClient) {
    console.log('✅ ItemsService iniciado. API URL:', this.apiUrl);
  }

  getItems(): Observable<Item[]> {
    console.log('📡 Fazendo GET para:', this.apiUrl);
    
    return this.http.get<Item[]>(this.apiUrl).pipe(
      tap(data => {
        console.log('✅ Dados recebidos:', data);
      }),
      catchError(error => {
        console.error('❌ ERRO na requisição GET:', error);
        console.log('⚠️ Retornando array vazio para teste');
        return of([]);
      })
    );
  }

  getItem(id: number): Observable<Item> {
    console.log('📡 Fazendo GET para item:', id);
    return this.http.get<Item>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('❌ ERRO ao buscar item:', error);
        throw error;
      })
    );
  }

  createItem(item: Item): Observable<Item> {
    console.log('📡 Fazendo POST com item:', item);
    return this.http.post<Item>(this.apiUrl, item).pipe(
      catchError(error => {
        console.error('❌ ERRO ao criar item:', error);
        throw error;
      })
    );
  }

  updateItem(id: number, item: Item): Observable<Item> {
    console.log('📡 Fazendo PUT para item:', id);
    return this.http.put<Item>(`${this.apiUrl}/${id}`, item).pipe(
      catchError(error => {
        console.error('❌ ERRO ao atualizar item:', error);
        throw error;
      })
    );
  }

  deleteItem(id: number): Observable<void> {
    console.log('📡 Fazendo DELETE para item:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('❌ ERRO ao excluir item:', error);
        throw error;
      })
    );
  }
}