import { Chart } from 'chart.js';
import $ from 'jquery';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';

export async function weatherView() {
  async function getDataForStation(station) {
    const api = `https://api.openweathermap.org/data/2.5/forecast?id=${station}&APPID=841681e14be8b0d5de20d546adecfbe7&units=metric`;
    const res = await fetch(api);
    const json = await res.json();

    return json;
  }

  function getIcon($icon) {
    switch ($icon) {
      case '01d': {
        return '<i class="fas fa-sun"></i>';
      }
      case '02d': {
        return '<i class="fas fa-cloud-sun"></i>';
      }
      case '03d': {
        return '<i class="fas fa-cloud"></i>';
      }
      case '04d': {
        return '<i class="fas fa-cloud"></i>';
      }
      case '09d': {
        return '<i class="fas fa-cloud-rain"></i>';
      }
      case '10d': {
        return '<i class="fas fa-cloud-sun-rain"></i>';
      }
      case '11d': {
        return '<i class="fas fa-bolt"></i>';
      }
      case '13d': {
        return '<i class="fas fa-snowflake"></i>';
      }
      case '50d': {
        return '<i class="fas fa-smog"></i>';
      }
      case '01n': {
        return '<i class="fas fa-moon"></i>';
      }
      case '02n': {
        return '<i class="fas fa-cloud-moon"></i>';
      }
      case '03n': {
        return '<i class="fas fa-cloud"></i>';
      }
      case '04n': {
        return '<i class="fas fa-cloud"></i>';
      }
      case '09n': {
        return '<i class="fas fa-cloud-rain"></i>';
      }
      case '10n': {
        return '<i class="fas fa-cloud-moon-rain"></i>';
      }
      case '11n': {
        return '<i class="fas fa-bolt"></i>';
      }
      case '13n': {
        return '<i class="fas fa-snowflake"></i>';
      }
      case '50n': {
        return '<i class="fas fa-smog"></i>';
      }
      default: {
        return '<i class="fas fa-cloud"></i>';
      }
    }
  }

  function getImageFromURL(imgCODE) {
    const iconURL = 'http://openweathermap.org/img/w/' + imgCODE + '.png';

    return iconURL;
  }

  const barczewo = await getDataForStation('7530858');

  const barczewoTemp = barczewo.list;

  const tempToDisplay = barczewoTemp.map((entry) => Math.round(entry.main.temp_max));
  const timeToDisplay = barczewoTemp.map((entry) => entry.dt);

  const limitedTemperaturesArray = tempToDisplay.slice(0, 30);
  const limitedTimesArray = timeToDisplay.slice(0, 30);

  const iconsArray = [];
  const tempFeelsLike = barczewoTemp.map((entry) => entry.main.feels_like);

  const wIcon = barczewoTemp.map((entry, index) => iconsArray.push({ index: index, icon: getImageFromURL(entry.weather[0].icon) }));

  const newMyDate = limitedTimesArray.map(function (el) {
    const temp = new Date(parseInt(el, 10) * 1000);
    el = temp.toISOString();
    const toReplace = el.replace(/[a-zA-Z]/, ' g:');
    const toCut = toReplace.substr(0, 18);
    return toCut;
  });

  // Show tooltips always even the stats are zero

  Chart.pluginService.register({
    beforeRender: function (chart) {
      if (chart.config.options.showAllTooltips) {
        // create an array of tooltips
        // we can't use the chart tooltip because there is only one tooltip per chart
        chart.pluginTooltips = [];
        chart.config.data.datasets.forEach(function (dataset, i) {
          chart.getDatasetMeta(i).data.forEach(function (sector, j) {
            chart.pluginTooltips.push(
              new Chart.Tooltip(
                {
                  _icons: iconsArray,
                  _chart: chart.chart,
                  _chartInstance: chart,
                  _data: chart.data,
                  _options: chart.options.tooltips,
                  _active: [sector],
                },
                chart,
              ),
            );
          });
        });

        // turn off normal tooltips
        chart.options.tooltips.enabled = false;
      }
    },
    afterDraw: function (chart, easing) {
      if (chart.config.options.showAllTooltips) {
        // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
        if (!chart.allTooltipsOnce) {
          if (easing !== 1) return;
          chart.allTooltipsOnce = true;
        }

        // turn on tooltips
        chart.options.tooltips.enabled = true;
        Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
          tooltip.initialize();
          tooltip.update();
          // we don't actually need this since we are not animating tooltips
          tooltip.pivot();
          tooltip.transition(easing).draw();
        });
        chart.options.tooltips.enabled = false;
      }
    },
  });

  const canvas = $('#weather-canvas').get(0).getContext('2d');

  const config = {
    type: 'line',
    data: {
      labels: newMyDate,
      datasets: [
        {
          label: 'Temperatura maksymalna',
          data: limitedTemperaturesArray,
          borderColor: 'darkgreen',
          fill: false,
          //xAxisID: 'A',
          datalabels: {
            labels: {
              title: null,
            },
            formatter: function (value) {
              return Math.round(value);
            },
            align: 'top',
            offset: 10,
          },
        },
      ],
    },
    plugins: [ChartDataLabels],
    options: {
      // In options, just use the following line to show all the tooltips
      showAllTooltips: true,
      events: ['click'],
      tooltips: {
        backgroundColor: 'transparent',
        titleFontColor: 'transparent',
        bodyFontColor: 'black',
        footerFontColor: 'black',
        displayColors: false,
        callbacks: {
          // remove title
          title: function (tooltipItem, data) {
            return '';
          },
          label: function (tooltipItem, data) {
            let label = '';

            const img = new Image();

            img.src = iconsArray[tooltipItem.index].icon;

            img.addEventListener('load', function () {
              canvas.drawImage(img, tooltipItem.x - 20, tooltipItem.y - 40);
            });

            label += Math.round(tooltipItem.yLabel * 100) / 100;

            return label;
          },
        },
      },
    },
  };

  const weather = new Chart(canvas, config);
}
