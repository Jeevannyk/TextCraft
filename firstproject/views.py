#This file was created by me for educational purposes.
from django.http import HttpResponse
from django.shortcuts import render

def index(request):

    # content = {
    #     "Data": "Youtube is best for learning",
    #     "Roll_number":[1,2,3,4,5,6,7,8,9,10],
    #     "first_name":"Jeeva",
    #     "last_name":"Kumar",
    #     "variable_name":"This is a educational video in which we are gonna study about templates in Django",
    # }

    return render(request,'textutils-2.html', )
#      return HttpResponse(
# # '''<nav style="margin: auto;"></nav><a href="www.google.com">Google</a>
# # <a href="https://www.youtube.com">YouTube</a>   
# # <a href="https://www.facebook.com">Facebook</a>
# # <a href="https://www .instagram.com">Instagram</a></nav>'''
#      )

def removepunctuations(request):
    inputtext = request.POST.get('text', 'default')
    removepunctuations = request.POST.get('removepunctuations', 'off')
    capitalize = request.POST.get('capitalize', 'off')
    spaceremover = request.POST.get('spaceremover', 'off')

    if removepunctuations == 'on':
        punctuations = '''!@$%^&*()_+-=[];:><'",.?/#'''
        analyzed = ""
        for char in inputtext:
            if char not in punctuations:
                analyzed = analyzed + char

        user_text = {'Task': 'Removed Punctuations', 'analyzed_text': analyzed}
        inputtext = analyzed
    
    if capitalize == 'on':
        analyzed = ""
        for char in inputtext:
            analyzed = analyzed + char.upper()

        user_text = {'Task': 'Capitalized ', 'analyzed_text': analyzed}
        inputtext = analyzed
    
    if spaceremover == 'on':
        analyzed=""
        for index, char in enumerate(inputtext):
            if not (inputtext[index]== " " and inputtext[index+1]== " "):               
                analyzed = analyzed + char

        user_text = {'Task': 'sorted ', 'analyzed_text': analyzed}
        
    if(removepunctuations != "on" and capitalize != "on" and spaceremover != "on"):
        return HttpResponse("You have not selected any operations !!")
        
        return render(request, 'analyzed.html', user_text)
    

    else:
        return HttpResponse("ERROR - Your text has not been analyzed.")

def spaceremover(request):
    return HttpResponse("spaceremover")

def capitalize(request):
    return HttpResponse("capitalize this text")


def about(request):
    return HttpResponse("about this webpage ")

def home(request):
    return HttpResponse("welcome to the homepage of this website")