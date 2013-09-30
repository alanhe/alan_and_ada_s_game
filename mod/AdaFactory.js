define(["./roles/Ada", "./data/adaList", "./data/adaRanks", "./data/adaTitles", "./data/skillList", "./Utils"],
function(Ada, adaList, adaRanks, adaTitles, skillList, Utils){
	var exports = {};

	var getLV = function(heroLV, minLV, maxLV){
		heroLV = heroLV - heroLV % 10;
		minLV += heroLV;
		maxLV += heroLV;
		if(minLV < 1){
			minLV = 1;
		}
		return maxLV <= minLV ? minLV : Utils.random(1, maxLV, minLV)[0];
	};

	var applyTitles = function(ada){
		var titles = ada.titles;
		for(var i = titles.length - 1; i > -1; --i){
			var effects = titles[i].effects;
			for(var attrName in effects){
				ada[attrName](effects[attrName], true, true);
			}
		}
	};

	var fillTitles = function(titles, size){
		if(size === 0){
			return;
		}
		var titleIndex = Utils.random(size, adaTitles.length);
		for(var i = 0; i < size; ++i){
			titles.push(adaTitles[titleIndex[i]]);
		}
	};

	var fillSkills = function(skills, sizeMin, sizeMax){
		if(sizeMin == 0 && sizeMax == 0){
			return;
		}
		var numSkill = (sizeMin == sizeMax) ? sizeMin : Utils.random(1, sizeMax + 1, sizeMin)[0],
			skillIndex = Utils.random(numSkill, skillList.length);
		for(var i = 0; i < numSkill; ++i){
			skills.push(new skillList[skillIndex[i]]());
		}
	};

	var getAttr = function(lv, attr){
		var ret = parseInt(lv * attr);
		return ret < 1 ? 1 : ret;
	};

	var makeValid = function(ada){

		for(var i = ada.titles.length - 1; i > -1; --i){
			ada.titles[i] = ada.titles[i].name;
		}

		ada.aSTR = ada.aSTR < 1 ? 1 : parseInt(ada.aSTR);
		ada.aVIT = ada.aVIT < 1 ? 1 : parseInt(ada.aVIT);
		ada.aINT = ada.aINT < 1 ? 1 : parseInt(ada.aINT);
		ada.aLUK = ada.aLUK < 1 ? 1 : parseInt(ada.aLUK);

		// FIXME: the titles can bring negative effects, which may cause negative ATK/DEF/....etc.
		//        Fix them there.

		ada.CHP(ada.MHP());

		return ada;
	};

	exports.newAda = function(heroLV){
		// args.lv
		var rank = Utils.randomDraw(adaRanks, "encounterRate").item,
			lv = getLV(heroLV, rank.lvRange[0], rank.lvRange[1]);
			ada = $.extend(new Ada(), adaList[parseInt(Math.random() * adaList.length)]);

		fillTitles(ada.titles, rank.numTitles);
		fillSkills(ada.equipedSkills, rank.numSkills[0], rank.numSkills[1]);

		ada.lv = lv;
		ada.name = ada.name + parseInt(Math.random() * 100);
		ada.aSTR = ada.aSTR * lv;
		ada.aVIT = ada.aVIT * lv;
		ada.aINT = ada.aINT * lv;
		ada.aLUK = ada.aLUK * lv;

		ada.aCEXP = parseInt((ada.ATK() + ada.DEF()) * 0.5) + 1;
		ada.aGOLD = parseInt((ada.ATK() + ada.DEF()) * 5) + 1;

		applyTitles(ada);

		return makeValid(ada);
	};

	return exports;
});