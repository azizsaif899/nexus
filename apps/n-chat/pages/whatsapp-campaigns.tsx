import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const WhatsAppCampaignsPage = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns] = useState([
    {
      id: 1,
      name: 'حملة ترحيب العملاء الجدد',
      status: 'نشط',
      sent: 1250,
      delivered: 1180,
      read: 980,
      replied: 45,
      created: '2025-01-15',
      type: 'ترحيب'
    },
    {
      id: 2,
      name: 'عروض نهاية الأسبوع',
      status: 'مجدول',
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      created: '2025-01-20',
      type: 'تسويق'
    },
    {
      id: 3,
      name: 'تذكير بالدفع',
      status: 'مكتمل',
      sent: 500,
      delivered: 485,
      read: 420,
      replied: 120,
      created: '2025-01-10',
      type: 'تذكير'
    }
  ]);

  return (
    <>
      <Head>
        <title>حملات واتساب - نكسوس AI</title>
        <meta name="description" content="إدارة وتنظيم حملات واتساب التسويقية والتواصل مع العملاء" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0b141a',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
      }}>
        {/* Header */}
        <header style={{
          padding: '20px',
          borderBottom: '1px solid #1f2937',
          backgroundColor: '#111827'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#25d366',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25d366"/>
                <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.4zm-8.475 18.297c-1.776 0-3.517-.477-5.033-1.378l-.36-.214-3.74.977 1-3.645-.236-.374c-.99-1.574-1.512-3.393-1.511-5.26.003-5.45 4.46-9.884 9.942-9.884 2.656.001 5.153 1.035 7.033 2.91 1.88 1.876 2.914 4.367 2.913 7.015-.003 5.45-4.46 9.885-9.941 9.885z" fill="#25d366"/>
              </svg>
              حملات واتساب
            </h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/chat" style={{
                backgroundColor: '#00a884',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                المحادثة
              </Link>
              <Link href="/home" style={{
                backgroundColor: '#1f2937',
                color: '#8696a0',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                border: '1px solid #374151'
              }}>
                الرئيسية
              </Link>
            </div>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div style={{
          backgroundColor: '#111827',
          borderBottom: '1px solid #1f2937'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            padding: '0 20px'
          }}>
            {[
              { id: 'campaigns', name: 'الحملات', icon: '📢' },
              { id: 'templates', name: 'القوالب', icon: '📝' },
              { id: 'contacts', name: 'جهات الاتصال', icon: '👥' },
              { id: 'analytics', name: 'التحليلات', icon: '📊' },
              { id: 'settings', name: 'الإعدادات', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '15px 20px',
                  backgroundColor: activeTab === tab.id ? '#25d366' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#8696a0',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid #25d366' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {activeTab === 'campaigns' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: 0
                }}>
                  الحملات النشطة
                </h2>
                <button style={{
                  backgroundColor: '#25d366',
                  color: '#ffffff',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  إنشاء حملة جديدة
                </button>
              </div>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {[
                  { title: 'إجمالي الحملات', value: campaigns.length.toString(), color: '#25d366' },
                  { title: 'الرسائل المرسلة', value: campaigns.reduce((sum, c) => sum + c.sent, 0).toLocaleString(), color: '#4f97ff' },
                  { title: 'معدل التسليم', value: '94%', color: '#10b981' },
                  { title: 'معدل القراءة', value: '78%', color: '#f59e0b' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1f2937',
                      padding: '25px',
                      borderRadius: '12px',
                      border: '1px solid #374151',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: stat.color,
                      marginBottom: '10px'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      color: '#8696a0',
                      fontSize: '14px'
                    }}>
                      {stat.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Campaigns Table */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                border: '1px solid #374151',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #374151',
                  backgroundColor: '#111827'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    margin: 0
                  }}>
                    جميع الحملات
                  </h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#111827' }}>
                        {['اسم الحملة', 'النوع', 'الحالة', 'مُرسل', 'مُسلّم', 'مقروء', 'رد', 'تاريخ الإنشاء', 'إجراءات'].map((header) => (
                          <th key={header} style={{
                            padding: '15px',
                            textAlign: 'right',
                            color: '#8696a0',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            borderBottom: '1px solid #374151'
                          }}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} style={{
                          borderBottom: '1px solid #374151'
                        }}>
                          <td style={{ padding: '15px', color: '#ffffff', fontWeight: 'bold' }}>
                            {campaign.name}
                          </td>
                          <td style={{ padding: '15px', color: '#8696a0' }}>
                            <span style={{
                              backgroundColor: campaign.type === 'ترحيب' ? '#10b98120' : 
                                             campaign.type === 'تسويق' ? '#4f97ff20' : '#f59e0b20',
                              color: campaign.type === 'ترحيب' ? '#10b981' : 
                                     campaign.type === 'تسويق' ? '#4f97ff' : '#f59e0b',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {campaign.type}
                            </span>
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              backgroundColor: campaign.status === 'نشط' ? '#10b981' : 
                                             campaign.status === 'مجدول' ? '#f59e0b' : '#6b7280',
                              color: '#ffffff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {campaign.status}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#ffffff' }}>{campaign.sent.toLocaleString()}</td>
                          <td style={{ padding: '15px', color: '#10b981' }}>{campaign.delivered.toLocaleString()}</td>
                          <td style={{ padding: '15px', color: '#4f97ff' }}>{campaign.read.toLocaleString()}</td>
                          <td style={{ padding: '15px', color: '#f59e0b' }}>{campaign.replied.toLocaleString()}</td>
                          <td style={{ padding: '15px', color: '#8696a0' }}>{campaign.created}</td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button style={{
                                backgroundColor: '#4f97ff',
                                color: '#ffffff',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: 'none',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}>
                                تعديل
                              </button>
                              <button style={{
                                backgroundColor: '#ef4444',
                                color: '#ffffff',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: 'none',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}>
                                حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: 0
                }}>
                  قوالب الرسائل
                </h2>
                <button style={{
                  backgroundColor: '#25d366',
                  color: '#ffffff',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  + إنشاء قالب جديد
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {[
                  {
                    name: 'رسالة ترحيب',
                    category: 'ترحيب',
                    preview: 'مرحباً {{الاسم}}! نحن سعداء لانضمامك إلينا. كيف يمكننا مساعدتك اليوم؟',
                    used: 45,
                    approved: true
                  },
                  {
                    name: 'عرض خاص',
                    category: 'تسويق',
                    preview: 'عرض خاص لك! خصم 20% على جميع المنتجات. استخدم الكود: SAVE20',
                    used: 28,
                    approved: true
                  },
                  {
                    name: 'تأكيد الطلب',
                    category: 'تأكيد',
                    preview: 'تم تأكيد طلبك رقم {{رقم_الطلب}}. سيتم التسليم خلال 2-3 أيام عمل.',
                    used: 156,
                    approved: true
                  },
                  {
                    name: 'تذكير بالدفع',
                    category: 'تذكير',
                    preview: 'تذكير ودود: لديك فاتورة مستحقة بقيمة {{المبلغ}}. يرجى الدفع في أقرب وقت ممكن.',
                    used: 12,
                    approved: false
                  }
                ].map((template, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1f2937',
                      padding: '25px',
                      borderRadius: '12px',
                      border: '1px solid #374151',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        margin: 0
                      }}>
                        {template.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          backgroundColor: template.approved ? '#10b981' : '#f59e0b',
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {template.approved ? 'معتمد' : 'قيد المراجعة'}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      backgroundColor: template.category === 'ترحيب' ? '#10b98120' : 
                                     template.category === 'تسويق' ? '#4f97ff20' : 
                                     template.category === 'تأكيد' ? '#00a88420' : '#f59e0b20',
                      color: template.category === 'ترحيب' ? '#10b981' : 
                             template.category === 'تسويق' ? '#4f97ff' : 
                             template.category === 'تأكيد' ? '#00a884' : '#f59e0b',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      display: 'inline-block',
                      marginBottom: '15px'
                    }}>
                      {template.category}
                    </div>

                    <div style={{
                      backgroundColor: '#0b141a',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #374151'
                    }}>
                      <p style={{
                        color: '#ffffff',
                        fontSize: '14px',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {template.preview}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <span style={{
                        color: '#8696a0',
                        fontSize: '14px'
                      }}>
                        استُخدم {template.used} مرة
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <button style={{
                        backgroundColor: '#25d366',
                        color: '#ffffff',
                        padding: '8px 15px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        استخدام
                      </button>
                      <button style={{
                        backgroundColor: '#4f97ff',
                        color: '#ffffff',
                        padding: '8px 15px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        تعديل
                      </button>
                      <button style={{
                        backgroundColor: 'transparent',
                        color: '#8696a0',
                        padding: '8px 15px',
                        borderRadius: '6px',
                        border: '1px solid #374151',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        نسخ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: 0
                }}>
                  جهات الاتصال
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{
                    backgroundColor: '#25d366',
                    color: '#ffffff',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    + إضافة جهة اتصال
                  </button>
                  <button style={{
                    backgroundColor: '#4f97ff',
                    color: '#ffffff',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    استيراد CSV
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '30px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="البحث في جهات الاتصال..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    fontSize: '16px'
                  }}
                />
                <select style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  backgroundColor: '#1f2937',
                  color: '#ffffff',
                  fontSize: '16px'
                }}>
                  <option>جميع المجموعات</option>
                  <option>عملاء VIP</option>
                  <option>عملاء جدد</option>
                  <option>عملاء نشطون</option>
                </select>
              </div>

              {/* Contacts Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {[
                  { title: 'إجمالي الجهات', value: '2,547', color: '#25d366' },
                  { title: 'نشط', value: '1,890', color: '#10b981' },
                  { title: 'غير نشط', value: '657', color: '#6b7280' },
                  { title: 'محظور', value: '12', color: '#ef4444' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1f2937',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #374151',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: stat.color,
                      marginBottom: '8px'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      color: '#8696a0',
                      fontSize: '14px'
                    }}>
                      {stat.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contacts List */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                border: '1px solid #374151'
              }}>
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    margin: 0
                  }}>
                    قائمة جهات الاتصال
                  </h3>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '15px',
                  padding: '20px'
                }}>
                  {[
                    { name: 'أحمد محمد', phone: '+966501234567', group: 'عملاء VIP', status: 'نشط', lastMessage: 'منذ ساعتين' },
                    { name: 'فاطمة علي', phone: '+966507654321', group: 'عملاء جدد', status: 'نشط', lastMessage: 'منذ يوم' },
                    { name: 'محمد سعد', phone: '+966509876543', group: 'عملاء نشطون', status: 'غير نشط', lastMessage: 'منذ أسبوع' },
                    { name: 'سارة أحمد', phone: '+966505551234', group: 'عملاء VIP', status: 'نشط', lastMessage: 'منذ 30 دقيقة' },
                    { name: 'خالد عبدالله', phone: '+966502468135', group: 'عملاء جدد', status: 'نشط', lastMessage: 'منذ 3 ساعات' },
                    { name: 'نور محمد', phone: '+966508642097', group: 'عملاء نشطون', status: 'نشط', lastMessage: 'منذ 5 دقائق' }
                  ].map((contact, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#0b141a',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #374151'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#ffffff',
                          margin: 0
                        }}>
                          {contact.name}
                        </h4>
                        <span style={{
                          backgroundColor: contact.status === 'نشط' ? '#10b981' : '#6b7280',
                          color: '#ffffff',
                          padding: '3px 6px',
                          borderRadius: '3px',
                          fontSize: '11px'
                        }}>
                          {contact.status}
                        </span>
                      </div>
                      <p style={{
                        color: '#8696a0',
                        fontSize: '14px',
                        margin: '5px 0'
                      }}>
                        📱 {contact.phone}
                      </p>
                      <p style={{
                        color: '#8696a0',
                        fontSize: '14px',
                        margin: '5px 0'
                      }}>
                        👥 {contact.group}
                      </p>
                      <p style={{
                        color: '#8696a0',
                        fontSize: '12px',
                        margin: '5px 0'
                      }}>
                        آخر رسالة: {contact.lastMessage}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '15px'
                      }}>
                        <button style={{
                          backgroundColor: '#25d366',
                          color: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          إرسال
                        </button>
                        <button style={{
                          backgroundColor: '#4f97ff',
                          color: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          تعديل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '30px'
              }}>
                تحليلات الحملات
              </h2>

              {/* Performance Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {[
                  { title: 'إجمالي الرسائل المرسلة', value: '15,247', change: '+12%', color: '#25d366' },
                  { title: 'معدل التسليم', value: '94.2%', change: '+2.1%', color: '#10b981' },
                  { title: 'معدل القراءة', value: '78.5%', change: '+5.3%', color: '#4f97ff' },
                  { title: 'معدل الاستجابة', value: '23.7%', change: '+8.2%', color: '#f59e0b' },
                  { title: 'التكلفة لكل رسالة', value: '0.05 ر.س', change: '-3%', color: '#8b5cf6' },
                  { title: 'العائد على الاستثمار', value: '245%', change: '+15%', color: '#ec4899' }
                ].map((metric, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1f2937',
                      padding: '25px',
                      borderRadius: '12px',
                      border: '1px solid #374151'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: metric.color
                      }}>
                        {metric.value}
                      </div>
                      <div style={{
                        backgroundColor: metric.change.startsWith('+') ? '#10b98120' : '#ef444420',
                        color: metric.change.startsWith('+') ? '#10b981' : '#ef4444',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {metric.change}
                      </div>
                    </div>
                    <div style={{
                      color: '#8696a0',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      {metric.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {/* Main Chart */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '20px'
                  }}>
                    أداء الحملات خلال الشهر
                  </h3>
                  <div style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8696a0',
                    fontSize: '18px'
                  }}>
                    📈 سيتم عرض الرسم البياني هنا
                  </div>
                </div>

                {/* Top Performing Campaigns */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '20px'
                  }}>
                    أفضل الحملات أداءً
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { name: 'حملة ترحيب العملاء', rate: '89%' },
                      { name: 'عروض نهاية الأسبوع', rate: '76%' },
                      { name: 'تذكير بالدفع', rate: '65%' },
                      { name: 'منتجات جديدة', rate: '58%' }
                    ].map((campaign, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px',
                          backgroundColor: '#0b141a',
                          borderRadius: '6px'
                        }}
                      >
                        <span style={{
                          color: '#ffffff',
                          fontSize: '14px'
                        }}>
                          {campaign.name}
                        </span>
                        <span style={{
                          color: '#25d366',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {campaign.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Analytics Table */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                border: '1px solid #374151'
              }}>
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    margin: 0
                  }}>
                    تحليلات مفصلة للحملات
                  </h3>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: '#8696a0',
                    fontSize: '18px'
                  }}>
                    📊 سيتم عرض الجدول التفصيلي هنا
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '30px'
              }}>
                إعدادات واتساب
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '30px'
              }}>
                {/* WhatsApp Connection */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '20px'
                  }}>
                    اتصال واتساب
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <p style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        margin: 0,
                        marginBottom: '5px'
                      }}>
                        +966501234567
                      </p>
                      <p style={{
                        color: '#10b981',
                        fontSize: '14px',
                        margin: 0
                      }}>
                        ✅ متصل
                      </p>
                    </div>
                    <button style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      padding: '8px 15px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      قطع الاتصال
                    </button>
                  </div>
                  <button style={{
                    backgroundColor: '#25d366',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%'
                  }}>
                    إعادة المسح بـ QR Code
                  </button>
                </div>

                {/* Message Settings */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '20px'
                  }}>
                    إعدادات الرسائل
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <input type="checkbox" defaultChecked style={{ marginLeft: '10px' }} />
                      تأكيد قراءة الرسائل
                    </label>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <input type="checkbox" defaultChecked style={{ marginLeft: '10px' }} />
                      حفظ الوسائط المرسلة
                    </label>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <input type="checkbox" style={{ marginLeft: '10px' }} />
                      إرسال تقارير يومية
                    </label>
                  </div>
                </div>

                {/* Rate Limits */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '20px'
                  }}>
                    حدود الإرسال
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#ffffff',
                        fontSize: '14px',
                        marginBottom: '5px'
                      }}>
                        عدد الرسائل في الدقيقة
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #374151',
                          backgroundColor: '#0b141a',
                          color: '#ffffff'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#ffffff',
                        fontSize: '14px',
                        marginBottom: '5px'
                      }}>
                        الحد الأقصى يومياً
                      </label>
                      <input
                        type="number"
                        defaultValue="1000"
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #374151',
                          backgroundColor: '#0b141a',
                          color: '#ffffff'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Backup & Export */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '20px'
                  }}>
                    النسخ الاحتياطي والتصدير
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button style={{
                      backgroundColor: '#4f97ff',
                      color: '#ffffff',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      نسخ احتياطي للمحادثات
                    </button>
                    <button style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      تصدير جهات الاتصال
                    </button>
                    <button style={{
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      تصدير تقارير الحملات
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default WhatsAppCampaignsPage;