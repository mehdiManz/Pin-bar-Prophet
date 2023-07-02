"use strict";

document.addEventListener("DOMContentLoaded", function() {
  const majorminorpairs = [
    "EUR/USD",
    "USD/CHF",
    "AUD/USD",
    "GBP/USD",
    "NZD/USD",
    "USD/JPY",
    "USD/CAD",
    "EUR/GBP",
    "EUR/CAD",
    "EUR/AUD",
    "EUR/NZD",
    "EUR/CHF",
    "EUR/JPY",
    "GBP/JPY",
    "AUD/JPY",
    "NZD/JPY",
    "CAD/JPY",
    "CHF/JPY",
    "GBP/CAD",
    "GBP/AUD",
    "GBP/NZD",
    "GBP/CHF",
    "AUD/NZD",
    "AUD/CAD",
    "AUD/CHF",
    "NZD/CHF",
    "CAD/CHF",
    "NZD/CAD"
  ];

  let currencyCounts = {};
  const yesInput = document.getElementById("yes");
  const noInput = document.getElementById("no");
  const bullishInput = document.getElementById("bullish");
  const bearishInput = document.getElementById("bearish");

  const currencyForm = document.getElementById("currencyForm");
  const question = document.getElementById("question");
  const validationMessage = document.getElementById("validationMessage");
  const resultMessage = document.getElementById("resultMessage");
  let currentIndex = 0;
  let selectedCurrencies = [];

  currencyForm.addEventListener("submit", handleNext);

  // Initialize by showing the first question
  showQuestion();

  function handleNext(event) {
    event.preventDefault();
  
    if (yesInput.checked || noInput.checked) {
      validationMessage.style.display = "none";
  
      if (yesInput.checked) {
        if (!bullishInput.checked && !bearishInput.checked) {
          // Show error message if neither "Bullish" nor "Bearish" is selected
          validationMessage.style.display = "block";
          validationMessage.style.color = "red";
          validationMessage.textContent = "Please select either Bullish or Bearish.";
          return; // Exit the function to prevent further execution
        }
  
        const currencyPair = majorminorpairs[currentIndex];
        const pinBarType = bullishInput.checked ? "Bullish Pin Bar" : "Bearish Pin Bar";
  
        // Save the answer as an object
        const answer = {
          currencyPair,
          pinBarType,
        };
  
        selectedCurrencies.push(answer);
      }
  
      currentIndex++;
  
      if (currentIndex < majorminorpairs.length) {
        showQuestion();
      } else {
        calculateCurrencyCounts();
        currencyForm.querySelector("button[type='submit']").disabled = true;
      }
    } else {
      validationMessage.style.display = "block";
      validationMessage.style.color = "red";
      validationMessage.textContent = "Please select either Yes or No.";
    }
  }
  

  function showQuestion() {
    const currencyPair = majorminorpairs[currentIndex];
    question.innerHTML = `Is <span class="outstanding-animation">${currencyPair}</span> a pin bar rejected from the Bollinger Band?`;




  
    yesInput.checked = false;
    noInput.checked = false;
    bullishInput.checked = false;
    bearishInput.checked = false;
    validationMessage.style.display = "none";
  
    yesInput.addEventListener("change", function() {
      if (yesInput.checked) {
        pinBarOptions.style.display = "block";
      } else {
        pinBarOptions.style.display = "none";
      }
    });
  }
  

  function calculateCurrencyCounts() {
    for (let currencyObj of selectedCurrencies) {
      const currencyCodes = currencyObj.currencyPair.split("/");
      const baseCurrency = currencyCodes[0];
      const quoteCurrency = currencyCodes[1];

      // Count the base currency
      if (currencyCounts[baseCurrency]) {
        currencyCounts[baseCurrency].count++;
        currencyCounts[baseCurrency].pairs.push(currencyObj);
      } else {
        currencyCounts[baseCurrency] = {
          count: 1,
          pairs: [currencyObj],
        };
      }

      // Count the quote currency
      if (currencyCounts[quoteCurrency]) {
        currencyCounts[quoteCurrency].count++;
        currencyCounts[quoteCurrency].pairs.push(currencyObj);
      } else {
        currencyCounts[quoteCurrency] = {
          count: 1,
          pairs: [currencyObj],
        };
      }
    }

    displayCurrencyCounts();
  }
  function displayCurrencyCounts() {
    const resultList = document.getElementById("resultList");
    resultList.innerHTML = ""; // Clear previous results
  
    // Create an array of currency counts in descending order
    const sortedCounts = Object.entries(currencyCounts).sort(
      (a, b) => b[1].count - a[1].count
    );
  
    let highestCount = 0;
    const highestCurrencies = [];
  
    for (let [currencyCode, { count, pairs }] of sortedCounts) {
      const listItem = document.createElement("li");
      listItem.textContent = `Currency: ${currencyCode}, Yes Count: ${count}`;
  
      const pairsList = document.createElement("ul");
      for (let pairObj of pairs) {
        const pairItem = document.createElement("li");
        pairItem.textContent = `${pairObj.currencyPair} (${pairObj.pinBarType})`;
        pairsList.appendChild(pairItem);
      }
  
      listItem.appendChild(pairsList);
      resultList.appendChild(listItem);
  
      if (count > highestCount) {
        highestCount = count;
        highestCurrencies.length = 0; // Clear the array
        highestCurrencies.push(currencyCode);
      } else if (count === highestCount) {
        highestCurrencies.push(currencyCode);
      }
    }
  
    if (highestCurrencies.length > 0) {
      const highestCurrenciesString = highestCurrencies.join(", ");
      resultMessage.innerHTML = `There is a high probability of winning the trade if you trade pairs that involve <span class="highlight">${highestCurrenciesString}</span>.`;
    } else {
      const currentHour = new Date().getHours();
      let nextCheckTime = "";
      if (currentHour < 16) {
        nextCheckTime = "8 hours";
      } else {
        nextCheckTime = "12 hours";
      }
      resultMessage.textContent = `We kindly suggest revisiting the market in ${nextCheckTime} as there are currently limited pin bars available for accurate market assessment.`;
    }
    
  }
  
  

  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetApp);

  function resetApp() {
    currentIndex = 0;
    selectedCurrencies = [];
    currencyCounts = {};
    showQuestion();
    validationMessage.style.display = "none";
    resultMessage.textContent = "";
    resultList.innerHTML = "";
    currencyForm.querySelector("button[type='submit']").disabled = false;
  }
});
