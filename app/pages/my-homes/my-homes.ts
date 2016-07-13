import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {User} from "../../models/user";
import {RedFinResult} from "../../models/redFinResult";
import {HouseListing} from "../../models/houseListing";
import {HomeBuyersScorecardService} from '../../providers/home-buyers-scorecard-service/home-buyers-scorecard-service';
import {HomeFormPage} from '../home-form/home-form';
import {HouseListingDisplayPipe} from '../../pipes/house-listing-display-pipe';
import {OrderByPipe} from '../../pipes/orderby';

/*
  Generated class for the MyHomesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/my-homes/my-homes.html',
  pipes: [HouseListingDisplayPipe, OrderByPipe]
})
export class MyHomesPage {
  public currentUser: User;
  emsg: string;
  addByHouseListing: HouseListing;

  constructor(private nav: NavController, private homeBuyersScorecardService: HomeBuyersScorecardService) {
    homeBuyersScorecardService.currentUserSet$.subscribe(cu => this.onCurrentUserSet(cu));
    homeBuyersScorecardService.currentUserError$.subscribe(s => this.onCurrentUserError(s));
  }

  onCurrentUserSet(cu: User) {
    this.currentUser = cu;
    this.emsg = null;
  }

  onCurrentUserError(e: string) {
    this.emsg = e;
  }

  houseListingClick(houseListing: HouseListing) {
    this.nav.push(HomeFormPage, {
      houseListing: houseListing
    });
  }

  addClick() {
    this.nav.push(HomeFormPage);
  }

  redFinClick(){
    
  }

  contextMenuClick(e:MouseEvent, houseListing){
    e.preventDefault();
    e.cancelBubble = true;
  }
}
