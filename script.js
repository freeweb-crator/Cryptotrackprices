let priceHistory = [];

async function fetchCryptoPrices() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const data = await response.json();
    
    let btcPrice = data.bitcoin.usd;
    let ethPrice = data.ethereum.usd;

    // Store prices in history (limit to 10 for forecasting)
    priceHistory.push(btcPrice);
    if (priceHistory.length > 10) priceHistory.shift();

    let btcForecast = forecastPrice(priceHistory);

    document.getElementById('crypto-container').innerHTML = `
        <p>Bitcoin: $${btcPrice}</p>
        <p>Ethereum: $${ethPrice}</p>
        <p><strong>Bitcoin Forecast:</strong> $${btcForecast}</p>
    `;
}

// Simple Moving Average (SMA) Forecast
function forecastPrice(history) {
    if (history.length < 2) return "Not enough data";
    let sum = history.reduce((a, b) => a + b, 0);
    return (sum / history.length).toFixed(2); // Average price
}

fetchCryptoPrices();
setInterval(fetchCryptoPrices, 10000);
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

    // Get stored transactions or create an empty array
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

// Load transactions on page load
displayTransactions();
