import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedEventCreatePage } from './shared-event-create';

@NgModule({
  declarations: [
    SharedEventCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(SharedEventCreatePage),
  ],
})
export class SharedEventCreatePageModule {}
