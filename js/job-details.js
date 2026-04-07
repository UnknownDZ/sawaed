// عرض تفاصيل الإعلان
function getJobIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function displayJobDetails() {
    const jobId = getJobIdFromURL();
    if (!jobId) {
        document.getElementById('jobDetails').innerHTML = '<div style="text-align:center;padding:50px;">❌ لم يتم تحديد الإعلان</div>';
        return;
    }

    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs.find(j => j.id == jobId);

    if (!job) {
        document.getElementById('jobDetails').innerHTML = '<div style="text-align:center;padding:50px;">❌ الإعلان غير موجود</div>';
        return;
    }

    // عرض الصور
    let imagesHtml = '';
    if (job.images && job.images.length > 0) {
        imagesHtml = '<div class="images-gallery">';
        job.images.forEach(img => {
            imagesHtml += `<img src="${img}" class="job-image" alt="صورة الإعلان">`;
        });
        imagesHtml += '</div>';
    }

    // عرض الصوت
    let audioHtml = '';
    if (job.audio) {
        audioHtml = `
            <div style="margin: 20px 0;">
                <h3>🎙️ التسجيل الصوتي</h3>
                <audio controls src="${job.audio}" style="width:100%;"></audio>
            </div>
        `;
    }

    const html = `
        <h2 style="color:#ff6b35; margin-bottom:20px;">${job.title}</h2>
        <div style="display:flex; gap:15px; flex-wrap:wrap; margin-bottom:20px;">
            <span class="badge">💰 ${job.price} دولار</span>
            <span class="badge">📍 ${job.location}</span>
            <span class="badge">👤 ${job.userId}</span>
            <span class="badge">📅 ${new Date(job.createdAt).toLocaleDateString('ar')}</span>
        </div>
        <div style="margin: 20px 0;">
            <h3>📝 الوصف</h3>
            <p style="line-height:1.8;">${job.description}</p>
        </div>
        ${imagesHtml}
        ${audioHtml}
        <div style="margin-top: 30px; text-align: center;">
            <a href="index.html" class="btn-secondary">← العودة للرئيسية</a>
            <button onclick="contactOwner()" class="btn-primary">📞 تواصل مع الناشر</button>
        </div>
    `;

    document.getElementById('jobDetails').innerHTML = html;
}

function contactOwner() {
    alert('سيتم إضافة نظام المراسلة قريباً');
}

displayJobDetails();