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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private globalMessageService: GlobalMessageService,
  ) { }

  ngOnInit() {
    this.inicializarFormulario();
  }

  private inicializarFormulario() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  obterControle(nome: string): FormControl {
    const control = this.loginForm.get(nome);
    if (!control) {
      throw new Error(`Controle ${nome} não encontrado`);
    }
    return control as FormControl;
  }

  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        catchError(error => {
          this.globalMessageService.showError('Erro!', 'Verifique email e senha!');
          return of(null);
        }))
      .subscribe({
        next: data => {
          if(data) {
            console.log("Login realizado com sucesso");
            this.router.navigateByUrl('');
          }
        }
      });
  }

  cadastrarNovoUsuario() {
    this.loginForm.reset();
    this.router.navigateByUrl('/auth/register');
  }
}