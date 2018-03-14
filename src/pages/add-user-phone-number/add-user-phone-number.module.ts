import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserPhoneNumberPage } from './add-user-phone-number';

@NgModule({
  declarations: [
    AddUserPhoneNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUserPhoneNumberPage),
  ],
})
export class AddUserPhoneNumberPageModule {}
