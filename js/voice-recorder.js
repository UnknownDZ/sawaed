// التسجيل الصوتي باستخدام MediaRecorder API
let mediaRecorder;
let audioChunks = [];
let recordedBlob = null;
let isRecording = false;

const startBtn = document.getElementById('startRecordBtn');
const stopBtn = document.getElementById('stopRecordBtn');
const playBtn = document.getElementById('playRecordBtn');
const audioPlayback = document.getElementById('audioPlayback');
const recordingStatus = document.getElementById('recordingStatus');

// طلب الإذن واستداء التسجيل
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            recordedBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(recordedBlob);
            audioPlayback.src = audioUrl;
            audioPlayback.style.display = 'block';
            playBtn.disabled = false;
            recordingStatus.textContent = '✅ تم التسجيل بنجاح';
            
            // إيقاف المسارات
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        isRecording = true;
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        playBtn.disabled = true;
        recordingStatus.textContent = '🔴 جاري التسجيل...';
        
    } catch (err) {
        console.error('خطأ في التسجيل:', err);
        recordingStatus.textContent = '❌ لا يمكن الوصول إلى الميكروفون. تأكد من الإذن.';
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

function playRecording() {
    if (recordedBlob) {
        audioPlayback.play();
    }
}

// ربط الأزرار
if (startBtn) startBtn.onclick = startRecording;
if (stopBtn) stopBtn.onclick = stopRecording;
if (playBtn) playBtn.onclick = playRecording;