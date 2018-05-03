import json
import pysolr
import sys

with open('config.json', 'r') as f:
    config = json.load(f)

solr = pysolr.Solr('{0}:{1}/solr/{2}'.format(config['baseURL'], config['port'], config['core']), timeout=10)

if (len(sys.argv) != 1):
    query = '{!term f=' + sys.argv[1] + '}' + sys.argv[2]
    results = solr.search(query.lower())

    print("Hit {0} result(s).".format(len(results)))
    for result in results:
        print("The title is '{0}'.".format(result['package']))
else:
    print("Query input required. Format of the command is: python search.py <field> <keyword>")
