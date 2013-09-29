define(["../EventEmitter"], function(EventEmitter){
	return function(){
		$.extend(this, {
			aCHP: 1,
			aSTR: 1,
			aVIT: 1,
			aINT: 1,
			aLUK: 1,
			aCP: 0, // status points
			aSP: 0, // skill points

			aGOLD: 0,

			aLV: 1, // current level
			aCEXP: 0, // EXP gained since this level
			aMEXP: 0, // max EXP needed to level up

			// aATKMRP;   m - modification, r -ratio, p - permanent
			// _aATKMRT;  t - temporary
			// aATKMA;    a - absolute modification
			}, new EventEmitter());

        this.attr = function(attrName, newVal, isAdd, types, stopEmit){
            // args:
            //    attrName is like: "aSTR", "aVIT", "aINT", "aLUK"
            if(typeof newVal !== "number"){
                return this[attrName] || 0;
            }
            var oldVal = this[attrName] || 0;
            newVal = this[attrName] = isAdd ? oldVal + newVal : newVal;
            if(stopEmit !== true){
                this.emitUpdate(types, oldVal, newVal);
            }
            return this;
        };
		// ATK-------------------------------------------------------
		this.ATKB = function(){
			return this.aSTR;
		};
		this.ATKMRP = function(newVal, isAdd, stopEmit){
			return this.attr("aATKMRP", newVal, isAdd, ["ATKMIN", "ATKMAX"], stopEmit);
		};
		this.ATKMRT = function(newVal, isAdd, stopEmit){
			return this.attr("_aATKMRT", newVal, isAdd, ["ATKMIN", "ATKMAX"], stopEmit);
		};
		this.ATKMR = function(){
			return this.ATKMRP() + this.ATKMRT();
		};
		this.ATKMA = function(newVal, isAdd, stopEmit){
			return this.attr("aATKMA", newVal, isAdd, ["ATKMIN", "ATKMAX"], stopEmit);
		};
		this.ATKFR = function(){
			return Math.atan(this.aLUK / 50) * 2 / Math.PI;
		};
		this._getATK = function(r1, r2){
			return (this.ATKB() * (1 + 0.01 * this.ATKMR()) + this.ATKMR()) * (r1 + r2 * this.ATKFR());
		};
		this.ATKMAX = function(){
			return this._getATK(1.3, 0.7);
		};
		this.ATKMIN = function(){
			return this._getATK(0.3, 0.3);
		};
		// DEF-------------------------------------------------------
		this.DEFB = function(){
			return this.aVIT / 5;
		};
		this.DEFMRP = function(newVal, isAdd, stopEmit){
			return this.attr("aDEFMRP", newVal, isAdd, ["DEF"], stopEmit);
		};
		this.DEFMRT = function(newVal, isAdd, stopEmit){
			return this.attr("_aDEFMRT", newVal, isAdd, ["DEF"], stopEmit);
		};
		this.DEFMR = function(){
			return this.DEFMRP() + this.DEFMRT();
		};
		this.DEFMA = function(newVal, isAdd, stopEmit){
			return this.attr("aDEFMA", newVal, isAdd, ["DEF"], stopEmit);
		};
		this.DEF = function(){
			return this.DEFB() * (1 + 0.01 * this.DEFMR()) + this.DEFMA();
		};
		// MHP-------------------------------------------------------
		this.MHPB = function(){
			return this.aVIT * 25;
		};
		this.MHPMRP = function(newVal, isAdd, stopEmit){
			return this.attr("aMHPMRP", newVal, isAdd, ["MHP"], stopEmit);
		};
		this.MHPMRT = function(newVal, isAdd, stopEmit){
		    return this.attr("_aMHPMRT", newVal, isAdd, ["MHP"], stopEmit);
		};
		this.MHPMR = function(){
			return this.MHPMRP() + this.MHPMRT();
		};
		this.MHPMA = function(newVal, isAdd, stopEmit){
		    return this.attr("aMHPMA", newVal, isAdd, ["MHP"], stopEmit);
		};
		this.MHP = function(){
			return parseInt(this.MHPB() * (1 + 0.01 * this.MHPMR()) + this.MHPMA());
		};
		// CHP-------------------------------------------------------
		this.CHP = function(newVal, isAdd, stopEmit){
		    // args:
		    //    if newVal is not null, it should be an integer.
		    //    Can CHP be lager than MHP for some skill/buff effect?
			if(typeof newVal !== "number"){
				return this.aCHP || 0;
			}
			var oldVal = this.CHP(),
			     mHP = this.MHP();
			newVal = isAdd ? oldVal + newVal : newVal;
			newVal = (newVal < 0) ? 0 : newVal;
			newVal = (newVal > mHP) ? mHP : newVal;
			this.aCHP = newVal;
			if(stopEmit !== true){
                this.emitUpdate(["CHP"], oldVal, newVal);
            }
			return this;
		};
		// MEXP-------------------------------------------------------
		this._getNEXP = function(lv){
		    return parseInt((lv * lv + 2 * lv + 2) * (5 - Math.atan(this.aINT / 50) * 14 / Math.PI));
		};
		this.MEXP = function(){
		    return this._getNEXP(this.aLV);
		};
		
		this._getUPLV = function(cexp, lv){
            var up = 0, next;
            
            while(cexp >= (next = this._getNEXP(lv + up))){
                cexp -= next;
                ++up;
            }
            return {
                cexp: cexp,
                up: up
            };
		};
		
		this.CEXP = function(newVal, isAdd, stopEmit){
            if(typeof newVal !== "number"){
                return this.aCEXP || 0;
            }
            var oldVal = this.aCEXP || 0;
            newVal = isAdd ? oldVal + newVal : newVal;
            
            var upLevel = this._getUPLV(newVal, this.LV());
            
            if(upLevel.up !== 0){
                this.LV(upLevel.up, true);
            }
            
            this.aCEXP = newVal = upLevel.cexp;
            if(stopEmit !== true){
                this.emitUpdate(["CEXP"], oldVal, newVal);
            }
            return this;
        };
        
        this._getNCP = function(lv){
            return parseInt(lv / 5) + 3;
        };
        this._getNSP = function(lv){
            return 1;
        };
        this.LV = function(newVal, isAdd, stopEmit){
            if(typeof newVal !== "number"){
                return this.aLV || 0;
            }
            if(typeof isAdd === "undefined"){
                throw "sAdd must be set in LV()!";
            }
            
            var 
                  up = newVal,
                oldVal = this.aLV,
                newVal = oldVal + up,
                sumCP = 0,
                sumSP = 0;
            
            for(var i = 0; i < up; ++i){
                sumCP += this._getNCP(this.aLV);
                sumSP += this._getNSP(this.aLV);
                ++this.aLV;
            }
            if(sumCP != 0){
                this.CP(sumCP, true);
            }
            if(sumSP != 0){
                this.SP(sumSP, true);
            }
            if(stopEmit !== true){
                this.emitUpdate(["LV"], oldVal, newVal);
            }
            return this;
        };
		this.STR = function(newVal, isAdd, stopEmit){
		    return this.attr("aSTR", newVal, isAdd, ["STR", "ATKMIN", "ATKMAX"], stopEmit);
		};
		this.VIT = function(newVal, isAdd, stopEmit){
		    return this.attr("aVIT", newVal, isAdd, ["VIT", "MHP", "DEF"], stopEmit);
		};
		this.INT = function(newVal, isAdd, stopEmit){
		    if(typeof newVal !== "number"){
		        return this.aINT || 0;
		    }
            var oldVal = this.aINT || 0;
            newVal = this.aINT = isAdd ? oldVal + newVal : newVal;
            var cexp = this.CEXP();
            if(cexp > this.MEXP()){
                this.CEXP(cexp);
            }
            if(stopEmit !== true){
                this.emitUpdate(["INT"], oldVal, newVal);
            }
            return this;
		};
		this.LUK = function(newVal, isAdd, stopEmit){
		    return this.attr("aLUK", newVal, isAdd, ["LUK", "ATKMIN", "ATKMAX"], stopEmit);
		};
		// general----------------------------------------------------
		this.GOLD = function(newVal, isAdd, stopEmit){
		    return this.attr("aGold", newVal, isAdd, ["GOLD"], stopEmit);
		};
		this.CP = function(newVal, isAdd, stopEmit){
		    return this.attr("aCP", newVal, isAdd, ["CP"], stopEmit);
		};
		this.SP = function(newVal, isAdd, stopEmit){
		    return this.attr("aSP", newVal, isAdd, ["SP"], stopEmit);
		};
		
		// Utils functions:---------------------------------------------------
		this.isDead = function(){
		    return this.aCHP === 0;
		};
		this.getSkills = function(){
		    return this.equipedSkills;
		};
		this.emitUpdate = function(types, oldVal, newVal){
		    if(typeof oldVal !== "undefined" && oldVal !== newVal){
		        this.emit("update_status", types, oldVal, newVal);
		    }
		};
		this._getUpdateCost = function(oldVal){
		    return parseInt(oldVal / 10) + 3; 
		};
	};
});