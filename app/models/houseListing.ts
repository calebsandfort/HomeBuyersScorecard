import {User} from "./user";

export class HouseListing {
    public Identifier:number;
    public AddressLine1:string;
    public AddressLine2:string;
    public City:string;
    public State:string;
    public StateInt:number;
    public Zip:number;
    public Price:number;
    public Bedrooms:number;
    public Bathrooms:number;
    public SquareFootage:number;
    
    public Neighborhood:number;
    public Schools:number;
    public Layout:number;
    public Yard:number;
    public MoveInReady:number;
    public GutFeeling:number;

    public UserIdentifier:number;

    constructor() { }
}