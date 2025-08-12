# -*- coding: utf-8 -*-
{
    'name': 'G-Assistant Connector',
    'version': '1.0.0',
    'category': 'Integration',
    'summary': 'تكامل G-Assistant مع Odoo للتحديثات الفورية',
    'description': """
G-Assistant Connector
=====================

تكامل Odoo مع نظام G-Assistant الذكي:

* إرسال تحديثات فورية عبر Webhooks
* مزامنة العملاء المحتملين والفرص التجارية
* تكامل مع نظام CRM الذكي
* إشعارات فورية للتغييرات المهمة
    """,
    'author': 'AzizSys Team',
    'website': 'https://azizsys.com',
    'depends': ['base', 'crm', 'sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/g_assistant_config_views.xml',
        'data/automated_actions.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
    'license': 'LGPL-3',
}