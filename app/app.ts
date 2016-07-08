import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {HomeBuyersScorecardService} from './providers/home-buyers-scorecard-service/home-buyers-scorecard-service';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import {HTTP_BINDINGS} from '@angular/http';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [HomeBuyersScorecardService]
})
export class MyApp {

  private rootPage:any;
  emsg:string;

  constructor(private platform:Platform,
              private homeBuyersScorecardService: HomeBuyersScorecardService) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      homeBuyersScorecardService.fetchMetadata()
        .then(() => {
          homeBuyersScorecardService.setCurrentUser(false)
              .then(() => { }).catch((emsg:string) => this.emsg = emsg);
        })
        .catch((emsg:string) => this.emsg = emsg);
    });
  }
}

ionicBootstrap(MyApp, [
  HTTP_BINDINGS,
  disableDeprecatedForms(),
  provideForms()
 ])
