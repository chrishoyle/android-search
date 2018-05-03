from app import webapp
from flask import jsonify, Blueprint, render_template, request
# pysolr config
import json
import os
import pysolr

with open('config.json', 'r') as f:
    config = json.load(f)

solr = pysolr.Solr('{0}:{1}/solr/{2}'.format(config['baseURL'], config['port'], config['core']), timeout=10, results_cls=dict)

b = Blueprint('layouts', __name__, static_url_path="/layouts", static_folder=os.path.realpath(config['parse_dir']))
webapp.register_blueprint(b)

# For now this route just redirects all query strings
# to our solr instance
@webapp.route('/api/query')
def handle_query():
	args = request.args.to_dict()
	try:
		results = solr.search(**args)
	except pysolr.SolrError as err:
		return jsonify({"status" : 504, "message" : str(err)[41:]})
	# print(results)
	return jsonify(results)

@webapp.route('/api/upload')
def upload_package():
	return jsonify({"message" : "Not yet implemented"})

@webapp.route('/api/<path:path>')
def catch_all_api_routes(path):
	return jsonify({"status" : 404, "message" : path+"is not an api endpoint" })


# simply redirects all routes to one vue template
@webapp.route('/', defaults={'path': ''})
@webapp.route('/<path:path>')
def catch_all_routes(path):
	return render_template("index.html")
