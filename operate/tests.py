from django.shortcuts import render
from django.test import TestCase

# Create your tests here.
def test(request):
    return render(request, 'operate/haha.html')
