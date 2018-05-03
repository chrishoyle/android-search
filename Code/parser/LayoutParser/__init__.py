from xml.dom import minidom
from multiprocessing import Pool, Process, Lock, cpu_count
import colorgram
import json
import os
import fnmatch
import re
from bs4 import BeautifulSoup
import requests

DEFAULT_PROCESSES = cpu_count() - 1 or 1

pool = None
print_lock = Lock()

logOutput = True

def setProcesses(num):
    if num <= 0:
        num = DEFAULT_PROCESSES
    print("Using %d process(es)" % num)
    global pool
    pool = Pool(processes = num or DEFAULT_PROCESSES, maxtasksperchild=10)
    
def crawlGooglePlay(appname):
    appinfo = { "appname" : appname }
    url = "https://play.google.com/store/apps/details?id=" + appname
    print_lock.acquire()
    print("Getting url           %s" % url)
    print_lock.release()
    r = requests.get(url)
    soup = BeautifulSoup(r.content,'html.parser')
    data = soup.find_all("div",{"class":"id-app-title"})
    if(not len(data)): 
        print_lock.acquire()
        print("Couldn't crawl Google play")
        print_lock.release()
    else:
        appinfo['name'] = (soup.find_all("div",{"class":"id-app-title"})[0].text).strip()
        appinfo['tag'] = (soup.find_all("span", {"itemprop":"genre"})[0].text).strip()
    return appinfo

def parseFile(filepath, root, screenID, cb=None):
    """Parses a single file given a full filepath"""
    print_lock.acquire()
    print("Analyzing file:       %s" % (filepath))
    print_lock.release()
    # extract the folder name and 
    folder = os.path.basename(os.path.dirname(filepath))
    appname = folder.split("-")[0]

    # crawl google play store
    appinfo = crawlGooglePlay(appname)

    screenDic = {}
    classList = []
    textList = []
    doc = minidom.parse(filepath)
    nodelist = doc.getElementsByTagName('node')

    for node in nodelist:
        package = appinfo['appname']
        # don't index screenshots of the home screen
        if (package == "com.android.launcher"):
            print("Discard screen")
            return
        className = node.getAttribute('class')
        text = node.getAttribute('text')
        if(text and text not in textList):
            textList.append(text)
        if(className not in classList):
            classList.append(className)

    screenDic['id'] = package + "-" + str(screenID)
    package = package.replace("."," ") # change the package name for better tokenization
    screenDic['package'] = package
    screenDic['screenID'] = screenID
    screenDic['class'] = classList
    screenDic['text'] = textList
    screenDic['location'] = folder +  os.path.basename(filepath) # temp
    
    screenshot = '/screenshot_' + str(screenID) + '.png'
    screenDic['screenshot_location'] = folder + screenshot

    # info crawled from google play store
    screenDic['appname'] = appinfo.get('name',"")  # more proper name comparing to 'package'
    screenDic['appname_search'] = appinfo.get('name', "")
    screenDic['tag'] = appinfo.get('tag', "")

    # extract six main colors from the screenshot.
    prop_list, rgb_list, red_list, green_list, blue_list, hue_list, sat_list, light_list  = parseScreenshot(root + screenshot)
    # don't index screenshots with swip-down alert
    for s in rgb_list:
        if any(s.r==99 and s.g==176 and s.b==233 for s in rgb_list):
            print("discard screen")
            return
    # print("Hello")

    # not necessarily all the screen can be extracted six colors
    for i in range(len(prop_list)):
        screenDic['prop_'+str(i+1)] = prop_list[i]
        screenDic['red_'+str(i+1)] = red_list[i]
        screenDic['green_'+str(i+1)] = green_list[i]
        screenDic['blue_'+str(i+1)] = blue_list[i]

        screenDic['hue_'+str(i+1)] = hue_list[i]
        screenDic['sat_'+str(i+1)] = sat_list[i]
        screenDic['light_'+str(i+1)] = light_list[i]

    print_lock.acquire()
    print("Completed parsing     %s" % filepath)
    print_lock.release()
    # run callback function with dictionary passed as parameter
    return screenDic

def parseScreenshot(filename):
    """Extracts color information from the relevant screenshot"""
    print_lock.acquire()
    print("Analyzing screenshot: %s" % (filename))
    print_lock.release()

    rgb_list, red_list, green_list, blue_list = ([] for i in range(4))
    hue_list, sat_list, light_list = ([] for i in range(3))
    prop_list = []

    palette = colorgram.extract(filename, 6) # extract 6 colors from each screenshot
    # RGB, HSL, and what proportion of the image was that color
    for color in palette:
        color_rgb = color.rgb
        color_hsl = color.hsl
        color_prop = color.proportion

        red = color_rgb.r
        green = color_rgb.g
        blue = color_rgb.b
        hue = color_hsl.h
        sat = color_hsl.s
        light = color_hsl.l

        rgb_list.append(color_rgb)
        red_list.append(red)
        green_list.append(green)
        blue_list.append(blue)
        hue_list.append(hue)
        sat_list.append(sat)
        light_list.append(light)
        prop_list.append(color_prop)

    return prop_list, rgb_list, red_list, green_list, blue_list, hue_list, sat_list, light_list

def parseDirectory(dir, cb):
    """Reads and parses all files in a directory"""
    global pool
    if not pool:
        setProcesses(0)
    # Print number of xml files
    xml_count = sum([len(fnmatch.filter(files, "*.xml")) for r, d, files in os.walk(dir)])
    print("Found %d xml files" % (xml_count))
    # Parse the directory
    for root, dirs, files in os.walk(dir):
        screenID = 0
        for filename in files:
            if(filename.endswith(".xml")):
                fullpath = os.path.join(root, filename)
                screenID = screenID + 1
                pool.apply_async(parseFile, args=(fullpath, root, screenID,), callback=cb)
    pool.close()
    pool.join()
