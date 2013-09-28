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

		// ATK-------------------------------------------------------
		this.ATKB = function(){
			return this.aSTR;
		};
		this.ATKMRP = function(newVal){
			if(typeof newVal !== "number"){
				return this.aATKMRP || 0;
			}
			this.aATKMRP = newVal;
			return this;
		};
		this.ATKMRT = function(newVal){
			if(typeof newVal !== "number"){
				return this._aATKMRT || 0;
			}
			this._aATKMRT = newVal;
			return this;
		};
		this.ATKMR = function(){
			return this.ATKMRP() + this.ATKMRT();
		};
		this.ATKMA = function(newVal){
			if(this.aATKMA !== "number"){
				return this.aATKMA;
			}
			this.aATKMA = newVal;
			return this;
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
		this.DEFMRP = function(newVal, isAdd){
			if(typeof newVal !== "number"){
				return this.aDEFMRP || 0;
			}
			this.aDEFMRP = isAdd? this.DEFMRP() + newVal : newVal;
			return this;
		};
		this.DEFMRT = function(newVal, isAdd){
			if(typeof newVal !== "number"){
				return this._aDEFMRT || 0;
			}
			this._aDEFMRT = isAdd ? this.DEFMRT() + newVal : newVal;
			return this;
		};
		this.DEFMR = function(){
			return this.DEFMRP() + this.DEFMRT();
		};
		this.DEFMA = function(newVal, isAdd){
			if(typeof newVal !== "number"){
				return this.aDEFMA || 0;
			}
			this.aDEFMA = isAdd ? this.DEFMA() + newVal : newVal;
			return this;
		};
		this.DEF = function(){
			return this.DEFB() * (1 + 0.01 * this.DEFMR()) + this.DEFMA();
		};
		// MHP-------------------------------------------------------
		this.MHPB = function(){
			return this.aVIT * 25;
		};
		this.MHPMRP = function(newVal, isAdd){
			if(typeof newVal !== "number"){
				return this.aMHPMRP || 0;
			}
			this.aMHPMRP = isAdd ? this.MHPMRP() + newVal : newVal;
			return this;
		};
		this.MHPMRT = function(newVal, isAdd){
			if(typeof newVal !== "number"){
				return this._aMHPMRT || 0;
			}
			this._aMHPMRT = isAdd ? this.MHPMRT() + newVal : newVal;
			return this;
		};
		this.MHPMR = function(){
			return this.MHPMRP() + this.MHPMRT();
		};
		this.MHPMA = function(newVal, isAdd){
			if(typeof newVal !== "number"){
				return this.aMHPMA || 0;
			}
			this.aMHPMA = isAdd ? this.MHPMA() + newVal : newVal;
			return this;
		};
		this.MHP = function(){
			return parseInt(this.MHPB() * (1 + 0.01 * this.MHPMR()) + this.MHPMA());
		};
		// CHP-------------------------------------------------------
		this.CHP = function(newVal, isAdd){
			if(typeof newVal !== "number"){
				return this.aCHP || 0;
			}
			this.aCHP = isAdd ? this.CHP() + newVal : newVal;
			return this;
		};
		// gold--------------------------------------------------------
		this.GOLD = function(newVal, isAdd){
			if(typeof newVal != "number"){
				return this.aGOLD || 0;
			}
			this.aGOLD = isAdd ? this.GOLD() + newVal : newVal;
		};
		// CP--------------------------------------------------------
		this.CP = function(newVal, isAdd){
			if(typeof newVal != "number"){
				return this.aCP || 0;
			}
			this.aCP = isAdd ? this.CP() + newVal : newVal;
		};
		// SP--------------------------------------------------------
		this.SP = function(newVal, isAdd){
			if(typeof newVal != "number"){
				return this.aSP || 0;
			}
			this.aSP = isAdd ? this.SP() + newVal : newVal;
		};
		// CEXP---------------------------------------------------------
		this.CEXP = function(newVal, isAdd){
			if(typeof newVal != "number"){
				return this.aCEXP || 0;
			}
			this.aCEXP = isAdd ? this.CEXP() + newVal : newVal;
			return this;
		};
		this.MEXP = function(){
			return parseInt(this.aLV * this.aLV + 2 * this.aLV + 2) * (5 + Math.atan(this.aINT / 50) * 14 / Math.PI);
		};
		// general----------------------------------------------------
		this.attr = function(attrName, newVal, isAdd){
			// args:
			//    attrName: "STR", "VIT", "INT", "LUK"
			attrName = "a" + attrName;
			if(typeof newVal !== "number"){
				return this[attrName] || 0;
			}
			var oldVal = this[attrName] || 0;
			newVal = this[attrName] = isAdd ? oldVal + newVal : newVal;
			if(oldVal != newVal){
				var types = null;
				switch(attrName){
					case "aSTR":
					case "aLUK": types = ["ATKMAX", "ATKMIN"]; break;
					case "aVIT": types = ["MHP", "DEF"]; break;
					case "aINT": types = ["MEXP"]; break;
				}
				this.emit("update_status", types);
			}
		};
	};
});