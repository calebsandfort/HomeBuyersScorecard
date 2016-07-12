import {FormControl} from '@angular/forms';
 
export class MyValidators {
 
    static noneSelected(control: FormControl){
        let val:Number = Number(control.value);

        if(val == 0){
            return { "noneSelected": true}
        }

        return null;
    }

    static isPositiveNumber(control: FormControl){
        if(control.value <= 0){
            return { "isPositiveNumber": true}
        }

        return null;
    }
}