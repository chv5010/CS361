import requests
import re
from bs4 import BeautifulSoup as soup
import json

target = 'Texas'

def wikiScraper(target):
    targetPage = requests.get("https://en.wikipedia.org/wiki/"+target)
    print("Target Article: ","https://en.wikipedia.org/wiki/"+target)

    data = soup(targetPage.content, 'html.parser')
    headers = []
    text = []
    headers.append("Main")

    # get main section and filter
    mainText = data.find('p', {'class':None}).text
    mainText = re.sub(r'\[.*?\]+', '', mainText)
    mainText = mainText.replace('\n', '')
    text.append(mainText)

    # Iteratively pull section titles and text
    for content in data.find_all('h2'):
        filtertext = content.text
        filtertext = re.sub(r'\[.*?\]+', '', filtertext)
        filtertext = filtertext.replace('\n', '')
        headers.append(filtertext)
        textBuilder = ''
        for elem in content.next_siblings:
            if elem.name == 'h2':
                break
            if elem.name == 'p':
                filtertext = elem.text
                filtertext = re.sub(r'\[.*?\]+', '', filtertext)
                filtertext = filtertext.replace('\n', '')
                textBuilder += filtertext
        text.append(textBuilder)

    # print(headers)
    # print(text)
    print("Sections Length: ", len(headers))
    print("Text Length: ", len(text))

    # # Build JSON Object
    jsonText = {}

    for x in range(0, len(text)):
        jsonText[headers[x]] = text[x]

    jsonData = json.dumps(jsonText)
    print(jsonData)
    return jsonData

wikiScraper(target)
