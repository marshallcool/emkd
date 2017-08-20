import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription'

import { EstateService } from '../estate.service';
import { EstateType } from '../estate.interfaces';

import { NotificationService } from '../../../services/notification.service';
import cnst from '../../../tools/constants';


@Component({
  selector: 'app-add-estate',
  templateUrl: 'add-estate.component.html',
  styleUrls: ['add-estate.component.scss']
})
export class AddEstateComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor (
    private estateSrv: EstateService,
    private notification: NotificationService,
    private router: Router,
  ) {
  }

  types: EstateType[];
  currentType: EstateType;
  address: string;
  number: string;
  comment: string;

  setNewType(typeId) {
    this.currentType = this.types.filter((x) => x.id == typeId)[0];
  }

  isCanSave() {
    return this.address && (this.currentType.abbreviation ? this.number : true);
  }

  add() {
    this.subscriptions.push(
      this.estateSrv.addEstate(this.currentType.id, this.address, this.number, this.comment).subscribe((resp: boolean) => {
        this.router.navigate([cnst.URLS.profile.index]);
        // this.notification.success("Успешно! Профиля пока нет, редиректить некуда :(");
      },
      err => {
        this.notification.error(err);
      })
    );
  }


  join(arr, separator = ', ') {
    return arr.filter(function (n) {
      return n
    }).join(separator);
  }

  makeAddressString(address) {
    return this.join([
      (address.city == address.region && this.join([address.city_type, address.city], " ") || ""),
      (address.city != address.region && this.join([address.region, address.region_type], " ") || ""),
      this.join([address.area, address.area_type], " "),
      this.join([address.settlement, address.settlement_type], " "),
      (address.city !== address.region && this.join([address.city_type, address.city], " ") || ""),
      this.join([address.street_type, address.street], " "),
      this.join([address.house_type, address.house], " "),
      this.join([address.block_type, address.block], " ")
    ]);
  }

  checkEstate() {
    this.subscriptions.push(this.estateSrv.isUserHaveAnyEstate(this.currentType.id, this.address, this.number).subscribe(x => {
      if (x) {
        this.notification.success("Внимание, в данном объекте недвижимости уже зарегистрированы пользователи. В случае, если вы собственник - рекомендуем пройти процедуру верификации, иначе ранее зарегистрированный собственник может удалить вас по своему желанию.");
      }
    }));
  }

  ngOnInit() {
    this.subscriptions.push(this.estateSrv.getEstateTypes().subscribe(x => {
      this.types = x;
      this.currentType = this.types[0];
    }));
    var that = this;
    //init plugin

    function formatResult(value, currentValue, suggestion) {
      var addressValue = that.makeAddressString(suggestion.data);
      suggestion.value = addressValue;
      return addressValue;
    }

    function formatSelected(suggestion) {
      var addressValue = that.makeAddressString(suggestion.data);
      return addressValue;
    }

    $("#address").suggestions({
      serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
      token: "cc76429d198ab4c6b28bca9db5cf3cd32cc11e18",
      type: "ADDRESS",
      count: 5,
      /* Вызывается, когда пользователь выбирает одну из подсказок */
      onSelect: function (suggestion) {
        console.log(suggestion);
        that.address = suggestion.value;
        that.checkEstate();
      },
      formatResult: formatResult,
      formatSelected: formatSelected
    });
  }

  ngOnDestroy() {
     this.subscriptions.forEach(s => s.unsubscribe());
  }

}
