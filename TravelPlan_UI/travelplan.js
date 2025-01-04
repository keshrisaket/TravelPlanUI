let planIdCounter = 1; // Counter for generating unique Plan IDs
const budgetsArray = []; // Store budgets and categories
let currentRow; // Store reference to the current row being edited

document.getElementById('categorySelect').addEventListener('change', function() {
    const budgetInputContainer = document.getElementById('budgetInputContainer');
    budgetInputContainer.style.display = this.value ? 'block' : 'none'; // Show budget input if a category is selected
});

document.getElementById('addBudgetButton').addEventListener('click', function() {
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect.value;
    const budgetInput = document.getElementById('budgetInput').value;
    const messageDiv = document.getElementById('message');

    messageDiv.innerText = ""; // Clear previous messages

    if (!selectedCategory) {
        messageDiv.innerText = "Please select a category.";
        return;
    }

    if (budgetsArray.some(b => b.category === selectedCategory)) {
        messageDiv.innerText = "This category already exists.";
        return;
    }

    if (!budgetInput || isNaN(budgetInput) || budgetInput <= 0) {
        messageDiv.innerText = "Please enter a valid budget greater than zero.";
        return;
    }

    budgetsArray.push({ category: selectedCategory, budget: budgetInput });

    const budgetItem = document.createElement('div');
    budgetItem.className = 'budget-item';
    budgetItem.innerHTML = `<span>${selectedCategory} Budget: $${budgetInput}</span>
        <button type="button" class="removeBudgetButton">Remove</button>`;
    document.getElementById('budgets').appendChild(budgetItem);

    categorySelect.value = "";
    document.getElementById('budgetInput').value = "";
    document.getElementById('budgetInputContainer').style.display = 'none'; // Hide budget input again

    budgetItem.querySelector('.removeBudgetButton').addEventListener('click', function() {
        const index = budgetsArray.findIndex(b => b.category === selectedCategory && b.budget === budgetInput);
        if (index !== -1) {
            budgetsArray.splice(index, 1); // Remove from the array
            budgetItem.remove(); // Remove from display
        }
    });
});

document.getElementById('travelForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const destination = document.getElementById('destination').value;
    const description = document.getElementById('description').value;
    const messageDiv = document.getElementById('message');
    const tableBody = document.querySelector('#travelTable tbody');
    messageDiv.innerText = ""; // Clear previous messages

    if (budgetsArray.length === 0) {
        messageDiv.innerText = "Please add at least one budget.";
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${planIdCounter++}</td>
        <td>${destination}</td>
        <td>
            <select class="planCategory">
                <option value="">Select Category</option>
                ${budgetsArray.map(b => `<option value="${b.category}">${b.category}</option>`).join('')}
            </select>
        </td>
        <td class="budgetDisplay">N/A</td>
        <td>${description}</td>
        <td>
            <button type="button" class="editButton action-button">Edit</button>
            <button type="button" class="deleteButton action-button">Delete</button>
        </td>
        <td>
            <button type="button" class="statusButton action-button">Active</button>
        </td>
    `;
    tableBody.appendChild(newRow);

    newRow.querySelector('.statusButton').addEventListener('click', function() {
        const currentStatus = this.textContent;
        this.textContent = currentStatus === "Active" ? "Inactive" : "Active"; // Toggle text
        this.style.backgroundColor = currentStatus === "Active" ? "#f44336" : "#4CAF50"; // Change color
    });

    const categorySelect = newRow.querySelector('.planCategory');
    const budgetDisplay = newRow.querySelector('.budgetDisplay');

    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        const selectedBudget = budgetsArray.find(b => b.category === selectedCategory);
        budgetDisplay.textContent = selectedBudget ? `$${selectedBudget.budget}` : "N/A"; // Update the budget display
    });

    newRow.querySelector('.editButton').addEventListener('click', function() {
        const currentCategory = categorySelect.value;
        const currentBudget = budgetDisplay.textContent.replace(/[^0-9]/g, ''); // Clean input
        const currentDescription = description;

        // Fill the edit form with current values
        document.getElementById('editDestination').value = destination;
        document.getElementById('editCategory').value = currentCategory;
        document.getElementById('editBudget').value = currentBudget;
        document.getElementById('editDescription').value = currentDescription;

        // Show the edit form
        currentRow = newRow; // Save reference to the row being edited
        document.getElementById('editForm').style.display = "block";
    });

    newRow.querySelector('.deleteButton').addEventListener('click', function() {
        newRow.remove(); // Remove the row from the table
    });

    document.getElementById('travelForm').reset();
    document.getElementById('budgets').innerHTML = ''; // Clear budget list
    document.getElementById('budgetInputContainer').style.display = 'none'; // Hide budget input
});

document.getElementById('updatePlanButton').addEventListener('click', function() {
    const updatedDestination = document.getElementById('editDestination').value;
    const updatedCategory = document.getElementById('editCategory').value;
    const updatedBudget = document.getElementById('editBudget').value;
    const updatedDescription = document.getElementById('editDescription').value;

    // Update the current row
    currentRow.children[1].textContent = updatedDestination;
    currentRow.querySelector('.planCategory').value = updatedCategory;
    currentRow.querySelector('.budgetDisplay').textContent = `$${updatedBudget}`;
    currentRow.children[4].textContent = updatedDescription;

    // Reset the edit form
    document.getElementById('editForm').style.display = "none";
});

document.getElementById('cancelEditButton').addEventListener('click', function() {
    document.getElementById('editForm').style.display = "none"; // Hide the edit form
});