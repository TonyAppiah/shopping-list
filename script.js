// global variables
const form = document.getElementById("item-form");
const input = document.getElementById("item-input");
const ul = document.getElementById("item-list");
let isEditMode = false; /*this will be used to check when the app is in EDIT MODE or not*/


// displays items already in storage in the DOM, if any

function displayItemsFromStorage() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}

document.addEventListener("DOMContentLoaded", displayItemsFromStorage)



// Adding list items to DOM and Local Storage 

const addItemSubmit = (e) => {
    e.preventDefault();
    
    const item = input.value;

    if (item === "") {
        alert("Please enter item.");
        return;
    } 


    if (doesItemExist(item)) {
        alert("That item already exists!");
        const itemToEdit = ul.querySelector(".edit-mode");
        itemToEdit.classList.remove("edit-mode");
        isEditMode = false;
        checkUI();
        return;
    }
    
    // submitting when edit mode is true
    if (isEditMode) {
        const itemToEdit = ul.querySelector(".edit-mode");
        itemToEdit.remove();
        removeItemFromStorage(itemToEdit.textContent);
        isEditMode = false;        
    } 

    addItemToDOM(item);

    addItemToStorage(item);

    checkUI();

    input.value = "";    
};

function addItemToDOM(item) {
    const li = document.createElement("li");
    const newItem = document.createTextNode(item);    
    li.appendChild(newItem);

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    ul.appendChild(li);
}

// button creating function
function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

// icon creating function
function createIcon(classes) {
    const icon = document.createElement("i")
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item); /*this adds a new item(value) to the itemsFromStorage variable, which is now an array of items */

    localStorage.setItem('items', JSON.stringify(itemsFromStorage)); /*this sets the 'items' key and the converted from array to string itemsFromStorage values, to the local storage */
}

function getItemsFromStorage() {
    let itemsFromStorage; /*this variable represents items that are in storage, if any */

    /*checking whether there are items already in storage */
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items')); /*this grabs the values which might already be in the local storage(all strings), and covert them into an array and sets it to the itemsFromStorage variable */        
    }

    return itemsFromStorage;
}

form.addEventListener("submit", addItemSubmit);




// Removing individual items from DOM list and Storage list with caution alert and setting item to edit state

function onItemClick(e) {
    
    if (e.target.tagName === "I") {
        removeItem(e.target.parentElement.parentElement);
    } else if (e.target.tagName === "LI") {
        setItemToEdit(e.target);
    } 
}

// put app into EDIT MODE
function setItemToEdit(item) {
    isEditMode = true;

    ul.querySelectorAll("li").forEach(i => i.classList.remove("edit-mode"));
    item.classList.add("edit-mode");

    const formBtn = form.querySelector("button");
    formBtn.style.backgroundColor = "limeGreen";
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';

    input.value = item.textContent;
}

// CHECKING IF ITEM EXISTS

function doesItemExist(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}
     

// Removing individual items from DOM list and Storage list with caution alert

function removeItem(item) {
    if (confirm("Are you sure?")) {

        // removes item from DOM
        item.remove();          
        
        // removes item from storage
        removeItemFromStorage(item.textContent)
        }     
    
    checkUI();
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage(); /* this gets the arrayed list of items from storage */
    itemsFromStorage = itemsFromStorage.filter(i => i !== item);/*loops through the array, filters out the item clicked on and returns remaining items */
    localStorage.setItem("items", JSON.stringify(itemsFromStorage)); /*set the remaining items back to storage, stringified */
}

ul.addEventListener("click", onItemClick);





// Clearing all items from DOM and storage with caution alert

const clearAllButton = document.getElementById("clear");

function clearAllItems() {
    const allItems = document.querySelectorAll("li");

    // clears all items from DOM
    if (confirm("Are you sure?")) {
        allItems.forEach(item => { item.remove() });        
    }       

    // clears all items form storage
    localStorage.removeItem("items");
    
    checkUI();
}

clearAllButton.addEventListener("click", clearAllItems);




// not displaying filter and clear all btn when there are no list items

function checkUI() {
    const listItems = document.querySelectorAll("li");
    const filter = document.querySelector("#filter");

    input.value = "";

    if (listItems.length === 0) {
        filter.style.display = "none";
        clearAllButton.style.display = "none"
    } else {
        filter.style.display = "block";
        clearAllButton.style.display = "block"        
    }

    // brings the UI state back to original from edit mode
    const formBtn = form.querySelector("button");
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";
    ul.querySelectorAll("li").forEach(i => i.classList.remove("edit-mode"));

    isEditMode = false;
}

checkUI();


// filtering items out

const filter = document.querySelector("#filter");

function filterItems(e) {
    const filterText = e.target.value.toLowerCase();
    
    const items = document.querySelectorAll("li");

    items.forEach(item => {
        const itemName = item.textContent.toLowerCase();
        
        if (itemName.includes(filterText)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";            
        }
    })
}

filter.addEventListener("input", filterItems);

// document.addEventListener("click", (e) => {
    
//     if (e.target.tagName !== "I" && e.target.tagName !== "LI" /*&& e.target.id !== "item-input"*/) {
//         const formBtn = form.querySelector("button");
//         formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
//         formBtn.style.backgroundColor = "#333";
//         ul.querySelectorAll("li").forEach(i => i.classList.remove("edit-mode"));

//     }
// })
