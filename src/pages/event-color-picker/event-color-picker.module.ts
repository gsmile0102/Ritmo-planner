import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventColorPickerPage } from './event-color-picker';

@NgModule({
  declarations: [
    EventColorPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(EventColorPickerPage),
  ],
})
export class EventColorPickerPageModule {}
