import {HouseListing} from './houseListing';

export class User {
    public Identifier:number;
    public DeviceId:string;
    public PushId:string;
    public DefaultCity:string;
    public DefaultState:string;
    public DefaultStateInt:number;
    public DefaultsSet:boolean;
    public HouseListings:HouseListing[];

    constructor() { }
}