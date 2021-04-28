const tfName = document.getElementById('name'), 
  amount = document.getElementById('amount'),
  tf_formSubmit = document.getElementById('transaction'),
  historyEl = document.getElementById('history'),
  balanceText = document.getElementById('balance-text'),
  incomeText = document.getElementById('income-text'),
  outcomeText = document.getElementById('outcome-text');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let tf = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// ----- EVENT LISTENERS -----
init();

tf_formSubmit.addEventListener('submit', transactionSubmit);

// ----- FUNCTIONS -----

// Submitting Transactions
function transactionSubmit(e) {
  e.preventDefault();

  if (tfName.value.trim() === '' || amount.value.trim() === ''){
    alert('Please add a text and amount');
  } else {
    const tfName_value = tfName.value;
    const amount_value = parseInt(amount.value);
  
    const obj = {
      id: generateID(),
      name: tfName_value,
      amount: amount_value
    };
  
    tf.push(obj);
  
    updateLocalStorage();
    init();

    tfName.value = '';
    amount.value = '';
  }
}

// Generate ID
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Update DOM on Load/Wake
function updateDom(transaction) {
  if (transaction.amount < 0) {
    historyEl.innerHTML += `
    <div class="history-card outcome-card">
      <p><a id="delete" class="delete" onclick="deleteTransaction(${transaction.id})">X</a> ${transaction.name}</p>
      <p>${transaction.amount}</p>
    </div>
    `;
  } else if(transaction.amount > 0) {
    historyEl.innerHTML += `
    <div class="history-card income-card">
      <p><a id="delete" class="delete" onclick="deleteTransaction(${transaction.id})">X</a> ${transaction.name}</p>
      <p>+${transaction.amount}</p>
    </div>
    `;
  }
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(tf));
}

function init() {
  historyEl.innerHTML = '';

  tf.forEach(updateDom);
  updateAmount();
}

function deleteTransaction(id) {
  console.log(id);
  tf = tf.filter(transaction => transaction.id !== id);
  console.log(tf);

  updateLocalStorage();
  init(); 
}

// Update Balance, Income, and Outcome
function updateAmount() {
  const amounts = tf.map(item => item.amount);

  // Update total balance
  const total = amounts.reduce((acc, item) => (acc += item), 0);

  // Update total income
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);

  // Update total outcome
  const outcome = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);

  // to DOM
  balanceText.innerText = `Rp ${total}`;
  incomeText.innerText = `Rp ${income}`;
  outcomeText.innerText = `Rp ${outcome}`;

  // console.log(outcome);
}


