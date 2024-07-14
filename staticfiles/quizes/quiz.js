console.log('hello world');
const url = window.location.href;
const quizBox = document.getElementById('quiz-box');

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
      // console.log(response);
      quizForm.classList.add('not-visible');
      const results = response.results;
      console.log(results);
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
