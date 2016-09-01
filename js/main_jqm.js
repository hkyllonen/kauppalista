// These arrays are global, not too elegant
/**
 * Array of groceryItems e.g current Kauppalista
 */
var groceryItems = [];

/**
 * Array of all ListItems entered, ever
 */
var allItems = [];

/**
 * The GroceryItem and related functions.
 * GroceryItem is used in one shopping list.
 */
function GroceryItem(name, amount) 
{
	this.name = name;
	this.amount = amount;
	this.purchased = false;
	this.id = name + Math.floor((Math.random()*100)+1);
}	

/**
 * Get a groceryItem from array based on 
 * @param id
 */
function getGroceryItem(id)
{
	for( var index in groceryItems) {
		if (id == groceryItems[index].id)
			return groceryItems[index];
	}
	return null;
}

/**
 * The ListItem and related functions.
 * ListItems are collected from all GroceryItems entered.
 * The idea is to be able to maintain an all time favourite item list.
 * @param name
 * @param count
 */
function ListItem(name, count) 
{
	this.name = name;
	this.count = count;
}

/**
 * Update count on ListItem
 */
ListItem.prototype.append = function() 
{
	this.count++;
	return this.count;
}

/**
 * Compare function for ListItems. Used when sorting.
 */
function compareListItems(a,b) 
{
  if (a.count < b.count)
     return -1;
  if (a.count > b.count)
    return 1;
  return 0;
}

/**
 * Sort ListItems based on count
 */
function sortListItems()
{
	allItems.sort(compareListItems);
}

/**
 * Helper to flatten ListItems to string array
 */
function getListItemName(listItem)
{
	return listItem.name;
}

/**
 * Local storage methods
 */
function storeListItems()
{
	sortListItems();
	localStorage.setObject("goods", allItems);
}

function loadListItems()
{
	var items = localStorage.getObject("goods");
	if( items != null ) {
		//check if items is an array, using underscore.js here
		if(_.isArray(items)) {
			allItems = items;
		} else {
			//alert("Arrayn lataus ei onnistunut");
		}
	}
}

function clearListItems()
{
	allItems = [];
	localStorage.setItem("goods", allItems);
	
	viewItemsInUI();
}

/** 
 * Remove one list item and store the rest.
 * @param name. The name of the list item to remove.
 */
function removeListItem(name)
{
	for( var index in allItems) {
		if (name == allItems[index].name) {
			allItems.splice(index, 1);
			localStorage.setObject("goods", allItems);
			return;
		}
	}
}

/**
 * New method to Storage class to allow serializing objects.
 * http://stackoverflow.com/a/3146971
 */
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

/**
 * New method to Storage class to allow serializing objects.
 */
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

/** 
 * GroceryItems CRUD functions
 * Store all grocery items.
 */
function storeGroceryItems()
{
	localStorage.setObject("shoppinglist", groceryItems);
}

/** 
 * GroceryItems CRUD functions
 * Remove one grocery item and store the rest.
 */
function removeGroceryItem(id)
{
	for(var index in groceryItems) {
		if (id == groceryItems[index].id) {
			groceryItems.splice(index, 1);
			localStorage.setObject("shoppinglist", groceryItems);
			return;
		}
	}
}

/** 
 * GroceryItems CRUD functions
 * Load all grocery items from local storage.
 */
function loadGroceryItems()
{
	var items = localStorage.getObject("shoppinglist");
	if( items != null ) {
		//check if items is an array
		if(_.isArray(items)) {
			groceryItems = items;
		} else {
			// This will happen on first run
			//alert("Kauppalistan lataus ei onnistunut");
		}
	}
}

/**
 * Add new GroceryItem via form input
 * @param form. Form element, but not used since accessing relevant inputs via jQuery.
 */
function addItemViaUi(form) 
{
	var inputText = $('#nameInput');
	var amountText = $('#amountInput');
	
	//add here the item and amount
	var item = new GroceryItem(inputText.val(), amountText.val());
	
	groceryItems.push(item);
	storeGroceryItems();
	updateListItem(inputText.val());
	addNewUiItem(item);
	//empty the input text field
	inputText.val("");
}

/**
 * Update the counts in allItems list and store the results
 * @param itemName. The good to search for.
 */
function updateListItem(itemName)
{	
	//make sure that we have up to date list
	loadListItems();

	//Now search for ListItem with same name and append count if found
	var result = $.grep(allItems, function(e){ return e.name == itemName; });
	
	if( result.length > 0) {
		result[0].count++;
	} else {
		//If not found then add new ListItem
		var listItem = new ListItem(itemName, 1);
		allItems.push(listItem);
	}
	storeListItems();
}

