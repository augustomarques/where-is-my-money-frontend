import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../api/categoria';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly API = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  buscar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API);
  }

  buscarPorNome(description: string): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.API}?query=${description}`);
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  editarOuSalvar(categoria: Categoria): Observable<Categoria> {
    if (categoria.id) {
      return this.editar(categoria);
    } else {
      return this.salvar(categoria);
    }
  }

  salvar(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.API, categoria);
  }

  editar(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API}/${categoria.id}`, categoria);
  }
}
