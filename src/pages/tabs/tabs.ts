import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { PersonalEventListPage } from '../personal-event-list/personal-event-list';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = PersonalEventListPage;
  tab2Root = HomePage;
  tab3Root = '';

  constructor() {
  }

}
