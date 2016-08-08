const STARTING_XI = 0;
const SUBS = 2;
const GOALS = 3;
const ASSISTS = 4;
const YELLOW_CARDS = 5;
const RED_CARDS = 6;
const CLEAN_SHEETS = 7;
const CONCEEDED = 8;
const SAVED_PENALTIES = 10;

function forStarting(starts) { // starting a match 3 point
  return starts * 3;
}

function forSub(subs) { // sub = 1 point
  return subs * 1;
}

function forGoals(goals, position) { // depends on position
  let multiplier = 0;
  if (position === 'GK') {
    multiplier = 10;
  } else if (position === 'FB' || position === 'CB') {
    multiplier = 8;
  } else if (position === 'WM' || position === 'CM') {
    multiplier = 6;
  } else if (position === 'STR') {
    multiplier = 4;
  }
  return goals * multiplier;
}

function forAssists(assists) { // assist = 3 points
  return assists * 3;
}

function forYellowCards(yc) { // -2
  return yc * -2;
}

function forRedCards(rc) { // -5
  return rc * -5;
}

function forCleanSheet(cs, position) { // 5
  let multiplier;
  if ((position === 'FB' || position === 'CB') || position === 'GK') {
    multiplier = 5;
  } else {
    multiplier = 0;
  }
  return cs * multiplier;
}

function forConceeded(ga, position) { // -1
  let multiplier;
  if ((position === 'FB' || position === 'CB') || position === 'GK') {
    multiplier = -1;
  } else {
    multiplier = 0;
  }
  return ga * multiplier;
}

function forPenaltiesSaved(ps) { // -1
  return ps * 5;
}


// todo: shouldnt have to update object here
export default function StatsToPoints(data, timeFrame = 'season') {
  this.players = this.calculatePlayers(data.players, timeFrame);
  this.unknown = data.unknown;
  this.updatedOn = data.updatedOn;
}

StatsToPoints.prototype.calculatePlayer = function calculatePlayer(stats, pos) {
  const goals = forGoals(stats[GOALS], pos);
  const yells = forYellowCards(stats[YELLOW_CARDS], pos);
  const reds = forRedCards(stats[RED_CARDS], pos);
  const starts = forStarting(stats[STARTING_XI], pos);
  const subs = forSub(stats[SUBS], pos);
  const asts = forAssists(stats[ASSISTS], pos);
  const cs = forCleanSheet(stats[CLEAN_SHEETS], pos);
  const con = forConceeded(stats[CONCEEDED], pos);
  const penSvd = forPenaltiesSaved(stats[SAVED_PENALTIES], pos);
  const total = goals + yells + reds + starts + subs + asts + cs + con;
  return {
    starts, subs, goals, asts, cs, con, penSvd, yells, reds, total
  };
};

StatsToPoints.prototype.calculatePlayers = function calculatePlayers(players, timeFrame) {
  return players.map((player) => {
    const ffPoints = this.calculatePlayer(player.stats[timeFrame], player.pos);
    return {
      ...player,
      ffPoints
    };
  });
};
