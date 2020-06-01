import { Chart } from 'chart.js';
import $ from 'jquery';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import __ from 'lodash';

//Funkcja asynchroniczna do pobrania danych z API Openweathermap.org
export async function oneCall() {
  async function getOneCall(part) {
    const api = `https://api.openweathermap.org/data/2.5/onecall?lat=52.400631&lon=16.901541&exclude=${part}&appid=5d19895d400e45e352196760bc5e2205&units=metric
    `;
    const res = await fetch(api);
    const json = await res.json();
    return json;
  }

  //wykluczenie danych godzinowych dla API
  const daysSeven = await getOneCall('hourly');

  //przejściena dane dziennie (8 wartości, dzisiaj + 7 dni)
  const daysSevenList = daysSeven.daily;
  console.log(daysSevenList);

  //pobranie czasów z API, czasy są w formacie unixowym
  const daysSevenDate = daysSevenList.map((entry) => entry.dt);
  console.log(daysSevenDate);

  //przekonwertowanie czasu unixowego na daty w formacie MM-DD-RRRR
  const daysSevenDateConvert = daysSevenDate.map(function (el) {
    const convertDate = new Date(parseInt(el, 10) * 1000);
    el = convertDate.toISOString();
    const cutDate = el.substr(5, 5);
    return cutDate;
  });

  const convertedWeek = [];
  daysSevenDate.forEach(function (val) {
    const myDate = new Date(val * 1000).getDay();
    convertedWeek.push(parseInt(myDate, 10));
    return myDate;
  });

  function conv(value) {
    let dayConv = '';
    switch (value) {
      case 0:
        dayConv = 'Niedziela';
        break;
      case 1:
        dayConv = 'Poniedziałek';
        break;
      case 2:
        dayConv = 'Wtorek';
        break;
      case 3:
        dayConv = 'Środa';
        break;
      case 4:
        dayConv = 'Czwartek';
        break;
      case 5:
        dayConv = 'Piątek';
        break;
      case 6:
        dayConv = 'Sobota';
        break;
      default:
        return 'Coś poszło nie tak';
    }
    return dayConv;
  }

  const polishDaysName = [];
  convertedWeek.forEach(function (val, index) {
    polishDaysName.push(conv(val));
  });

  console.log(`po forEach ${polishDaysName}`);
  console.log(polishDaysName);

  console.log(daysSevenDateConvert);

  const concatDaysAndDates = polishDaysName.concat(...daysSevenDateConvert);
  console.log('concatDaysAndDates ' + concatDaysAndDates);

  const lodashZipObject = __.zip(polishDaysName, daysSevenDateConvert);
  console.log(lodashZipObject);
  const newArr = Object.values(lodashZipObject);
  console.log('TO JEST ZIP ARRAYS');
  console.log(newArr);

  const daysSevenTemp = daysSevenList.map((entry) => Math.round(entry.temp.max));
  console.log(daysSevenTemp);
  const daysSevenRain = daysSevenList.map((entry) => entry.rain);
  const removeUndefinedRain = daysSevenRain.map((item) => (item === undefined ? 0 : item));
  console.log(removeUndefinedRain);

  const canvasOne = $('#onecall-canvas').get(0).getContext('2d');

  const configOne = {
    type: 'line',
    data: {
      labels: newArr,
      datasets: [
        {
          label: 'Temperatura maksymalna w C',
          data: daysSevenTemp,
          borderColor: 'darkred',
          fill: false,
          datalabels: {
            labels: {
              //title: null,
            },
            formatter: function (value) {
              return Math.round(value);
            },
            align: 'top',
            offset: 10,
          },
        },
        {
          label: 'Opady w mm na m2',
          type: 'bar',
          data: removeUndefinedRain,
          borderColor: 'blue',
          fill: 'lightblue',
          datalabels: {
            labels: {
              title: null,
            },
          },
        },
      ],
    },
    plugins: [ChartDataLabels],
    options: {},
  };

  const oneCallChart = new Chart(canvasOne, configOne);
}
