Handlebars.registerHelper('generateIdFromCategoryTitle', function (title) {
  return title.replace(/\s/g, '-').toLowerCase();
});
Handlebars.registerHelper('getImdbId', function (url) {
  const match = url.match(/\/title\/(tt\d+)/i);
  return match ? match[1] : null;
});
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('./awards.json');
  const data = await response.json();
  const templateSource = document.querySelector('template').innerHTML;
  const template = Handlebars.compile(templateSource);
  const compiledHtml = template(data);
  document.body.insertAdjacentHTML('beforeend', compiledHtml);
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState !== null) {
      checkbox.checked = JSON.parse(savedState);
    }
    checkbox.addEventListener('change', () => {
      localStorage.setItem(checkbox.id, JSON.stringify(checkbox.checked));
    });
  });
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    const savedState = localStorage.getItem(radio.name);
    if (savedState !== null) {
      radio.checked = (radio.value === savedState);
    }
    radio.addEventListener('change', () => {
      if (radio.checked) {
        localStorage.setItem(radio.name, radio.value);
      }
    });
  });
});
function sharePrediction(){
  const url = window.location.href;
  const title = document.title;
  const text = 'Check out my predictions for the 2021 Oscars!';
  if (navigator.share) {
    navigator.share({ title, text, url });
  } else {
    alert('Share functionality is not supported in your browser.');
  }
}
