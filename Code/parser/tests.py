import unittest
import pysolr
import LayoutParser

class TestSearchEngine(unittest.TestCase):

    def test_can_access_solr(self):
        solr = pysolr.Solr('http://127.0.0.1:8983/solr/', timeout=10)

        self.assertTrue(True,solr)
    
    def test_query_text(self):
        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test/', timeout=10)

        #query = '{!term f=' + field_name + '}' + keyword
        query = '{!term f=' + 'text' + '}' + 'History'
        results = solr.search(query.lower())
        found = False
        for result in results:
            if result['location'] == "..Sample/com.kaspersky.qrscanner-screens/hierarchy_4.xml":
                found = True

        self.assertTrue(True,found)

    def test_query_package(self):
        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test/', timeout=10)

        query = '{!term f=' + 'package' + '}' + 'emoji'
        results = solr.search(query.lower())

        self.assertEqual(59,len(results))

    def test_query_class(self):
        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test/', timeout=10)
        
        query = '{!term f=' + 'class' + '}' + 'android.widget.Button'
        results = solr.search(query.lower())

        self.assertEqual(47,len(results))

    def test_query_multiple(self):
        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test/', timeout=10)
        
        results = solr.search(q='{!term f=package}emoji',fq=("text:sticker~","text:keyboard","class:android.widget.button"))

        self.assertEqual(6,len(results))

    def test_color_search(self):

        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test/', timeout=10)

        results = solr.search(q='{!term f=red-1}[80 TO 100]',fq=("blue_1:[80 TO 85]","green_1:[90 TO 95]"))

        self.assertEqual(3,len(results))

    def test_color_search_2(self):

        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test/', timeout=10)

        results = solr.search(q='{!term f=red-1}[70 TO 100]',fq=("blue_1:[80 TO 85]","green_1:[90 TO 95]"))

        self.assertEqual(5,len(results))

    def test_tokenizer_keyword(self):
        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test2/', timeout=10)

        query = '{!term f=' + 'text' + '}' + 'keyboard'
        results = solr.search(query.lower())

        self.assertEqual(23,len(results))

    def test_tokenizer_class(self):

        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test2/', timeout=10)

        query = '{!term f=' + 'class' + '}' + 'button'
        results = solr.search(query.lower())

        self.assertEqual(36,len(results))

    def test_tokenizer_package(self):

        solr = pysolr.Solr('http://127.0.0.1:8983/solr/test2/', timeout=10)

        query = '{!term f=' + 'package' + '}' + 'keyboard'
        results = solr.search(query.lower())

        self.assertEqual(15,len(results))




if __name__ == "__main__":
    unittest.main(warnings='ignore')