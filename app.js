"use strict";

function main() {
  //DOOGIE PICTURE
  function getDog() {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var imgDog = document.querySelector("picture");
        imgDog.innerHTML = `<img src="${
          data.message
        }" alt="Random Photo of a Dog" />`;
      })
      .catch(function(error) {
        console.error(error);
      });
  }

  async function initDogApi() {
    var dogPic = await getDog();
  }

  initDogApi();

  //EXCHANGE RATES
  function getRates() {
    return fetch("https://api.exchangeratesapi.io/latest")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var ratesObject = data.rates;
        var ratesArray = Object.keys(ratesObject).map(function(key) {
          return [String(key), ratesObject[key]];
        });

        var markup = `<select id="rates">`;
        for (var i = 0; i < ratesArray.length; i++) {
          markup += `<option>${ratesArray[i][0]} - ${
            ratesArray[i][1]
          }</option>`;
        }
        markup += `</select>`;

        var exchangeDiv = document.querySelector(".exchange-rates");

        exchangeDiv.innerHTML = markup;
      })
      .catch(function(error) {
        console.error(error);
      });
  }
  async function initExchangeApi() {
    var exchangeRate = await getRates();
    var exchangeValue = document.querySelector("#rates");
    console.log(exchangeValue);
    function logRate() {
      var optionSelected =
        exchangeValue.options[exchangeValue.selectedIndex].text;
      console.log(optionSelected);
    }
    exchangeValue.addEventListener("change", logRate);
  }

  initExchangeApi();

  //WORDPRESS API

  function getPosts(numPosts) {
    var proxyURL = "https://cors-anywhere.herokuapp.com/";
    var targetURL = `http://dev-js-explained-api.pantheonsite.io/wp-json/wp/v2/posts?per_page=${numPosts}`;
    return fetch(proxyURL + targetURL).then(function(response) {
      return response.json();
    });
  }
  async function initPosts(posts) {
    var results = await getPosts(posts);
    console.log(results);
    var list = `<ol>`;

    for (var i = 0; i < results.length; i++) {
      list += `<li><a data-id="${results[i].id}" href="${results[i].link}">${
        results[i].title.rendered
      }</a></li>`;
    }
    list += `</ol>`;
    var listHtml = document.querySelector(".wordpress-list");
    listHtml.innerHTML = list;

    for (var j = 0; j < 5; j++) {
      var a = document.querySelector(`a[data-id="${results[j].id}"]`);
      a.addEventListener("click", function getLink(event) {
        event.preventDefault();
        var y = event.target;
        fetch(
          `http://dev-js-explained-api.pantheonsite.io/wp-json/wp/v2/posts/${
            y.dataset.id
          }`
        ).then(function(response) {
          console.log(response);
          var details = document.querySelector(".wordpress-details");
          details.innerHTML = response;
          return response.json;
        });
      });
    }
  }
  initPosts(5);
}

window.addEventListener("load", main);
