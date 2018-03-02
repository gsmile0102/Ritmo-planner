import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogInModalPage } from './log-in-modal';

@NgModule({
  declarations: [
    LogInModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LogInModalPage),
  ],
})
export class LogInModalPageModule {}
