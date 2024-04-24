import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

import { TableModule } from 'primeng/table';
import { Categoria } from 'src/app/api/categoria';
import { CategoriaService } from 'src/app/service/categoria.service';
import { GlobalMessageService } from 'src/app/service/global-message.service';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  templateUrl: './lista-categorias.component.html',
  imports: [
    TableModule,
    RouterLink,
    ButtonModule,
    ConfirmDialogModule,
    ToolbarModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class ListaCategoriasComponent implements OnInit {

  categorias: Categoria[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private globalMessageService: GlobalMessageService,
    private categoriaService: CategoriaService
    ) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  confirmarDelecao(categoria: Categoria) {
    this.confirmationService.confirm({
      message: 'Deseja deletar o categoria?',
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
        this.deletarCategoria(categoria);
      },
      reject: () => {}
    });
  
  }

  carregarCategorias() {
    this.categoriaService.buscar().subscribe(categorias => { this.categorias = categorias })
  }

  deletarCategoria(categoria: Categoria) {
    this.categoriaService.excluir(categoria.id).subscribe(() => {
      this.carregarCategorias();
      this.showToastCategoriaRemovido();
    });
  }

  showToastCategoriaRemovido() { 
    this.globalMessageService.showSuccess('Sucesso!', 'Categoria removido com sucesso!');
  }
}
