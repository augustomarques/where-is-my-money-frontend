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
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TipoCompra } from 'src/app/api/tipo-compra.enum';

@Component({
  selector: 'app-lista-compras',
  standalone: true,
  templateUrl: './lista-compras.component.html',
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
export class ListaComprasComponent implements OnInit {

  compras: CompraView[] = [];
  valorTotalCompras: number = 0;
  tipos = [];

  constructor(
    private confirmationService: ConfirmationService,
    private globalMessageService: GlobalMessageService,
    private compraService: CompraService
  ) { }

  ngOnInit(): void {
    this.carregarCompras();
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

  carregarCompras() {
    this.compraService.buscar().subscribe(compras => { 
      this.compras = compras;
      this.calcularValorTotal();
    })
  }

  deletarCompra(compra: Compra) {
    this.compraService.excluir(compra.id).subscribe(() => {
      this.carregarCompras();
      this.showToastCompraRemovido();
    });
  }

  showToastCompraRemovido() { 
    this.globalMessageService.showSuccess('Sucesso!', 'Compra removido com sucesso!');
  }

  calcularValorTotal() {
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
}
