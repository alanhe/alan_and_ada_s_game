define(["./Timer", "./EventEmitter", "./AdaFactory", "./Utils"], function(Timer, EventEmitter, AdaFactory, Utils){
	// Message:
	//		msg_atk_new_enemies, [], array of roles
	//      msg_atk_gen_damages, {}
	//		msg_atk_interrupt, null

	var exports = $.extend({
		//party1: undefined
		//party2: undefined
		//callback: undefined
		//failback: undefined
		// timer: undefined
		isActive: false,
		tick: 1000
	}, new EventEmitter());


	var isAllDead = function(roles){
		for(var i = roles.length - 1; i > -1; --i){
			if(!roles[i].isDead()){
				return false;
			}
		}
		return true;
	};

	var getAliveRoles = function(roles){
		var ret = [];
		for(var i = roles.length -1; i > -1; --i){
			if(!roles[i].isDead()){
				ret.push(roles[i]);
			}
		}
		return ret;
	};

	exports.triggerSkills = function(args, chooseOne){
		var skills = args.fromRole.getSkills();
		for(var i = skills.length - 1; i > -1; --i){
			if(skills[i].canCast(args)){
				var logInfo =  skills[i].cast(args);
				this.emit("msg_atk_gen_damages", logInfo);
				if(chooseOne){
					return;
				}
			}
		}
	};

	exports.triggerPassiveSkills = function(party1, party2){
		var roles = {
			fromParty: party1,
			toParty: party2,
			moment: "OnPassive"
		};
		for(var i = 0; i < party1.length; ++i){
			roles.fromRole = party1[i];
			this.triggerSkills(roles, false);
		}

		roles.fromRole = party2;
		roles.toRole = party1;
		for(var i = 0; i < party2.length; ++i){
			roles.fromRole = party2[i];
			this.triggerSkills(roles, false);
		}
	};

	exports.triggerActiveSkills = function(args){
		//args:
		//  toRole
		//  toParty
		//  fromRole
		//  fromParty
		//  moment

		// For all the active skills equipped, including "ATTACK", only one will be triggered in one "hit" action;
		// Make sure that, for all roles, "ATTACK" is the 1st skill in the "equipedSkills";
		// The skills are triggered by different rates. First, the last skill is checked to see if it can be
		// triggered, then the previous one, then the previous... At last, the "ATTACK" skill is checked, which is sure to be triggered.
		this.triggerSkills(args, true);
	};

	exports.newEnemies = function(hero){
		var ret = [],
			i = Utils.random(1, 3); // index in range [0, 3], total of 4;
		for(; i > -1; --i){
			ret.push(AdaFactory.newAda({lv: hero.lv}));
		}
		this.emit("msg_atk_new_enemies", ret);
		return ret;
	};

	exports.swapRoles = function(roles){
		return {
			fromRole: roles.toRole,
			fromParty: roles.toParty,
			toRole: roles.fromRole,
			toParty: roles.fromParty
		};
	};

	exports.attack = function(args){
		var aliveParty1 = getAliveRoles(exports.party1),
			aliveParty2 = getAliveRoles(exports.party2),
			role1 = aliveParty1[Utils.random(1, aliveParty1.length)],
			role2 = aliveParty2[Utils.random(1, aliveParty2.length)],
			roles = {
				fromRole: role1,
				fromParty: aliveParty1,
				toRole: role2,
				toParty: aliveParty2
			};

		if(args.count % 2 === 0){ // party2's turn
			roles = exports.swapRoles(roles);
		}

		for(var i = aliveParty2.length - 1; i > -1; --i){
			aliveParty2[i].newRound();
		}

		//Trigger attack skills
		roles.moment = "OnAttack";
		exports.triggerActiveSkills(roles);

		//Trigger defensive skills
		roles = exports.swapRoles(roles);

		roles.moment = "OnBeHit";
		exports.triggerActiveSkills(roles);

		roles.moment = "OnDying";
		exports.triggerActiveSkills(roles);


		var isAllDead1 = isAllDead(aliveParty1),
			isAllDead2 = isAllDead(aliveParty2);

		if(isAllDead1 || isAllDead2){ // if fight ends:
			exports.timer.stop();
			var callback = isAllDead2 ? exports.callback : exports.failback;
			if($.isFunction(callback)){
				callback(exports.party2);
			}
			exports.reset();
		}
	};

	exports.newFight = function(args){
		this.isActive = true;
		this.party1 = args.party1;
		this.party2 = this.newEnemies(this.party1[0]);
		this.callback = args.callback;
		this.failback = args.failback;

		exports.triggerPassiveSkills(this.party1, this.party2);

		this.timer = Timer.newTimer(this.attack, this.tick);
	};

	exports.interrupt = function(){
		this.reset();
		this.emit("msg_atk_interrupt");
	};

	exports.reset = function(){
		if(this.timer){
			this.timer.stop();
			delete this.timer;
		}
		delete this.part1;
		delete this.part2;
		delete this.callback;
		delete this.failback;
		this.tick = 1000;
		this.isActive = false;
	};

	return exports;
});