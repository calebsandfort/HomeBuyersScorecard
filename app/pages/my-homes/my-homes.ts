import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {User} from "../../models/user";
import {RedFinResult} from "../../models/redFinResult";
import {HouseListing} from "../../models/houseListing";
import {HomeBuyersScorecardService} from '../../providers/home-buyers-scorecard-service/home-buyers-scorecard-service';
import {HomeFormPage} from '../home-form/home-form';
import {HouseListingDisplayPipe} from '../../pipes/house-listing-display-pipe';
import {OrderByPipe} from '../../pipes/orderby';
import {State, STATES} from '../../models/state';
import {MyValidators} from '../../validators/my-validators';

/*
  Generated class for the MyHomesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/my-homes/my-homes.html',
  directives: [REACTIVE_FORM_DIRECTIVES],
  pipes: [HouseListingDisplayPipe, OrderByPipe]
})
export class MyHomesPage {
  public currentUser: User;
  emsg: string;
  addByHouseListing: HouseListing;
  loading: any;

  allStates: State[] = STATES;
  userDefaultsForm: FormGroup;

  constructor(private nav: NavController, private homeBuyersScorecardService: HomeBuyersScorecardService, private formBuilder: FormBuilder,
    private actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController) {
    homeBuyersScorecardService.currentUserSet$.subscribe(cu => this.onCurrentUserSet(cu));
    homeBuyersScorecardService.currentUserError$.subscribe(s => this.onCurrentUserError(s));
  }

  onCurrentUserSet(cu: User) {
    this.currentUser = cu;
    this.emsg = null;

    if (!this.currentUser.DefaultsSet) {
      this.initUserDefaultsForm();
    }

    Splashscreen.hide();
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

  redFinClick() {

  }

  initUserDefaultsForm() {
    this.userDefaultsForm = this.formBuilder.group({
      city: [this.currentUser.DefaultCity, Validators.compose([Validators.maxLength(50), Validators.required])],
      state: [this.currentUser.DefaultStateInt, Validators.compose([MyValidators.noneSelected])]
    });
  }

  userDefaultsFormSubmit(){
    this.currentUser.DefaultCity = this.userDefaultsForm.controls["city"].value;
    this.currentUser.DefaultStateInt = this.userDefaultsForm.controls["state"].value;
    this.currentUser.DefaultState = this.allStates.filter(x => x.Identifier == this.currentUser.DefaultStateInt)[0].Abbreviation;
    this.showLoading();

    this.homeBuyersScorecardService.saveChanges()
      .then((result: any) => {
        this.hideLoading();
        this.homeBuyersScorecardService.setCurrentUser(true);
      })
      .catch((emsg: string) => {
        this.hideLoading();
        this.emsg = emsg;
      });
  }

  deleteListing(houseListing: HouseListing) {
    this.showLoading();
    this.homeBuyersScorecardService.deleteEntity(houseListing)
      .then((result: any) => {
        this.hideLoading();
      })
      .catch((emsg: string) => {
        this.hideLoading();
        this.emsg = emsg;
      });
  }

  contextMenuClick(e: MouseEvent, houseListing) {
    e.preventDefault();
    e.cancelBubble = true;

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteListing(houseListing);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }
}
