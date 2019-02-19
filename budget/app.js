//Budget Controller


var budgetController = (function(){
	/*var x =23;
	var add = function(a){
		return x + a;
	}
	return {
		publicTest: function(b){
			return add(b);
		}
	}*/
	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};
	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		}else{
			this.percentage = -1;
		}
		
	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		})
		data.totals[type] = sum;
	};
	var data = {
		allItems:{
			exp: [],
			inc: []
		},	
		totals:{
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;

			//[1,2,3,4,5] next = 6
			//[1,2,4,6,8] next = 9
			//ID = last ID + 1

			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}else{
				ID = 0;
			}
			if(type === 'exp'){
				newItem = new Expense(ID, des, val);
			}else if(type === 'inc'){
				newItem = new Income(ID, des, val);
			}

			data.allItems[type].push(newItem);
			return newItem;
		
		},

		deleteItem: function(type, id){
			var ids, index;
			ids = data.allItems[type].map(function(cur){
				return cur.id;
			});
			index = ids.indexOf(id);
			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function(){
			//calculate total income and expenses
			calculateTotal('inc');
			calculateTotal('exp');
			//calculate budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			//calculate the percentage of income that we spent
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}
			
		},

		calculatePercentages: function(){
			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPerc;
		},
		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},
		
		testing: function(){
			console.log(data);
		}
	}
})();

// UI Controller

var UIController = (function(){
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn:'.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'


	};
	var formatNumber = function(num, type){
			/* Rules of displaying:
			1) + or - before number;
			2) exactly 2 decimal points;
			3) comma separating the thounds

			2300.4567 -> + 2,300.46
			*/
			var numSplit, numInt, numDec;
			num = Math.abs(num);
			num = num.toFixed(2);
			numSplit = num.split('.');
			numInt = numSplit[0];
			if(numInt.length > 3){
				numInt = numInt.substr(0,numInt.length - 3) + ',' + numInt.substr(numInt.length - 3, 3);
			}
			numDec = numSplit[1];

			

			return (type === 'exp' ? '-' : '+') + ' ' + numInt + '.' + numDec;

	};

	var nodeListForEach = function(list, callback){
				for(var i = 0; i < list.length; i++){
					callback(list[i], i);
				}
	};

	return {
		getInput: function(){
			return {
				type:document.querySelector(DOMStrings.inputType).value,
				description:document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
				}
			},

		addListItem: function(obj, type){
			//create HTML string
			var html, newHTML, element;
			if(type === 'inc'){
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}else if(type === 'exp'){
				element = DOMStrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			//replace text with actual data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

			//insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
			
			return 
		},

		deleteListItem: function(selectorId){
			var el = document.getElementById(selectorId);
			el.parentNode.removeChild(el);
		},

		clearFields: function(){
			var fields, fieldsArray;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
			fieldsArray = Array.prototype.slice.call(fields);
			fieldsArray.forEach(function(current){
				current.value = "";
			});
		},
		
		displayBudget: function(obj){
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			if(obj.percentage > 0){
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';	
			}else{
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
			
		},

		displayPercentages: function(percentages){
			var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
			
			nodeListForEach(fields, function(cur, index){
				if(percentages[index] > 0){
					cur.textContent = percentages[index] + '%';
				}else{
					cur.textContent = '---';
				}
				
			});
		},

		displayMonth: function(){
			var now, year, months, month;
			now = new Date();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];
			month = now.getMonth();
			//var date = new Date(2015, 11, 24);
			year = now.getFullYear();
			document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
		},

		changedType: function(){
			var fields = document.querySelectorAll(
				DOMStrings.inputType + ',' +
				DOMStrings.inputDescription + ',' +
				DOMStrings.inputValue
				);
			nodeListForEach(fields, function(cur){
				cur.classList.toggle('red-focus');
			});
			document.querySelector(DOMStrings.inputBtn).classList.toggle('red');	
		},	

		getDOMStrings: function(){
				return DOMStrings;
		}


	
	}
})();

//Global App Controller

var controller = (function(budgetCtrl, UICtrl){
	/*var z = budgetCtrl.publicTest(5);
	return {
		anotherPublic: function(){
			console.log(z);
		}
	}*/

	var setupEventListeners = function(){
		var DOM = UICtrl.getDOMStrings();
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlGetItem);
		document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13){
				ctrlGetItem();
			}
		});
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

	};

	var updateBudget = function(){
		//1)calculate the budget
		budgetCtrl.calculateBudget();
		//2)return the budget
		var budget = budgetCtrl.getBudget();
		console.log(budget);
		//3)display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function(){
		//1) calculate percentages
		budgetCtrl.calculatePercentages();
		//2) read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		//3) update the UI with the new percentages
		UICtrl.displayPercentages(percentages);
	};

	var ctrlGetItem = function(){
		var input, newItem;
		//1) get input data
		input = UICtrl.getInput();
		//console.log(input);
		if(input.description !== '' && !isNaN(input.value) && input.value > 0){
			//2) add item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			//3) add the item to the UI
			UICtrl.addListItem(newItem, input.type);
			//4)clear the fields
			UICtrl.clearFields();
			//5 CALCULATE AND UPDATE BUDGET
			updateBudget();
			//6) calculate and update the precentages
			updatePercentages();
		}
		
	};
	var ctrlDeleteItem = function(event){
		var itemId, splitId, type, ID;
		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemId){
			splitId = itemId.split('-');
			type = splitId[0];
			ID = parseInt(splitId[1]);
		}

		//1. delete the item from data
		budgetCtrl.deleteItem(type, ID);
		//2. delete the item from the UI
		UICtrl.deleteListItem(itemId);
		//3. update and show new budget
		updateBudget();
		//4) calculate and update the precentages
		updatePercentages();
	};
	return {
		init: function(){
			console.log('Application has started.');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	}
	
})(budgetController, UIController);

controller.init();