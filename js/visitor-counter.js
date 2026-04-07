// ========== عداد زوار حقيقي باستخدام IndexedDB ==========
async function recordVisitor() {
    // الحصول على IP تقريبي (في التطوير نستخدم معرف مؤقت)
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitorId', visitorId);
    }
    
    try {
        await addVisitor(visitorId);
        const todayCount = await getUniqueVisitorsCount();
        const counterSpan = document.getElementById('visitorCount');
        if (counterSpan) {
            counterSpan.textContent = todayCount;
        }
    } catch(error) {
        console.error('خطأ في تسجيل الزائر:', error);
    }
}

async function updateVisitorDisplay() {
    try {
        const todayCount = await getUniqueVisitorsCount();
        const counterSpan = document.getElementById('visitorCount');
        if (counterSpan) {
            counterSpan.textContent = todayCount;
        }
    } catch(error) {
        console.error('خطأ:', error);
    }
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    recordVisitor();
});