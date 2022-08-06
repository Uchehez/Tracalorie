
// Storage Controller
const storageCtrl = (function () {

  // public methods
  return {
    storeItem: function (item) {
      let items;
      //check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        // push new item
        items.push(item);
        //set LS
        localStorage.setItem('items', JSON.stringify(items));

      } else {
        //get what is already in LS
        items = JSON.parse(localStorage.getItem('items'));
        //push new item
        items.push(item);
        //re set LS
        localStorage.setItem('items', JSON.stringify(items));

      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let Items = JSON.parse(localStorage.getItem('items'));
      Items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          Items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(Items));
    },
    deleteItemFromStorage: function (id) {
      let Items = JSON.parse(localStorage.getItem('items'));
      Items.forEach(function (item, index) {
        if (id === item.id) {
          Items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(Items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }


  }
})();







// Item Controller
const ItemCrtl = (function () {
  // item constructor
  const item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data structure/state
  const data = {
    // initially used to test 
    // items: [
    // { id: 0, name: "Steak Dinner", calories: 1200 },
    // { id: 1, name: "Cookies", calories: 800 },
    // { id: 2, name: "Eggs", calories: 500 }
    // ],
    items: storageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }


  //public methods
  return {
    getItems: function () {
      return data.items;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    addItem: function (name, calories) {

      let ID;
      //create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //calories to number
      calories = parseInt(calories);

      //create new Item
      newItem = new item(ID, name, calories);

      //Add item to data array
      data.items.push(newItem);


      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      //calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;

    },
    deleteItem: function (id) {
      //get IDs
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },

    getTotalCalories: function () {

      let total = 0;
      //loop through items and add calories
      data.items.forEach(function (item) {
        total += item.calories;
      });

      //set total calories in data structure
      data.totalCalories = total;

      //return total calories
      return data.totalCalories;
    },
    clearAllItems: function () {
      data.items = [];
    },
    logData: function () {
      return data;
    }
  };

})();





//UI Controller
const UICrtl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }


  // public method
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `<li class="collection-list" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`
      });

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function (item) {
      //show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //create li element
      const li = document.createElement('li');
      //add class
      li.className = 'collection-list';
      //add ID
      li.id = `item-${item.id}`
      //add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`
      //insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {

      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn NodeList into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }

      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemTOForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCrtl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCrtl.getCurrentItem().calories;
      UICrtl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn NodeList into an Array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },

    clearEditState: function () {
      UICrtl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function () {
      return UISelectors;
    }

  }
})();



// App Controller
const App = (function (ItemCrtl, storageCtrl, UICrtl) {
  //Load Event listeners
  const loadEventListeners = function () {
    //Get UI selectors
    const UISelectors = UICrtl.getSelectors();

    //add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable submit on ENTER (e.keyCode has been deprecated use e.key instead)
    document.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICrtl.clearEditState);

    //clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsclick);

  }

  //add item submit
  const itemAddSubmit = function (e) {
    //get item input from UICtrl
    const input = UICrtl.getItemInput();

    //check for name and calories
    if (input.name !== '' && input.calories !== '') {
      //Add item
      const newItem = ItemCrtl.addItem(input.name, input.calories);

      UICrtl.addListItem(newItem);

      //get total calories
      const totalCalories = ItemCrtl.getTotalCalories();

      //Add total calories to UI
      UICrtl.showTotalCalories(totalCalories);


      //store in LS
      storageCtrl.storeItem(newItem);

      //clear fields
      UICrtl.clearInput();

    }

    e.preventDefault();
  }

  //Edit item Fn
  const itemEditClick = function (e) {

    if (e.target.classList.contains('edit-item')) {

      //get the id of the list item(item-0,item-1 ..)
      const listId = e.target.parentNode.parentNode.id;

      // break ListId into an array
      const listIdArr = listId.split('-');

      //get actual ID
      const id = parseInt(listIdArr[1]);

      // get item
      const itemToEdit = ItemCrtl.getItemById(id);

      //set current item
      ItemCrtl.setCurrentItem(itemToEdit);

      //add item to the form
      UICrtl.addItemTOForm();

    }
    e.preventDefault();
  }

  const itemUpdateSubmit = function (e) {

    //Get item input
    const input = UICrtl.getItemInput();


    //update item
    const updatedItem = ItemCrtl.updateItem(input.name, input.calories);

    //update UI
    UICrtl.updateListItem(updatedItem);

    //get total calories
    const totalCalories = ItemCrtl.getTotalCalories();

    //Add total calories to UI
    UICrtl.showTotalCalories(totalCalories);

    //update local storage
    storageCtrl.updateItemStorage(updatedItem);

    UICrtl.clearEditState();


    e.preventDefault();
  }

  const itemDeleteSubmit = function (e) {

    //get current item
    const currentItem = ItemCrtl.getCurrentItem();

    //delete frm Data structure
    ItemCrtl.deleteItem(currentItem.id);

    //delete from UI
    UICrtl.deleteListItem(currentItem.id);

    //get total calories
    const totalCalories = ItemCrtl.getTotalCalories();

    //Add total calories to UI
    UICrtl.showTotalCalories(totalCalories);

    //delete item from local storage
    storageCtrl.deleteItemFromStorage(currentItem.id);

    UICrtl.clearEditState();

    e.preventDefault();
  }

  const clearAllItemsclick = function () {

    //Delete all items from Data Structure
    ItemCrtl.clearAllItems();

    //get total calories
    const totalCalories = ItemCrtl.getTotalCalories();

    //Add total calories to UI
    UICrtl.showTotalCalories(totalCalories);

    //remove from UI
    UICrtl.removeItems();

    //remove items from Local storage
    storageCtrl.clearItemsFromStorage();

    //hide UL
    UICrtl.hideList();


  }


  // Public Methods
  return {
    init: function () {

      //clear edit state/set initial set
      UICrtl.clearEditState();

      // fetch item from data structures
      const items = ItemCrtl.getItems();

      //check if any item
      if (items.length === 0) {
        //hide the list(note the line goes away)
        UICrtl.hideList();

      } else {
        //populate list with item
        UICrtl.populateItemList(items);
      }

      //get total calories
      const totalCalories = ItemCrtl.getTotalCalories();

      //Add total calories to UI
      UICrtl.showTotalCalories(totalCalories);

      // load EventListeners
      loadEventListeners();

    }
  }

})(ItemCrtl, storageCtrl, UICrtl);


App.init();