/**
 * The most important UI related function. This is called whenever
 * the grocery items list changes.
 * The idea is to keep up two lists in UI. One with items not yet
 * picked and other with picked up items. Clicking on each row
 * toggles the placement of the item.
 */
function addNewUiItem(groceryItem)
{
	//list rows with label and count bubble
	var li = $('<li></li>').text(groceryItem.name);
	li.attr("id", groceryItem.id);
	//For the life of me I can't figure out why this is not rendering correctly
	//in desktop Chrome. Looks like a bug in Chrome or jQuery Mobile.
	var span = $('<span class="ui-li-count"></span>').text(groceryItem.amount);
	li.append(span);
	
	var ul1 = $('#ulPicked');
	var ul2 = $('#ulNonPicked');
	
	if(groceryItem.purchased) {
		ul1.append(li);
	} else {
		ul2.append(li);
	}
	
	// Bind an event to an anonymous event listener function
	$(li).bind("click", function(event) {
		var id = $(this).attr("id");
		//toggle the groceryItem purchased state
		toggleItem(getGroceryItem(id));
		//now trigger to refresh the UI lists
		$('#ulNonPicked').empty();
		$('#ulPicked').empty();
		for( var index in groceryItems) {
			addNewUiItem(groceryItems[index]);
		}
	});
	
	// Refreshing magic apparently required by the jQuery Mobile
	if (ul1.hasClass('ui-listview')) {
		ul1.listview('refresh');
	} else {
		ul1.trigger('create');
	}
	if (ul2.hasClass('ui-listview')) {
		ul2.listview('refresh');
	} else {
		ul2.trigger('create');
	}
	// And remember to update the autocompleter list too
	$("#nameInput").autocomplete("update", {
		source: allItems.map(getListItemName),
	});
}

/**
 * Toggle and save purchased state
 * @param item. Grocery item which state is changed.
 */
function toggleItem(item)
{
	if( item != null) {
		item.purchased = !item.purchased;
	}
	storeGroceryItems();
}

/**
 * Removal of groceryItems. 
 * UI and logic/engine not as decoupled as it should be.
 */
function clearGroceryList()
{
	//empty the array and store
	groceryItems = [];
	storeGroceryItems();
	
	var form = document.getElementById("addItemForm");
	var list = document.getElementById("itemListDiv");
	form.itemName.value = "";
	form.itemAmount.value = "";
	
	var ul = $('#ulNonPicked');
	ul.empty();
	var ul2 = $('#ulPicked');
	ul2.empty();
}

/**
 * ListItems UI view
 */
function viewItemsInUI()
{
	var ul = $('#allItems');
	ul.empty(); 

	for( var index in allItems) {
		var li = $('<li data-role="fieldcontain"></li>').text(allItems[index].name);
		li.attr("id", allItems[index].name);
		var span = $('<span class="ui-li-count"></span>').text(allItems[index].count);
		//span.attr("id", allItems[index].name);
		li.append(span);
		ul.append(li);
		
		// Bind an event to an anonymous event listener function
		$(li).bind("click", function(event) {
			var name = $(this).attr("id");
			removeListItem(name);
			viewItemsInUI();
		});
	}
	
	if (ul.hasClass('ui-listview')) {
		ul.listview('refresh');
	} else {
		ul.trigger('create');
	}
}

/**
 * On #main pageshow event reload everything
 */
$("#main").bind("pageshow", function(e) {
	loadListItems();
	loadGroceryItems();
	var ul = $('#ulNonPicked');
	ul.empty();
	var ul2 = $('#ulPicked');
	ul2.empty();
	for( var index in groceryItems) {
		addNewUiItem(groceryItems[index]);
	}
	// jqm autocomplete https://github.com/commadelimited/autoComplete.js/blob/master/array.html
	$("#nameInput").autocomplete({
		target: $('#suggestions'),
		source: allItems.map(getListItemName),
		link: '#about',
		minLength: 1,
		matchFromStart: false,
		callback: function(e) {
			// access the selected item
			var $a = $(e.currentTarget);
			// place the value of the selection into the search box
			$('#nameInput').val($a.text());
			// clear the listview
			$("#nameInput").autocomplete('clear');
		}
	});
});

/**
 * Function for rapidly adding test data. Commented out in final version.
 *
function addTestItems(form)
{
	loadListItems();
	
	for( var i=0;i<5;i++) {
		var inputText = "ruoka" + Math.floor((Math.random()*10)+1);
		var item = new GroceryItem(inputText, Math.floor((Math.random()*3)+1));
		groceryItems.push(item);
		updateListItem(inputText);
		addNewUiItem(item);
	}
}*/


