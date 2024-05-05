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
import { CompraView } from "src/app/api/compra";
import { PaymentMethod } from "src/app/api/payment-method.enum";
import { StoreType } from "src/app/api/store-type.enum";
import { TipoCompra } from "src/app/api/tipo-compra.enum";
import { MensagemErroInputComponent } from "src/app/components/mensagem-erro-input/mensagem-erro-input.component";
import { CategoriaService } from "src/app/service/categoria.service";
import { CompraService } from "src/app/service/compra.service";
import { GlobalMessageService } from "src/app/service/global-message.service";
import { PeriodoService } from "src/app/service/periodo.service";

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
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
export class CompraComponent implements OnInit {

  compraForm!: FormGroup;
  isEdicao: boolean = false;
  compraId: number = 0;
  compraAvulsa: boolean = false;
  totalDeParcelas: number = 0;
  parcelaAtual: number = 0;
  isHabilitadoParaEdicao: boolean = true;
  tipoCompra: TipoCompra;

  categoriasFiltrados: Categoria[] = [];
  periodos = [];
  storeTypes = [];
  paymentMethods = [];

  constructor(
    private router: Router,
    private globalMessageService: GlobalMessageService,
    private activatedRoute: ActivatedRoute,
    private compraService: CompraService,
    private categoriaService: CategoriaService,
    private periodService: PeriodoService,
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarPeriodos();
    this.carregarStoreTypes();
    this.carregarPaymentMethods();
    this.carregarCompra();
  }

  obterControle(nome: string): FormControl {
    const control = this.compraForm.get(nome);
    if(!control) {
      throw new Error(`Controle ${nome} não encontrado`);
    }
    return control as FormControl;
  }

  private inicializarFormulario() {
    this.compraForm = new FormGroup({
      description: new FormControl({value: '', disabled: false}, Validators.required),
      amount: new FormControl({value: '', disabled: false}, Validators.required),
      installments: new FormControl({value: 0, disabled: false}),
      currentInstallment: new FormControl({value: 0, disabled: false}),
      boughtAt: new FormControl<Date | string>({value: new Date(), disabled: false}, Validators.required),
      storeType: new FormControl({value: '', disabled: false}, Validators.required),
      paymentMethod: new FormControl({value: '', disabled: false}, Validators.required),
      category: new FormControl({value: '', disabled: false}, Validators.required),
      period: new FormControl({value: '', disabled: false}, Validators.required),
    });
  }

  private atualizarFormulario(compra: CompraView) {
    this.compraAvulsa = (TipoCompra[compra.type] === TipoCompra.SINGLE_PURCHASE)
    if(!this.compraAvulsa) {
      this.compraForm.get('description').disable();
      this.compraForm.get('boughtAt').disable();
      this.compraForm.get('storeType').disable();
      this.compraForm.get('installments').disable();
      this.compraForm.get('currentInstallment').disable();
      this.compraForm.get('category').disable();
      
      if(TipoCompra[compra.type] == TipoCompra.INSTALLMENT) {
        this.compraForm.get('amount').disable();  
        this.compraForm.get('paymentMethod').disable();

        this.isHabilitadoParaEdicao = false;
        this.totalDeParcelas = compra.installment.installments;
        this.parcelaAtual = compra.currentInstallment;
      }
    }
  }
  
  private carregarStoreTypes() {
    this.storeTypes = Object.keys(StoreType).map(key => ({ label: StoreType[key], value: key }));
  }

  private carregarPaymentMethods() {
    this.paymentMethods = Object.keys(PaymentMethod).map(key => ({ label: PaymentMethod[key], value: key }));
  }

  private carregarPeriodos() {
    this.periodService.buscar().subscribe(periodos => {
      this.periodos = periodos;
    });
  }

  private carregarCompra() {
    this.compraAvulsa = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      this.compraService.buscarPorId(Number(id)).subscribe(compra => {
        this.compraForm.patchValue(compra);
        this.compraForm.controls["boughtAt"].patchValue(new Date(compra.boughtAt));

        this.atualizarFormulario(compra);
        this.tipoCompra = TipoCompra[compra.type];
      });
      this.compraId = Number(id);
      this.isEdicao = true;
    }
  }

  cancelar() {
    this.compraForm.reset();
    this.router.navigateByUrl('/lista-compras');
  }

  salvar() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    let compra

    if(this.tipoCompra == TipoCompra.SINGLE_PURCHASE) {
      compra = {
        id: id ? Number(id) : null,
        description: this.compraForm.value.description,
        amount: this.compraForm.value.amount,
        boughtAt: this.compraForm.value.boughtAt,
        storeType: this.compraForm.value.storeType,
        paymentMethod: this.compraForm.value.paymentMethod,
        categoryId: this.compraForm.value.category.id,
        periodId: this.compraForm.value.period.id
      }
    } else {
      compra = {
        id: id ? Number(id) : null,
        amount: this.compraForm.value.amount,
        paymentMethod: this.compraForm.value.paymentMethod,
      }
    }

    this.compraService.editarOuSalvar(compra).subscribe(() => {
      
      this.compraForm.reset();
      this.router.navigateByUrl('/lista-compras');
      
      if(compra.id) {
        this.globalMessageService.showSuccess('Sucesso!', 'Compra alterada com sucesso!');
      } else {
        this.globalMessageService.showSuccess('Sucesso!', 'Compra cadastrada com sucesso!');
      }
    });
  }

  buscarCategoria(event: AutoCompleteCompleteEvent) {
    this.categoriaService.buscarPorNome(event.query).subscribe(categorias => {
      this.categoriasFiltrados = categorias;
    });
  }
}
