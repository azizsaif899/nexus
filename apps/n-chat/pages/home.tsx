import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>الصفحة الرئيسية - نكسوس AI</title>
        <meta name="description" content="الصفحة الرئيسية لمنصة نكسوس AI للذكاء الاصطناعي" />
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
              color: '#00a884',
              margin: 0
            }}>
              نكسوس AI - الصفحة الرئيسية
            </h1>
            <Link href="/chat" style={{
              backgroundColor: '#00a884',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s ease'
            }}>
              العودة للمحادثة
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {/* Welcome Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '20px'
            }}>
              مرحباً بك في نكسوس AI
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#8696a0',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              منصة الذكاء الاصطناعي المتطورة لإدارة المحادثات والأتمتة والحملات التسويقية
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {/* Chat Feature */}
            <div style={{
              backgroundColor: '#1f2937',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #374151',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{
                backgroundColor: '#00a884',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '15px'
              }}>
                المحادثة الذكية
              </h3>
              <p style={{
                color: '#8696a0',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                تجربة محادثة متطورة مع الذكاء الاصطناعي لحل مشاكلك وتقديم المساعدة
              </p>
              <Link href="/chat" style={{
                color: '#00a884',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                ابدأ المحادثة ←
              </Link>
            </div>

            {/* Automation Feature */}
            <div style={{
              backgroundColor: '#1f2937',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #374151'
            }}>
              <div style={{
                backgroundColor: '#4f97ff',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '15px'
              }}>
                الأتمتة الذكية
              </h3>
              <p style={{
                color: '#8696a0',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                أتمتة مهامك وعملياتك التجارية بذكاء لتوفير الوقت والجهد
              </p>
              <Link href="/automation" style={{
                color: '#4f97ff',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                استكشف الأتمتة ←
              </Link>
            </div>

            {/* Bot Feature */}
            <div style={{
              backgroundColor: '#1f2937',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #374151'
            }}>
              <div style={{
                backgroundColor: '#10b981',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '15px'
              }}>
                البوت الذكي
              </h3>
              <p style={{
                color: '#8696a0',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                إعدادات وتخصيص البوت الذكي ليناسب احتياجاتك ومتطلبات عملك
              </p>
              <Link href="/bot-settings" style={{
                color: '#10b981',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                إعدادات البوت ←
              </Link>
            </div>

            {/* WhatsApp Campaigns Feature */}
            <div style={{
              backgroundColor: '#1f2937',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #374151'
            }}>
              <div style={{
                backgroundColor: '#25d366',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '15px'
              }}>
                حملات واتساب
              </h3>
              <p style={{
                color: '#8696a0',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                إدارة وتنظيم حملاتك التسويقية عبر واتساب بطريقة ذكية وفعالة
              </p>
              <Link href="/whatsapp-campaigns" style={{
                color: '#25d366',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                إدارة الحملات ←
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            backgroundColor: '#1f2937',
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid #374151',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '30px'
            }}>
              إحصائيات سريعة
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#00a884',
                  marginBottom: '10px'
                }}>
                  100+
                </div>
                <div style={{
                  color: '#8696a0',
                  fontSize: '16px'
                }}>
                  محادثة نشطة
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#4f97ff',
                  marginBottom: '10px'
                }}>
                  50+
                </div>
                <div style={{
                  color: '#8696a0',
                  fontSize: '16px'
                }}>
                  عملية أتمتة
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#25d366',
                  marginBottom: '10px'
                }}>
                  25+
                </div>
                <div style={{
                  color: '#8696a0',
                  fontSize: '16px'
                }}>
                  حملة واتساب
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid #1f2937',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#111827'
        }}>
          <p style={{
            color: '#8696a0',
            margin: 0
          }}>
            © 2025 نكسوس AI. جميع الحقوق محفوظة.
          </p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;