import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';


export class DropdownValue {
  value:string;
  label:string;
  order:number = 0;
  visible:boolean;

  constructor(value:string, label:string) {
    this.value = value;
    this.label = label;
    this.order++;
    this.visible = true;
  }
}


@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss']
})


export class DropdownComponent implements OnInit {
  @Input() values: DropdownValue[];
  @Input() value: string;
  @Output() genderUpdated = new EventEmitter();

  open: boolean;
  activeValue: DropdownValue;

  ngOnInit() {
    this.initActiveValue();
  }

  toggleMenu() {
    this.open = !this.open;
  }

  initActiveValue() {
    for (let value of this.values) {
      if (value.value === this.value) {
        this.setActive(value);
        break;
      }
    }
  }

  setActive(activeValue:DropdownValue) {
    this.activeValue = activeValue;

    for (let value of this.values) {
      value.visible = (value.value !== this.activeValue.value) ? true : false;
    }

    this.open = false;
    this.genderUpdated.emit(this.activeValue.value);
  }
}
