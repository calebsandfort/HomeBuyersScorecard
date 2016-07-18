import {User} from "./user";

export class HouseListing {
    public Identifier:number;
    public Nickname:string;
    public Notes:string;
    public AddressLine1:string;
    public AddressLine2:string;
    public City:string;
    public State:string;
    public StateInt:number;
    public Zip:number;
    public Mls:string;
    public Price:number;
    public Bedrooms:number;
    public Bathrooms:number;
    public SquareFootage:number;
    
    public Kitchen:number;
    public BathroomsScore:number;
    public Location:number;
    public Neighborhood:number;
    public Schools:number;
    public Layout:number;
    public MoveInReady:number;
    public FeelsLikeHome:number;
    public Yard:number;
    public Score:number;

    public UserIdentifier:number;
    public FoundDetails:boolean;

    constructor() { 
        this.Kitchen = 0;
        this.BathroomsScore = 0;
        this.Location = 0;
        this.Neighborhood = 0;
        this.Schools = 0;
        this.Layout = 0;
        this.MoveInReady = 0;
        this.FeelsLikeHome = 0;
        this.Yard = 0;
        this.Score = 0;
        this.FoundDetails = false;
    }
}