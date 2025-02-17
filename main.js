Handlebars.registerHelper("generateIdFromCategoryTitle", function (title) {
  return title.replace(/\s/g, "-").toLowerCase();
});
Handlebars.registerHelper("getImdbId", function (url) {
  const match = url.match(/\/(title|name)\/(tt\d+|nm\d+)/i);
  return match ? match[2] : null;
});
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("./awards.json");
  const data = await response.json();
  const templateSource = document.querySelector("template").innerHTML;
  const template = Handlebars.compile(templateSource);
  const compiledHtml = template(data);
  document.body.insertAdjacentHTML("beforeend", compiledHtml);
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState !== null) {
      checkbox.checked = JSON.parse(savedState);
    }
    calcWatchedMovies();
    calcWatchedMoviesPerCategory();
    checkbox.addEventListener("change", (el) => {
      localStorage.setItem(checkbox.id, JSON.stringify(checkbox.checked));
      calcWatchedMovies();
      calcWatchedMoviesPerCategory();
    });
  });
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    const savedState = localStorage.getItem(radio.name);
    if (savedState !== null) {
      radio.checked = radio.value === savedState;
    }
    radio.addEventListener("change", (el) => {
      if (radio.checked) {
        localStorage.setItem(radio.name, radio.value);
      }
    });
  });
});
function calcWatchedMovies() {
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const watchedMovies = checkboxes.filter((checkbox) => checkbox.checked);
  const totalWatchedMovies = watchedMovies.length;
  const totalMovies = checkboxes.length;
  const percentage = Math.round((totalWatchedMovies / totalMovies) * 100);
  const wachedPercentage = `${totalWatchedMovies} / ${totalMovies} (${percentage}%)`;
  document.querySelector("#wachedPercentage").textContent = wachedPercentage;
}
function calcWatchedMoviesPerCategory() {
  const categories = Array.from(document.querySelectorAll(".award"));
  categories.forEach((category) => {
    const checkboxes = Array.from(category.querySelectorAll('input[type="checkbox"]'));
    const watchedMovies = checkboxes.filter((checkbox) => checkbox.checked);
    const totalWatchedMovies = watchedMovies.length;
    const totalMovies = checkboxes.length;
    const percentage = Math.round((totalWatchedMovies / totalMovies) * 100);
    const wachedPercentage = `${totalWatchedMovies} / ${totalMovies} (${percentage}%)`;
    category.querySelector(".wachedPercentage").textContent = wachedPercentage;
  });
}
function sharePredictions() {
  const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
  const checkedRadios = radios.filter((radio) => radio.checked);
  const nominees = checkedRadios.map((radio) => {
    console.log();
    const category = radio.closest(".award").querySelector("h2").innerText;
    const title = radio.closest("figure").querySelector("h3").innerText;
    return `🎬 ${category}: \r\n🏆 ${title}`;
  });

  const text = `I predict the following nominees will win at the 2025 Oscars:\r\n${nominees.join("\r\n")}`;
  if (navigator.share) {
    navigator.share({ text });
  } else {
    console.log(text);
  }
}
