import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mensagem-erro-input',
  standalone: true,
  imports: [],
  templateUrl: './mensagem-erro-input.component.html'
})
export class MensagemErroInputComponent {

  @Input() control!: FormControl;
}
