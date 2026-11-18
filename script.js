const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");
const expenseId = document.getElementById("expenseId");

const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const totalCount = document.getElementById("totalCount");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const clearAllBtn = document.getElementById("clearAllBtn");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Set today's date
expenseDate.value = new Date().toISOString().split("T")[0];

// Save expenses
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Display expenses
function displayExpenses() {
    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach((expense) => {
        total += Number(expense.amount);

        const item = document.createElement("div");
        item.className = "expense-item";

        const top = document.createElement("div");
        top.className = "expense-top";

        const name = document.createElement("h3");
        name.textContent = expense.name;

        const amount = document.createElement("span");
        amount.className = "expense-amount";
        amount.textContent = "- ₹" + Number(expense.amount).toFixed(2);

        top.append(name, amount);

        const info = document.createElement("div");
        info.className = "expense-info";
        info.textContent = "📁 " + expense.category + " | 📅 " + expense.date;

        const actions = document.createElement("div");
        actions.className = "expense-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "✏️ Edit";
        editButton.addEventListener("click", () => editExpense(expense.id));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "🗑️ Delete";
        deleteButton.addEventListener("click", () => deleteExpense(expense.id));

        actions.append(editButton, deleteButton);
        item.append(top, info, actions);

        expenseList.appendChild(item);
    });

    totalAmount.textContent = "₹" + total.toFixed(2);
    totalCount.textContent = expenses.length;

    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <p class="empty-message">
                No expenses yet! Add your first expense above. 😊
            </p>
        `;
    }
}

// Add or update expense
expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    if (!name || amount <= 0 || !category || !date) {
        alert("Please enter valid expense details.");
        return;
    }

    if (expenseId.value) {
        const index = expenses.findIndex(
            expense => expense.id === expenseId.value
        );

        if (index !== -1) {
            expenses[index] = {
                id: expenseId.value,
                name,
                amount,
                category,
                date
            };
        }
    } else {
        expenses.push({
            id: String(Date.now()),
            name,
            amount,
            category,
            date
        });
    }

    saveExpenses();
    displayExpenses();
    resetForm();
});

// Edit expense
function editExpense(id) {
    const expense = expenses.find(item => item.id === id);

    if (!expense) return;

    expenseId.value = expense.id;
    expenseName.value = expense.name;
    expenseAmount.value = expense.amount;
    expenseCategory.value = expense.category;
    expenseDate.value = expense.date;

    formTitle.textContent = "✏️ Edit Expense";
    submitBtn.textContent = "Update Expense";
    cancelBtn.classList.remove("hidden");

    document.querySelector(".form-card").scrollIntoView({
        behavior: "smooth"
    });
}

// Delete expense
function deleteExpense(id) {
    if (!confirm("Do you want to delete this expense?")) return;

    expenses = expenses.filter(item => item.id !== id);

    saveExpenses();
    displayExpenses();

    if (expenseId.value === id) {
        resetForm();
    }
}

// Cancel editing
cancelBtn.addEventListener("click", resetForm);

// Reset form
function resetForm() {
    expenseForm.reset();
    expenseId.value = "";
    expenseDate.value = new Date().toISOString().split("T")[0];

    formTitle.textContent = "➕ Add New Expense";
    submitBtn.textContent = "Add Expense";
    cancelBtn.classList.add("hidden");
}

// Clear all expenses
clearAllBtn.addEventListener("click", function () {
    if (expenses.length === 0) {
        alert("There are no expenses to delete.");
        return;
    }

    if (confirm("Are you sure you want to delete ALL expenses?")) {
        expenses = [];
        saveExpenses();
        displayExpenses();
        resetForm();
    }
});

// Initial display
displayExpenses();