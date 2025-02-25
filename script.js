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
