import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { Contacts, ContactFieldType, IContactFindOptions } from '@ionic-native/contacts';

/**
 * Generated class for the AddAttendeeFromContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-attendee-from-contact',
  templateUrl: 'add-attendee-from-contact.html',
})
export class AddAttendeeFromContactPage {
  ourtype: ContactFieldType[] = ["displayName"];
  contactList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,  private contacts: Contacts, private viewCtrl: ViewController) {
    this.search('');
  }

  ionViewDidLoad() {
  }

  search(q) {
    const option: IContactFindOptions = {
      filter: q
    };

    this.contacts.find(this.ourtype, option).then((conts) => {
      this.contactList = [];
      for(var i = 0; i < conts.length; i++) {
        var contact = {};
        contact['name'] = conts[i].displayName;
        contact['number'] = conts[i].phoneNumbers[0].value;
        if(conts[i].emails != null) {
          contact['email'] = conts[i].emails[0].value;
        }
        this.contactList.push(contact);
      }
    });
  }

  onKeyUp(ev) {
    this.search(ev.target.value);
  }

  addAttendee(contact): void {
    this.viewCtrl.dismiss(contact);
  }

  cancel() {
    this.viewCtrl.dismiss('none');
  }
}
