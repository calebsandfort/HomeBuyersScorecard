import { Pipe, PipeTransform } from '@angular/core';
import {HouseListing} from '../models/houseListing';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'houseListingDisplay'})
export class HouseListingDisplayPipe implements PipeTransform {
  transform(houseListing: HouseListing): string {
    let ret:string = '';

    if(typeof(houseListing.Nickname) != 'undfined' && houseListing.Nickname != ''){
        ret = houseListing.Nickname;
    }
    else if(typeof(houseListing.AddressLine1) != 'undfined' && houseListing.AddressLine1 != ''){
        ret = houseListing.AddressLine1;
    }

    return ret;
  }
}