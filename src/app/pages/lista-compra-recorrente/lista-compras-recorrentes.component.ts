import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

import { TableModule } from 'primeng/table';
import { CompraRecorrente, CompraRecorrenteView } from 'src/app/api/compra-recorrente';
import { CompraRecorrenteService } from 'src/app/service/compra-recorrente.service';
import { GlobalMessageService } from 'src/app/service/global-message.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-lista-compraRecorrentes',
  standalone: true,
  templateUrl: './lista-compras-recorrentes.component.html',
  imports: [
    TableModule,
    RouterLink,
    ButtonModule,
    ConfirmDialogModule,
    ToolbarModule,
    CurrencyPipe,
    DatePipe,
    TagModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class ListaComprasRecorrentesComponent implements OnInit {

  comprasRecorrentes: CompraRecorrenteView[] = [];
  valorTotalCompras: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private globalMessageService: GlobalMessageService,
    private compraRecorrenteService: CompraRecorrenteService
  ) { }

  ngOnInit(): void {
    this.carregarCompraRecorrentes();
  }

  confirmarDelecao(compraRecorrente: CompraRecorrente) {
    this.confirmationService.confirm({
      message: 'Deseja deletar a Compra Recorrente <b>'+compraRecorrente.description+'</b>?',
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
        this.deletarCompraRecorrente(compraRecorrente);
      },
      reject: () => {}
    });
  
  }

  carregarCompraRecorrentes() {
    this.compraRecorrenteService.buscar().subscribe(compraRecorrentes => { 
      this.comprasRecorrentes = compraRecorrentes 
      this.calcularValorTotal();
    });
  }

  deletarCompraRecorrente(compraRecorrente: CompraRecorrente) {
    this.compraRecorrenteService.excluir(compraRecorrente.id).subscribe(() => {
      this.carregarCompraRecorrentes();
      this.showToastCompraRecorrenteRemovido();
    });
  }

  showToastCompraRecorrenteRemovido() { 
    this.globalMessageService.showSuccess('Sucesso!', 'Compra Recorrente removida com sucesso!');
  }

  calcularValorTotal() {
    this.valorTotalCompras = this.comprasRecorrentes.reduce((acc, compra) => acc + compra.amount, 0);
  }
}
