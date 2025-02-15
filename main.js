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
    checkbox.addEventListener("change", () => {
      localStorage.setItem(checkbox.id, JSON.stringify(checkbox.checked));
    });
  });
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    const savedState = localStorage.getItem(radio.name);
    if (savedState !== null) {
      radio.checked = radio.value === savedState;
    }
    radio.addEventListener("change", () => {
      if (radio.checked) {
        localStorage.setItem(radio.name, radio.value);
      }
    });
  });
});
function sharePrediction() {
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
