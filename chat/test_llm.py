import io
import json
import unittest
from unittest.mock import patch
import llm

class ModelAdapterTests(unittest.TestCase):
    def response(self, value, status='completed'):
        return io.BytesIO(json.dumps({'status':status,'output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(value)}]}]}).encode())

    def test_grounded_request_redaction_schema_and_source_mapping(self):
        value={'answer':'Trader is Manoj’s project.','supported':True,'fact_ids':['trader']}
        with patch.dict('os.environ',{'OPENAI_API_KEY':'test-only'}), patch('llm.urlopen',return_value=self.response(value)) as send:
            result=llm.generate('Trader; contact me at visitor@example.com', [{'question':'My number is +91 98765 43210','answer':'Hello'}])
        payload=json.loads(send.call_args.args[0].data)
        self.assertFalse(payload['store'])
        self.assertEqual(payload['max_output_tokens'],600)
        self.assertNotIn('visitor@example.com',json.dumps(payload['input']))
        self.assertNotIn('98765',json.dumps(payload['input']))
        self.assertIn('February 2024',payload['instructions'])
        self.assertEqual(result['sources'][0]['url'],'https://trader.manojmathivanan.com')
        self.assertTrue(payload['text']['format']['strict'])

    def test_unsupported_and_uncited_output_not_displayed(self):
        for value in [{'answer':'Invented salary','supported':False,'fact_ids':[]}, {'answer':'Invented salary','supported':True,'fact_ids':[]}]:
            with patch.dict('os.environ',{'OPENAI_API_KEY':'test-only'}), patch('llm.urlopen',return_value=self.response(value)):
                self.assertEqual(llm.generate('What is his salary?',[])['text'],llm.REFUSAL)

    def test_unknown_sources_or_incomplete_output_rejected(self):
        for value,status in [({'answer':'Fake','supported':True,'fact_ids':['fake']},'completed'), ({'answer':'Partial','supported':True,'fact_ids':['trader']},'incomplete')]:
            with patch.dict('os.environ',{'OPENAI_API_KEY':'test-only'}), patch('llm.urlopen',return_value=self.response(value,status)):
                with self.assertRaises(ValueError):
                    llm.generate('Trader',[])
