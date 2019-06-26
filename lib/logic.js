/**
 * New script file
 */


/**
* CreateTourist
* @param {com.pax.tourism.CreateTourist} detail
* @transaction
*/
async function createTourist(detail){
  var ns = "com.pax.tourism";
  var factory = getFactory();
  var newTourist = factory.newResource(ns, "Tourist", detail.emailId);
  newTourist.name = detail.name;
  newTourist.age = detail.age;
  newTourist.gender = detail.gender;
  newTourist.balance = detail.balance;
  newTourist.country = detail.country;
  newTourist.phoneNumber = detail.phoneNumber;
  newTourist.visited = [];
  newTourist.toVisit = [];
  
  var touristRegistry = await getParticipantRegistry(ns+'.Tourist');
  await touristRegistry.add(newTourist);
}

/**
* Create Destination
* @param{com.pax.tourism.CreateDestination} detail
* @transaction
*/
async function createDestination(detail){
  var ns = "com.pax.tourism";
  var factory = getFactory();
  var newDestination = factory.newResource(ns, "Destination", detail.destinationName);
  newDestination.latitude = detail.latitude;
  newDestination.longitude = detail.longitude;
  newDestination.specialities = detail.specialities;
  newDestination.hotels = detail.hotels;
  
  var destinationRegistry = await getAssetRegistry(ns+'.Destination');
  await destinationRegistry.add(newDestination);
}

/**
* Create LocationToVisit
* @param{com.pax.tourism.LocationToVisit} detail
* @transaction
*/
async function locationToVisit(detail){
  var ns = "com.pax.tourism";
  var factory = getFactory();
  //var current = getCurrentParticipant();
  
  var touristRegistry = await getParticipantRegistry(ns+'.Tourist');
  var current = await touristRegistry.get(detail.emailId);
  
  current.toVisit.push(factory.newRelationship(ns, "Destination", detail.destinationName));
  
  await touristRegistry.update(current);
}

/**
* Create LocationToVisit
* @param{com.pax.tourism.VisitLocation} detail
* @transaction
*/
async function visitLocation(detail){
  var ns = "com.pax.tourism";
  var factory = getFactory();
  //var current = getCurrentParticipant();
  var touristRegistry = await getParticipantRegistry(ns+'.Tourist');
  var current = await touristRegistry.get(detail.emailId);
  
  current.visited.push(factory.newRelationship(ns, "Destination", detail.destinationName));
  if(current.toVisit.includes(factory.newRelationship(ns, "Destination", detail.destinationName))){
  	current.toVisit.splice(current.toVisit.indexOf(factory.newRelationship(ns, "Destination", detail.destinationName)),1);
  }
  
  await touristRegistry.update(current);
}