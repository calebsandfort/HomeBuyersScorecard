import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HouseListing} from "../../models/houseListing";
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {State, STATES} from '../../models/state';
import {StateValidator} from '../../validators/state';

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
      state: [this.houseListing.StateInt, Validators.compose([StateValidator.noneSelected])],
      zip: [this.houseListing.Zip, Validators.compose([Validators.pattern('[0-9]{5}'), Validators.maxLength(5), Validators.required, StateValidator.noneSelected])]
    });
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  saveHome() {
    this.submitAttempt = true;

    
  }
}
