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
  newDestination.rating = 0;
  newDestination.noOfPeopleRated = 0;
  newDestination.noOfPeopleVisited = 0;
  
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
  
  var destination = factory.newRelationship(ns, "Destination", detail.destinationName);
  current.visited.push(destination);
  if(current.toVisit.includes(destination)){
  	current.toVisit.splice(current.toVisit.indexOf(destination) ,1);
  }
  
  await touristRegistry.update(current);
  
  var destinationRegistry = await getAssetRegistry(ns+'.Destination');
  var destination_a = await destinationRegistry.get(detail.destinationName);
  
  destination_a.noOfPeopleVisited += 1;
  
  await destinationRegistry.update(destination_a);
}

/**
* Rate Location
* @param {com.pax.tourism.RateLocation} detail
* @transaction
*/
async function rateLocation(detail){
  var ns = "com.pax.tourism";
  var factory = getFactory();
  var destinationRegistry = await getAssetRegistry(ns+'.Destination');
  var destination = await destinationRegistry.get(detail.destinationName);
  
  var rating = destination.rating * destination.noOfPeopleRated;
  rating += detail.rating;
  destination.noOfPeopleRated += 1;
  destination.rating = rating/destination.noOfPeopleRated;
  
  await destinationRegistry.update(destination);
}