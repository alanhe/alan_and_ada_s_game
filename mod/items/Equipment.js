define(["../Utils"], function(Utils){

	var exports = function(){
		// this.name;
		// this.description;
		// this.effects = [
		//   {
		//	 	baseATRMA: 40,
		//      baseUpdateMoney: 40,
		//      updateAttr
		//	 }
		//];
		//this.position = this.TYPE_HEAD;

		this.id = Utils.createUUID(); // Every equipment should have an unique id.

		this.upgrades = 0;
	};

	// constants:
	exports.TYPE_HEAD = 1;
	exports.TYPE_HAND_EITHER = 2;
	exports.TYPE_HAND_LEFT = 3;
	exports.TYPE_HAND_RIGHT = 4;
	exports.TYPE_HAND_BOTH = 5;
	exports.TYPE_BODY = 6;

	return exports;
});