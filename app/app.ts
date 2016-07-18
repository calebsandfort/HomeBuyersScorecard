import {Component, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar, Splashscreen, AdMob} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {MyHomesPage} from './pages/my-homes/my-homes';
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
    this.rootPage = MyHomesPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //Splashscreen.hide();

      if(AdMob){
        // AdMob.prepareInterstitial({
        //   adId: 'ca-app-pub-9286532093165876/9945013340',
        //   isTesting: true, // TODO: remove this line when release
        //   autoShow: true
        // });

        // AdMob.isInterstitialReady().then((isReady: boolean) => {
        //   alert(isReady);
        //   AdMob.showInterstitial();
        //   Splashscreen.hide();

        //   setTimeout(() => {
            
        //   }, 2000);
        // });
      }

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

enableProdMode();

ionicBootstrap(MyApp, [
  HTTP_BINDINGS,
  disableDeprecatedForms(),
  provideForms()
 ])
