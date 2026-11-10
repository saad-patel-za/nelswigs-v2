const stage = document.querySelector('.comparison-photo');
const range = document.querySelector('#shade-range');
range.addEventListener('input', () => stage.style.setProperty('--split', range.value + '%'));

for (const pick of document.querySelectorAll('[data-compare]')) {
  pick.addEventListener('click', () => {
    const product = products[Number(pick.dataset.compare)];
    const photo = stage.querySelector('img');
    const name = product.name.split(' - ')[0];
    photo.src = product.images[0];
    photo.alt = name;
    document.querySelector('#compare-name').textContent = name;
    document.querySelectorAll('[data-compare]').forEach(button => {
      button.setAttribute('aria-pressed', String(button === pick));
    });
  });
}

const rail = document.querySelector('.rail');
const controls = document.querySelectorAll('.rail-controls button');
controls.forEach((button, index) => button.addEventListener('click', () => {
  const distance = rail.firstElementChild.offsetWidth + parseFloat(getComputedStyle(rail).gap);
  rail.scrollBy({ left: (index ? 1 : -1) * distance, behavior: 'smooth' });
}));

const questions = [
  ['Which length do you like?', ['Short', 'Medium', 'Long']],
  ['Which shade family draws you in?', ['Blonde', 'Brunette', 'Black', 'Auburn/Copper', 'Salt & Pepper/Platinum']],
  ['Which style would you like to explore?', ['Straight', 'Wavy/Curly', 'Bangs & Curtain']]
];
const answers = [];
const question = document.querySelector('#question');
function renderQuestion() {
  const step = answers.length;
  const complete = step === questions.length;
  document.querySelector('#progress').value = Math.min(step + 1, questions.length);
  question.replaceChildren();
  const count = document.createElement('p');
  count.textContent = complete ? 'Your selections' : 'Step ' + (step + 1) + ' / 3';
  const heading = document.createElement('h3');
  heading.tabIndex = -1;
  heading.textContent = complete ? 'Explore your collections' : questions[step][0];
  const options = document.createElement('div');
  options.className = 'options';
  question.append(count, heading, options);
  for (const value of complete ? answers : questions[step][1]) {
    const choice = document.createElement(complete ? 'a' : 'button');
    choice.textContent = value;
    if (complete) choice.href = links[value];
    else choice.onclick = () => { answers.push(value); renderQuestion(); question.querySelector('h3').focus(); };
    options.append(choice);
  }
  if (step > 0) {
    const back = document.createElement('button');
    back.className = 'back-step';
    back.textContent = 'Back';
    back.onclick = () => { answers.pop(); renderQuestion(); question.querySelector('h3').focus(); };
    question.append(back);
  }
}
renderQuestion();
