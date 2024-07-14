from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
  list_display = ['name','topic','time','required_score_to_pass']


