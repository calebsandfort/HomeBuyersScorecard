import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HouseListing} from "../../models/houseListing";
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {State, STATES} from '../../models/state';
import {MyValidators} from '../../validators/my-validators';
import {HomeBuyersScorecardService} from '../../providers/home-buyers-scorecard-service/home-buyers-scorecard-service';

/*
  Generated class for the HomeFormPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home-form/home-form.html',
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class HomeFormPage implements OnInit {
  activeSegment: string = "details";
  isAndroid: boolean = true;
  houseListing: HouseListing;
  allStates: State[] = STATES;
  showHomeForm:boolean = false;
  showAddButtons:boolean = false;

  homeForm: FormGroup;

  addressLine1Changed: boolean = false;
  cityChanged: boolean = false;
  stateChanged: boolean = false;
  zipChanged: boolean = false;

  submitAttempt: boolean = false;

  constructor(private nav: NavController, private navParams: NavParams, private formBuilder: FormBuilder, private homeBuyersScorecardService:HomeBuyersScorecardService) {

  }

  ngOnInit() {
    this.houseListing = this.navParams.get('houseListing');

    if (typeof (this.houseListing) == "undefined" || typeof (this.houseListing) == null) {
      this.showAddButtons = true;
    }
    else{
      this.showHomeForm = true;
      this.initForm();
    }
  }

  addManuallyClick = function(){
    this.houseListing = new HouseListing();
    this.showAddButtons = false;
    this.showHomeForm = true;
    this.initForm();
  }

  initForm(){
    this.homeForm = this.formBuilder.group({
          addressLine1: [this.houseListing.AddressLine1, Validators.compose([Validators.maxLength(50), Validators.required])],
          city: [this.houseListing.City, Validators.compose([Validators.maxLength(50), Validators.required])],
          state: [this.houseListing.StateInt, Validators.compose([MyValidators.noneSelected])],
          zip: [this.houseListing.Zip, Validators.compose([Validators.pattern('[0-9]{5}'), Validators.maxLength(5), Validators.required])],
          price: [this.houseListing.Price, Validators.compose([Validators.required, MyValidators.isPositiveNumber])],
          bedrooms: [this.houseListing.Bedrooms, Validators.compose([Validators.required])],
          bathrooms: [this.houseListing.Bathrooms, Validators.compose([Validators.required])],
          squareFootage: [this.houseListing.SquareFootage, Validators.compose([Validators.required])],
          neighborhood: [this.houseListing.Neighborhood],
          schools: [this.houseListing.Schools],
          layout: [this.houseListing.Layout],
          yard: [this.houseListing.Yard],
          moveInReady: [this.houseListing.MoveInReady],
          gutFeeling: [this.houseListing.GutFeeling]
        });
  }

  saveHome() {
    this.houseListing.AddressLine1 = this.homeForm.controls["addressLine1"].value;
    this.houseListing.City = this.homeForm.controls["city"].value;
    this.houseListing.StateInt = this.homeForm.controls["state"].value;
    this.houseListing.Zip = this.homeForm.controls["zip"].value;
    this.houseListing.Price = this.homeForm.controls["price"].value;
    this.houseListing.Bedrooms = this.homeForm.controls["bedrooms"].value;
    this.houseListing.Bathrooms = this.homeForm.controls["bathrooms"].value;
    this.houseListing.SquareFootage = this.homeForm.controls["squareFootage"].value;
    this.houseListing.Neighborhood = this.homeForm.controls["neighborhood"].value;
    this.houseListing.Schools = this.homeForm.controls["schools"].value;
    this.houseListing.Layout = this.homeForm.controls["layout"].value;
    this.houseListing.Yard = this.homeForm.controls["yard"].value;
    this.houseListing.MoveInReady = this.homeForm.controls["moveInReady"].value;
    this.houseListing.GutFeeling = this.homeForm.controls["gutFeeling"].value;

    this.homeBuyersScorecardService.saveHouseListing(this.houseListing);
  }
}
