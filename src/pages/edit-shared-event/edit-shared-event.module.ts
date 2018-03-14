import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditSharedEventPage } from './edit-shared-event';

@NgModule({
  declarations: [
    EditSharedEventPage,
  ],
  imports: [
    IonicPageModule.forChild(EditSharedEventPage),
  ],
})
export class EditSharedEventPageModule {}
