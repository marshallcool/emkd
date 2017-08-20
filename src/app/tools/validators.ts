import { FormGroup, FormControl } from '@angular/forms';

export class CstmValidator {
	
  public static email(c: FormControl) {
		const EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		
		return EMAIL_REGEXP.test(c.value) ? null : {
			validateEmail: {
        valid: false
      }
		}
	}


  public static phoneLength(c: FormControl) {
    return (c.value.replace('_','').length === 18) ? null : {
      validatePhone: {
        valid: false
      }
    };
  }


  public static equal(value:string) {
    return (c: FormControl) => {
      return (c.value === value) ? null : {
        equal: {
          validEqual: false
        }
      };
    };
  }

}
