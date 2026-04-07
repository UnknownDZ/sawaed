// استبدال دالة حفظ الإعلان في post-job.js
async function saveJobToDB(jobData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('يرجى تسجيل الدخول أولاً');
        window.location.href = 'login.html';
        return false;
    }
    
    const fullJobData = {
        ...jobData,
        email: currentUser.email,
        userName: currentUser.name,
        createdAt: new Date().toISOString()
    };
    
    try {
        const jobId = await saveJob(fullJobData);
        alert('✅ تم نشر الإعلان بنجاح!');
        window.location.href = 'job-details.html?id=' + jobId;
        return true;
    } catch(error) {
        alert('❌ خطأ في حفظ الإعلان: ' + error);
        return false;
    }
}

// تعديل حدث submit النموذج
if (jobForm) {
    jobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('يرجى تسجيل الدخول أولاً');
            window.location.href = 'login.html';
            return;
        }
        
        const jobData = {
            title: document.getElementById('jobTitle').value,
            description: document.getElementById('jobDesc').value,
            price: document.getElementById('jobPrice').value,
            location: document.getElementById('jobLocation').value,
            images: selectedImages.map(img => img.data),
            audio: recordedBlob ? URL.createObjectURL(recordedBlob) : null
        };
        
        await saveJobToDB(jobData);
    });
}