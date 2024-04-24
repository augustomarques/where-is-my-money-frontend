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
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { ToggleButtonModule } from "primeng/togglebutton";
import { Categoria } from "src/app/api/categoria";
import { CompraRecorrente } from "src/app/api/compra-recorrente";
import { PaymentMethod } from "src/app/api/payment-method.enum";
import { MensagemErroInputComponent } from "src/app/components/mensagem-erro-input/mensagem-erro-input.component";
import { CategoriaService } from "src/app/service/categoria.service";
import { CompraRecorrenteService } from "src/app/service/compra-recorrente.service";
import { GlobalMessageService } from "src/app/service/global-message.service";

@Component({
  selector: 'app-compra-recorrente',
  templateUrl: './compra-recorrente.component.html',
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
    DropdownModule,
    InputSwitchModule,
    ToggleButtonModule
  ]
})
export class CompraRecorrenteComponent implements OnInit {

  compraRecorrenteForm!: FormGroup;
  isEdicao: boolean = false;
  compraRecorrenteId: number = 0;
  compraRecorrente: CompraRecorrente = {} as CompraRecorrente;

  categoriasFiltrados: Categoria[] = [];
  categoriaSelecionada: Categoria = {} as Categoria;

  paymentMethods = [];

  constructor(
    private router: Router,
    private globalMessageService: GlobalMessageService,
    private activatedRoute: ActivatedRoute,
    private compraRecorrenteService: CompraRecorrenteService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarCompraRecorrente();
    this.carregarPaymentMethods();
  }

  obterControle(nome: string): FormControl {
    const control = this.compraRecorrenteForm.get(nome);
    if(!control) {
      throw new Error(`Controle ${nome} não encontrado`);
    }
    return control as FormControl;
  }

  private inicializarFormulario() {
    this.compraRecorrenteForm = new FormGroup({
      description: new FormControl('', Validators.required),
      startedAt: new FormControl<Date | string>(new Date(), Validators.required),
      amount: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required),
      paymentMethod: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
  }

  private carregarPaymentMethods() {
    this.paymentMethods = Object.keys(PaymentMethod).map(key => ({ label: PaymentMethod[key], value: key }));
  }

  carregarCompraRecorrente() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      this.compraRecorrenteService.buscarPorId(Number(id)).subscribe(compraRecorrente => {
        this.compraRecorrenteForm.patchValue(compraRecorrente);
        this.compraRecorrenteForm.controls["startedAt"].patchValue(new Date(compraRecorrente.startedAt));
      });
      this.compraRecorrenteId = Number(id);
      this.isEdicao = true;
    }
  }

  cancelar() {
    this.compraRecorrenteForm.reset();
    this.router.navigateByUrl('/lista-compras-recorrentes');
  }

  salvar() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    const compraRecorrente: CompraRecorrente = {
      id: id ? Number(id) : null,
      description: this.compraRecorrenteForm.value.description,
      startedAt: this.compraRecorrenteForm.value.startedAt,
      amount: this.compraRecorrenteForm.value.amount,
      active: this.compraRecorrenteForm.value.active,
      paymentMethod: this.compraRecorrenteForm.value.paymentMethod,
      categoryId: this.compraRecorrenteForm.value.category.id
    }

    this.compraRecorrenteService.editarOuSalvar(compraRecorrente).subscribe(() => {
      
      this.compraRecorrenteForm.reset();
      this.router.navigateByUrl('/lista-compras-recorrentes');
      
      if(compraRecorrente.id) {
        this.globalMessageService.showSuccess('Sucesso!', 'Compra recorrente alterada com sucesso!');
      } else {
        this.globalMessageService.showSuccess('Sucesso!', 'Compra recorrente cadastrada com sucesso!');
      }
    });
  }

  buscarCategoria(event: AutoCompleteCompleteEvent) {
    this.categoriaService.buscarPorNome(event.query).subscribe(categorias => {
      this.categoriasFiltrados = categorias;
      this.categoriaSelecionada = this.categoriasFiltrados[this.findIndexByIdOfCategoriasFiltrados(this.compraRecorrente.categoryId)]
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
