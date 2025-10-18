import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AutomationPage = () => {
  const [activeTab, setActiveTab] = useState('workflows');

  return (
    <>
      <Head>
        <title>الأتمتة الذكية - نكسوس AI</title>
        <meta name="description" content="إدارة وأتمتة العمليات التجارية بذكاء" />
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
              color: '#4f97ff',
              margin: 0
            }}>
              الأتمتة الذكية
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
              { id: 'workflows', name: 'سير العمل', icon: '⚙️' },
              { id: 'triggers', name: 'المحفزات', icon: '🔔' },
              { id: 'actions', name: 'الإجراءات', icon: '🎯' },
              { id: 'analytics', name: 'التحليلات', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '15px 20px',
                  backgroundColor: activeTab === tab.id ? '#4f97ff' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#8696a0',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid #4f97ff' : '3px solid transparent',
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
          {activeTab === 'workflows' && (
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px'
              }}>
                سير العمل الآلي
              </h2>
              <p style={{
                color: '#8696a0',
                fontSize: '18px',
                marginBottom: '40px'
              }}>
                قم بإنشاء وإدارة سير العمل الآلي لتوفير الوقت والجهد
              </p>

              {/* Create New Workflow Button */}
              <button style={{
                backgroundColor: '#4f97ff',
                color: '#ffffff',
                padding: '15px 30px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '30px'
              }}>
                + إنشاء سير عمل جديد
              </button>

              {/* Workflows Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {[
                  {
                    name: 'الرد التلقائي على الرسائل',
                    status: 'نشط',
                    triggers: 12,
                    lastRun: 'منذ 5 دقائق'
                  },
                  {
                    name: 'تصنيف العملاء الجدد',
                    status: 'نشط',
                    triggers: 8,
                    lastRun: 'منذ ساعة'
                  },
                  {
                    name: 'إرسال تقارير يومية',
                    status: 'متوقف',
                    triggers: 0,
                    lastRun: 'أمس'
                  }
                ].map((workflow, index) => (
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
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        margin: 0
                      }}>
                        {workflow.name}
                      </h3>
                      <span style={{
                        backgroundColor: workflow.status === 'نشط' ? '#10b981' : '#ef4444',
                        color: '#ffffff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {workflow.status}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#8696a0',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}>
                      <span>المحفزات: {workflow.triggers}</span>
                      <span>آخر تشغيل: {workflow.lastRun}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
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
                        تفاصيل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'triggers' && (
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px'
              }}>
                المحفزات
              </h2>
              <p style={{
                color: '#8696a0',
                fontSize: '18px',
                marginBottom: '40px'
              }}>
                إدارة المحفزات التي تبدأ سير العمل الآلي
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { name: 'رسالة واردة جديدة', type: 'رسالة', active: true },
                  { name: 'عميل جديد', type: 'حدث', active: true },
                  { name: 'وقت محدد', type: 'وقت', active: false },
                  { name: 'كلمة مفتاحية', type: 'نص', active: true }
                ].map((trigger, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1f2937',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #374151'
                    }}
                  >
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}>
                      {trigger.name}
                    </h3>
                    <p style={{
                      color: '#8696a0',
                      marginBottom: '15px'
                    }}>
                      النوع: {trigger.type}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        backgroundColor: trigger.active ? '#10b981' : '#ef4444',
                        color: '#ffffff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {trigger.active ? 'نشط' : 'متوقف'}
                      </span>
                      <button style={{
                        backgroundColor: '#4f97ff',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        تعديل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px'
              }}>
                الإجراءات
              </h2>
              <p style={{
                color: '#8696a0',
                fontSize: '18px',
                marginBottom: '40px'
              }}>
                الإجراءات التي يتم تنفيذها عند تفعيل المحفزات
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { name: 'إرسال رسالة', description: 'إرسال رسالة تلقائية', icon: '📤' },
                  { name: 'إنشاء تذكرة', description: 'إنشاء تذكرة جديدة في النظام', icon: '🎫' },
                  { name: 'إرسال إيميل', description: 'إرسال بريد إلكتروني', icon: '📧' },
                  { name: 'تحديث قاعدة البيانات', description: 'تحديث بيانات العميل', icon: '💾' }
                ].map((action, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1f2937',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #374151'
                    }}
                  >
                    <div style={{
                      fontSize: '36px',
                      marginBottom: '15px'
                    }}>
                      {action.icon}
                    </div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}>
                      {action.name}
                    </h3>
                    <p style={{
                      color: '#8696a0',
                      marginBottom: '15px'
                    }}>
                      {action.description}
                    </p>
                    <button style={{
                      backgroundColor: '#4f97ff',
                      color: '#ffffff',
                      padding: '8px 15px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      إضافة
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px'
              }}>
                تحليلات الأتمتة
              </h2>
              <p style={{
                color: '#8696a0',
                fontSize: '18px',
                marginBottom: '40px'
              }}>
                إحصائيات وتحليلات أداء سير العمل الآلي
              </p>

              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {[
                  { title: 'إجمالي المهام المكتملة', value: '1,234', color: '#10b981' },
                  { title: 'المهام النشطة', value: '45', color: '#4f97ff' },
                  { title: 'الوقت المُوفر (ساعات)', value: '156', color: '#f59e0b' },
                  { title: 'معدل النجاح', value: '98%', color: '#00a884' }
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

              {/* Chart Placeholder */}
              <div style={{
                backgroundColor: '#1f2937',
                padding: '40px',
                borderRadius: '12px',
                border: '1px solid #374151',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '20px'
                }}>
                  أداء سير العمل خلال الأسبوع
                </h3>
                <div style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8696a0',
                  fontSize: '18px'
                }}>
                  📈 سيتم عرض الرسم البياني هنا
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AutomationPage;