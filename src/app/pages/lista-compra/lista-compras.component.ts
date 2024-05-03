import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

import { TableModule } from 'primeng/table';
import { Compra, CompraView } from 'src/app/api/compra';
import { CompraService } from 'src/app/service/compra.service';
import { GlobalMessageService } from 'src/app/service/global-message.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TipoCompra } from 'src/app/api/tipo-compra.enum';
import { DropdownModule } from 'primeng/dropdown';
import { PeriodoService } from 'src/app/service/periodo.service';
import { PeriodoView } from 'src/app/api/periodo';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-lista-compras',
  standalone: true,
  templateUrl: './lista-compras.component.html',
  imports: [
    CommonModule,
    TableModule,
    RouterLink,
    ButtonModule,
    ConfirmDialogModule,
    ToolbarModule,
    CurrencyPipe,
    DatePipe,
    DropdownModule,
    FormsModule,
    PanelModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class ListaComprasComponent implements OnInit {

  compras: CompraView[] = [];
  valorTotalCompras: number = 0;
  tipos = [];
  periodos = [];
  periodoSelecionado: PeriodoView | undefined;

  constructor(
    private confirmationService: ConfirmationService,
    private globalMessageService: GlobalMessageService,
    private compraService: CompraService,
    private periodService: PeriodoService,
  ) { }

  ngOnInit(): void {
    this.carregarDadosIniciais();
    this.carregarTipos();
  }

  confirmarDelecao(compra: Compra) {
    this.confirmationService.confirm({
      message: 'Deseja deletar a compra <b>'+compra.description+'</b> ?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      key: 'confirm',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',

      accept: () => {
        this.deletarCompra(compra);
      },
      reject: () => {}
    });
  }

  deletarCompra(compra: Compra) {
    this.compraService.excluir(compra.id).subscribe(() => {
      this.buscarComprasNoPeriodo();
      this.showToastCompraRemovido();
    });
  }

  showToastCompraRemovido() { 
    this.globalMessageService.showSuccess('Sucesso!', 'Compra removido com sucesso!');
  }

  private calcularValorTotal() {
    this.valorTotalCompras = this.compras.reduce((acc, compra) => acc + compra.amount, 0);
  }

  isCompraAvulsa(compra: CompraView): boolean {
    return (compra.subscription || compra.installment) ? false : true;
  }

  private carregarTipos() {
    this.tipos = Object.keys(TipoCompra).map(key => ({ label: TipoCompra[key], value: key }));
  }

  getDescricaoTipoCompra(compra: CompraView): string {
    return this.tipos.find(tipo => tipo.value === compra.type).label;
  }

  private carregarDadosIniciais() {
    this.periodService.buscar().subscribe(periodos => {
      this.periodos = periodos;
      this.periodoSelecionado = periodos[0];
      this.buscarComprasNoPeriodo();
    });
  }

  buscarComprasNoPeriodo() {
    this.compraService.buscarPorPeriodo(this.periodoSelecionado.id).subscribe(compras => {
      this.compras = compras;
      this.calcularValorTotal();
    });
  }
}
