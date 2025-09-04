const balanceEl= document.getElementById("balance-amount")
const incomeAmountEl= document.getElementById("income-amount")
const expensesAmountEl= document.getElementById("expenses-amount")
const transactionlistEl= document.getElementById("transaction-list")
const transactionFormEl= document.getElementById("transaction-form")
const descriptionEl= document.getElementById("description")
const amountEl= document.getElementById("amount")
const typeEl = document.getElementById("type");



let transactions =JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransactions)
function addTransactions(e){
    e.preventDefault();
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;
    if (description && !isNaN(amount)) {
        const transaction = {
            id: Date.now(),
            description,
            amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount)
        };
        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateTransactionList();
        updateSummary();
    }
    transactionFormEl.reset();
}

// function addTransactions(e){
//     e.preventDefault();

//     const description = descriptionEl.value.trim();
//     const amount = parseFloat(amountEl.value)

//     transactions.push({
//         id:Date.now(),
//         description,
//         amount
//     })
     
 

//     localStorage.setItem("transactions", JSON.stringify(transactions));

//     updateTransactionList();
//     updateSummary();
//     transactionFormEl.reset()
// }
function updateTransactionList(){
    transactionlistEl.innerHTML=""

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transactionlistEl.appendChild(transactionEl)
    })
}

function createTransactionElement(transaction){
    const li =document.createElement("li")
    li.classList.add("transaction")
    li.classList.add(transaction.amount > 0 ? "income" : "expenses");

    li.innerHTML=`
            <span>${transaction.description}</span>
            <span>
            ${formatCurrency(transaction.amount > 0 ? transaction.amount : Math.abs(transaction.amount))}
           <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
            </span>
            `;

            return li;

}
function updateSummary(){
    const balance = transactions.reduce((acc,transaction) => acc + transaction.amount, 0);

    const income = transactions.filter((transaction) => transaction.amount > 0 )
   .reduce((acc,transaction) => acc + transaction.amount, 0);

    const expenses = transactions.filter((transaction) => transaction.amount < 0 )
    .reduce((acc,transaction) => acc + transaction.amount, 0);

    // update ui

    balanceEl.textContent =formatCurrency(balance);
    incomeAmountEl.textContent =formatCurrency(income);
expensesAmountEl.textContent = formatCurrency(Math.abs(expenses));
}

function formatCurrency(number){
    return new Intl.NumberFormat("en-us", {
        style:"currency",
        currency: "USD",
    }).format(number);
}

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id)

    localStorage.setItem("transactions", JSON.stringify(transactions))

      updateTransactionList();
  updateSummary()

}

  updateTransactionList();
  updateSummary();