import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra, CompraView } from '../api/compra';
import { environment } from '../../environments/environment';
import { TipoCompra } from '../api/tipo-compra.enum';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private readonly API = environment.apiUrl + '/expenses';

  constructor(private http: HttpClient) {}

  buscar(): Observable<CompraView[]> {
    return this.http.get<CompraView[]>(this.API);
  }

  buscarPorPeriodo(periodId: number): Observable<CompraView[]> {
    return this.http.get<CompraView[]>(`${this.API}?periodId=${periodId}`);
  }

  buscarPorPeriodoETipo(periodId: number, tipo: TipoCompra): Observable<CompraView[]> {
    return this.http.get<CompraView[]>(`${this.API}?periodId=${periodId}&type=${tipo}`);
  }

  buscarPorId(id: number): Observable<CompraView> {
    return this.http.get<CompraView>(`${this.API}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  editarOuSalvar(compra: Compra): Observable<CompraView> {
    if (compra.id) {
      return this.editar(compra);
    } else {
      return this.salvar(compra);
    }
  }

  salvar(compra: Compra): Observable<CompraView> {
    return this.http.post<CompraView>(this.API, compra);
  }

  editar(compra: Compra): Observable<CompraView> {
    return this.http.put<CompraView>(`${this.API}/${compra.id}`, compra);
  }
}
