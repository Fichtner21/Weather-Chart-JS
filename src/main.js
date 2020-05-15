import $ from 'jquery';
import { weatherView } from './views/weather';

function enableRouting() {
  function setRoute() {
    $('.view').hide();
    const { hash } = window.location;
    console.log(hash);
    if (hash === '') {
      $('#home').show();
    }
    $(hash).show();
  }
  setRoute();
  window.addEventListener('hashchange', setRoute);
}

document.addEventListener('DOMContentLoaded', () => {
  weatherView();

  enableRouting();
});
