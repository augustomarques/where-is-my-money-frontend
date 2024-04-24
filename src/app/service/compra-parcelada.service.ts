import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraParcelada, CompraParceladaView } from '../api/compra-parcelada';
import { environment } from '../../environments/environment';
import { CompraParceladaStatus, getKeyByValue } from '../api/compra-parcelada-status.enum';

@Injectable({
  providedIn: 'root'
})
export class CompraParceladaService {

  private readonly API = environment.apiUrl + '/installments';

  constructor(private http: HttpClient) {}

  buscar(): Observable<CompraParceladaView[]> {
    return this.http.get<CompraParceladaView[]>(this.API);
  }

  buscarPorStatus(status: CompraParceladaStatus): Observable<CompraParceladaView[]> {
    const value = getKeyByValue(status);
    return this.http.get<CompraParceladaView[]>(`${this.API}?status=${value}`);
  }

  // buscarPorNome(description: string): Observable<CompraParcelada[]> {
  //   return this.http.get<CompraParcelada[]>(`${this.API}?query=${description}`);
  // }

  buscarPorId(id: number): Observable<CompraParceladaView> {
    return this.http.get<CompraParceladaView>(`${this.API}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  editarOuSalvar(compraParcelada: CompraParcelada): Observable<CompraParceladaView> {
    if (compraParcelada.id) {
      return this.editar(compraParcelada);
    } else {
      return this.salvar(compraParcelada);
    }
  }

  salvar(compraParcelada: CompraParcelada): Observable<CompraParceladaView> {
    return this.http.post<CompraParceladaView>(this.API, compraParcelada);
  }

  editar(compraParcelada: CompraParcelada): Observable<CompraParceladaView> {
    return this.http.put<CompraParceladaView>(`${this.API}/${compraParcelada.id}`, compraParcelada);
  }
}
