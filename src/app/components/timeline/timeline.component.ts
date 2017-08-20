import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TimelineService } from './timeline.service';
import { Event } from './timeline.interfaces';

import { EstateService } from './estate.service';
import { Estate, EstateType } from './estate.interfaces';

import cnst from '../../tools/constants';

import { SelectItem } from 'primeng/primeng';

import * as _ from 'lodash';


@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.component.html',
  styleUrls: ['timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  sysMsgShown: boolean = false;
  urls: Object = cnst.URLS;
  array: any;
  sum = 15;
  onlyRead: number = null;

  filterString: string = "Отображаются все события";

  estates: Estate[];

  ngOnInit(): void {
    this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, null, this.filter.modules, 15).subscribe(x => {
      this.events = x.events;
    }));

    this.subscriptions.push(this.tmlnSrvc.getFilterParams().subscribe(x => {
      this.filters = x.modules;
    }));

    this.subscriptions.push(this.estateService.getUserEstates().subscribe(x => {
      this.estates = x.realty;
      this.sysMsgShown = x.realty.length == 0;
    }, err => {
      this.sysMsgShown = true;
    }));
  }

  filters: any[];
  public numberhouse: any = [3];

  constructor(private tmlnSrvc: TimelineService, private estateService: EstateService) {
  }

  selectedDeviceObj: any = 'Непрочитанные';

  events: Event[];

  filter: any = {
    To: "",
    From: "",
    OnlyReaded: false
  };
  oldItem: any;

  removeHouse(id: any) {
    this.HouseData = _.reject(this.HouseData, function (item: any) {
      return item.id === id;
    });
    return this.HouseData;
  }

  removeModule(id: any) {
    this.ModuleData = _.reject(this.ModuleData, function (item: any) {
      return item.id === id;
    });
    return this.ModuleData;
  }

  getByIdHouse(id: any) {
    return _.find(this.HouseData, { id: id });
  }

  getByIdModule(id: any) {
    return _.find(this.ModuleData, { id: id });
  }

  // House
  houseLoad: boolean = false;
  numberHouse: any;
  HouseData: any = [];
  houseId: any = [];

  // Module
  moduleLoad: boolean = false;
  numberModule: any;
  ModuleData: any = [];
  moduleId: any = [];

  // Фильтр по недвежимости
  filterHouse(numberHouse) {
    this.houseId = [];
    this.houseLoad = true;
    this.sum = 15;
    this.numberHouse = numberHouse;
    this.oldItem = this.getByIdHouse(this.numberHouse.id)
    if (!this.oldItem) {
      this.HouseData.push(this.numberHouse);
    } else {
      this.removeHouse(this.numberHouse.id);
    }
    for (let i = 0; this.HouseData.length > 0; i++) {
      this.houseId.push(this.HouseData[i].id);
      this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
        this.events = x.events;
      }));
    }
    if (this.HouseData.length <= 0) {
      this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
        this.events = x.events;
      }));
    }
  }

  // Фильтр по типу события
  filterType(numberModule) {
    this.moduleId = [];
    this.moduleLoad = true;
    this.sum = 15;
    this.numberModule = numberModule;
    this.oldItem = this.getByIdModule(this.numberModule.id)
    if (!this.oldItem) {
      this.ModuleData.push(this.numberModule);
    } else {
      this.removeModule(this.numberModule.id);
    }
    for (let i = 0; this.ModuleData.length > 0; i++) {
      this.moduleId.push(this.ModuleData[i].id);
      this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
        this.events = x.events;
      }));
    }
    if (this.ModuleData.length <= 0) {
      this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
        this.events = x.events;
      }));
    }
  }

  // Автоподгрузка событий
  onScrollDown() {
    // Количество выдаваемых данных
    this.sum += 15;
    this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, this.sum).subscribe(x => {
      this.events = x.events;
    }));
  }

  selectYes:any = 'Прочитанные';
  selectNo:any = 'Непрочитанные';
  loadMsg:boolean = false;

  newFilter() {
    this.loadMsg = true;
    // if(this.loadMsg == true) {
    //   this.loadMsg = false;
    // } else {
    //   this.loadMsg = true;
    // }
  }

  onChangeObj(newObj) {
    this.selectedDeviceObj = newObj.toElement.firstChild.data;
    this.onFilter();
    this.loadMsg = false;
  }

  onFilter() {
    setTimeout(() => {
      //filter modules
      let mods = $('.toggle');
      let activeMods = [];
      for (let mod of mods) {
        if ($(mod).hasClass('active')) {
          activeMods.push($(mod).attr('id') as number);
        }
      }
      this.filter.modules = activeMods.join(',');
      // console.log(activeMods);
      //Посылаем запрос на фильтр прочитанных/непрочитанных
      this.filterString = this.filter.OnlyReaded;
      console.log(this.selectedDeviceObj)
      if (this.selectedDeviceObj == 'Непрочитанные') {
        this.onlyRead = 0;
        this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
          this.events = x.events;
        }));
      }
      if (this.selectedDeviceObj == 'Прочитанные') {
        this.onlyRead = 1;
        this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
          this.events = x.events;
        }));
      }
      if (!this.filter.From) {
        this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
          this.events = x.events;
        }));
      }
      if (!this.filter.To) {
        this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
          this.events = x.events;
        }));
      }
      this.subscriptions.push(this.tmlnSrvc.get(this.onlyRead, this.filter.From, this.filter.To, this.houseId, this.moduleId, 15).subscribe(x => {
        this.filterString = "Отображаются все события";
        if (!this.filter.From && !this.filter.To && activeMods.length == 0) {
          this.filter.OnlyReaded = this.selectedDeviceObj;
          this.filterString = this.filter.OnlyReaded;
        } else {
          this.filter.OnlyReaded = this.selectedDeviceObj;
          this.filterString = this.filter.OnlyReaded;
          if (!this.filter.From && !this.filter.To) {
            this.filterString += " за все время ";
          } else {
            if (this.filter.From) {
              this.filterString += ` с ${this.filter.From} `;
            }
            if (this.filter.To) {
              this.filterString += ` по ${this.filter.To} `;
            }
          }
          if (activeMods.length > 0) {
            this.filterString += `, ${activeMods.length} ${activeMods.length > 1 ? "модулей" : "модуль"}`;
          }
        }

        // console.log('loaded date to', this.filter);
        this.events = x.events;
      }, err => {
        console.log(err);
      }));
    }, 150);
  }

  filterShowed: boolean = false;


  // markAllAsReaded() {
  //   this.subscriptions.push(this.tmlnSrvc.markAsReaded().subscribe(resp => {
  //     this.onFilter();
  //   }, err => {
  //     console.error(err);
  //   }));
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
