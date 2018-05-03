import os
import xml.dom.minidom as md


def print_structure(root, depth):
    if root.childNodes:
        for node in root.childNodes:
           if node.nodeType == node.ELEMENT_NODE:
               print(node.tagName, "of depth:", depth ,", index:", node.getAttribute("index"), ", class", node.getAttribute("class"))
               print_structure(node, depth+1)



# a simple function that will print one xml file structure 

path = "absolute path of your xml file";
dom = md.parse(path)
root = dom.documentElement
print_structure(root, 1)
