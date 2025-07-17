const mu = 0.04;
const sigma_0 = 0.03;
let sigma = sigma_0;
const delta = 1;
const alpha = 0.5;
const gamma = 0.02;

const crachPrice = 2;
const beer1 = "Cuvée";
const beer2 = "Lagunitas";
const beer3 = "Blanche";
const beer4 = "Kasteel";
const beer5 = "Chouffe";
const beer6 = "Chimay";
const color1 = "#FF4136";
const color2 = "#2ECC40";
const color3 = "#0074D9";
const color4 = "#FFDC00";
const color5 = "#F012BE";
const color6 = "#FF851B";

document.addEventListener('DOMContentLoaded', () => {
    // Sélectionne l'élément de la liste de bières
    let chartInstance;  // Track the existing chart instance
    const beerListElement = document.getElementById('beer-list');
    let beers;
    beers = window.fileAPI.loadBeers("beers.json");
    if (beers.length==0) {
        beers = [
            { name: beer1, price: 3.5, color: color1 },
            { name: beer2, price: 3.5, color: color2 },
            { name: beer3, price: 3.5, color: color3 },
            { name: beer4, price: 3.5, color: color4 },
            { name: beer5, price: 3.5, color: color5 },
            { name: beer6, price: 3.5, color: color6 }
        ];
    }
    let minmaxPrices;
    minmaxPrices = window.fileAPI.loadBeers("minmaxPrices.json");
    if (minmaxPrices.length==0){
        minmaxPrices = {
            "max": Math.max(...beers.map(beer => beer.price)),
            "min": Math.min(...beers.map(beer => beer.price))
        }
    }
    function updatePrices(beers) {
        window.electron.sendPrices(beers);
        setTimeout(() => {
            updateBeerList();
        }, 50);
    }
    
    function transformPrices(beers, name, pinte, sigma) {
        function normalRandom(loc = 0, scale = 1) {
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            return z0 * scale + loc;
        }
    
        const beer = beers.find(beer => beer.name === name);
    
        if (!beer) {
            console.error(`Bière avec le nom "${name}" non trouvée.`);
            return beers;
        }
        let coef = 2 / 3.5;
        sigma += alpha * (sigma_0 - sigma) + gamma * normalRandom(0, delta);
        if (pinte) {
            coef = 1;
        }
        if (beer.price <= 6) {
            beer.price += coef * beer.price * (mu * delta + sigma * normalRandom(0, delta));
        } else {
            beer.price -= coef * beer.price * (mu * delta + sigma * normalRandom(0, delta));
        }
    
        const mean = beers.reduce((acc, beer) => acc + beer.price, 0) / beers.length;
    
        beers.forEach(beer => {
            beer.price = 3.5 * beer.price / mean;
        });
        minmaxPrices["max"] = Math.max(minmaxPrices["max"], Math.max(...beers.map(beer => beer.price)));
        minmaxPrices["min"] = Math.min(minmaxPrices["min"], Math.min(...beers.map(beer => beer.price)));

        return sigma;
    }

    function crachBoursier(beers, name) {
        const beer = beers.find(beer => beer.name === name);
        if (!beer) {
            console.error(`Bière avec le nom "${name}" non trouvée.`);
            return beers;
        };
        beer.price = crachPrice;
        const mean = beers.reduce((acc, beer) => acc + beer.price, 0) / beers.length;
        beers.forEach(beer => {
            beer.price = 3.5 * beer.price / mean;
        });
        minmaxPrices["max"] = Math.max(minmaxPrices["max"], Math.max(...beers.map(beer => beer.price)));
        minmaxPrices["min"] = Math.min(minmaxPrices["min"], Math.min(...beers.map(beer => beer.price)));
    }
    
    function displayChart(historicalData) {
        const ctx = document.getElementById('priceChart').getContext('2d');
        const scrollY = window.scrollY;
        // Destroy the existing chart instance if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        // Group data by beer name
        const beerData = {};
        historicalData.forEach(({ id_mod, beer_name, price }) => {
            if (!beerData[beer_name]) {
                beerData[beer_name] = { id_mods: [], prices: [] };
            }
            beerData[beer_name].id_mods.push(id_mod);
            beerData[beer_name].prices.push(price);
        });
    
        // Prepare datasets for each beer
        const datasets = Object.keys(beerData).map(beerName => ({
            label: beerName,
            data: beerData[beerName].prices,
            borderColor: beers.find(beer => beer.name === beerName).color,  // To assign a unique color to each line
            borderWidth: 3,
            pointRadius: 1,
            fill: false,
            parsing: {
                xAxisKey: 'sales',
                yAxisKey: 'prices'
            }
        }));
    
        // Create chart with multiple datasets
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: beerData[Object.keys(beerData)[0]].id_mods,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            font: {
                                size: 17
                            },
                            color: "#f5f5f5"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        min: minmaxPrices["min"],
                        max: minmaxPrices["max"],
                        ticks: {
                            font: {
                                size: 17
                            },
                            color: "#f5f5f5"
                        }
                    }
                },
                plugins: {
                    legend: {
                      display: false
                    }
                }
            }
        });
        window.scrollTo(0, scrollY);
    }
    
    async function updateBeerList() {
        beerListElement.innerHTML = ''; // Vide la liste avant de la recréer
    
        beers.forEach(beer => {
            const li = document.createElement('li');
            const ul = document.createElement('ul');
            li.id = "beer-description";
            li.style.border = `4px solid ${beer.color}`;
            const name = document.createElement('li');
            name.id = "name";
            name.textContent = `${beer.name}`;
            const price = document.createElement('li');
            price.id = "price";
            price.textContent = `${beer.price.toFixed(2)}`;
            const halfPrice = document.createElement('li');
            halfPrice.id = "halfPrice";
            halfPrice.textContent = `${(beer.price*2/3.5).toFixed(2)}`;
            const button = document.createElement('button');
            button.textContent = 'PINTE';
            button.addEventListener('click', async () => {
                sigma = transformPrices(beers, beer.name, true, sigma);
                updatePrices(beers);
            });
            const button2 = document.createElement('button');
            button2.textContent = 'DEMI';
            button2.addEventListener('click', async () => {
                sigma = transformPrices(beers, beer.name, false, sigma);
                updatePrices(beers);
            });
            const crachButton = document.createElement('button');
            crachButton.textContent = 'Crach Boursier';
            crachButton.id = "crach";
            crachButton.addEventListener('click', () => {
                crachBoursier(beers, beer.name);
                updatePrices(beers);
            });
            ul.appendChild(name);
            ul.appendChild(price);
            ul.appendChild(button);
            ul.appendChild(halfPrice);
            ul.appendChild(button2);
            ul.appendChild(crachButton);
            li.appendChild(ul);
            beerListElement.appendChild(li);
        });
        const historicalData = await window.electron.getHistoricalPrices();
        displayChart(historicalData);
        window.fileAPI.saveBeers(beers, "beers.json");
        window.fileAPI.saveBeers(minmaxPrices, "minmaxPrices.json");
    }
    // Affiche la liste initiale des bières
    updateBeerList(beers);
  });