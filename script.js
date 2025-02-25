async function fetchCryptoPrices() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const data = await response.json();
    document.getElementById('crypto-container').innerHTML = `
        <p>Bitcoin: $${data.bitcoin.usd}</p>
        <p>Ethereum: $${data.ethereum.usd}</p>
    `;
}
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 10000); // Refresh every 10 sec
