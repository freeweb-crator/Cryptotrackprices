async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        
        document.getElementById('crypto-container').innerHTML = `
            <p>Bitcoin: $${data.bitcoin.usd}</p>
            <p>Ethereum: $${data.ethereum.usd}</p>
        `;
    } catch (error) {
        console.error("Error fetching crypto prices:", error);
        document.getElementById('crypto-container').innerHTML = `<p>Error loading prices. Try again later.</p>`;
    }
}

fetchCryptoPrices();
setInterval(fetchCryptoPrices, 10000);

console.log("Crypto price fetching initialized.");

function displayLastUpdatedTime() {
    const now = new Date();
    document.getElementById('last-updated').textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

displayLastUpdatedTime();
setInterval(displayLastUpdatedTime, 1000);

//---------------------------------------------------------------------------------------
// Added Code: Transaction Handling
//---------------------------------------------------------------------------------------

document.getElementById('transaction-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let crypto = document.getElementById('crypto').value;
    let amount = document.getElementById('amount').value;
    let type = document.getElementById('type').value;

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let transaction = { crypto, amount, type, date: new Date().toLocaleString() };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    document.getElementById('amount').value = "";
    displayTransactions();
});

function displayTransactions() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = "";

    transactions.forEach((t, index) => {
        let li = document.createElement('li');
        li.innerHTML = `${t.date} - ${t.crypto} - ${t.type} ${t.amount} <button onclick="deleteTransaction(${index})">❌</button>`;
        transactionList.appendChild(li);
    });
}

function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions();
}

displayTransactions(); // Load transactions on page load
