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
				for(var iSkill=0,jSkillLength=canCastSkillList.length; iSkill<jSkillLength; iSkill++){
					canCastSkillList[iSkill].cast({
						caster: role,
						victim: args.participant[1- iPartyIdx],
						party1: args.aliveParty[iPartyIdx],
						party2: args.aliveParty[1- iPartyIdx]
					});
				}
			}
		}
	};

	exports.getAliveRoles = function(party){
		var ret = [];
		for(var i = party.length - 1; i > -1; --i){
			if(party[i].c_hp > 0){
				ret.push(party[i]);
			}
		}
		return ret;
	};

	exports.isAllDead = function(party){
		for(var i = party.length - 1; i > -1; --i){
			if(party[i].c_hp > 0){
				return false;
			}
		}
		return true;
	};

	exports.newEnemies = function(hero){
		var ret = [],
			i = parseInt(Math.random() * 3); // index in range [0, 3], total of 4;
		for(; i > -1; --i){
			ret.push(AdaFactory.newAda({lv: hero.lv}));
		}
		this.emit("msg_atk_new_enemies", ret);
		return ret;
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
		var aliveParty1 = exports.getAliveRoles(exports.party1),
			aliveParty2 = exports.getAliveRoles(exports.party2),
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

		var allDead1 = exports.isAllDead(exports.party1),
			allDead2 = exports.isAllDead(exports.party2);
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
		this.party1 = args.party1;
		this.party2 = this.newEnemies(this.party1[0]);
		this.callback = args.callback;
		this.failback = args.failback;

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