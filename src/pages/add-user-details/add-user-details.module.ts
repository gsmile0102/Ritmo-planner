import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserDetailsPage } from './add-user-details';

@NgModule({
  declarations: [
    AddUserDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUserDetailsPage),
  ],
})
export class AddUserDetailsPageModule {}
