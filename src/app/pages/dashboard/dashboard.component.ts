import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CompraView } from "src/app/api/compra";
import { PeriodoView } from "src/app/api/periodo";
import { CompraService } from "src/app/service/compra.service";
import { PeriodoService } from "src/app/service/periodo.service";
import { TipoCompra } from "src/app/api/tipo-compra.enum";
import { ChartModule } from "primeng/chart";
import { RelatorioService } from "src/app/service/relatorio.service";
import { TotalPorPeriodo } from "src/app/api/report";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    ChartModule
  ]
})
export class DashboardComponent implements OnInit {

  periodo: PeriodoView;

  compras: CompraView[] = [];
  valorTotalCompras: number = 0;

  comprasAvulsas: CompraView[] = [];
  valorTotalComprasAvulsas: number = 0;

  comprasParceladas: CompraView[] = [];
  valorTotalComprasParceladas: number = 0;

  comprasRecorrentes: CompraView[] = [];
  valorTotalComprasRecorrentes: number = 0;

  totaisPorPeriodo: TotalPorPeriodo[] = [];
  lineData: any;

  constructor(
    private periodoService: PeriodoService,
    private compraService: CompraService,
    private relatorioService: RelatorioService,
  ) { }

  ngOnInit(): void {
    this.carregarPeriodoAtual();
    this.carregarTotaisPorPeriodo();
  }

  private carregarPeriodoAtual() {
    this.periodoService.buscarPeriodoAtual().subscribe(periodo => {
      this.periodo = periodo;
      this.carregarCompras();
    })
  }

  private carregarCompras() {
    this.compraService.buscarPorPeriodo(this.periodo.id).subscribe(compras => { 
      this.compras = compras;
      
      this.calcularValorTotalDasCompras();

      this.filtrarComprasAvulsas();
      this.filtrarComprasParceladas();
      this.filtrarComprasRecorrentes();
    })
  }

  private carregarTotaisPorPeriodo() {
    this.relatorioService.buscarValorTotalNosUltimosSeisMeses().subscribe(totaisPorPeriodo => {
      this.totaisPorPeriodo = totaisPorPeriodo;
      this.iniciarGraficoTotaisPorPeriodo();
    })
  }

  private calcularValorTotalDasCompras() {
    this.valorTotalCompras = this.compras.reduce((acc, compra) => acc + compra.amount, 0);
  }

  private filtrarComprasAvulsas() {
    this.comprasAvulsas = this.compras.filter(compra => TipoCompra[compra.type] === TipoCompra.SINGLE_PURCHASE);
    this.valorTotalComprasAvulsas = this.comprasAvulsas.reduce((acc, compra) => acc + compra.amount, 0);
  }

  private filtrarComprasParceladas() {
    this.comprasParceladas = this.compras.filter(compra => TipoCompra[compra.type] === TipoCompra.INSTALLMENT);
    this.valorTotalComprasParceladas = this.comprasParceladas.reduce((acc, compra) => acc + compra.amount, 0);
  }

  private filtrarComprasRecorrentes() {
    this.comprasRecorrentes = this.compras.filter(compra => TipoCompra[compra.type]=== TipoCompra.RECURRING_CHARGE);
    this.valorTotalComprasRecorrentes = this.comprasRecorrentes.reduce((acc, compra) => acc + compra.amount, 0);
  }

  private getArrayDeMeseseFromTotaisPorPeriodo(): string[] {
    const meses: string[] = [];

    this.totaisPorPeriodo.map(total => {
      meses.push(this.convertIntToMonth(total.month));
    });

    return meses.reverse();
  }

  private convertIntToMonth(month: number): string {
    switch(month) {
      case 1: return 'Janeiro';
      case 2: return 'Fevereiro';
      case 3: return 'Março';
      case 4: return 'Abril';
      case 5: return 'Maio';
      case 6: return 'Junho';
      case 7: return 'Julho';
      case 8: return 'Agosto';
      case 9: return 'Setembro';
      case 10: return 'Outubro';
      case 11: return 'Novembro';
      case 12: return 'Dezembro';
      default: return '';
    }
  }


  private iniciarGraficoTotaisPorPeriodo() {
    const documentStyle = getComputedStyle(document.documentElement);

    this.lineData = {
      labels: this.getArrayDeMeseseFromTotaisPorPeriodo(),
      datasets: [
          {
              label: 'Valor',
              data: this.totaisPorPeriodo.map(total => total.amount),
              fill: false,
              backgroundColor: documentStyle.getPropertyValue('--primary-500'),
              borderColor: documentStyle.getPropertyValue('--primary-500'),
              tension: .4
          }
      ]
    }
  }
}