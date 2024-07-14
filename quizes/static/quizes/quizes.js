const modelBtns = [...document.getElementsByClassName('model-button')];
const modelBody = document.getElementById('quiz-model-body');
const startBtn = document.getElementById('start-btn');

const url = window.location.href;
modelBtns.forEach(modelBtn =>
  modelBtn.addEventListener('click', () => {
    const pk = modelBtn.getAttribute('data-pk');
    const name = modelBtn.getAttribute('data-name');
    const topic = modelBtn.getAttribute('data-topic');
    const number_of_questions = modelBtn.getAttribute(
      'data-number-of-questions'
    );
    const time = modelBtn.getAttribute('data-time');
    const difficulty = modelBtn.getAttribute('data-difficulty');
    const required_score_to_pass = modelBtn.getAttribute(
      'data-required-score-to-pass'
    );

    modelBody.innerHTML = `
    <div class="h5 mb-4"> are you sure begin "<b>${name}</b>"</div>
    <div class="mb3 mt-3">
    <ul>
    <li>name: ${name} </li>
    <li>topic: ${topic} </li>
    <li>questions: ${number_of_questions} </li>
    <li>difficulty: ${difficulty} </li>
    <li>score: ${required_score_to_pass}% </li>
    <li>time: ${time}min</li>
    </ul>
    </div>
    `;
    startBtn.addEventListener('click', () => {
      window.location.href = url + pk;
      console.log(window.location.href);
    });
  })
);
