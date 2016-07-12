import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Loading } from 'ionic-angular';
import {HouseListing} from "../../models/houseListing";
import {User} from "../../models/user";
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {State, STATES} from '../../models/state';
import {MyValidators} from '../../validators/my-validators';
import {HomeBuyersScorecardService} from '../../providers/home-buyers-scorecard-service/home-buyers-scorecard-service';
import {HouseListingDisplayPipe} from '../../pipes/house-listing-display-pipe';

/*
  Generated class for the HomeFormPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home-form/home-form.html',
  directives: [REACTIVE_FORM_DIRECTIVES],
  pipes: [HouseListingDisplayPipe]
})
export class HomeFormPage implements OnInit {
  public currentUser: User;
  emsg: string;
  activeSegment: string = "details";
  isAndroid: boolean = true;
  houseListing: HouseListing;
  allStates: State[] = STATES;
  addPadding: boolean = false;
  showHomeForm: boolean = false;
  showAddButtons: boolean = false;
  addForm: string = "";

  homeForm: FormGroup;
  addByMlsForm: FormGroup;
  addByAddressForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(private nav: NavController, private navParams: NavParams, private formBuilder: FormBuilder, private homeBuyersScorecardService: HomeBuyersScorecardService) {
    this.currentUser = this.homeBuyersScorecardService.getCurrentUser();
  }

  ngOnInit() {
    this.houseListing = this.navParams.get('houseListing');

    if (typeof (this.houseListing) == "undefined" || typeof (this.houseListing) == null) {
      this.showAddButtons = true;
      this.addPadding = true;
    }
    else {
      this.showHomeForm = true;
      this.initHomeForm();
    }
  }

  addByMlsClick = function () {
    this.addForm = "mls";
    this.showAddButtons = false;
    this.initAddByMlsForm();
  }

  initAddByMlsForm() {
    this.addByMlsForm = this.formBuilder.group({
      mls: ['', Validators.compose([Validators.required])],
      city: [this.currentUser.DefaultCity, Validators.compose([Validators.maxLength(50), Validators.required])],
      state: [this.currentUser.DefaultStateInt, Validators.compose([MyValidators.noneSelected])]
    });
  }

  addByMlsFormSubmit() {
    this.homeBuyersScorecardService.getDetailsByMls(this.addByMlsForm.controls["city"].value, this.addByMlsForm.controls["state"].value, this.addByMlsForm.controls["mls"].value)
      .then(
      houseListing => {
        this.populateFromFoundListing(houseListing);
      },
      error => this.emsg = <any>error);

    // this.progressSpinner = new Loading(null, {
    //   content: "Adding Round..."
    // });

    //this.nav.present(this.progressSpinner);
  }

  addByAddressClick = function () {
    this.addForm = "address";
    this.showAddButtons = false;
    this.initAddByAddressForm();
  }

  initAddByAddressForm() {
    this.addByAddressForm = this.formBuilder.group({
      addressLine1: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      city: [this.currentUser.DefaultCity, Validators.compose([Validators.maxLength(50), Validators.required])],
      state: [this.currentUser.DefaultStateInt, Validators.compose([MyValidators.noneSelected])],
      zip: ['', Validators.compose([Validators.pattern('[0-9]{5}'), Validators.maxLength(5), Validators.required])]
    });
  }

  addByAddressFormSubmit() {
    this.homeBuyersScorecardService.getDetailsByAddress(this.addByAddressForm.controls["addressLine1"].value, this.addByAddressForm.controls["city"].value,
      this.addByAddressForm.controls["state"].value, this.addByAddressForm.controls["zip"].value)
      .then(
      houseListing => {
        this.populateFromFoundListing(houseListing);
      },
      error => this.emsg = <any>error);

    // this.progressSpinner = new Loading(null, {
    //   content: "Adding Round..."
    // });

    //this.nav.present(this.progressSpinner);
  }

  addManuallyClick = function () {
    this.houseListing = new HouseListing();
    this.showAddButtons = false;
    this.showHomeForm = true;
    this.initHomeForm();
  }

  populateFromFoundListing(houseListing: HouseListing) {
    this.houseListing = new HouseListing();
    this.houseListing.Nickname = '';
    this.houseListing.AddressLine1 = houseListing.AddressLine1;
    this.houseListing.Bathrooms = houseListing.Bathrooms;
    this.houseListing.Bedrooms = houseListing.Bedrooms;
    this.houseListing.City = houseListing.City;
    this.houseListing.Mls = houseListing.Mls;
    this.houseListing.Price = houseListing.Price;
    this.houseListing.SquareFootage = houseListing.SquareFootage;
    this.houseListing.State = this.allStates.filter(x => x.Identifier == houseListing.StateInt)[0].Abbreviation;
    this.houseListing.StateInt = houseListing.StateInt;
    this.houseListing.Zip = houseListing.Zip;
    this.houseListing.UserIdentifier = this.currentUser.Identifier;

    this.houseListing.Kitchen = 0;
    this.houseListing.BathroomsScore = 0;
    this.houseListing.Location = 0;
    this.houseListing.Neighborhood = 0;
    this.houseListing.Schools = 0;
    this.houseListing.Layout = 0;
    this.houseListing.MoveInReady = 0;
    this.houseListing.FeelsLikeHome = 0;
    this.houseListing.Yard = 0;
    this.houseListing.Notes = '';


    this.addForm = '';
    this.initHomeForm();
    this.showHomeForm = true;
  }

  initHomeForm() {
    this.homeForm = this.formBuilder.group({
      nickname: [this.houseListing.Nickname, Validators.compose([Validators.maxLength(20)])],
      addressLine1: [this.houseListing.AddressLine1, Validators.compose([Validators.maxLength(50), Validators.required])],
      city: [this.houseListing.City, Validators.compose([Validators.maxLength(50), Validators.required])],
      state: [this.houseListing.StateInt, Validators.compose([MyValidators.noneSelected])],
      zip: [this.houseListing.Zip, Validators.compose([Validators.pattern('[0-9]{5}'), Validators.maxLength(5), Validators.required])],
      mls: [this.houseListing.Mls],
      price: [this.houseListing.Price, Validators.compose([Validators.required, MyValidators.isPositiveNumber])],
      bedrooms: [this.houseListing.Bedrooms, Validators.compose([Validators.required])],
      bathrooms: [this.houseListing.Bathrooms, Validators.compose([Validators.required])],
      squareFootage: [this.houseListing.SquareFootage, Validators.compose([Validators.required])],
      kitchen: [this.houseListing.Kitchen],
      bathroomsScore: [this.houseListing.BathroomsScore],
      location: [this.houseListing.Location],
      neighborhood: [this.houseListing.Neighborhood],
      schools: [this.houseListing.Schools],
      layout: [this.houseListing.Layout],
      moveInReady: [this.houseListing.MoveInReady],
      feelsLikeHome: [this.houseListing.FeelsLikeHome],
      yard: [this.houseListing.Yard],
      notes: [this.houseListing.Notes]
    });
  }

  saveHome() {
    this.houseListing.Nickname = this.homeForm.controls["nickname"].value;
    this.houseListing.AddressLine1 = this.homeForm.controls["addressLine1"].value;
    this.houseListing.City = this.homeForm.controls["city"].value;
    this.houseListing.StateInt = this.homeForm.controls["state"].value;
    this.houseListing.State = this.allStates.filter(x => x.Identifier == this.houseListing.StateInt)[0].Abbreviation
    this.houseListing.Zip = this.homeForm.controls["zip"].value;
    this.houseListing.Mls = this.homeForm.controls["mls"].value;
    this.houseListing.Price = this.homeForm.controls["price"].value;
    this.houseListing.Bedrooms = this.homeForm.controls["bedrooms"].value;
    this.houseListing.Bathrooms = this.homeForm.controls["bathrooms"].value;
    this.houseListing.SquareFootage = this.homeForm.controls["squareFootage"].value;
    this.houseListing.Kitchen = this.homeForm.controls["kitchen"].value;
    this.houseListing.BathroomsScore = this.homeForm.controls["bathroomsScore"].value;
    this.houseListing.Location = this.homeForm.controls["location"].value;
    this.houseListing.Neighborhood = this.homeForm.controls["neighborhood"].value;
    this.houseListing.Schools = this.homeForm.controls["schools"].value;
    this.houseListing.Layout = this.homeForm.controls["layout"].value;
    this.houseListing.MoveInReady = this.homeForm.controls["moveInReady"].value;
    this.houseListing.FeelsLikeHome = this.homeForm.controls["feelsLikeHome"].value;
    this.houseListing.Yard = this.homeForm.controls["yard"].value;
    this.houseListing.Notes = this.homeForm.controls["notes"].value;

    this.homeBuyersScorecardService.saveHouseListing(this.houseListing)
      .then((result: any) => {
        //this.progressSpinner.dismiss();
        this.nav.popToRoot();
      })
      .catch((emsg: string) => {
        //this.progressSpinner.dismiss();
        this.emsg = emsg;
      });
  }
}
