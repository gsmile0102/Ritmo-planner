import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedEventListPage } from './shared-event-list';

@NgModule({
  declarations: [
    SharedEventListPage,
  ],
  imports: [
    IonicPageModule.forChild(SharedEventListPage),
  ],
})
export class SharedEventListPageModule {}
