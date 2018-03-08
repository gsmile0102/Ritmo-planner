import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalEventListPage } from './personal-event-list';

@NgModule({
  declarations: [
    PersonalEventListPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalEventListPage),
  ],
})
export class PersonalEventListPageModule {}
