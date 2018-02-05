import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReminderModalPage } from './reminder-modal';

@NgModule({
  declarations: [
    ReminderModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ReminderModalPage),
  ],
})
export class ReminderModalPageModule {}
