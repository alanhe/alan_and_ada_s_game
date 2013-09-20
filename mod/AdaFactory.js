define(["./roles/Ada", "./data/adaTitles", "./data/skillList", "./Utils"], function(Ada, adaTitles, skillList, Utils){
	var exports = {};

	var genAtk = function(lv){
		return parseInt(Math.random() * lv * 10) + 10;
	};

	var genTitle = function(ada){
		var title_rate = 100;

		if (Math.random() * 100 > title_rate){
			return;
		}

		//TODO: more than one title can be applied
		var title = adaTitles[parseInt(Math.random() * adaTitles.length)];
		ada.title = title.name;
		ada[title.effect] = parseInt(ada[title.effect] * (100 + title.percent) / 100);
	};
	
	var genSkills = function(ada){
		var next_skill_rate = 50;
		var skill_num = 0;
		while(next_skill_rate > 0){
			if (Math.random() * 100 < next_skill_rate){
				skill_num++;
			}
			next_skill_rate -= 20;
		}
		if (skill_num == 0){
			return;
		}
		var skillIdxList = Utils.random(skill_num, skillList.length, 0, true);
		for(var i=0,j=skillIdxList.length; i<j; i++){
			ada.equipedSkills.push(new skillList[skillIdxList[i]]);
		}
	};

	exports.newAda = function(args){
		// args.name;
		// ({name: eee, name2:eee})

		// args.lv
		var ada = new Ada();
		ada.lv 			= args.lv;
		ada.name 		= "Ada" + parseInt(Math.random() * 100);
		ada.m_hp		= parseInt(Math.random() * ada.lv * 50) + 100;
		ada.atk			= genAtk(ada.lv);
		ada.m_mp		= 0;
		ada.exp			= ada.lv;
		ada.gold		= ada.lv * 5;
		ada.drop_rate	= 100;

		genTitle(ada);
		genSkills(ada);

		ada.c_hp		= ada.m_hp;
		ada.c_mp		= ada.m_mp;

		return ada;
	};

	return exports;
});