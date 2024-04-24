import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AutoCompleteCompleteEvent, AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { Categoria } from "src/app/api/categoria";
import { CompraParcelada } from "src/app/api/compra-parcelada";
import { PaymentMethod } from "src/app/api/payment-method.enum";
import { StoreType } from "src/app/api/store-type.enum";
import { MensagemErroInputComponent } from "src/app/components/mensagem-erro-input/mensagem-erro-input.component";
import { CategoriaService } from "src/app/service/categoria.service";
import { CompraParceladaService } from "src/app/service/compra-parcelada.service";
import { GlobalMessageService } from "src/app/service/global-message.service";

@Component({
  selector: 'app-compra-parcelada',
  templateUrl: './compra-parcelada.component.html',
  standalone: true,
  imports: [
    CommonModule,
		FormsModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    ButtonModule,
    MensagemErroInputComponent,
    CalendarModule,
    ConfirmDialogModule,
    RouterLink,
    AutoCompleteModule,
    TabViewModule,
    DropdownModule
  ]
})
export class CompraParceladaComponent implements OnInit {

  compraParceladaForm!: FormGroup;
  isEdicao: boolean = false;
  compraParceladaId: number = 0;
  compraParcelada: CompraParcelada = {} as CompraParcelada;

  categoriasFiltrados: Categoria[] = [];
  categoriaSelecionada: Categoria = {} as Categoria;

  storeTypes = [];
  paymentMethods = [];

  constructor(
    private router: Router,
    private globalMessageService: GlobalMessageService,
    private activatedRoute: ActivatedRoute,
    private compraParceladaService: CompraParceladaService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarCompraParcelada();
    this.carregarStoreTypes();
    this.carregarPaymentMethods();
  }

  obterControle(nome: string): FormControl {
    const control = this.compraParceladaForm.get(nome);
    if(!control) {
      throw new Error(`Controle ${nome} não encontrado`);
    }
    return control as FormControl;
  }

  private inicializarFormulario() {
    this.compraParceladaForm = new FormGroup({
      description: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      installments: new FormControl(1, Validators.required),
      boughtAt: new FormControl<Date | string>(new Date(), Validators.required),
      storeType: new FormControl('', Validators.required),
      paymentMethod: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
  }
  
  private carregarStoreTypes() {
    this.storeTypes = Object.keys(StoreType).map(key => ({ label: StoreType[key], value: key }));
  }

  private carregarPaymentMethods() {
    this.paymentMethods = Object.keys(PaymentMethod).map(key => ({ label: PaymentMethod[key], value: key }));
  }

  carregarCompraParcelada() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      this.compraParceladaService.buscarPorId(Number(id)).subscribe(compraParcelada => {
        this.compraParceladaForm.patchValue(compraParcelada);
        this.compraParceladaForm.controls["boughtAt"].patchValue(new Date(compraParcelada.boughtAt));
      });
      this.compraParceladaId = Number(id);
      this.isEdicao = true;
    }
  }

  cancelar() {
    this.compraParceladaForm.reset();
    this.router.navigateByUrl('/lista-compras-parceladas');
  }

  salvar() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    const compraParcelada: CompraParcelada = {
      id: id ? Number(id) : null,
      description: this.compraParceladaForm.value.description,
      amount: this.compraParceladaForm.value.amount,
      installments: this.compraParceladaForm.value.installments,
      boughtAt: this.compraParceladaForm.value.boughtAt,
      storeType: this.compraParceladaForm.value.storeType,
      paymentMethod: this.compraParceladaForm.value.paymentMethod,
      categoryId: this.compraParceladaForm.value.category.id
    }

    this.compraParceladaService.editarOuSalvar(compraParcelada).subscribe(() => {
      
      this.compraParceladaForm.reset();
      this.router.navigateByUrl('/lista-compras-parceladas');
      
      if(compraParcelada.id) {
        this.globalMessageService.showSuccess('Sucesso!', 'Compra parcelada alterada com sucesso!');
      } else {
        this.globalMessageService.showSuccess('Sucesso!', 'Compra parcelada cadastrada com sucesso!');
      }
    });
  }

  buscarCategoria(event: AutoCompleteCompleteEvent) {
    this.categoriaService.buscarPorNome(event.query).subscribe(categorias => {
      this.categoriasFiltrados = categorias;
      this.categoriaSelecionada = this.categoriasFiltrados[this.findIndexByIdOfCategoriasFiltrados(this.compraParcelada.categoryId)]
    });
  }

  private findIndexByIdOfCategoriasFiltrados(id: number): number {
    let index = -1;
    for (let i = 0; i < this.categoriasFiltrados.length; i++) {
        if (this.categoriasFiltrados[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
  }
}
