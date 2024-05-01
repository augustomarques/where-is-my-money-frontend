import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { catchError, of } from "rxjs";
import { MensagemErroInputComponent } from "src/app/components/mensagem-erro-input/mensagem-erro-input.component";
import { AuthService } from "src/app/service/auth.service";
import { GlobalMessageService } from "src/app/service/global-message.service";

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    MensagemErroInputComponent
  ],
  templateUrl: './cadastro-usuario.component.html',
})
export class CadastroUsuarioComponent implements OnInit {

  cadastroForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private globalMessageService: GlobalMessageService,
  ) { }

  ngOnInit() {
    this.inicializarFormulario();
  }

  private inicializarFormulario() {
    this.cadastroForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  obterControle(nome: string): FormControl {
    const control = this.cadastroForm.get(nome);
    if (!control) {
      throw new Error(`Controle ${nome} não encontrado`);
    }
    return control as FormControl;
  }

  cadastrar() {
    const usuario = this.cadastroForm.value;

    this.authService.register(usuario)
      .pipe(
        catchError(error => {
          this.globalMessageService.showError('Erro!', 'Ocorreu um erro ao realizar o cadastro!');
          return of(null);
        }))
      .subscribe({
        next: data => {
          if(data) {
            this.globalMessageService.showSuccess('Sucesso!', 'Cadastro realizado!');
            this.router.navigateByUrl('');
          }
        }
      });
  }

  voltarParaLogin() {
    this.cadastroForm.reset();
    this.router.navigateByUrl('/auth/login');
  }
}