import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TotalPorPeriodo } from "../api/report";

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  private readonly API = environment.apiUrl + '/reports';

  constructor(private http: HttpClient) {}

  buscarValorTotalNosUltimosSeisMeses(): Observable<TotalPorPeriodo[]> {
    return this.http.get<TotalPorPeriodo[]>(`${this.API}/total-amount-from-last-six-months`);
  }
}