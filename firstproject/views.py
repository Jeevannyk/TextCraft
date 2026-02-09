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
    inputtext = request.POST.get('text', '')
    removepunctuations_option = request.POST.get('removepunctuations', 'off')
    capitalize_option = request.POST.get('capitalize', 'off')
    spaceremover_option = request.POST.get('spaceremover', 'off')

    # If no operation is selected, show a simple message
    if (
        removepunctuations_option != "on"
        and capitalize_option != "on"
        and spaceremover_option != "on"
    ):
        return HttpResponse("You have not selected any operations !!")

    analyzed = inputtext
    tasks = []

    if removepunctuations_option == 'on':
        punctuations = '''!@$%^&*()_+-=[];:><"',.?/#'''
        temp = ""
        for char in analyzed:
            if char not in punctuations:
                temp += char
        analyzed = temp
        tasks.append('Removed Punctuations')

    if capitalize_option == 'on':
        analyzed = analyzed.upper()
        tasks.append('Capitalized')

    if spaceremover_option == 'on':
        temp = ""
        for index, char in enumerate(analyzed):
            # Skip if this and the next character are both spaces
            if char == " " and index + 1 < len(analyzed) and analyzed[index + 1] == " ":
                continue
            temp += char
        analyzed = temp
        tasks.append('Removed Extra Spaces')

    user_text = {
        'Task': ", ".join(tasks),
        'analyzed_text': analyzed,
    }

    return render(request, 'analyzed.html', user_text)

def spaceremover(request):
    return HttpResponse("spaceremover")

def capitalize(request):
    return HttpResponse("capitalize this text")


def about(request):
    return HttpResponse("about this webpage ")

def home(request):
    return HttpResponse("welcome to the homepage of this website")