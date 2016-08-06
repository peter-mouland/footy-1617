const STARTING_XI = 0;
const SUBS = 2;
const GOALS = 3;
const ASSISTS = 4;
const YELLOW_CARDS = 5;
const RED_CARDS = 6;
const CLEAN_SHEETS = 7;
const CONCEEDED = 8;
const SAVED_PENALTIES = 10;

export default function points(stats){
  this.total = this.calculatePlayer(stats);
};

points.prototype.calculatePlayer = function(stats){
  var forGoals = this.forGoals(stats[GOALS], stats['pos']);
  var forYellowCards = this.forYellowCards(stats[YELLOW_CARDS], stats['pos']);
  var forRedCards = this.forRedCards(stats[RED_CARDS], stats['pos']);
  var forStarting = this.forStarting( stats[STARTING_XI], stats['pos']);
  var forSub = this.forSub( stats[SUBS], stats['pos']);
  var forAssists = this.forAssists( stats[ASSISTS], stats['pos']);
  var forCleanSheet = this.forCleanSheet(stats[CLEAN_SHEETS], stats['pos']);
  var forGoalAgainst = this.forConceeded(stats[CONCEEDED], stats['pos']);
  return forGoals + forYellowCards + forRedCards + forStarting + forSub + forAssists + forCleanSheet + forGoalAgainst;
};



points.prototype.forStarting = function(starts, position){ //starting a match 3 point
  return starts * 3;
};

points.prototype.forSub = function(subs, position){ //sub = 1 point
  return subs * 1;
};

points.prototype.forGoals = function(goals, position){//depends on position
  var multiplier;
  if (position == 'GK'){
    multiplier = 10;
  } else  if (position == 'FB' || position == 'CB'){
    multiplier = 8;
  } else if (position == 'WM' || position == 'CM'){
    multiplier = 6;
  } else if (position == 'FWD'){
    multiplier = 4;
  } else {
    console.log('Position not found : ', position);
  }
  return goals * multiplier;
};

points.prototype.forAssists = function(assists, position){//assist = 3 points
  return assists * 3;
};

points.prototype.forYellowCards = function(yc, position){ //-2
  return yc * 2;
};

points.prototype.forRedCards = function(rc, position){ //-5
  return rc * 5;
};

points.prototype.forCleanSheet = function(cs, position){ //5
  var multiplier;
  if ((position == 'FB' || position == 'CB') || position == 'GK'){
    multiplier = 5;
  } else  {
    multiplier = 0;
  }
  return cs * multiplier;
};

points.prototype.forConceeded = function(ga, position){ //-1
  var multiplier;
  if ((position == 'FB' || position == 'CB') || position == 'GK'){
    multiplier = -1;
  } else  {
    multiplier = 0;
  }
  return ga * multiplier;
};
