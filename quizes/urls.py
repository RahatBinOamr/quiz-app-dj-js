from django.urls import path
from .views import QuizListView,quiz_view,quiz_data_view,save_quiz_view

urlpatterns=[
path('',QuizListView.as_view(),name='quiz_list'),
path('<pk>/',quiz_view,name='quiz'),
path('<pk>/data',quiz_data_view,name='quiz_data'),
path('<pk>/save',save_quiz_view,name='save_data')
]