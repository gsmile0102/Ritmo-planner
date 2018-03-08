import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalEventDetailPage } from './personal-event-detail';

@NgModule({
  declarations: [
    PersonalEventDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalEventDetailPage),
  ],
})
export class PersonalEventDetailPageModule {}
