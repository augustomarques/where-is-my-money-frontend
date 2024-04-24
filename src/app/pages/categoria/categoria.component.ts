import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';

import { CategoriaService } from 'src/app/service/categoria.service';
import { MensagemErroInputComponent } from 'src/app/components/mensagem-erro-input/mensagem-erro-input.component';
import { GlobalMessageService } from 'src/app/service/global-message.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    CommonModule,
		FormsModule,
		InputTextModule,
    InputMaskModule,
    ReactiveFormsModule,
    ButtonModule,
    MensagemErroInputComponent
  ],
  templateUrl: './categoria.component.html',
})
export class CategoriaComponent implements OnInit {
  
  categoriaForm!: FormGroup;
  isEdicao: boolean = false;

  constructor(
    private router: Router,
    private globalMessageService: GlobalMessageService,
    private categoriaService: CategoriaService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarCategoria();
  }

  inicializarFormulario() {
    this.categoriaForm = new FormGroup({
      description: new FormControl('', Validators.required),
    });
  }

  obterControle(nome: string): FormControl {
    const control = this.categoriaForm.get(nome);
    if(!control) {
      throw new Error(`Controle ${nome} não encontrado`);
    }
    return control as FormControl;
  }

  carregarCategoria() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      this.categoriaService.buscarPorId(Number(id)).subscribe(categoria => {
        this.categoriaForm.patchValue(categoria);
      });
      this.isEdicao = true;
    }
  }

  salvarCategoria() {
    const novoCategoria = this.categoriaForm.value;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    novoCategoria.id = id ? Number(id) : null;

    this.categoriaService.editarOuSalvar(novoCategoria).subscribe(() => {
      this.categoriaForm.reset();
      this.router.navigateByUrl('/lista-categorias');
      if(novoCategoria.id) {
        this.globalMessageService.showSuccess('Sucesso!', 'Categoria alterado com sucesso!');
      } else {
        this.globalMessageService.showSuccess('Sucesso!', 'Categoria cadastrado com sucesso!');
      }
    });
  }

  cancelar() {
    this.categoriaForm.reset();
    this.router.navigateByUrl('/lista-categorias');
  }
}
