const API_URL = "https://6a4283197602860e65219465.mockapi.io/MahisKitchen"; 

const searchedItemName = document.getElementById('searched_item_name');
const searchBtn = document.getElementById('search_id');
const itemNameInput = document.getElementById('item_name');
const itemPriceInput = document.getElementById('item_price');
const addBtn = document.getElementById('add_id');
const listItemsContainer = document.getElementById('list_items_id');

let allFoodItems = []; 
let editItemId = null; 

// 1. READ: API 
async function fetchMenu() {
    try {
        const response = await fetch(API_URL);
        allFoodItems = await response.json();
        renderMenu(allFoodItems);
    } catch (error) {
        console.error("error at data loading", error);
    }
}

// UI 
function renderMenu(items) {
    listItemsContainer.innerHTML = ""; 

    if (items.length === 0) {
        listItemsContainer.innerHTML = "<p style='text-align:center; color:#747d8c;'>No items found!</p>";
        return;
    }

    items.forEach(item => {
        const li = document.createElement('li');
        li.style.background = "#fff";
        li.style.padding = "15px 20px";
        li.style.marginBottom = "10px";
        li.style.borderRadius = "8px";
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";

        li.innerHTML = `
            <div>
                <strong style="font-size: 1.1rem; color: #2d3436;">${item.Item}</strong> 
                <span style="color: #ff4757; font-weight: 600; margin-left: 10px;">₹${item.Price}</span>
            </div>
            <div class="action-btns" style="display: flex; gap: 8px;">
                <button class="edit-action-btn" style="background-color: #1e90ff; padding: 6px 12px; font-size: 0.85rem; color:white; border:none; border-radius:4px; cursor:pointer;">Edit</button>
                <button class="delete-action-btn" style="background-color: #ff4757; padding: 6px 12px; font-size: 0.85rem; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
            </div>
        `;

        // onclick 
        li.querySelector('.edit-action-btn').addEventListener('click', () => {
            prepareEdit(item.id, item.Item, item.Price);
        });

        li.querySelector('.delete-action-btn').addEventListener('click', () => {
            deleteItem(item.id);
        });

        listItemsContainer.appendChild(li);
    });
}

// 2. CREATE / UPDATE
addBtn.addEventListener('click', async () => {
    const name = itemNameInput.value.trim();
    const price = itemPriceInput.value.trim();

    if (!name || !price) {
        return;
    }

    const foodData = {
        Item: name,
        Price: Number(price)
    };

    try {
        if (editItemId) {
            // UPDATE (PUT)
            await fetch(`${API_URL}/${editItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodData)
            });
            editItemId = null;
            addBtn.innerText = "Add Item";
            addBtn.style.backgroundColor = "#ff4757";
        } else {
            // CREATE (POST)
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodData)
            });
        }

        itemNameInput.value = "";
        itemPriceInput.value = "";
        await fetchMenu(); 

    } catch (error) {
        console.error("error at saving", error);
    }
});

// 3. EDIT PREPARATION
function prepareEdit(id, name, price) {
    itemNameInput.value = name;
    itemPriceInput.value = price;
    editItemId = id; 

    addBtn.innerText = "Update Item";
    addBtn.style.backgroundColor = "#2ed573"; 
    itemNameInput.focus();
}

// 4. DELETE 
async function deleteItem(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        await fetchMenu(); 
    } catch (error) {
        console.error("Error near deletion:", error);
    }
}

// 5. SEARCH
searchBtn.addEventListener('click', () => {
    const keyword = searchedItemName.value.toLowerCase().trim();
    const filteredItems = allFoodItems.filter(item => 
        item.Item.toLowerCase().includes(keyword)
    );
    renderMenu(filteredItems);
});

fetchMenu();