# -*- coding: utf-8 -*-
from odoo import models, api

class CrmLead(models.Model):
    _inherit = 'crm.lead'

    @api.model
    def create(self, vals):
        """إرسال webhook عند إنشاء عميل محتمل جديد"""
        lead = super(CrmLead, self).create(vals)
        self._send_g_assistant_webhook(lead, 'create')
        return lead

    def write(self, vals):
        """إرسال webhook عند تحديث عميل محتمل"""
        result = super(CrmLead, self).write(vals)
        for lead in self:
            self._send_g_assistant_webhook(lead, 'write')
        return result

    def unlink(self):
        """إرسال webhook عند حذف عميل محتمل"""
        for lead in self:
            self._send_g_assistant_webhook(lead, 'unlink')
        return super(CrmLead, self).unlink()

    def _send_g_assistant_webhook(self, lead, action):
        """إرسال webhook إلى G-Assistant"""
        config = self.env['g.assistant.config'].get_config()
        
        if not config or not config.send_lead_updates:
            return
            
        lead_data = {
            'id': lead.id,
            'name': lead.name,
            'partner_name': lead.partner_name,
            'email_from': lead.email_from,
            'phone': lead.phone,
            'expected_revenue': lead.expected_revenue,
            'probability': lead.probability,
            'stage_id': lead.stage_id.name if lead.stage_id else None,
            'user_id': lead.user_id.name if lead.user_id else None,
            'team_id': lead.team_id.name if lead.team_id else None,
            'create_date': lead.create_date.isoformat() if lead.create_date else None,
            'write_date': lead.write_date.isoformat() if lead.write_date else None,
        }
        
        config.send_webhook('crm.lead', lead.id, action, lead_data)