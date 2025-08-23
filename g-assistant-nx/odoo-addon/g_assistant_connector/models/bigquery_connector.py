from odoo import models, fields, api
import json
import requests
import logging

_logger = logging.getLogger(__name__)

class BigQueryConnector(models.Model):
    _name = 'bigquery.connector'
    _description = 'BigQuery Connector'

    name = fields.Char('Name', required=True)
    project_id = fields.Char('Project ID', default='gen-lang-client-0147492600')
    dataset_id = fields.Char('Dataset ID', default='workflows_db')
    table_name = fields.Char('Table Name', default='workflows')
    api_endpoint = fields.Char('API Endpoint', default='http://localhost:5000/api/bigquery')
    active = fields.Boolean('Active', default=True)

    @api.model
    def sync_to_bigquery(self, data):
        """مزامنة البيانات مع BigQuery"""
        try:
            response = requests.post(f"{self.api_endpoint}/insert", json={
                'table': self.table_name,
                'data': data,
                'insertMethod': 'batch'
            })
            if response.status_code == 200:
                _logger.info(f"تم إرسال البيانات إلى BigQuery: {data}")
                return True
            else:
                _logger.error(f"خطأ في إرسال البيانات: {response.text}")
                return False
        except Exception as e:
            _logger.error(f"خطأ في الاتصال بـ BigQuery: {str(e)}")
            return False

    @api.model
    def query_bigquery(self, query):
        """استعلام من BigQuery"""
        try:
            response = requests.post(f"{self.api_endpoint}/query", json={
                'query': query
            })
            if response.status_code == 200:
                return response.json()
            else:
                _logger.error(f"خطأ في الاستعلام: {response.text}")
                return None
        except Exception as e:
            _logger.error(f"خطأ في الاستعلام من BigQuery: {str(e)}")
            return None