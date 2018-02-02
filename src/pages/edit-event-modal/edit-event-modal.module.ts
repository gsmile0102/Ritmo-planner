import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditEventModalPage } from './edit-event-modal';

@NgModule({
  declarations: [
    EditEventModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditEventModalPage),
  ],
})
export class EditEventModalPageModule {}
