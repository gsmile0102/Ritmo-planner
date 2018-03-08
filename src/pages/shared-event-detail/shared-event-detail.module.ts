import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedEventDetailPage } from './shared-event-detail';

@NgModule({
  declarations: [
    SharedEventDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SharedEventDetailPage),
  ],
})
export class SharedEventDetailPageModule {}
