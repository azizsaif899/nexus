# -*- coding: utf-8 -*-
from odoo import models, api

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    @api.model
    def create(self, vals):
        """إرسال webhook عند إنشاء أمر بيع جديد"""
        order = super(SaleOrder, self).create(vals)
        self._send_g_assistant_webhook(order, 'create')
        return order

    def write(self, vals):
        """إرسال webhook عند تحديث أمر بيع"""
        result = super(SaleOrder, self).write(vals)
        for order in self:
            self._send_g_assistant_webhook(order, 'write')
        return result

    def unlink(self):
        """إرسال webhook عند حذف أمر بيع"""
        for order in self:
            self._send_g_assistant_webhook(order, 'unlink')
        return super(SaleOrder, self).unlink()

    def _send_g_assistant_webhook(self, order, action):
        """إرسال webhook إلى G-Assistant"""
        config = self.env['g.assistant.config'].get_config()
        
        if not config or not config.send_order_updates:
            return
            
        order_data = {
            'id': order.id,
            'name': order.name,
            'partner_id': [order.partner_id.id, order.partner_id.name] if order.partner_id else None,
            'amount_total': order.amount_total,
            'amount_untaxed': order.amount_untaxed,
            'state': order.state,
            'date_order': order.date_order.isoformat() if order.date_order else None,
            'user_id': order.user_id.name if order.user_id else None,
            'team_id': order.team_id.name if order.team_id else None,
            'create_date': order.create_date.isoformat() if order.create_date else None,
            'write_date': order.write_date.isoformat() if order.write_date else None,
        }
        
        config.send_webhook('sale.order', order.id, action, order_data)