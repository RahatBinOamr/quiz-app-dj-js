console.log('hello world');
const url = window.location.href;
const quizBox = document.getElementById('quiz-box');
const resultBox = document.getElementById('result-box');
const scoreBox = document.getElementById('score-box');
const timerBox = document.getElementById('timer-box');
const activateTimer = time => {
  if (time.toString().length < 2) {
    timerBox.innerHTML += `<b>0${time}:00</b>`;
  } else {
    timerBox.innerHTML += `<b>0${time}:00</b>`;
  }
  let minutes = time - 1;
  let seconds = 60;
  let displayMinutes;
  let displaySeconds;

  const timer = setInterval(() => {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    if (minutes.toString().length < 2) {
      displayMinutes = '0' + minutes;
    } else {
      displayMinutes = minutes;
    }
    if (seconds.toString().length < 2) {
      displaySeconds = '0' + seconds;
    } else {
      displaySeconds = seconds;
    }
    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
      alert('time out!!!');
      submitForm();
    }
    timerBox.innerHTML = `<b>${displayMinutes}:${displaySeconds} </b>`;
  }, 1000);
};
$.ajax({
  type: 'GET',
  url: `${url}data`,
  success: function (response) {
    let data = response.data;
    data.forEach(el => {
      for (const [questions, answers] of Object.entries(el)) {
        quizBox.innerHTML += `
        <hr>
        <div class="mb-2 qes">
        <b>${questions} </b>
        </div>
        `;
        answers.forEach(answer => {
          quizBox.innerHTML += `
          <div class="mb-2">
            <input type="radio" class="ans" name="${questions}" value="${answer}" id="${questions}-${answer}" />
            <label for="${questions}-${answer}">${answer}</label>
          </div>
          `;
        });
      }
    });
    activateTimer(response.time);
  },
  error: function (error) {
    console.log(error);
  },
});

const quizForm = document.getElementById('quiz-form');
const csrf = document.getElementsByName('csrfmiddlewaretoken');

const submitForm = () => {
  const elements = [...document.getElementsByClassName('ans')];
  let data = {};
  data['csrfmiddlewaretoken'] = csrf[0].value;

  elements.forEach(el => {
    if (el.checked) {
      data[el.name] = el.value;
    }
  });

  $.ajax({
    type: 'POST',
    url: `${url}save`,
    data: data,
    success: function (response) {
      if (quizForm) {
        quizForm.classList.add('d-none');
        const results = response.results;
        console.log(response);
        scoreBox.innerHTML = `${
          response.passed ? 'congratulations!!! ' : 'Ups...:( '
        } your result is ${response.score}%`;
        results.forEach(res => {
          const resDiv = document.createElement('div');
          for (const [question, resp] of Object.entries(res)) {
            resDiv.innerHTML += question;
            const cls = [
              'container',
              'p-3',
              'h6',
              'text-light',
              'rounded',
              'mt-3',
            ];
            resDiv.classList.add(...cls);

            if (resp == 'not answered') {
              resDiv.innerHTML += '-not answered';
              resDiv.classList.add('bg-danger');
            } else {
              const answered = resp['answered'];
              const correct_answer = resp['correct_answer'];

              if (answered == correct_answer) {
                resDiv.classList.add('bg-success');
                resDiv.innerHTML += `answer: ${answered}`;
              } else {
                resDiv.classList.add('bg-danger');
                resDiv.innerHTML += ` | correct answer: ${correct_answer}`;
                resDiv.innerHTML += ` | answered: ${answered}`;
              }
            }
          }
          resultBox.append(resDiv);
        });
      } else {
        console.error('quiz-form element not found');
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

document.addEventListener('submit', function (e) {
  e.preventDefault();
  if (e.target && e.target.id === 'quiz-form') {
    submitForm();
  }
});
