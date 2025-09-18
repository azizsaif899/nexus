import './flow-theme.css';

export default function FlowPage() {
  return (
    <div className="flow-container">
      {/* الترحيب */}
      <div className="flow-header">
        <h1 className="flow-title">FlowCanvasAI</h1>
        <p className="flow-subtitle">
          منصة احترافية لبناء تدفقات العمل التلقائية مع الذكاء الاصطناعي
        </p>
      </div>

      {/* شبكة المكونات */}
      <div className="flow-grid">
        
        {/* مولد قواعد منع التضارب */}
        <div className="flow-card flow-fade-in">
          <div className="flow-card-header">
            <svg className="flow-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="flow-card-title">قواعد منع التضارب</h2>
          </div>
          <p className="flow-card-description">
            توليد قواعد ESLint ومسارات TypeScript وبادئات متغيرات البيئة لضمان العزل
          </p>
          
          <form className="flow-form">
            <div className="flow-form-row">
              <div className="flow-form-group">
                <label className="flow-label">اسم المشروع</label>
                <input className="flow-input" placeholder="مثال: my-feature" />
              </div>
              <div className="flow-form-group">
                <label className="flow-label">نوع المشروع</label>
                <input className="flow-input" placeholder="مثال: application" />
              </div>
            </div>
            <div className="flow-form-group">
              <label className="flow-label">نطاق المشروع</label>
              <input className="flow-input" placeholder="مثال: scope:my-feature" />
            </div>
            <button className="flow-button" type="submit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              توليد القواعد
            </button>
          </form>
        </div>

        {/* جدار حماية التبعيات */}
        <div className="flow-card flow-fade-in">
          <div className="flow-card-header">
            <svg className="flow-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            <h2 className="flow-card-title">جدار حماية التبعيات</h2>
          </div>
          <p className="flow-card-description">
            تحليل package.json للحصول على تبعيات أكثر صرامة واكتشاف المكتبات المشتركة الضمنية
          </p>
          
          <form className="flow-form">
            <div className="flow-form-group">
              <label className="flow-label">محتوى package.json</label>
              <textarea 
                className="flow-textarea" 
                placeholder='{ "name": "my-app", "dependencies": { ... } }'
              ></textarea>
            </div>
            <button className="flow-button" type="submit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              تحليل التبعيات
            </button>
          </form>
        </div>

        {/* منفذ الأوامر المعزول */}
        <div className="flow-card flow-fade-in">
          <div className="flow-card-header">
            <svg className="flow-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="flow-card-title">منفذ الأوامر المعزول</h2>
          </div>
          <p className="flow-card-description">
            تشغيل أوامر البناء والتشغيل والاختبار والفحص لمشروع واحد بشكل معزول
          </p>
          
          <div className="flow-form">
            <div className="flow-form-group">
              <label className="flow-label">اسم المشروع</label>
              <input className="flow-input" placeholder="مثال: your-awesome-app" />
            </div>
            <div className="flow-button-grid">
              <button className="flow-button-outline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M5 12h14l-1 7H6l-1-7z" />
                </svg>
                تشغيل
              </button>
              <button className="flow-button-outline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                بناء
              </button>
              <button className="flow-button-outline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                اختبار
              </button>
              <button className="flow-button-outline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                فحص
              </button>
            </div>
          </div>
        </div>

        {/* الرسم البياني للتبعيات */}
        <div className="flow-card flow-fade-in">
          <div className="flow-card-header">
            <svg className="flow-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h2 className="flow-card-title">الرسم البياني للتبعيات</h2>
          </div>
          <p className="flow-card-description">
            الصق مخرجات JSON من nx graph لتصور تبعيات المشروع والتضارب المحتمل
          </p>
          
          <div className="flow-form">
            <div className="flow-form-group">
              <label className="flow-label">Graph JSON من nx graph --file=output.json</label>
              <textarea 
                className="flow-textarea" 
                placeholder="الصق JSON هنا..."
              ></textarea>
            </div>
            <button className="flow-button" type="submit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              تحليل الرسم البياني
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}