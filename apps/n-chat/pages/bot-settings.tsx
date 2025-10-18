import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const BotSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [botSettings, setBotSettings] = useState({
    name: 'مساعد نكسوس',
    language: 'ar',
    autoReply: true,
    responseTime: 'fast',
    personality: 'professional',
    welcomeMessage: 'مرحباً! كيف يمكنني مساعدتك اليوم؟'
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setBotSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      <Head>
        <title>إعدادات البوت الذكي - نكسوس AI</title>
        <meta name="description" content="تخصيص وإعداد البوت الذكي حسب احتياجاتك" />
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
              color: '#10b981',
              margin: 0
            }}>
              🤖 إعدادات البوت الذكي
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

        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
          {/* Sidebar */}
          <div style={{
            width: '280px',
            backgroundColor: '#111827',
            borderRight: '1px solid #1f2937',
            padding: '20px'
          }}>
            <nav>
              {[
                { id: 'general', name: 'الإعدادات العامة', icon: '⚙️' },
                { id: 'personality', name: 'الشخصية', icon: '🎭' },
                { id: 'responses', name: 'الردود التلقائية', icon: '💬' },
                { id: 'training', name: 'التدريب', icon: '🎯' },
                { id: 'integrations', name: 'التكاملات', icon: '🔗' },
                { id: 'analytics', name: 'التحليلات', icon: '📊' }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: activeSection === section.id ? '#10b981' : 'transparent',
                    color: activeSection === section.id ? '#ffffff' : '#8696a0',
                    border: 'none',
                    borderRadius: '8px',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: '10px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== section.id) {
                      e.currentTarget.style.backgroundColor = '#1f2937';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== section.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#8696a0';
                    }
                  }}
                >
                  {section.icon} {section.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: '40px' }}>
            {activeSection === 'general' && (
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '30px'
                }}>
                  الإعدادات العامة
                </h2>

                <div style={{ maxWidth: '600px' }}>
                  {/* Bot Name */}
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}>
                      اسم البوت
                    </label>
                    <input
                      type="text"
                      value={botSettings.name}
                      onChange={(e) => handleSettingChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  {/* Language */}
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}>
                      اللغة الأساسية
                    </label>
                    <select
                      value={botSettings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        fontSize: '16px'
                      }}
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  {/* Auto Reply */}
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={botSettings.autoReply}
                        onChange={(e) => handleSettingChange('autoReply', e.target.checked)}
                        style={{ marginLeft: '10px' }}
                      />
                      تفعيل الرد التلقائي
                    </label>
                    <p style={{
                      color: '#8696a0',
                      fontSize: '14px',
                      marginTop: '5px'
                    }}>
                      سيقوم البوت بالرد تلقائياً على الرسائل الواردة
                    </p>
                  </div>

                  {/* Response Time */}
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}>
                      سرعة الاستجابة
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {[
                        { value: 'fast', label: 'سريع' },
                        { value: 'medium', label: 'متوسط' },
                        { value: 'slow', label: 'بطيء' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSettingChange('responseTime', option.value)}
                          style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: '1px solid #374151',
                            backgroundColor: botSettings.responseTime === option.value ? '#10b981' : '#1f2937',
                            color: botSettings.responseTime === option.value ? '#ffffff' : '#8696a0',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <button style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'personality' && (
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '30px'
                }}>
                  شخصية البوت
                </h2>

                <div style={{ maxWidth: '600px' }}>
                  {/* Personality Type */}
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '15px'
                    }}>
                      نوع الشخصية
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '15px'
                    }}>
                      {[
                        { value: 'professional', label: 'مهني', desc: 'رسمي ومباشر' },
                        { value: 'friendly', label: 'ودود', desc: 'دافئ ومرح' },
                        { value: 'casual', label: 'عادي', desc: 'مسترخي وبسيط' },
                        { value: 'expert', label: 'خبير', desc: 'تقني ومفصل' }
                      ].map((personality) => (
                        <div
                          key={personality.value}
                          onClick={() => handleSettingChange('personality', personality.value)}
                          style={{
                            padding: '20px',
                            borderRadius: '12px',
                            border: `2px solid ${botSettings.personality === personality.value ? '#10b981' : '#374151'}`,
                            backgroundColor: botSettings.personality === personality.value ? '#10b98120' : '#1f2937',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            marginBottom: '10px'
                          }}>
                            {personality.label}
                          </h3>
                          <p style={{
                            color: '#8696a0',
                            fontSize: '14px'
                          }}>
                            {personality.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}>
                      رسالة الترحيب
                    </label>
                    <textarea
                      value={botSettings.welcomeMessage}
                      onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        fontSize: '16px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    حفظ الشخصية
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'responses' && (
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '30px'
                }}>
                  الردود التلقائية
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '20px'
                }}>
                  {[
                    {
                      title: 'رسالة الترحيب',
                      trigger: 'عند بدء محادثة جديدة',
                      response: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
                      active: true
                    },
                    {
                      title: 'الرد على الشكر',
                      trigger: 'عند قول "شكراً"',
                      response: 'العفو! سعيد لأنني استطعت مساعدتك. هل هناك شيء آخر تحتاج إليه؟',
                      active: true
                    },
                    {
                      title: 'عدم الفهم',
                      trigger: 'عند عدم فهم السؤال',
                      response: 'عذراً، لم أفهم سؤالك. هل يمكنك إعادة صياغته بشكل أوضح؟',
                      active: true
                    },
                    {
                      title: 'خارج ساعات العمل',
                      trigger: 'خارج ساعات العمل',
                      response: 'نحن حالياً خارج ساعات العمل. سنرد عليك في أقرب وقت ممكن.',
                      active: false
                    }
                  ].map((response, index) => (
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
                          {response.title}
                        </h3>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={response.active}
                            style={{ marginLeft: '5px' }}
                          />
                          <span style={{
                            fontSize: '14px',
                            color: response.active ? '#10b981' : '#8696a0'
                          }}>
                            {response.active ? 'نشط' : 'متوقف'}
                          </span>
                        </label>
                      </div>
                      <p style={{
                        color: '#8696a0',
                        fontSize: '14px',
                        marginBottom: '15px'
                      }}>
                        المحفز: {response.trigger}
                      </p>
                      <div style={{
                        backgroundColor: '#0b141a',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <p style={{
                          color: '#ffffff',
                          fontSize: '14px',
                          margin: 0
                        }}>
                          "{response.response}"
                        </p>
                      </div>
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'training' && (
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '30px'
                }}>
                  تدريب البوت
                </h2>

                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  textAlign: 'center',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '20px'
                  }}>
                    🎓
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '15px'
                  }}>
                    مركز التدريب
                  </h3>
                  <p style={{
                    color: '#8696a0',
                    fontSize: '16px',
                    marginBottom: '25px'
                  }}>
                    قم بتدريب البوت على بياناتك الخاصة لتحسين دقة الإجابات
                  </p>
                  <button style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    بدء التدريب
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {[
                    { title: 'رفع ملفات التدريب', icon: '📁', status: 'جاهز' },
                    { title: 'تدريب النموذج', icon: '🤖', status: 'قيد التشغيل' },
                    { title: 'اختبار الأداء', icon: '📊', status: 'مكتمل' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#1f2937',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #374151'
                      }}
                    >
                      <div style={{ fontSize: '36px', marginBottom: '15px' }}>
                        {item.icon}
                      </div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        marginBottom: '10px'
                      }}>
                        {item.title}
                      </h3>
                      <span style={{
                        backgroundColor: item.status === 'مكتمل' ? '#10b981' : 
                                       item.status === 'قيد التشغيل' ? '#f59e0b' : '#6b7280',
                        color: '#ffffff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'integrations' && (
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '30px'
                }}>
                  التكاملات
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px'
                }}>
                  {[
                    { name: 'واتساب بزنس', icon: '💬', connected: true, color: '#25d366' },
                    { name: 'تيليجرام', icon: '✈️', connected: false, color: '#0088cc' },
                    { name: 'فيسبوك ماسنجر', icon: '💬', connected: true, color: '#0084ff' },
                    { name: 'سلاك', icon: '📱', connected: false, color: '#4a154b' },
                    { name: 'ديسكورد', icon: '🎮', connected: false, color: '#5865f2' },
                    { name: 'إيميل', icon: '📧', connected: true, color: '#ea4335' }
                  ].map((integration, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#1f2937',
                        padding: '25px',
                        borderRadius: '12px',
                        border: '1px solid #374151',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          fontSize: '24px',
                          width: '50px',
                          height: '50px',
                          borderRadius: '10px',
                          backgroundColor: integration.color + '20',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {integration.icon}
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            margin: 0,
                            marginBottom: '5px'
                          }}>
                            {integration.name}
                          </h3>
                          <span style={{
                            backgroundColor: integration.connected ? '#10b981' : '#6b7280',
                            color: '#ffffff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {integration.connected ? 'متصل' : 'غير متصل'}
                          </span>
                        </div>
                      </div>
                      <button style={{
                        backgroundColor: integration.connected ? '#ef4444' : integration.color,
                        color: '#ffffff',
                        padding: '8px 15px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        {integration.connected ? 'قطع الاتصال' : 'ربط'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'analytics' && (
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '30px'
                }}>
                  تحليلات البوت
                </h2>

                {/* Stats Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '40px'
                }}>
                  {[
                    { title: 'إجمالي المحادثات', value: '2,847', color: '#10b981' },
                    { title: 'معدل الرضا', value: '94%', color: '#00a884' },
                    { title: 'وقت الاستجابة المتوسط', value: '1.2ث', color: '#4f97ff' },
                    { title: 'الأسئلة المحلولة', value: '89%', color: '#f59e0b' }
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

                {/* Performance Chart */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  marginBottom: '30px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '20px'
                  }}>
                    أداء البوت خلال الأسبوع
                  </h3>
                  <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8696a0',
                    fontSize: '18px'
                  }}>
                    📈 سيتم عرض الرسم البياني للأداء هنا
                  </div>
                </div>

                {/* Recent Activity */}
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
                    النشاط الأخير
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { time: 'منذ 5 دقائق', action: 'تم الرد على سؤال حول الأسعار', user: 'أحمد محمد' },
                      { time: 'منذ 15 دقيقة', action: 'تم تحويل محادثة إلى موظف', user: 'فاطمة علي' },
                      { time: 'منذ 30 دقيقة', action: 'تم حل مشكلة تقنية', user: 'محمد سعد' },
                      { time: 'منذ ساعة', action: 'تم تقديم معلومات المنتج', user: 'سارة أحمد' }
                    ].map((activity, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '15px',
                          backgroundColor: '#0b141a',
                          borderRadius: '8px'
                        }}
                      >
                        <div>
                          <p style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            margin: 0,
                            marginBottom: '5px'
                          }}>
                            {activity.action}
                          </p>
                          <p style={{
                            color: '#8696a0',
                            fontSize: '12px',
                            margin: 0
                          }}>
                            المستخدم: {activity.user}
                          </p>
                        </div>
                        <span style={{
                          color: '#8696a0',
                          fontSize: '12px'
                        }}>
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BotSettingsPage;