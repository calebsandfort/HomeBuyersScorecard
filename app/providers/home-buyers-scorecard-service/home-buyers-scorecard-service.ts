import {Injectable, EventEmitter} from '@angular/core';
import {Q} from '../../q';
import {User} from "../../models/user";
import {RedFinResult} from "../../models/redFinResult";
import {HouseListing} from "../../models/houseListing";
import {Device} from 'ionic-native';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

declare var breeze: any;

breeze.config.setQ(Q);

@Injectable()
export class HomeBuyersScorecardService {
  //<editor-fold desc="Properties">
  private _manager: any; // no type def for EM yet
  private _store: any;
  private currentUser: User;
  private metadataSet: boolean;
  //</editor-fold>

  public currentUserSet$: EventEmitter<User>;
  public currentUserError$: EventEmitter<string>;

  //<editor-fold desc="Constructor">
  constructor(private http: Http) {
    //let serviceName = "http://guerillalogisticsapi.azurewebsites.net/breeze/GolfApp";
    let serviceName = "http://10.16.1.142/GuerillaLogisticsApi/breeze/HomeBuyersScorecardApp";
    this._manager = new breeze.EntityManager(serviceName);
    this.metadataSet = false;

    this._store = this._manager.metadataStore;

    this._store.registerEntityTypeCtor('HouseListing', function () {
      this.StateInt = 0;
    });

    this._store.registerEntityTypeCtor('HomeBuyersScorecardUsers', function () {
      this.DefaultStateInt = 0;
    });

    this.currentUserSet$ = new EventEmitter<User>();
    this.currentUserError$ = new EventEmitter<string>();
  }
  //</editor-fold>

  getDetailsFromRedFinByMlsNumber(): Promise<HouseListing> {
    return this.http.get("http://dev-csandfort.gwi.com/GuerillaLogisticsApi/api/HouseListingLookup/GetByMls?city=Vancouver&state=47&mls=16233200")
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }

  //<editor-fold desc="fetchMetadata()">
  fetchMetadata() {
    var that = this;
    return this._manager.fetchMetadata()
      .then(function () {
        that.metadataSet = true;
      }).catch(failed);

    function failed(error) {
      var msg = "Query failed: " + error.message;
      console.error(msg);
      return Promise.reject(msg); // use ES6 promise within A2 app
    }
  }
  //</editor-fold>

  //<editor-fold desc="Users">
  //<editor-fold desc="setCurrentUser()">
  setCurrentUser(forceRefresh: boolean) {
    var findPredicate = this.getUserFindPredicate();
    let deviceId: string = Device.device.uuid;
    var that = this;
    let userFromCatch = (!forceRefresh && this.metadataSet) ? that.getUserFromCatch() : null;

    if (userFromCatch) {

      return new Promise(function (resolve) {
        that.currentUser = userFromCatch;
        that.currentUserSet$.emit(that.currentUser);
        resolve();
      });
    }
    else {
      return breeze.EntityQuery
        .from('HomeBuyersScorecardUsers')
        .expand('HouseListings')
        .where(findPredicate)
        .take(1)
        .using(this._manager).execute()
        .then(success).catch(failed);
    }

    function success(data) {
      let user = data.results.length == 1 ? data.results[0] : null;

      if (user == null) {
        that.currentUserError$.emit("no user found: " + deviceId);

        that.createUser(deviceId)
          .then(() => {
            let createdUserFromCatch = that.getUserFromCatch();

            that.currentUser = createdUserFromCatch;
            that.currentUserSet$.emit(that.currentUser);
          })
          .catch((emsg: string) => {
            that.currentUserError$.emit(emsg);
          });
      }
      else {
        that.currentUser = user;
        that.currentUserSet$.emit(that.currentUser);
      }
    }

    function failed(error) {
      var msg = "Query failed: " + error.message;
      console.error(msg);
      that.currentUserError$.emit(msg);
      return Promise.reject(msg); // use ES6 promise within A2 app
    }
  }

  getUserFindPredicate() {
    var findPredicate;
    let deviceId: string = Device.device.uuid;

    if (typeof (deviceId) == "undefined") {
      findPredicate = new breeze.Predicate("DeviceId", breeze.FilterQueryOp.Equals, "95f85a94316023f7");
    }
    else {
      findPredicate = new breeze.Predicate("DeviceId", breeze.FilterQueryOp.Equals, deviceId);
    }

    return findPredicate;
  }

  getUserFromCatch() {
    var findPredicate = this.getUserFindPredicate();

    let usersFromCatchQuery = breeze.EntityQuery
      .from('Users')
      .where(findPredicate)
      .take(1);

    let usersFromCatch = this._manager.executeQueryLocally(usersFromCatchQuery);
    let userFromCatch = usersFromCatch.length == 1 ? usersFromCatch[0] : null;

    return userFromCatch
  }

  createUser(deviceId: string) {
    var that = this;
    var userType = this._manager.metadataStore.getEntityType("User");
    //noinspection TypeScriptUnresolvedVariable
    userType.setProperties({ autoGeneratedKeyType: breeze.AutoGeneratedKeyType.Identity });

    let user: User = new User();
    user.DeviceId = deviceId;

    var userEntity = this._manager.createEntity("User", user);

    return this._manager.saveChanges([userEntity]).then(success).catch(failed);

    function success(result) {
      return result;
    }

    function failed(error) {
      var msg = "Query failed: " + error.message;
      console.error(msg);
      return Promise.reject(msg); // use ES6 promise within A2 app
    }
  }
  //</editor-fold>

  getCurrentUser() {
    return this.currentUser;
  }
  //</editor-fold>

  saveHouseListing(houseListing: HouseListing) {
    let isNew: boolean = typeof (houseListing.Identifier) == "undefined";

    if (isNew) {

    }
    else {

    }
  }
}

