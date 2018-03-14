import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAttendeeFromContactPage } from './add-attendee-from-contact';

@NgModule({
  declarations: [
    AddAttendeeFromContactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAttendeeFromContactPage),
  ],
})
export class AddAttendeeFromContactPageModule {}
