import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type Entry = {
    propertyType : Text;
    east : Float;
    west : Float;
    north : Float;
    south : Float;
    unit : Text;
    unitRate : Float;
    roomsCount : Nat;
    totalArea : Float;
    totalValue : Float;
    timestamp : Time.Time;
  };

  module Entry {
    public func compare(e1 : Entry, e2 : Entry) : Order.Order {
      Float.compare(e1.totalValue, e2.totalValue);
    };
  };

  let entries = Map.empty<Nat, Entry>();
  var nextId = 0;

  public shared ({ caller }) func addEntry(propertyType : Text, east : Float, west : Float, north : Float, south : Float, unit : Text, unitRate : Float, roomsCount : Nat, totalArea : Float, totalValue : Float) : async Nat {
    let timestamp = Time.now();
    let entry : Entry = {
      propertyType;
      east;
      west;
      north;
      south;
      unit;
      unitRate;
      roomsCount;
      totalArea;
      totalValue;
      timestamp;
    };
    entries.add(nextId, entry);
    nextId += 1;
    nextId - 1;
  };

  public query ({ caller }) func getAllEntries() : async [Entry] {
    entries.values().toArray().sort();
  };

  public shared ({ caller }) func clearEntries() : async () {
    entries.clear();
    nextId := 0;
  };
};
