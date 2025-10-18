import React from 'react';

interface ConnectionLineProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceHandle?: 'input' | 'output' | 'top' | 'bottom';
  targetHandle?: 'input' | 'output' | 'top' | 'bottom';
  isAnimated?: boolean;
  isDashed?: boolean;
}

export function ConnectionLine({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceHandle = 'output',
  targetHandle = 'input',
  isAnimated = false,
  isDashed = false,
}: ConnectionLineProps) {
  
  // التحقق من صحة الإحداثيات
  if (!isFinite(sourceX) || !isFinite(sourceY) || !isFinite(targetX) || !isFinite(targetY)) {
    console.warn('⚠️ ConnectionLine: Invalid coordinates', { sourceX, sourceY, targetX, targetY });
    return null;
  }
  
  // حساب الاتجاه والمسافة
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Debug log
  if (distance > 0) {
    console.log('✅ Drawing connection:', {
      from: { x: sourceX, y: sourceY },
      to: { x: targetX, y: targetY },
      distance: Math.round(distance),
      sourceHandle,
      targetHandle
    });
  }
  
  /* 
   * ✨ نظام الخطوط المحسّن - 20 بكسل مستقيم فقط كما طلبت:
   * - يخرج الخط من العقدة بشكل مستقيم تماماً (20px فقط)
   * - ينحني بلطف في المنتصف (Bezier curve)
   * - يدخل العقدة المستهدفة بشكل مستقيم تماماً (20px فقط)
   */
  const straightLength = 20; // ثابت - 20 بكسل فقط كما طلبت
  
  // حساب نقاط التحكم Bezier - خطوط مستقيمة ثم انحناء لطيف
  let cp1x: number, cp1y: number, cp2x: number, cp2y: number;
  
  // تحديد الاتجاه بناءً على الـ handles
  if (sourceHandle === 'output' || sourceHandle === 'input') {
    // اتصال أفقي - يخرج بشكل مستقيم أفقياً
    if (sourceHandle === 'output') {
      // يخرج يميناً بشكل مستقيم تماماً
      cp1x = sourceX + straightLength;
      cp1y = sourceY; // نفس Y للحفاظ على الاستقامة
      
      // نقطة التحكم الثانية - تدخل مستقيمة للهدف
      if (targetHandle === 'input' || targetHandle === 'left') {
        // الهدف من اليسار - يدخل مستقيماً أفقياً
        cp2x = targetX - straightLength;
        cp2y = targetY; // نفس Y للحفاظ على الاستقامة
      } else if (targetHandle === 'top') {
        // الهدف من الأعلى - يدخل مستقيماً عمودياً
        cp2x = targetX; // نفس X للحفاظ على الاس��قامة
        cp2y = targetY - straightLength;
      } else if (targetHandle === 'bottom') {
        // الهدف من الأسفل - يدخل مستقيماً عمودياً
        cp2x = targetX; // نفس X للحفاظ على الاستقامة
        cp2y = targetY + straightLength;
      } else {
        // افتراضي - دخول أفقي
        cp2x = targetX - straightLength * 0.6;
        cp2y = targetY;
      }
    } else {
      // يخرج يساراً بشكل مستقيم تماماً
      cp1x = sourceX - straightLength;
      cp1y = sourceY; // نفس Y للحفاظ على الاستقامة
      
      if (targetHandle === 'output' || targetHandle === 'right') {
        // يدخل مستقيماً من اليمين
        cp2x = targetX + straightLength;
        cp2y = targetY; // نفس Y للحفاظ على الاستقامة
      } else if (targetHandle === 'top') {
        // يدخل مستقيماً من الأعلى
        cp2x = targetX; // نفس X للحفاظ على الاستقامة
        cp2y = targetY - straightLength;
      } else if (targetHandle === 'bottom') {
        // يدخل مستقيماً من الأسفل
        cp2x = targetX; // نفس X للحفاظ على الاستقامة
        cp2y = targetY + straightLength;
      } else {
        cp2x = targetX + straightLength * 0.6;
        cp2y = targetY;
      }
    }
  } else {
    // اتصال عمودي - يخرج بشكل مستقيم عمودياً
    if (sourceHandle === 'bottom') {
      // يخرج أسفل بشكل مستقيم تماماً
      cp1x = sourceX; // نفس X للحفاظ على الاستقامة
      cp1y = sourceY + straightLength;
      
      if (targetHandle === 'top') {
        // يدخل مستقيماً من الأعلى
        cp2x = targetX; // نفس X للحفاظ على الاستقامة
        cp2y = targetY - straightLength;
      } else if (targetHandle === 'input' || targetHandle === 'left') {
        // يدخل مستقيماً من اليسار
        cp2x = targetX - straightLength;
        cp2y = targetY; // نفس Y للحفاظ على الاستقامة
      } else if (targetHandle === 'output' || targetHandle === 'right') {
        // يدخل مستقيماً من اليمين
        cp2x = targetX + straightLength;
        cp2y = targetY; // نفس Y للحفاظ على الاستقامة
      } else {
        cp2x = targetX;
        cp2y = targetY - straightLength * 0.6;
      }
    } else {
      // يخرج أعلى بشكل مستقيم تماماً
      cp1x = sourceX; // نفس X للحفاظ على الاستقامة
      cp1y = sourceY - straightLength;
      
      if (targetHandle === 'bottom') {
        // يدخل مستقيماً من الأسفل
        cp2x = targetX; // نفس X للحفاظ على الاستقامة
        cp2y = targetY + straightLength;
      } else if (targetHandle === 'input' || targetHandle === 'left') {
        // يدخل مستقيماً من اليسار
        cp2x = targetX - straightLength;
        cp2y = targetY; // نفس Y للحفاظ على الاستقامة
      } else if (targetHandle === 'output' || targetHandle === 'right') {
        // يدخل مستقيماً من اليمين
        cp2x = targetX + straightLength;
        cp2y = targetY; // نفس Y للحفاظ على الاستقامة
      } else {
        cp2x = targetX;
        cp2y = targetY + straightLength * 0.6;
      }
    }
  }
  
  // بناء مسار Cubic Bezier - يبدأ مستقيماً، ينحني بلطف، ينتهي مستقيماً
  const path = `M ${sourceX},${sourceY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${targetX},${targetY}`;
  
  // حساب زاوية السهم بدقة
  const arrowAngle = Math.atan2(targetY - cp2y, targetX - cp2x) * (180 / Math.PI);
  
  return (
    <g className="connection-line">
      {/* خط التوهج - يمثل تدفق البيانات */}
      {!isDashed && (
        <path
          d={path}
          stroke="var(--primary)"
          strokeWidth="10"
          fill="none"
          opacity={isAnimated ? 0.4 : 0.2}
          filter="url(#connection-glow)"
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* الخط الرئيسي - خط نقل البيانات - أكثر وضوحاً */}
      <path
        d={path}
        stroke="var(--primary)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isDashed ? "8 4" : "0"}
        opacity={isDashed ? 0.8 : 0.95}
        style={{ pointerEvents: 'none' }}
      >
        {isDashed && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-12"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </path>
      
      {/* السهم - يوضح اتجاه تدفق البيانات - أكبر حجماً */}
      {!isDashed && (
        <path
          d={`M ${targetX},${targetY} l -14,-8 l 14,8 l -14,8 Z`}
          fill="var(--primary)"
          transform={`rotate(${arrowAngle} ${targetX} ${targetY})`}
          opacity="0.95"
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* نقطة متحركة - تمثل تدفق البيانات النشط */}
      {isAnimated && !isDashed && (
        <>
          {/* النقطة الرئيسية */}
          <circle
            r="5"
            fill="var(--primary)"
            filter="url(#connection-glow)"
            style={{ pointerEvents: 'none' }}
          >
            <animateMotion 
              dur="2.5s" 
              repeatCount="indefinite" 
              path={path}
            />
          </circle>
          
          {/* نقطة ثانية متأخرة - لإظهار التدفق المستمر */}
          <circle
            r="4"
            fill="var(--primary)"
            opacity="0.7"
            style={{ pointerEvents: 'none' }}
          >
            <animateMotion 
              dur="2.5s" 
              repeatCount="indefinite" 
              path={path}
              begin="0.6s"
            />
          </circle>
        </>
      )}
      
      {/* مؤشر أثناء الرسم */}
      {isDashed && (
        <circle
          cx={targetX}
          cy={targetY}
          r="6"
          fill="var(--primary)"
          opacity="0.8"
          style={{ pointerEvents: 'none' }}
        >
          <animate
            attributeName="r"
            values="4;8;4"
            dur="1.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}