import { OnInit, Component, EventEmitter, Input, AfterViewInit, OnDestroy,
         Output, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { ProfileService } from '../services/profile.service';

import Helpers from '../../../tools/helpers';


@Component({
  selector: 'app-avatar-edit-popup',
  templateUrl: 'edit-avatar.component.html',
})
export class ProfileEditAvatarPopupComponent implements OnInit, AfterViewInit, OnDestroy {
	@Output() onClose = new EventEmitter();
  @ViewChild('popupCropper') popup: ElementRef;
  @ViewChild('cropper') cropper: ImageCropperComponent;

  subscriptions: Subscription[] = [];
  imageMaxSize: number = 10;
	step: number;
	loading: boolean;
  error: string;
  cropperSettings: CropperSettings;
  data: any;

	constructor(
    private prflService: ProfileService,
    private elementRef: ElementRef,
  ) {
		this.step = 1;
		this.loading = false;
    this.error = '';

    this.cropperSettings = new CropperSettings();

    this.cropperSettings.canvasHeight = 400;
    this.cropperSettings.croppedWidth = 140;
    this.cropperSettings.croppedHeight = 140;
    this.cropperSettings.noFileInput = true;

    this.data = {};
	}

  ngOnInit() {
    const $popup = $(this.popup.nativeElement);
    this.cropperSettings.canvasWidth = $popup.width();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('html').css({'overflow-y': 'hidden'});
      this.elementRef.nativeElement.firstChild.className += ' is-shown';
    }, 4);
  }

  ngOnDestroy() {
    $('html').css({'overflow-y': 'auto'});
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange($event) {
    this.error = '';

    const files = $event.srcElement.files;
    if (!files.length) return false;
    
    const file = files[0];
    const name = file.name;
    const ext = Helpers.getFileExt(name);
    const allwdExtns = /png|jpg|jpeg/i;

    if (!ext || !allwdExtns.test(ext)) {
      this.error = "Недопустимый формат файла \'" + ext + "\'.";
      return false;
    }

    const size = file.size;
    if (!size || size > this.imageMaxSize * 1024 * 1024) {
      this.error = "Размер файла превышает максимально допустимый размер " + this.imageMaxSize + "Mb" ;
      return false;
    }

    let image:any = new Image();
    let myReader:FileReader = new FileReader();

    myReader.onloadend = (loadEvent:any) => {
      image.src = loadEvent.target.result;
      this.cropper.setImage(image);
      this.step = 2;
    };

    myReader.readAsDataURL(file);
  }

  onSave() {
    const ts = Math.ceil(new Date().getTime() / 1000);
    const blob = Helpers.dataURItoBlob(this.data.image);
    
    const ext = blob.type.match(/\/[0-9a-z]+$/i)[0].slice(1);
    const file = new File( [blob], 'blobImage_' + ts + '.'+ext, { type: blob.type } );

    this.error = '';
    this.loading = true;

    if (file) this.subscriptions.push(
      this.prflService.changeAvatar(file).subscribe(() => {
        this.loading = false;
        this.step++;
      }, err=> {
        this.loading = false;
        this.error = err;
      })
    )
  }

  onCancel() {
    this.step--;
  }

  closePopup() {
    this.onClose.emit(true);
  }
}