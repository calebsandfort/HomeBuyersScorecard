import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HouseListing} from "../../models/houseListing";
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {State, STATES} from '../../models/state';
import {MyValidators} from '../../validators/my-validators';

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

  homeForm: FormGroup;

  addressLine1Changed: boolean = false;
  cityChanged: boolean = false;
  stateChanged: boolean = false;
  zipChanged: boolean = false;

  submitAttempt: boolean = false;

  constructor(private nav: NavController, private navParams: NavParams, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.houseListing = this.navParams.get('houseListing');

    if (typeof (this.houseListing) == "undefined" || typeof (this.houseListing) == null) {
      this.houseListing = new HouseListing();
    }


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
    this.submitAttempt = true;

    console.log(this.homeForm);
  }
}
