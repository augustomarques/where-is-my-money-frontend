import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

import { TableModule } from 'primeng/table';
import { CompraParcelada, CompraParceladaView } from 'src/app/api/compra-parcelada';
import { CompraParceladaService } from 'src/app/service/compra-parcelada.service';
import { GlobalMessageService } from 'src/app/service/global-message.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CompraParceladaStatus } from 'src/app/api/compra-parcelada-status.enum';

@Component({
  selector: 'app-lista-compras-parceladas',
  standalone: true,
  templateUrl: './lista-compras-parceladas.component.html',
  imports: [
    TableModule,
    RouterLink,
    ButtonModule,
    ConfirmDialogModule,
    ToolbarModule,
    CurrencyPipe,
    DatePipe,
  ],
  providers: [
    ConfirmationService
  ]
})
export class ListaComprasParceladasComponent implements OnInit {

  comprasParceladas: CompraParceladaView[] = [];
  status = [];
  valorTotalCompras: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private globalMessageService: GlobalMessageService,
    private compraParceladaService: CompraParceladaService
  ) { }

  ngOnInit(): void {
    this.carregarCompraParceladas();
    this.carregarStatus();
  }

  confirmarDelecao(compraParcelada: CompraParceladaView) {
    this.confirmationService.confirm({
      message: 'Deseja deletar a Compra Parcelada <b>' + compraParcelada.description + '</b> ?',
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
        this.deletarCompraParcelada(compraParcelada);
      },
      reject: () => {}
    });
  }

  carregarCompraParceladas() {
    this.compraParceladaService.buscar().subscribe(compraParceladas => { 
      this.comprasParceladas = compraParceladas;
      this.calcularValorTotal();
    });
  }

  deletarCompraParcelada(compraParcelada: CompraParceladaView) {
    this.compraParceladaService.excluir(compraParcelada.id).subscribe(() => {
      this.carregarCompraParceladas();
      this.showToastCompraParceladaRemovido();
    });
  }

  private showToastCompraParceladaRemovido() { 
    this.globalMessageService.showSuccess('Sucesso!', 'Compra Parcelada removida com sucesso!');
  }

  private carregarStatus() {
    this.status = Object.keys(CompraParceladaStatus).map(key => ({ label: CompraParceladaStatus[key], value: key }));
  }

  getDescricaoCompraParceladaStatus(compraParcelada: CompraParceladaView): string {
    return this.status.find(tipo => tipo.value === compraParcelada.status).label;
  }

  calcularValorTotal() {
    this.valorTotalCompras = this.comprasParceladas.reduce((acc, compra) => acc + compra.amount, 0);
  }
}
