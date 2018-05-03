# Android-Search-Engine

An advanced search engine for android GUIs that allows a user to search for internal elements such as text, component, activities, and color.
[DEMO](http://173.255.245.197:8000/)

2. Set up Solr server:
cd to `/solr-7.2.1/bin`
use command `solr start` to start the server

(note that the parsed core is already included in the folder)
to stop the solr server use command `solr stop -all`

3. Setting up the configuration file
cd to Code and edit `config.json`
change `layouts_dir` with the path to the layouts data files (that was named `final-data`)

4. Running the application
Requirements:
i. Node.js with Node Package Manger (npm)

cd app

ii. Install the dependencies

npm install

iv. Development mode
npm run dev

v. Production mode
npm start