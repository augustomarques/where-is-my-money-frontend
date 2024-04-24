import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { PeriodoView } from "../api/periodo";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  private readonly API = environment.apiUrl + '/periods';

  constructor(private http: HttpClient) {}

  buscarPeriodoAtual(): Observable<PeriodoView> {
    return this.http.get<PeriodoView>(`${this.API}/current`);
  }

  buscar(): Observable<PeriodoView[]> {
    return this.http.get<PeriodoView[]>(this.API);
  }
}