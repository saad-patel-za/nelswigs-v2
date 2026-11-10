const category = document.querySelector('#finder-group');
const preference = document.querySelector('#finder-choice');
function showPreferences() {
  const [, choices] = groups.find(([name]) => name === category.value);
  preference.replaceChildren(...choices.map(choice => new Option(choice, choice)));
}
category.addEventListener('change', showPreferences);
showPreferences();
document.querySelector('#finder-form').addEventListener('submit', event => {
  event.preventDefault();
  location.assign(links[preference.value]);
});
const range = document.querySelector('#shade-range');
range.addEventListener('input', () => {
  document.querySelector('.comparison-photo').style.setProperty('--split', range.value + '%');
});
