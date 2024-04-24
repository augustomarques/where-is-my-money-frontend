import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraRecorrente, CompraRecorrenteView } from '../api/compra-recorrente';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraRecorrenteService {

  private readonly API = environment.apiUrl + '/recurring-charges';

  constructor(private http: HttpClient) {}

  buscar(): Observable<CompraRecorrenteView[]> {
    return this.http.get<CompraRecorrenteView[]>(this.API);
  }

  // buscarPorNome(description: string): Observable<CompraRecorrente[]> {
  //   return this.http.get<CompraRecorrente[]>(`${this.API}?query=${description}`);
  // }

  buscarPorStatus(active: boolean): Observable<CompraRecorrenteView[]> {
    return this.http.get<CompraRecorrenteView[]>(`${this.API}?active=${active}`);
  }

  buscarPorId(id: number): Observable<CompraRecorrenteView> {
    return this.http.get<CompraRecorrenteView>(`${this.API}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  editarOuSalvar(compraRecorrente: CompraRecorrente): Observable<CompraRecorrenteView> {
    if (compraRecorrente.id) {
      return this.editar(compraRecorrente);
    } else {
      return this.salvar(compraRecorrente);
    }
  }

  salvar(compraRecorrente: CompraRecorrente): Observable<CompraRecorrenteView> {
    return this.http.post<CompraRecorrenteView>(this.API, compraRecorrente);
  }

  editar(compraRecorrente: CompraRecorrente): Observable<CompraRecorrenteView> {
    return this.http.put<CompraRecorrenteView>(`${this.API}/${compraRecorrente.id}`, compraRecorrente);
  }
}
