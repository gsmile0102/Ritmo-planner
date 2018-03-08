import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPersonalEventPage } from './edit-personal-event';

@NgModule({
  declarations: [
    EditPersonalEventPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPersonalEventPage),
  ],
})
export class EditPersonalEventPageModule {}
