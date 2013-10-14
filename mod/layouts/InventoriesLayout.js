define(["text!./InventoriesLayout.html", "../items/Equipment", "../EventEmitter", "link!./InventoriesLayout.css"], function(sHTML, Equipment, EventEmitter){
	var UPGRADE = "inventory_upgrade",
		EQUIP = "inventory_equip",
		SALE = "inventory_sale";

	var getInventories = function(self, position){
		var filter,
			numEquipment = 0;
		if(self.btnHead === position){
			numEquipment = self.numHead;
			filter = function(position){
				return position === Equipment.TYPE_HEAD;
			};
		} else if (self.btnHand === position){
			numEquipment = self.numHand;
			filter = function(position){
				return position >= Equipment.TYPE_HAND_EITHER && position <= Equipment.TYPE_HAND_BOTH;
			};
		} else if (self.btnBody === position){
			numEquipment = self.numBody;
			filter = function(position){
				return position === Equipment.TYPE_BODY;
			};
		}

		var ret = [];

		if(numEquipment !== 0){
			var inventories = self.hero.getInventories(),
				equipment = undefined;
			for(var i = 0, l = inventories.length; i < l; ++i){
				equipment = inventories[i];
				if(filter(equipment.position)){
					ret.push(equipment);
				}
			}
		}

		return ret;
	};

	var countInventories = function(self){
		var inventories = self.hero.getInventories();
		for(var i = inventories.length - 1; i > -1; --i){
			switch(inventories[i].position){
			case Equipment.TYPE_HEAD:
				++self.numHead;
				break;
			case Equipment.TYPE_BODY:
				++self.numBody;
				break;
			default:
				// this.TYPE_HAND_EITHER = 2;
				// this.TYPE_HAND_LEFT = 3;
				// this.TYPE_HAND_RIGHT = 4;
				// this.TYPE_HAND_BOTH = 5;
				++self.numHand;
			}
		}
	};

	var setButtonLabels = function(self){
		self.btnHead.html(self.numHead != 0 ? "Head(" + self.numHead + ")" : "Head");
		self.btnHand.html(self.numHand != 0 ? "Hand(" + self.numHand + ")" : "Hand");
		self.btnBody.html(self.numBody != 0 ? "Body(" + self.numBody + ")" : "Body");
	};

	return function(){
		$.extend(this, new EventEmitter());
		var self = this;

		this.numHead = 0;
		this.numHand = 0;
		this.numBody = 0;

		this.setup = function(args){
			this.hero = args.hero;
			this.domNode = $(sHTML);
			this.btnHead = this.domNode.find(".btn_head");
			this.btnHand = this.domNode.find(".btn_hand");
			this.btnBody = this.domNode.find(".btn_body");
			this.btnSelected = undefined;
			this.lvInventories = this.domNode.find("ul");
			this.toolbar = this.domNode.find(".toolbar");
			this.btnUpgrade = this.toolbar.find(".btn_upgrade");
			this.btnEquip = this.toolbar.find(".btn_equip");
			this.btnSale = this.toolbar.find(".btn_sale");

			this.toolbar.detach();

			countInventories(self);
			setButtonLabels(self);

			this.btnHead.click(function(){
				self.switchTab(self.btnHead);
			});
			this.btnHand.click(function(){
				self.switchTab(self.btnHand);
			});
			this.btnBody.click(function(){
				self.switchTab(self.btnBody);
			});

			this.lvInventories.on("mouseenter", "li", function(){
				self.toolbar.prependTo(this);
			});

			this.lvInventories.on("mouseleave", "li", function(){
				self.toolbar.detach();
			});

			// connect Dashboard------------------------------------------------
			this.btnUpgrade.click(function(){
				var id = $(this).parent().parent().data("uuid");

				self.emit(UPGRADE, uuid);
			});

			this.btnEquip.click(function(){
				var nodeLi = self.btnSale.parent().parent(),
					uuid = nodeLi.data("uuid");

				self.emit(EQUIP, uuid);
			});

			this.btnSale.click(function(){
				var nodeLi = self.btnSale.parent().parent(),
					uuid = nodeLi.data("uuid");
				self.toolbar.detach();
				nodeLi.remove();

				self.emit(SALE, uuid);
			});

			this.switchTab(this.btnHead);
			this.domNode.appendTo(args.domNode);
		};

		this.switchTab = function(newTab){
			if(self.btnSelected === newTab){
				return;
			}
			if(self.btnSelected){
				self.btnSelected.removeClass("selected");
			}
			self.btnSelected = newTab;
			self.btnSelected.addClass("selected");

			self.createListItems();
		};

		this.createListItems = function(){
			self.lvInventories.empty();

			var inventories = getInventories(self, self.btnSelected);
			self.listInventories(inventories);
		};

		this._getInventoryDisplayName = function(inventory){
			return inventory.upgrades ? (inventory.name + "(+" + inventory.upgrades + ")") : inventory.name;
		};

		this.listInventories = function(inventories){
			var fragment = document.createDocumentFragment();
			for(var i = 0, l = inventories.length; i < l; ++i){
				var inventory = inventories[i],
					nodeInventory = $("<li><span>" + this._getInventoryDisplayName(inventory) + "</span></li>");
				nodeInventory.data("uuid", inventory.id);
				nodeInventory.appendTo(fragment);
			}
			this.lvInventories[0].appendChild(fragment);
		};

		this.destroy = function(){
			this.domNode.remove();
		};
	};
});