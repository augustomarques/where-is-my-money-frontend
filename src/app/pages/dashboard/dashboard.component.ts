import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CompraView } from "src/app/api/compra";
import { PeriodoView } from "src/app/api/periodo";
import { CompraService } from "src/app/service/compra.service";
import { PeriodoService } from "src/app/service/periodo.service";
import { TipoCompra } from "src/app/api/tipo-compra.enum";
import { ChartModule } from "primeng/chart";
import { RelatorioService } from "src/app/service/relatorio.service";
import { TotalPorCategoria, TotalPorCategoriaPorPeriodo, TotalPorPeriodo } from "src/app/api/report";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { PanelModule } from "primeng/panel";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    CurrencyPipe,
    ChartModule,
    DropdownModule,
    FormsModule,
    ToolbarModule,
    PanelModule
  ]
})
export class DashboardComponent implements OnInit {

  periodos = [];
  periodoSelecionado: PeriodoView | undefined;

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

  totalPorCategoria: TotalPorCategoria[] = [];
  dataGraficoTotalPorCategoria: any;
  optionsGraficoTotalPorCategoria: any;

  totalPorCategoriaPorPeriodo: TotalPorCategoriaPorPeriodo[] = [];
  dataGraficoTotalPorCategoriaPorPeriodo: any;

  constructor(
    private periodoService: PeriodoService,
    private compraService: CompraService,
    private relatorioService: RelatorioService,
  ) { }

  ngOnInit(): void {
    this.carregarDadosIniciais();
    this.carregarTotaisPorPeriodo();
    this.carregarValorTotalPorCategoriaPorPeriodo();
  }

  filtrar() {
    this.carregarCompras();
    this.carregarTotalPorCategoria();
  }

  private carregarDadosIniciais() {
    this.periodoService.buscar().subscribe(periodos => {
      this.periodos = periodos;
      this.periodoSelecionado = periodos[0];
      this.carregarCompras();
      this.carregarTotalPorCategoria();
    });
  }

  private carregarCompras() {
    this.compraService.buscarPorPeriodo(this.periodoSelecionado.id).subscribe(compras => { 
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

  private carregarTotalPorCategoria() {
    this.relatorioService.buscarValorTotalPorCategoria(this.periodoSelecionado.id).subscribe(totalPorCategoria => {
      this.totalPorCategoria = totalPorCategoria;
      this.iniciarGraficoTotaisPorCategoria();
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

  private carregarValorTotalPorCategoriaPorPeriodo() {
    this.relatorioService.buscarValorTotalPorCategoriaPorPeriodo().subscribe(totalPorCategoriaPorPeriodo => {
      this.totalPorCategoriaPorPeriodo = totalPorCategoriaPorPeriodo;
      this.iniciarGraficoTotalPorCategoriaPorPeriodo();
    });
  }

  private getArrayDeMeseseFromTotaisPorPeriodo(): string[] {
    const meses: string[] = [];

    this.totaisPorPeriodo.map(total => {
      meses.push(this.convertIntToMonth(total.month));
    });

    return meses;
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

  private iniciarGraficoTotalPorCategoriaPorPeriodo() {
    const documentStyle = getComputedStyle(document.documentElement);

    const labels = this.getArrayDeMeseseFromTotaisPorPeriodo();

    const datasets = this.totalPorCategoriaPorPeriodo.map((totalPorCategoria, idx )=> {
      return {
        label: totalPorCategoria.category,
        data: totalPorCategoria.amounts.reverse().map(total => total.amount),
        fill: false,
        borderColor: this.backgroundColor(documentStyle)[idx],
        tension: .4
      }
    });

    this.dataGraficoTotalPorCategoriaPorPeriodo = {
      labels: labels,
      datasets: datasets
    };
  }

  private iniciarGraficoTotaisPorPeriodo() {
    const documentStyle = getComputedStyle(document.documentElement);
    
    this.lineData = {
      labels: this.getArrayDeMeseseFromTotaisPorPeriodo().reverse(),
      datasets: [
          {
              label: 'Valor',
              data: this.totaisPorPeriodo.reverse().map(total => total.amount),
              fill: false,
              backgroundColor: documentStyle.getPropertyValue('--primary-500'),
              borderColor: documentStyle.getPropertyValue('--primary-500'),
              tension: .4
          }
      ]
    }
  }

  private iniciarGraficoTotaisPorCategoria() {
    const labels = [];
    const valores = [];
    
    this.totalPorCategoria.map(total => {
        labels.push(total.category);
        valores.push(total.amount);
    });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataGraficoTotalPorCategoria = {
        labels: labels,
        datasets: [
            {
                data: valores,
                backgroundColor: this.backgroundColor(documentStyle).slice(0, this.totalPorCategoria.length),
                hoverBackgroundColor: this.hoverBackgroundColor(documentStyle).slice(0, this.totalPorCategoria.length),
            }
        ]
    };

    this.optionsGraficoTotalPorCategoria = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
  }

  private backgroundColor(documentStyle: CSSStyleDeclaration): string[] {
    return [
      documentStyle.getPropertyValue('--blue-500'), 
      documentStyle.getPropertyValue('--yellow-500'), 
      documentStyle.getPropertyValue('--green-500'),
      documentStyle.getPropertyValue('--pink-500'),
      documentStyle.getPropertyValue('--indigo-500'),
      documentStyle.getPropertyValue('--teal-500'),
      documentStyle.getPropertyValue('--orange-500'),
      documentStyle.getPropertyValue('--bluegray-500'),
      documentStyle.getPropertyValue('--purple-500'),
      documentStyle.getPropertyValue('--red-500'),
      documentStyle.getPropertyValue('--cyan-500'),
      documentStyle.getPropertyValue('--primary-500'),
    ];
  }

  private hoverBackgroundColor(documentStyle: CSSStyleDeclaration): string[] {
    return [
      documentStyle.getPropertyValue('--blue-400'), 
      documentStyle.getPropertyValue('--yellow-400'), 
      documentStyle.getPropertyValue('--green-400'),
      documentStyle.getPropertyValue('--pink-400'),
      documentStyle.getPropertyValue('--indigo-400'),
      documentStyle.getPropertyValue('--teal-400'),
      documentStyle.getPropertyValue('--orange-400'),
      documentStyle.getPropertyValue('--bluegray-400'),
      documentStyle.getPropertyValue('--purple-400'),
      documentStyle.getPropertyValue('--red-400'),
      documentStyle.getPropertyValue('--cyan-400'),
      documentStyle.getPropertyValue('--primary-400'),
    ];
  }
}