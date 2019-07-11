var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){
            var sum = 0;
            data.allItems[type].forEach(function(cur){
                sum = sum + cur.value;
            });
            data.totals[type] = sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        addItem: function(type, des, val) {
            var newItem, ID = 0;
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            // Create new ID
           // if (data.allItems[type].length > 0) {
             //   ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            //} else {
            // ID = 0;
            //}
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);
            // Return the new element
            return newItem;
        },

         deleteItem: function(type, id){
             var ids, index;
             ids = data.allItems[type].map(function(current){
                 return current.id;
             })

             index = ids.indexOf(id);
             if(index !== -1)
             {
                 data.allItems[type].splice(index, 1); //?????????????????
             }
         },
        calculateBudget:function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            }else{
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data);
        }
    };
})();


var UIController = (function(){
    var DOMstrings = {

        inputType: '.add__type',

        inputDescription: '.add__description',

        inputValue: '.add__value',

        inputBtn: '.add__btn',

        incomeContainer: '.income__list',

        expensesContainer: '.expenses__list',

        budgetLabel: '.budget__value',

        incomeLabel: '.budget__income--value',

        expensesLabel: '.budget__expenses--value',

        percentageLabel: '.budget__expenses--percentage',
        
        dateLabel: '.budget__title--month',

        container: '.container'

      
    };
    return {

        getInput: function() {

            return {

                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp

                description: document.querySelector(DOMstrings.inputDescription).value,

                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };

        },
    
        addListItem: function(obj, type) {

            var html, newHtml, element;

            // Create HTML string with placeholder text

            

            if (type === 'inc') {

                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
                        // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

//selectorID...???
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); //slice converts list to array
            fieldsArr.forEach(function(cur, i, array){
                cur.value = "";
            });
            fieldsArr[0].focus();
        },


  displayBudget: function(obj){

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
             }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';

             }
        },
        
displayDate: function(){
    var now, year, month, months;
    now = new Date();
    months = ['jan', 'feb', 'mar', 'april', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec'];
    month = now.getMonth();

    year = now.getFullYear();
    document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
},


        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();

var controller = (function(budgetCtrl, UICtrl) {
    var setupEventListeners = function() {
        var deleteBtn = document.querySelector('.item__delete--btn');
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
            
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };


var updateBudget = function(){
    budgetCtrl.calculateBudget();

    var budget = budgetCtrl.getBudget();

    UICtrl.displayBudget(budget);
};


    var ctrlAddItem = function() {
        var input, newItem;
        // 1. Get the field input data !isNaN(input.value)
        input = UICtrl.getInput();   
        if(input.description !== "" && input.value !== NaN && input.value != 0){
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //clear fields
            UICtrl.clearFields();
            updateBudget();  
        }     
            };

var ctrlDeleteItem = function(event){
    var itemID, splitID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        budgetCtrl.deleteItem(type, ID);

        UICtrl.deleteListItem(itemID);

        updateBudget();


    }
};
    return {
        init: function() {
            UICtrl.displayDate();
            UICtrl.displayBudget({
                
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }      

    };
})(budgetController, UIController);

controller.init();