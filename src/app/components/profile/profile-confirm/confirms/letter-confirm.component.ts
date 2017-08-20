import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ConfirmService } from '../../services/confirm.service';
import { ConfirmLetter } from '../../interfaces/confirm.interfaces';
import { NotificationService } from '../../../../services/notification.service';
import cnst from '../../../../tools/constants';


@Component({
  selector: 'app-profile-confirm-letter',
  templateUrl: 'letter-confirm.component.html',
  styleUrls: ['letter-confirm.component.scss'],
})
export class ProfileCnfrmLetterComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('address') addressRef: ElementRef;
  subs: Subscription[] = [];
  userNames: {first_name:string, middle_name:string, last_name:string};
	step: number;
	loading: boolean;
	error: string;
	form: FormGroup;
	urls: Object = cnst.URLS;
  addrError: string = '';

	constructor (
		private fb: FormBuilder,
		private router: Router,
    private route: ActivatedRoute,
		private cnfrmSrvc: ConfirmService,
		private notifySrvc: NotificationService,
	){
		this.step = 1;
		this.loading = false;
		this.error = '';
	}

	ngOnInit() {
		this.loading = true;

    this.subs.push(this.route.params.subscribe(params => {
      if (!params) return false;

      this.userNames = {
        first_name: params['first'],
        middle_name: params['middle'],
        last_name: params['last']
      };

      this.loading = false;
    }));

    this.buildEditForm();
	}

	ngAfterViewInit() {
    this.autocompleteAddress();
	}

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

	buildEditForm() {
    this.form = this.fb.group({
      'address': ['', [Validators.required, Validators.maxLength(128)] ],
      'postcode': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)] ],
    });
  }

	nextStep() {
		this.step++;
	}

  prevStep() {
    if (this.step > 0) this.step--;
  }

	autocompleteAddress() {
    const $address = $(this.addressRef.nativeElement);

    if ($address.length) $address.suggestions({
      serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
      token: "cc76429d198ab4c6b28bca9db5cf3cd32cc11e18",
      type: "ADDRESS",
      count: 5,

      onSelect: (suggestion) => {
        this.form.patchValue({'address': suggestion.value});
        this.form.patchValue({'postcode': suggestion.data.postal_code});

        const addr = suggestion.data;
        if (!addr.region) this.addrError = 'Укажите в адресе регион.';
        else if (!addr.street) this.addrError = 'Укажите в адресе название улицы.';
        else if (!addr.house) this.addrError = 'Укажите в адресе номер дома.';
        else if (!addr.flat) this.addrError = 'Укажите в адресе номер квартиры.';
        else this.addrError = '';
      }
    });
	}

  sendLetter() {
    const cntrls = this.form.controls;

    const data:ConfirmLetter = {
      'address': cntrls['address'].value,
      'postcode': cntrls['postcode'].value,
      'first_name': this.userNames.first_name,
      'middle_name': this.userNames.middle_name,
      'last_name': this.userNames.last_name,
    };

    this.error = '';
    this.loading = true;

    this.subs.push(
      this.cnfrmSrvc.sendLetter(data).subscribe(() => {
        this.notifySrvc.success("Запрос успешно отправлен");
        this.loading = false;
        this.router.navigate([cnst.URLS.profile.confirm]);
      }, err => {
        this.error = err;
        this.loading = false;
      })
    )
  }

  getFullName() {
    const names = this.userNames;
    if (!names) return '';

    return names.last_name +' '+ names.first_name +' '+ names.middle_name;
  }

}

