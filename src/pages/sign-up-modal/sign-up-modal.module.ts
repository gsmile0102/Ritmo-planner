import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpModalPage } from './sign-up-modal';

@NgModule({
  declarations: [
    SignUpModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpModalPage),
  ],
})
export class SignUpModalPageModule {}
