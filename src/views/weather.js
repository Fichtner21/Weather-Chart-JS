import { Chart } from 'chart.js';
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
        return 'fas fa-sun';
      }
      case '02d': {
        return 'fas fa-cloud-sun';
      }
      case '03d': {
        return 'fas fa-cloud';
      }
      case '04d': {
        return 'fas fa-cloud';
      }
      case '09d': {
        return 'fas fa-cloud-rain';
      }
      case '10d': {
        return 'fas fa-cloud-sun-rain';
      }
      case '11d': {
        return 'fas fa-bolt';
      }
      case '13d': {
        return 'fas fa-snowflake';
      }
      case '50d': {
        return 'fas fa-smog';
      }
      case '01n': {
        return 'fas fa-moon';
      }
      case '02n': {
        return 'fas fa-cloud-moon';
      }
      case '03n': {
        return 'fas fa-cloud';
      }
      case '04n': {
        return 'fas fa-cloud';
      }
      case '09n': {
        return 'fas fa-cloud-rain';
      }
      case '10n': {
        return 'fas fa-cloud-moon-rain';
      }
      case '11n': {
        return 'fas fa-bolt';
      }
      case '13n': {
        return 'fas fa-snowflake';
      }
      case '50n': {
        return 'fas fa-smog';
      }
      default: {
        return 'fas fa-cloud';
      }
    }
  }

  const barczewo = await getDataForStation('776384');

  const barczewoTemp = barczewo.list;

  console.log(barczewoTemp);

  const tempToDisplay = barczewoTemp.map((entry) => entry.main.temp_max);
  const timeToDisplay = barczewoTemp.map((entry) => entry.dt);

  const arr = [];
  const tempFeelsLike = barczewoTemp.map((entry) => entry.main.feels_like);
  const wIcon = barczewoTemp.map((entry, index) => arr.push([index, entry.weather[0].icon]));

  const newMyDate = timeToDisplay.map(function (el) {
    const temp = new Date(parseInt(el, 10) * 1000);
    el = temp.toISOString();
    const toReplace = el.replace(/[a-zA-Z]/, ' g:');
    const toCut = toReplace.substr(0, 18);
    return toCut;
  });

  console.log(newMyDate);

  const canvas = document.getElementById('weather-canvas');
  const context2 = canvas.getContext('2d');

  const config = {
    type: 'line',
    data: {
      labels: newMyDate,
      datasets: [
        {
          label: 'Temperatura maksymalna',
          data: tempToDisplay,
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
        // {
        //   label: 'Temperatura odczuwalna',
        //   data: tempFeelsLike,
        //   borderColor: 'blue',
        //   fill: false,
        //   datalabels: {
        //     labels: {},
        //     formatter: function (value) {
        //       return Math.round(value);
        //     },
        //     align: 'bottom',
        //     offset: 10,
        //   },
        // },
      ],
    },
    plugins: [ChartDataLabels],
    options: {
      tooltips: {
        enabled: false,
        custom: function (data) {
          const item = data.dataPoints; // pobranie tablicy elementów związanych z danym punktem

          // jeśli modele danych istnieją (najechanie myszką)
          if (item) {
            // mamy tylko jeden dataset, więc bierzemy pierwszy element dla danego punktu
            const weatherPoint = item[0];

            const goodIcon = arr.forEach((arritem) => {
              if (arritem[0] === weatherPoint.index) {
                const icon = getIcon(arritem[1]);

                // tworzymy customowy tooltip i ustawiamy wszystkie niezbędne parametry
                const tooltip = document.createElement('div');
                tooltip.id = 'weather-icon-tooltip';
                tooltip.style.top = `${data.caretY}px`;
                tooltip.style.left = `${data.caretX}px`;

                tooltip.innerHTML = `<i class="fas ${icon}"></i> <span>${Math.round(weatherPoint.yLabel)}</span>`;

                document.getElementById('weather').appendChild(tooltip);
              }
            });
          } else {
            // brak modelu danych, kasujemy element tooltipa
            const existing = document.getElementById('weather-icon-tooltip');
            document.getElementById('weather').removeChild(existing);
          }
        },
      },
    },
    // options: {
    //   legend: {
    //     display: false,
    //   },
    //   hover: {
    //     animationDuration: 0,
    //   },
    //   animation: {
    //     onComplete: function () {
    //       const chartInstance = this.chart;
    //       const { ctx } = chartInstance;

    //       ctx.font = Chart.helpers.fontString(18, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
    //       ctx.textAlign = 'center';
    //       ctx.textBaseline = 'bottom';

    //       this.data.datasets.forEach(function (dataset, i) {
    //         console.log(dataset);
    //         const meta = chartInstance.controller.getDatasetMeta(i);
    //         meta.data.forEach(function (bar, index) {
    //           const data = Math.round(dataset.data[index]);
    //           ctx.bodyAlign = 'top';
    //           // ctx.yPadding = 40;

    //           ctx.fillStyle = '#000';
    //           ctx.fillText(data, bar._model.x, bar._model.y - 2);
    //         });
    //       });
    //     },
    //   },
    //   tooltips: {
    //     enabled: false,
    //   },
    //   responsive: true,
    //   scales: {
    //     xAxes: [
    //       {
    //         display: true,
    //         gridLines: {
    //           drawOnChartArea: true,
    //         },
    //       },
    //     ],
    //     yAxes: [
    //       {
    //         display: true,
    //         gridLines: {
    //           drawOnChartArea: true,
    //         },
    //         ticks: {
    //           precision: 0,
    //         },
    //       },
    //     ],
    //   },
    // },
    // options: {
    //   showAllTooltips: true,
    //   responsive: true,
    //   title: {
    //     display: true,
    //     text: 'Pogoda w miastach',
    //   },
    //   scales: {
    //     xAxes: [
    //       {
    //         id: 'A',
    //         display: true,
    //         position: 'bottom',
    //       },
    //       {
    //         id: 'B',
    //         display: true,
    //         position: 'bottom',
    //       },
    //     ],
    //     yAxes: [
    //       {
    //         display: true,
    //       },
    //     ],
    //   },
    //   //   tooltips: {
    //   //     enabled: false,
    //   //     custom: function (tooltipModel) {
    //   //       // Tooltip Element
    //   //       let tooltipEl = document.getElementById('chartjs-tooltip');

    //   //       // Create element on first render
    //   //       if (!tooltipEl) {
    //   //         tooltipEl = document.createElement('div');
    //   //         tooltipEl.id = 'chartjs-tooltip';
    //   //         tooltipEl.innerHTML = '<table></table>';
    //   //         document.body.appendChild(tooltipEl);
    //   //       }

    //   //       // Hide if no tooltip
    //   //       if (tooltipModel.opacity === 0) {
    //   //         tooltipEl.style.opacity = 0;
    //   //         return;
    //   //       }

    //   //       // Set caret Position
    //   //       tooltipEl.classList.remove('above', 'below', 'no-transform');
    //   //       if (tooltipModel.yAlign) {
    //   //         tooltipEl.classList.add(tooltipModel.yAlign);
    //   //       } else {
    //   //         tooltipEl.classList.add('no-transform');
    //   //       }

    //   //       function getBody(bodyItem) {
    //   //         return bodyItem.lines;
    //   //       }

    //   //       // Set Text
    //   //       if (tooltipModel.body) {
    //   //         const titleLines = tooltipModel.title || [];
    //   //         const bodyLines = tooltipModel.body.map(getBody);

    //   //         let innerHtml = '<thead>';
    //   //         console.log(titleLines);
    //   //         titleLines.forEach(function (title, index) {
    //   //           innerHtml += '<tr><th>' + convertedIcon[index].outerHTML + '</th></tr>';
    //   //         });
    //   //         // convertedIcon.forEach(function (icon, index) {
    //   //         //   console.log(index);
    //   //         //   innerHtml += '<tr><th>' + icon.outerHTML + '</th></tr>';
    //   //         // });
    //   //         innerHtml += '</thead><tbody>';

    //   //         bodyLines.forEach(function (body, i) {
    //   //           const colors = tooltipModel.labelColors[i];
    //   //           let style = 'background:' + colors.backgroundColor;
    //   //           style += '; border-color:' + colors.borderColor;
    //   //           style += '; border-width: 2px';
    //   //           const span = '<span style="' + style + '"></span>';
    //   //           innerHtml += '<tr><td>' + span + body + '</td></tr>';
    //   //         });
    //   //         innerHtml += '</tbody>';

    //   //         const tableRoot = tooltipEl.querySelector('table');
    //   //         tableRoot.innerHTML = innerHtml;
    //   //       }

    //   //       // `this` will be the overall tooltip
    //   //       const position = this._chart.canvas.getBoundingClientRect();

    //   //       // Display, position, and set styles for font
    //   //       tooltipEl.style.opacity = 1;
    //   //       tooltipEl.style.position = 'absolute';
    //   //       tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    //   //       tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    //   //       tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
    //   //       tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
    //   //       tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    //   //       tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    //   //       tooltipEl.style.pointerEvents = 'none';
    //   //     },
    //   //   },
    //   datalabels: {
    //     font: {
    //       family: 'FontAwesome',
    //       size: 20,
    //     },
    //     formatter: function (value, context) {
    //       return context.dataset.icons[context.dataIndex];
    //     },
    //   },
    // },
  };

  const weather = new Chart(context2, config);
  console.log(weather);
}
