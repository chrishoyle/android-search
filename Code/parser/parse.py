import sys
import os
import json
import pysolr
import argparse
import LayoutParser

solr = None
config = None

# Add the file to the solr database
def onParsedXML(p):
    """ """
    # Take the results
    if(p):
        # TODO: print to std out if o is provided database provided
        try:
            solr.add([p])
        except:
            print("Couldn't add document to solr.")

def parseWithoutConfig(args):
    """ Parses files or directories using argumetns mostly supplied on the command line """
    print("Parsing without a config")

def parseUsingConfig(args):
    """ Loads a configuration file """
    global solr
    # Open config
    config = None
    try:
        with open(args.config or "config.json", 'r') as f:
            config = json.load(f)
    except:
        print("Configuration file was not found or has syntax error!")
        sys.exit(2)
    #override other arguments
    config['processes'] = int(args.processes or config.get('processes', 3))

    # Get and check if parse directory supplied
    directory = None
    directory = config.get('layouts_dir')
    if not directory:
        print("Error: Empty or missing parse directory (layouts_dir) in config file!")
        sys.exit(2)
    # Normalize path to directory
    directory = os.path.abspath(directory)
    print("Building index from directory: " + directory)

    # Check for solr_url
    url = args.solrurl or config.get('solr_url')
    if not url:
        print("Missing solr_url field in configuration")

    print("Connecting to solr index at: " + url)

    # initialize and check for running solr instance
    solr = pysolr.Solr(url, timeout=10, results_cls=dict)
    try:
        result = solr.search(q="*:*", rows=0)
    except:
        print("Error: Couldn't connect to solr core!")
        print("Check your configuration settings and make sure solr is running.")
        sys.exit(2)

    LayoutParser.setProcesses(config['processes'])
    LayoutParser.parseDirectory(directory, onParsedXML)


def main(args):
    """ Gathers information from a file and its associated screenshot """
    # Decide if there is information to parse without a configuration file
    if not args.config and (args.output or args.solrurl) and (args.files or args.directory):
        parseWithoutConfig(args)
    # Otherwise search for a configuration file
    else:
        parseUsingConfig(args)

if __name__ == "__main__":
    os.chdir("..")
    # Set up arguments parser
    descr = "This program extracts data and puts it into a solr database."
    parser = argparse.ArgumentParser(description = descr)
    parser.add_argument("-c", "--config",     help="set configuration file")
    parser.add_argument("-o", "--output",     help="write parse output to stdio", action="store_true")
    parser.add_argument("-f", "--files",      help="parse specific files")
    parser.add_argument("-d", "--directory",  help="parse a directory")
    parser.add_argument("-s", "--solrurl",    help="url to running solr instance")
    parser.add_argument("-p", "--processes",  help="set number of processes", type=int)
    # Pass arguments to main
    main(parser.parse_args())
