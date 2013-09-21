define(["./Timer", "./EventEmitter", "./AdaFactory", "./Utils"], function(Timer, EventEmitter, AdaFactory, Utils){
	// Message:
	//		msg_atk_new_enemies, [], array of roles
	//      msg_atk_gen_damages, {}

	var exports = $.extend({
		//party1: undefined
		//party2: undefined
		//callback: undefined
		//failback: undefined
		// timer: undefined
		isActive: false,
		tick: 1000
	}, new EventEmitter());

	exports.toParty = function(party){
		party.takeDamages = function(damages, damage_type){
			for(var i = party.length - 1; i > -1; --i){
				party[i].takeDamages(damages, damage_type);
			}
		};

		party.getAliveRoles = function(){
			var ret = [];
			for(var i = party.length - 1; i > -1; --i){
				if(!party[i].isDead()){
					ret.push(party[i]);
				}
			}
			return exports.toParty(ret);
		};

		party.isAllDead = function(){
			for(var i = party.length - 1; i > -1; --i){
				if(!party[i].isDead()){
					return false;
				}
			}
			return true;
		};
		return party;
	};

	exports.triggerPassiveSkills = function(args){
		//args
		// aliveParty [party1, party2]
		for(var iParty=0; iParty<2; iParty++){
			for(var iRole=0,jPartyLength=args.aliveParty[iParty].length; iRole<jPartyLength; iRole++){
				var role = args.aliveParty[iParty][iRole];
				var canCastSkillList = role.onEvent("Passive");

				for(var iSkill=0; iSkill<canCastSkillList.length; iSkill++){
					canCastSkillList[iSkill].cast({
						caster: role,
						party1: args.aliveParty[iParty],
						party2: args.aliveParty[1- iParty]
					});
				}
			}
		}
	};

	exports.triggerSkills = function(args){
		//args
		// aliveParty [party1, party2]
		// participant [roleInParty1, roleInParty2]
		// evt: BeforeAttack, AfterAttack
		// attackParty: 1 or 2
		var attackParty = args.attackParty == 1 ? 0 : 1;
		for(var iPartyIdx=0; iPartyIdx<2; iPartyIdx++){
			var role = args.participant[iPartyIdx];
			var canCastSkillList = [];
			//send event
			if(args.evt == "BeforeAttack"){
				if (iPartyIdx == attackParty){
					canCastSkillList = role.onEvent("OnAttack");
				}
			}
			else if(args.evt == "AfterAttack"){
				if (iPartyIdx != attackParty){
					canCastSkillList = role.onEvent("BeHit");
					if (role.isDead()){
						Utils.joinArray(canCastSkillList, role.onEvent("OnDie"));
					}
				}
			}
			//cast skill
			if (canCastSkillList.length > 0){
				for(var iSkill=0; iSkill<canCastSkillList.length; iSkill++){
					var logInfo = canCastSkillList[iSkill].cast({
						caster: role,
						victim: args.participant[1- iPartyIdx],
						party1: args.aliveParty[iPartyIdx],
						party2: args.aliveParty[1- iPartyIdx]
					});
					this.emit("msg_atk_gen_damages", logInfo);
				}
			}
		}
	};

	exports.newEnemies = function(hero){
		var ret = [],
			i = parseInt(Math.random() * 3); // index in range [0, 3], total of 4;
		for(; i > -1; --i){
			ret.push(AdaFactory.newAda({lv: hero.lv}));
		}
		this.emit("msg_atk_new_enemies", ret);
		return exports.toParty(ret);
	};

	exports.calculateDamage = function(toRole, fromRole, partyAttack){
		//TODO: add more complex logic here;
		var damage = fromRole.atk,
			c_hp = toRole.c_hp - damage;
		toRole.setAttribute("c_hp", c_hp < 0 ? 0 : c_hp);
		this.emit("msg_atk_gen_damages", {
			toRole: toRole,
			fromRole: fromRole,
			damage: damage
		});
	};

	exports.attack = function(args){
		var aliveParty1 = exports.party1.getAliveRoles(),
			aliveParty2 = exports.party2.getAliveRoles(),
			partyAttack = args.count % 2 ? 1 : 2,
			role1 = aliveParty1[parseInt(Math.random() * aliveParty1.length)],
			role2 = aliveParty2[parseInt(Math.random() * aliveParty2.length)],
			roles = (function(role1, role2, partyAtk){
				var ret = {};
				if(partyAtk == 1){
					ret.fromRole = role1;
					ret.toRole = role2;
				} else {
					ret.fromRole = role2;
					ret.toRole = role1;
				}
				return ret;
			})(role1,
			   role2,
			   partyAttack);

		for(var i=0,j=aliveParty2.length; i<j; i++){
			aliveParty2[i].newRound();
		}

		exports.triggerSkills({
			aliveParty: [aliveParty1, aliveParty2],
			participant: [role1, role2],
			evt: "BeforeAttack",
			attackParty: partyAttack});

		if(roles.toRole && roles.fromRole){
			//exports.calculateDamage(roles.toRole, roles.fromRole, partyAttack);
		}

		exports.triggerSkills({
			aliveParty: [aliveParty1, aliveParty2],
			participant: [role1, role2],
			evt: "AfterAttack",
			attackParty: partyAttack});

		var allDead1 = exports.party1.isAllDead(),
			allDead2 = exports.party2.isAllDead();
		if(allDead1 || allDead2){ // if fight ends:
			exports.timer.stop();
			var callback = allDead2 ? exports.callback : exports.failback;
			if($.isFunction(callback)){
				callback(exports.party2);
			}
			exports.reset();
		}
	};

	exports.newFight = function(args){
		if(this.isActive){
			return;
		}
		this.isActive = true;
		this.party1 = exports.toParty(args.party1);
		this.party2 = this.newEnemies(this.party1[0]);
		this.callback = args.callback;
		this.failback = args.failback;

		exports.triggerPassiveSkills({
			aliveParty: [this.party1, this.party2]
		});

		this.timer = Timer.newTimer(this.attack, this.tick);
	};

	exports.reset = function(){
		delete this.part1;
		delete this.part2;
		delete this.callback;
		delete this.failback;
		this.tick = 1000;
		this.isActive = false;
	};

	return exports;
});