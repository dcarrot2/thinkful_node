var percentageTip = 15;
var fixedTaxPercentage = 8.5
var billTotal = 0.0;

// Create diner objects which represent a single diner
var Diner = function(name){
	this.name = name;
	this.dishes = [];
	this.subTotal = 0.0;
	this.total = 0.0;
	this.splitTip = 0.0;
	this.tax = 0.0;
};

Diner.prototype.addDish = function(dish){
	this.dishes.push(dish);
};

// Simple sum return doesn't need own Diner attribute?
Diner.prototype.sumDishes = function(){
	var sum = 0;
	for(var i=0; i<this.dishes.length; i++){
		sum += this.dishes[i].price;
	}
	return sum;
};

Diner.prototype.foodTax = function(){
	return this.subTotal * (fixedTaxPercentage / 100);
};

Diner.prototype.totalCost = function(tax){
	return costOfDishes + tax;
};

// Create dish objects
var Dish = function(name, price){
	this.name = name;
	this.price = price;
};

// program functions

function calculateTip(numDiners, total){
	return ((percentageTip / 100) * total);
};

function calculateBill(diners){
	var totalSubTotal = 0;
	var splitTip = 0;
	for(var i=0; i<diners.length; i++){
		var subTotal = 0;
		for(j = 0; j < diners[i].dishes.length; j++){
			subTotal += diners[i].dishes[j].price;
		}
		diners[i].subTotal = subTotal;
		diners[i].tax = diners[i].foodTax();
		totalSubTotal += subTotal;
	}

	splitTip = calculateTip(diners.length, totalSubTotal);

	for(var i=0; i<diners.length; i++){
		diners[i].splitTip = splitTip / diners.length;
		diners[i].total = diners[i].subTotal + diners[i].tax + diners[i].splitTip;
	}

};

function printBill(diners){
	calculateBill(diners);
	billTotal = 0.0;
	console.log("Bill of Diners");
	for(var i=0; i<diners.length;i++){
		console.log(diners[i].name);
		for(j=0; j<diners[i].dishes.length;j++){
			console.log(diners[i].dishes[j].name + " - $" + diners[i].dishes[j].price.toFixed(2));
		}
		billTotal += diners[i].total;
		console.log("Subtotal - $" + diners[i].subTotal.toFixed(2));
		console.log("Tax - $" + diners[i].tax.toFixed(2));
		console.log("Split tip - $" + diners[i].splitTip.toFixed(2));
		console.log("Total - $" + diners[i].total.toFixed(3) + '\n');
	}
	console.log("Total - $" + billTotal.toFixed(2));
};

// program vars

var daniel = new Diner("Daniel");
var bri = new Diner("Bri");
var elias = new Diner("Elias");
var miranda = new Diner("Miranda");
var friends = [daniel, bri, elias, miranda];

var curry = new Dish("Curry", 5.34);
var burger = new Dish("Burger", 5.00);
var nuggies = new Dish("Nuggies", 2.32);
var nachos = new Dish("Nachos", 6.23);

daniel.addDish(curry);
daniel.addDish(burger);
bri.addDish(nuggies);
elias.addDish(nachos);
miranda.addDish(burger);

printBill(friends);


