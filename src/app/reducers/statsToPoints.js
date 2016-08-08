const STARTING_XI = 0;
const SUBS = 2;
const GOALS = 3;
const ASSISTS = 4;
const YELLOW_CARDS = 5;
const RED_CARDS = 6;
const CLEAN_SHEETS = 7;
const CONCEEDED = 8;
const SAVED_PENALTIES = 10;

// todo: shouldnt have to update object here
export default function points(data, timeFrame){
  this.players = this.calculatePlayers(data.players, timeFrame);
  this.unknown = data.unknown;
  this.updatedOn = data.updatedOn;
};

points.prototype.calculatePlayers = function(players, timeFrame = 'season'){
  return players.map((player) => {
    const points = this.calculatePlayer(player.stats[timeFrame], player.pos);
    return {
      ...player,
      ffPoints: { ...points }
    };
  });
};

points.prototype.calculatePlayer = function(stats, pos){
  var goals = this.forGoals(stats[GOALS], pos);
  var yells = this.forYellowCards(stats[YELLOW_CARDS], pos);
  var reds = this.forRedCards(stats[RED_CARDS], pos);
  var starts = this.forStarting( stats[STARTING_XI], pos);
  var subs = this.forSub( stats[SUBS], pos);
  var asts = this.forAssists( stats[ASSISTS], pos);
  var cs = this.forCleanSheet(stats[CLEAN_SHEETS], pos);
  var con = this.forConceeded(stats[CONCEEDED], pos);
  var penSvd = this.forPenaltiesSaved(stats[SAVED_PENALTIES], pos);
  var total = goals + yells + reds + starts + subs + asts + cs + con;
  return {
    starts, subs, goals,  asts, cs, con, penSvd, yells, reds, total
  }
};



points.prototype.forStarting = function(starts, position){ //starting a match 3 point
  return starts * 3;
};

points.prototype.forSub = function(subs, position){ //sub = 1 point
  return subs * 1;
};

points.prototype.forGoals = function(goals, position){//depends on position
  var multiplier = 0;
  if (position == 'GK'){
    multiplier = 10;
  } else  if (position == 'FB' || position == 'CB'){
    multiplier = 8;
  } else if (position == 'WM' || position == 'CM'){
    multiplier = 6;
  } else if (position == 'STR'){
    multiplier = 4;
  }
  return goals * multiplier;
};

points.prototype.forAssists = function(assists, position){//assist = 3 points
  return assists * 3;
};

points.prototype.forYellowCards = function(yc, position){ //-2
  return yc * -2;
};

points.prototype.forRedCards = function(rc, position){ //-5
  return rc * -5;
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

points.prototype.forPenaltiesSaved = function(ps, position){ //-1
  var multiplier = 5;
  return ps * multiplier;
};
