import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-input-validate',
  templateUrl: 'input-validate.component.html',
  styleUrls: ['input-validate.component.scss'],
})
export class InputValidateComponent {
	@Input() control: FormControl;
	@Input() styleModfctr: string;
	@Input() touched: boolean;
	@Input() cstmStyle: Object;
}
