export default function TestStyles() {
  return (
    <div className="bg-red-500 text-white p-4 m-4">
      <h1 className="text-2xl font-bold">اختبار الأنماط</h1>
      <p className="text-slate-300">إذا رأيت هذا النص أبيض على خلفية حمراء، Tailwind يعمل</p>
      <div className="bg-blue-600 p-2 mt-2 rounded">
        <span>مربع أزرق = CSS يعمل ✅</span>
      </div>
    </div>
  )
}