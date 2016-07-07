import {HouseListing} from './houseListing';

export class User {
    public Identifier:number;
    public DeviceId:string;
    public PushId:string;
    public HouseListings:HouseListing[];

    constructor() { }
}