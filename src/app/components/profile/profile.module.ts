/* modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';

/* services */
import { GuardService } from '../../services/guard.service';
import { ProfileService } from './services/profile.service';
import { ConfirmService } from './services/confirm.service';

/* components */
import { ImageCropperComponent } from 'ng2-img-cropper';
import { InputValidateComponent } from '../ui/input/input-validate.component';
import { DropdownComponent } from '../ui/dropdown/dropdown.component';

import { ProfileComponent } from './profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

import { ProfileConfirmComponent } from './profile-confirm/profile-confirm.component';
import { ProfileCnfrmLetterComponent } from './profile-confirm/confirms/letter-confirm.component';
import { ProfileCnfrmPaymentComponent } from './profile-confirm/confirms/payment-confirm.component';

import { ProfileEditPhonePopupComponent } from './popups/edit-phone.component';
import { ProfileEditEmailPopupComponent } from './popups/edit-email.component';
import { ProfileEditPswrdPopupComponent } from './popups/edit-password.component';
import { ProfileEditAvatarPopupComponent } from './popups/edit-avatar.component';
import { ProfileCnfrmPopupComponent } from './popups/confirm.component';
import { ProfileRenewPaycodePopupComponent } from './popups/renew-paycode.component';

import { EstateListComponent } from './estate-list/estate-list.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

import cnst from '../../tools/constants';
const urls = cnst.URLS;

export const profileRoutes: Routes = [
  {path: urls.profile.index, component: ProfileComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.profile.edit, component: ProfileEditComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.profile.confirm, component: ProfileConfirmComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.profile.cnfrmLetter+'/:first/:middle/:last', component: ProfileCnfrmLetterComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.profile.cnfrmPayment, component: ProfileCnfrmPaymentComponent, canActivate: [GuardService], data: {auth: true} },
  {path: urls.profile.cnfrmEmail+'/:key', component: ConfirmEmailComponent, data: {auth: false} },
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    RouterModule.forChild(profileRoutes),
  ],
  declarations: [
    ProfileComponent,
    ProfileEditComponent,
    ProfileConfirmComponent,
    ProfileEditPhonePopupComponent,
    ProfileEditEmailPopupComponent,
    ProfileEditPswrdPopupComponent,
    ProfileEditAvatarPopupComponent,
    ProfileCnfrmPopupComponent,
    ProfileCnfrmLetterComponent,
    ProfileCnfrmPaymentComponent,
    ProfileRenewPaycodePopupComponent,

    EstateListComponent,
    CompaniesListComponent,
    ConfirmEmailComponent,

    ImageCropperComponent,
    InputValidateComponent,
    DropdownComponent,
  ],
  providers: [
  	ProfileService,
    ConfirmService,
  ]
})
export class ProfileModule {}
