function awale() {
	var me = this;
	me.content = [];
	me.score = {};
	me.turn = 1;
	
	me.init = function(ihm) {
		me.content = [4,4,4,4,4,4,4,4,4,4,4,4];
		me.score.j1 = 0;
		me.score.j2 = 0;
		me.turn = 1;
		if (ihm)
			me.updateIHM();
	};
	
	me.createId = function(index) {
		return "#case" + index;
	}
	
	me.currentPlayer = function() {
		return "j" + me.turn;
	}
	
	me.isBeatableCase = function(indexCase) {
		if (me.content[indexCase] != 2 && me.content[indexCase] != 3)
			return false;
		if (me.turn == 1 && indexCase >= 0 && indexCase <= 5)
			return true;
		if (me.turn == 2 && indexCase >= 6 && indexCase <= 11)
			return true;
		return false;
	}
	
	me.isPlayableCase = function(indexCase) {
		if (me.content[indexCase] == 0)
			return false;
		if (me.turn == 2 && indexCase >= 0 && indexCase <= 5)
			return true;
		if (me.turn == 1 && indexCase >= 6 && indexCase <= 11)
			return true;
		return false;
	}
	
	me.nextCase = function(indexCase) {
		if (indexCase < 11) {
			return indexCase + 1;
		}
		return 0;
	}
	
	me.prevCase = function(indexCase) {
		if (indexCase > 0) {
			return indexCase - 1;
		}
		return 11;
	}
	
	me.nextTurn = function() {
		if(me.turn == 2)
			return 1;
		return 2;
	}
	
	me.verifFeedPlayer = function(indexCase) {
		var b = new awale ();
		b.init(false);
		b.turn = me.turn;
		me.content.forEach(function(val, idx) {
			b.content[idx] = val;
		});
		b.onButtonClick(indexCase, true, true);
		
		if (b.turn == 1 && b.content[6] == 0 && b.content[7] == 0 && b.content[8] == 0 && b.content[9] == 0 && b.content[10] == 0 && b.content[11] == 0)
			return false;
		if (b.turn == 2 && b.content[0] == 0 && b.content[1] == 0 && b.content[2] == 0 && b.content[3] == 0 && b.content[4] == 0 && b.content[5] == 0)
			return false;
		return true;
	}
	
	me.verifDontStarvePlayer = function(indexCase, caseToEmpty) {
		var b = new awale ();
		b.init(false);
		b.turn = me.turn;
		me.content.forEach(function(val, idx) {
			b.content[idx] = val;
		});
		
		caseToEmpty.forEach(function(val, index) {
			b.content[val] = 0;
		});
		
		if (b.turn == 2 && b.content[6] == 0 && b.content[7] == 0 && b.content[8] == 0 && b.content[9] == 0 && b.content[10] == 0 && b.content[11] == 0)
			return false;
		if (b.turn == 1 && b.content[0] == 0 && b.content[1] == 0 && b.content[2] == 0 && b.content[3] == 0 && b.content[4] == 0 && b.content[5] == 0)
			return false;
		return true;
	}
	
	me.verifPlayerCanPlay = function() {
		var listCase = [];
		var playerCanPlay = false;
		if (me.turn == 1)
			listCase = [6,7,8,9,10,11];
		if (me.turn == 2)
			listCase = [0,1,2,3,4,5];
		listCase.forEach(function(val) {
			if (me.verifFeedPlayer(val))
				playerCanPlay = true;
		});
		return playerCanPlay;
	}
	
	me.onButtonClick = function(indexCase, b, dontTakeSeeds) {
		if (!me.isPlayableCase(indexCase))
			return;
		if (!b) {
			if (!me.verifFeedPlayer(indexCase)) {
				if (me.verifPlayerCanPlay())
					return;
				if (!b)
					me.endOfGame();
			}
		}
		var nbSeeds = me.content[indexCase];
		var currentCase = indexCase;
		var scoreToAdd = 0;
		var caseToEmpty = [];
		
		me.content[indexCase] = 0;
		for (nbSeeds; nbSeeds>0; nbSeeds--) {
			currentCase = me.nextCase(currentCase);
			if (currentCase == indexCase)
				currentCase = me.nextCase(currentCase);
			me.content[currentCase] += 1;
			if (!me.isBeatableCase(currentCase) || dontTakeSeeds) {
				scoreToAdd = 0;
				caseToEmpty = [];
			}
			else {
				scoreToAdd += me.content[currentCase];
				caseToEmpty.push(currentCase);
			}
		}
		if (me.verifDontStarvePlayer(indexCase, caseToEmpty)) {
			caseToEmpty.forEach(function(val, index) {
				me.content[val] = 0;
			});
			me.score[me.currentPlayer()] += scoreToAdd;
		}
		me.turn = me.nextTurn();
		if (!b)	{
			me.updateIHM();
			var nbSeeds = 0;
			me.content.forEach(function(val, idx) {
				nbSeeds += val;
			});
			if (nbSeeds < 6 || me.score.j1 >= 25 || me.score.j1 >= 26)
				me.endOfGame ();
		}
		
	}
	
	me.updateIHM = function() {
		me.content.forEach(function(val, index) {
			$(me.createId(index)).val(val);
		});
		$("#scoreJ1").text("Joueur1: " + me.score.j1);
		$("#scoreJ2").text("Joueur2: " + me.score.j2);
		$("#turn").text("Au joueur "+me.turn+" de jouer!");
	};
	
	me.endOfGame = function() {
		var winner = -1;
		if (me.score.j1 > me.score.j2)
			winner = 1
		if (me.score.j2 > me.score.j1)
			winner = 2
		if (winner != -1)
			alert("Le joueur " + winner + " à gagné");
		if (winner == -1)
			alert("Égalité! Les deux joueurs ont le même score.");
	}
}

var a = new awale();
a.init(true);