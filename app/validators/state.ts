import {FormControl} from '@angular/forms';
 
export class StateValidator {
 
    static noneSelected(control: FormControl){
        let val:Number = Number(control.value);

        if(val == 0){
            return { "noneSelected": true}
        }

        return null;
    }
}