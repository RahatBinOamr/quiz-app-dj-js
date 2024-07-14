from django.views.generic import ListView
from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from questions.models import Question,Answer
from .models import Quiz
from results.models import Result

# Create your views here.
class QuizListView(ListView):
  model = Quiz
  template_name = 'quizes.html'

def quiz_view(request, pk):
  quiz = Quiz.objects.get(pk=pk)
  return render(request,'quiz.html',{'quiz':quiz})


def quiz_data_view(request, pk):
    quiz = get_object_or_404(Quiz, pk=pk)
    questions = []
    for q in quiz.get_question():
        answers = [a.text for a in q.get_answer()]
        questions.append({str(q): answers})

    return JsonResponse({
        'data': questions,
        'time': quiz.time,
    })

def save_quiz_view(request, pk):
    if request.method == 'POST':
        questions = []
        data = dict(request.POST.lists())
        data.pop('csrfmiddlewaretoken')
        for k, v in data.items():
            if v:  # Only process questions with answers
                question = Question.objects.get(text=k)
                questions.append((question, v))

        user = request.user
        quiz = Quiz.objects.get(pk=pk)

        score = 0
        multiplier = 100 / quiz.number_of_questions
        results = []
        for q, a_selected in questions:
            a_selected = a_selected[0]
            correct_answer = None
            question_answer = Answer.objects.filter(question=q)
            for a in question_answer:
                if a.correct:
                    correct_answer = a.text
                if a_selected == a.text and a.correct:
                    score += 1
            results.append({
                str(q): {
                    'correct_answer': correct_answer,
                    'answered': a_selected
                }
            })

        score_ = multiplier * score
        Result.objects.create(quiz=quiz, user=user, score=score_)
        if score_ >= quiz.required_score_to_pass:
            return JsonResponse({'passed': True, 'score': score_, 'results': results})
        else:
            return JsonResponse({'passed': False, 'score': score_, 'results': results})

    return JsonResponse({'text': 'Invalid request'}, status=400)
