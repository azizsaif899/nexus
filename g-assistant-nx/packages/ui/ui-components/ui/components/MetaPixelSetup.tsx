import React, { useState } from 'react';

export const MetaPixelSetup: React.FC = () => {
  const [pixelId, setPixelId] = useState('');
  const [website, setWebsite] = useState('');
  const [pixelCode, setPixelCode] = useState('');
  const [utmLink, setUtmLink] = useState('');
  const [campaignName, setCampaignName] = useState('');

  const generatePixelCode = async () => {
    if (!pixelId || !website) {
      alert('يرجى إدخال Pixel ID ورابط الموقع');
      return;
    }

    try {
      const response = await fetch(`/api/meta/pixel/setup?pixelId=${pixelId}&website=${website}`);
      const data = await response.json();
      
      if (data.success) {
        setPixelCode(data.setup.pixelCode);
      }
    } catch (error) {
      console.error('Error generating pixel code:', error);
    }
  };

  const generateUTMLink = async () => {
    if (!website || !campaignName) {
      alert('يرجى إدخال رابط الموقع واسم الحملة');
      return;
    }

    try {
      const response = await fetch('/api/meta/utm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: website,
          campaign: campaignName,
          source: 'facebook'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUtmLink(data.utm_link);
      }
    } catch (error) {
      console.error('Error generating UTM link:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ إلى الحافظة!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>🔧 إعداد Meta Pixel وأدوات التتبع</h2>
      
      {/* إعداد Meta Pixel */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>📊 إعداد Meta Pixel</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Pixel ID:</label>
          <input
            type="text"
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            placeholder="123456789012345"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>رابط الموقع:</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://your-website.com"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button
          onClick={generatePixelCode}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#1877F2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px' 
          }}
        >
          🔧 إنشاء كود Pixel
        </button>
        
        {pixelCode && (
          <div style={{ marginTop: '20px' }}>
            <h4>كود Meta Pixel:</h4>
            <div style={{ 
              backgroundColor: '#f1f3f4', 
              padding: '15px', 
              borderRadius: '5px', 
              fontFamily: 'monospace',
              fontSize: '12px',
              maxHeight: '200px',
              overflow: 'auto'
            }}>
              <pre>{pixelCode}</pre>
            </div>
            <button
              onClick={() => copyToClipboard(pixelCode)}
              style={{ 
                marginTop: '10px',
                padding: '5px 15px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px' 
              }}
            >
              📋 نسخ الكود
            </button>
          </div>
        )}
      </div>

      {/* إنشاء روابط UTM */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h3>🔗 إنشاء روابط UTM للتتبع</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>اسم الحملة:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="حملة-الخدمات-التقنية"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button
          onClick={generateUTMLink}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px' 
          }}
        >
          🔗 إنشاء رابط UTM
        </button>
        
        {utmLink && (
          <div style={{ marginTop: '20px' }}>
            <h4>رابط UTM:</h4>
            <div style={{ 
              backgroundColor: '#f1f3f4', 
              padding: '15px', 
              borderRadius: '5px',
              wordBreak: 'break-all'
            }}>
              {utmLink}
            </div>
            <button
              onClick={() => copyToClipboard(utmLink)}
              style={{ 
                marginTop: '10px',
                padding: '5px 15px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px' 
              }}
            >
              📋 نسخ الرابط
            </button>
          </div>
        )}
      </div>

      {/* تعليمات الإعداد */}
      <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
        <h3>📋 تعليمات الإعداد</h3>
        <ol>
          <li><strong>إضافة Meta Pixel:</strong> انسخ كود Pixel وأضفه في &lt;head&gt; لموقعك</li>
          <li><strong>تفعيل Conversions API:</strong> اذهب إلى Events Manager في Meta Business</li>
          <li><strong>إعداد Lead Ads:</strong> أنشئ حملة Lead Ads واستخدم رابط UTM</li>
          <li><strong>تكوين Webhook:</strong> أضف رابط webhook في إعدادات التطبيق</li>
          <li><strong>اختبار التتبع:</strong> استخدم Meta Pixel Helper للتأكد من العمل</li>
        </ol>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
          <strong>🔗 Webhook URL:</strong><br />
          <code>https://your-domain.com/api/webhook/meta</code>
        </div>
      </div>
    </div>
  );
};