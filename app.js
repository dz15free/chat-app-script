// ✅ نسخة بدون import - متوافقة مع بلوجر وبدون type="module"

// أولاً: تأكد أنك أضفت مكتبات Firebase في HTML قبل هذا السكربت:
// <script src="https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js"></script>
// <script src="https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"></script>
// <script src="https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js"></script>

// ثانياً: كود التهيئة بدون import
const firebaseConfig = {
    apiKey: "AIzaSyDhjQe7B6XPhHWpyLOa2DT4R7k9yt5-CE0",
    authDomain: "studylinkchatapp.firebaseapp.com",
    databaseURL: "https://studylinkchatapp-default-rtdb.firebaseio.com",
    projectId: "studylinkchatapp",
    storageBucket: "studylinkchatapp.firebasestorage.app",
    messagingSenderId: "824488539257",
    appId: "1:824488539257:web:00da8162fe90c30d3550a8",
    measurementId: "G-Z1G0E0B233"
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const auth = firebase.auth();
const database = firebase.database();

// ✅ اجعل كل شيء متاحاً للعالم window
window.auth = auth;
window.database = database;
window.firebase = firebase;

// 🧠 الآن انسخ كل الدوال من ملفك السابق (scs.txt)
// وألصقها هنا كما هي، بدون استخدام import
 // Enhanced notification sounds
        const notificationSound = new Audio('https://lit2talks.com/tool/uploads/686dbc50ab779_mixkit-correct-answer-tone-2870.mp3');
        const joinSound = new Audio('https://lit2talks.com/tool/uploads/686dbc50ab779_mixkit-correct-answer-tone-2870.mp3');
        
        // Configure audio
        notificationSound.volume = 0.4;
        joinSound.volume = 0.3;

        // Auth state observer
        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.currentUser = user;
                document.getElementById('authModal').classList.add('hidden');
                document.getElementById('welcomeInterface').style.display = 'block';
                
                // Apply saved dark mode preference
                const savedDarkMode = localStorage.getItem('darkMode');
                if (savedDarkMode === 'true') {
                    document.body.classList.add('dark-mode');
                }
                
                showMessage('success', `مرحباً ${user.displayName || 'بك'}! تم تسجيل الدخول بنجاح إلى المنصة الأكاديمية.`);
                
                // ENHANCED: Restore room state after page refresh
                restoreRoomState();
            } else {
                window.currentUser = null;
                document.getElementById('authModal').classList.remove('hidden');
                document.getElementById('welcomeInterface').style.display = 'none';
            }
        });

        // Make Firebase functions globally available
        window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
        window.signInWithEmailAndPassword = signInWithEmailAndPassword;
        window.sendPasswordResetEmail = sendPasswordResetEmail;
        window.updateProfile = updateProfile;
        window.signOut = signOut;
        window.ref = ref;
        window.push = push;
        window.onValue = onValue;
        window.set = set;
        window.remove = remove;
        window.serverTimestamp = serverTimestamp;
        window.get = get;
        window.off = off;
        window.notificationSound = notificationSound;
    </script>

    <script>
        // Enhanced utility functions
        function showMessage(elementId, message, type) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = message;
                element.className = `message show ${type}`;
                setTimeout(() => {
                    element.className = 'message';
                }, 6000);
            }
        }

        // Enhanced navigation function
        function goToHomePage() {
            // يمكن تخصيص هذا الرابط حسب موقعك
            window.location.href = '/';
        }

        // Enhanced form navigation functions
        function showLoginForm(event) {
            if (event) event.preventDefault();
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('forgotPasswordForm').classList.add('hidden');
        }

        function showRegisterForm(event) {
            if (event) event.preventDefault();
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
            document.getElementById('forgotPasswordForm').classList.add('hidden');
        }

        function showForgotPasswordForm(event) {
            if (event) event.preventDefault();
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('forgotPasswordForm').classList.remove('hidden');
        }

        // Enhanced authentication functions
        async function registerUser() {
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;

            if (!name || !email || !password) {
                showMessage('registerMessage', 'الرجاء تعبئة جميع الحقول المطلوبة.', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('registerMessage', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.', 'error');
                return;
            }

            try {
                const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
                await window.updateProfile(userCredential.user, { displayName: name });
                showMessage('registerMessage', 'تم إنشاء حسابك الأكاديمي بنجاح! مرحباً بك في المنصة.', 'success');
            } catch (error) {
                let errorMessage = 'حدث خطأ أثناء إنشاء الحساب.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'هذا البريد الإلكتروني مسجل بالفعل. جرب تسجيل الدخول.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'صيغة البريد الإلكتروني غير صحيحة.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'كلمة المرور ضعيفة. اختر كلمة مرور أقوى.';
                }
                showMessage('registerMessage', errorMessage, 'error');
            }
        }

        async function loginUser() {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showMessage('loginMessage', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور.', 'error');
                return;
            }

            try {
                await window.signInWithEmailAndPassword(window.auth, email, password);
                showMessage('loginMessage', 'تم تسجيل الدخول بنجاح! أهلاً بعودتك.', 'success');
            } catch (error) {
                let errorMessage = 'حدث خطأ أثناء تسجيل الدخول.';
                if (error.code === 'auth/invalid-credential') {
                    errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
                } else if (error.code === 'auth/user-not-found') {
                    errorMessage = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
                }
                showMessage('loginMessage', errorMessage, 'error');
            }
        }

        async function resetPassword() {
            const email = document.getElementById('resetEmail').value.trim();

            if (!email) {
                showMessage('resetMessage', 'الرجاء إدخال بريدك الإلكتروني المسجل.', 'error');
                return;
            }

            try {
                await window.sendPasswordResetEmail(window.auth, email);
                showMessage('resetMessage', 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.', 'success');
            } catch (error) {
                showMessage('resetMessage', 'حدث خطأ أثناء إرسال رابط الاستعادة. تأكد من صحة البريد الإلكتروني.', 'error');
            }
        }

        // ENHANCED: Room state persistence functions
        function saveRoomState(roomId, roomName, videoId = null, videoTime = 0) {
            const roomState = {
                roomId: roomId,
                roomName: roomName,
                videoId: videoId,
                videoTime: videoTime,
                timestamp: Date.now()
            };
            localStorage.setItem('currentRoomState', JSON.stringify(roomState));
        }

        function clearRoomState() {
            localStorage.removeItem('currentRoomState');
        }

        async function restoreRoomState() {
            const savedState = localStorage.getItem('currentRoomState');
            if (!savedState) return;

            try {
                const roomState = JSON.parse(savedState);
                const timeDiff = Date.now() - roomState.timestamp;
                
                // Only restore if saved within last 24 hours
                if (timeDiff > 24 * 60 * 60 * 1000) {
                    clearRoomState();
                    return;
                }

                // Check if room still exists
                const roomRef = window.ref(window.database, `rooms/${roomState.roomId}`);
                const snapshot = await window.get(roomRef);
                
                if (snapshot.exists()) {
                    // Restore room
                    window.currentRoom = roomState.roomId;
                    document.getElementById('roomId').value = roomState.roomName;
                    
                    initializeRoom(roomState.roomId);
                    document.getElementById('exitRoomBtn').classList.remove('hidden');
                    
                    // Restore video if exists
                    await syncWithExistingVideo(roomState.roomId);
                    
                    showMessage('info', `تم استعادة الاتصال بغرفة الدراسة: ${roomState.roomName}`);
                } else {
                    clearRoomState();
                    showMessage('warning', 'الغرفة المحفوظة لم تعد موجودة.');
                }
            } catch (error) {
                console.error('Error restoring room state:', error);
                clearRoomState();
            }
        }

        // Enhanced room functions with separate join and create
        async function joinRoom() {
            const roomName = document.getElementById('roomId').value.trim();
            if (!roomName) {
                showMessage('error', 'الرجاء إدخال اسم غرفة الدراسة.');
                return;
            }

            const roomId = roomName.replace(/\s+/g, '-').toLowerCase(); 
            
            // Check if room exists
            const roomRef = window.ref(window.database, `rooms/${roomId}`);
            try {
                const snapshot = await window.get(roomRef);
                if (snapshot.exists()) {
                    window.currentRoom = roomId;
                    initializeRoom(roomId);
                    showMessage('success', `تم الانضمام بنجاح إلى غرفة الدراسة: ${roomName}`);
                    document.getElementById('exitRoomBtn').classList.remove('hidden');
                    
                    // ENHANCED: Save room state
                    saveRoomState(roomId, roomName);
                    
                    // Enhanced: Check and sync with existing video immediately
                    await syncWithExistingVideo(roomId);
                } else {
                    showMessage('error', 'الغرفة غير موجودة. يرجى إنشاء غرفة جديدة أو التأكد من اسم الغرفة.');
                }
            } catch (error) {
                showMessage('error', 'حدث خطأ أثناء البحث عن الغرفة. حاول مرة أخرى.');
            }
        }

        async function createRoom() {
            const roomName = document.getElementById('roomId').value.trim();
            if (!roomName) {
                showMessage('error', 'الرجاء إدخال اسم لغرفة الدراسة الجديدة.');
                return;
            }

            const roomId = roomName.replace(/\s+/g, '-').toLowerCase(); 
            
            // Check if room already exists
            const roomRef = window.ref(window.database, `rooms/${roomId}`);
            try {
                const snapshot = await window.get(roomRef);
                if (snapshot.exists()) {
                    showMessage('warning', 'غرفة بهذا الاسم موجودة بالفعل. استخدم زر "انضمام للغرفة" أو اختر اسماً آخر.');
                    return;
                }
                
                // Create new room
                await window.set(roomRef, {
                    name: roomName,
                    createdAt: window.serverTimestamp(),
                    createdBy: window.currentUser.uid
                });
                
                window.currentRoom = roomId;
                initializeRoom(roomId);
                showMessage('success', `تم إنشاء غرفة دراسة جديدة بنجاح: ${roomName}`);
                document.getElementById('exitRoomBtn').classList.remove('hidden');
                
                // ENHANCED: Save room state
                saveRoomState(roomId, roomName);
            } catch (error) {
                showMessage('error', 'حدث خطأ أثناء إنشاء الغرفة. حاول مرة أخرى.');
            }
        }

        // Enhanced sync with existing video function
        async function syncWithExistingVideo(roomId) {
            const videoRef = window.ref(window.database, `rooms/${roomId}/currentVideo`);
            try {
                const snapshot = await window.get(videoRef);
                if (snapshot.exists()) {
                    const videoData = snapshot.val();
                    if (videoData.videoId) {
                        // Calculate current time based on when video was last updated
                        const timeDiff = (Date.now() - videoData.timestamp) / 1000;
                        let currentTime = (videoData.currentTime || 0) + (videoData.isPlaying ? timeDiff : 0);
                        
                        // Load video and sync to current time
                        loadVideoById(videoData.videoId, currentTime, videoData.isPlaying || false);
                        window.currentVideoId = videoData.videoId;
                        
                        // ENHANCED: Update saved state with video info
                        const savedState = localStorage.getItem('currentRoomState');
                        if (savedState) {
                            const roomState = JSON.parse(savedState);
                            roomState.videoId = videoData.videoId;
                            roomState.videoTime = currentTime;
                            localStorage.setItem('currentRoomState', JSON.stringify(roomState));
                        }
                        
                        showMessage('info', `تم تحميل الفيديو الموجود في الغرفة والمزامنة مع الوقت الحالي: ${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}`);
                    }
                }
            } catch (error) {
                console.error('Error syncing with existing video:', error);
            }
        }

        // Enhanced notification system
        function showMessage(type, text) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 25px;
                right: 25px;
                padding: 18px 25px;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                z-index: 10001;
                max-width: 350px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                transition: all 0.4s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;
            
            switch(type) {
                case 'success':
                    notification.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                    break;
                case 'info':
                    notification.style.background = 'linear-gradient(135deg, #3b82f6, #60a5fa)';
                    break;
                case 'warning':
                    notification.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)';
                    break;
                case 'error':
                    notification.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
                    break;
            }
            
            notification.textContent = text;
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Animate out
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 400);
            }, 4000);
        }

        // Enhanced room initialization with improved video sync
        function initializeRoom(roomId) {
            // Clean up previous listeners
            cleanupRoomListeners();
            
            // Set up room presence
            const userRef = window.ref(window.database, `rooms/${roomId}/users/${window.currentUser.uid}`);
            window.set(userRef, {
                name: window.currentUser.displayName || window.currentUser.email,
                joinedAt: window.serverTimestamp(),
                status: 'active'
            });

            // Listen for messages
            const messagesRef = window.ref(window.database, `rooms/${roomId}/messages`);
            const messagesListener = window.onValue(messagesRef, (snapshot) => {
                const messages = snapshot.val();
                displayMessages(messages);
            });
            window.videoSyncListeners.push({ ref: messagesRef, listener: messagesListener });

            // Listen for users
            const usersRef = window.ref(window.database, `rooms/${roomId}/users`);
            const usersListener = window.onValue(usersRef, (snapshot) => {
                const users = snapshot.val();
                displayUsers(users);
            });
            window.videoSyncListeners.push({ ref: usersRef, listener: usersListener });

            // Enhanced video sync listener
            const videoRef = window.ref(window.database, `rooms/${roomId}/currentVideo`);
            const videoListener = window.onValue(videoRef, (snapshot) => {
                const videoData = snapshot.val();
                if (videoData && videoData.videoId !== window.currentVideoId) {
                    // Calculate current time for new video
                    const timeDiff = (Date.now() - videoData.timestamp) / 1000;
                    let currentTime = (videoData.currentTime || 0) + (videoData.isPlaying ? timeDiff : 0);
                    
                    loadVideoById(videoData.videoId, currentTime, videoData.isPlaying || false);
                    window.currentVideoId = videoData.videoId;
                    
                    showMessage('info', 'تم تحميل فيديو جديد من قبل مستخدم آخر في الغرفة.');
                }
            });
            window.videoSyncListeners.push({ ref: videoRef, listener: videoListener });

            // Enhanced sync listener for real-time sync
            const syncRef = window.ref(window.database, `rooms/${roomId}/videoSync`);
            const syncListener = window.onValue(syncRef, (snapshot) => {
                const syncData = snapshot.val();
                if (syncData && syncData.triggeredBy !== window.currentUser.uid) {
                    handleVideoSync(syncData);
                }
            });
            window.videoSyncListeners.push({ ref: syncRef, listener: syncListener });

            // Start periodic sync check
            startSyncCheck(roomId);
        }

        // Enhanced periodic sync check
        function startSyncCheck(roomId) {
            if (window.syncCheckInterval) {
                clearInterval(window.syncCheckInterval);
            }
            
            window.syncCheckInterval = setInterval(async () => {
                if (!window.currentRoom || !window.currentVideoId || !window.youtubePlayer) return;
                
                try {
                    const videoRef = window.ref(window.database, `rooms/${roomId}/currentVideo`);
                    const snapshot = await window.get(videoRef);
                    
                    if (snapshot.exists()) {
                        const videoData = snapshot.val();
                        if (videoData.videoId === window.currentVideoId) {
                            const timeDiff = (Date.now() - videoData.timestamp) / 1000;
                            const expectedTime = (videoData.currentTime || 0) + (videoData.isPlaying ? timeDiff : 0);
                            const actualTime = window.youtubePlayer.getCurrentTime();
                            
                            // If time difference is more than 2 seconds, sync
                            if (Math.abs(expectedTime - actualTime) > 2) {
                                window.isVideoSyncing = true;
                                window.youtubePlayer.seekTo(expectedTime, true);
                                
                                if (videoData.isPlaying && window.youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING) {
                                    window.youtubePlayer.playVideo();
                                } else if (!videoData.isPlaying && window.youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                                    window.youtubePlayer.pauseVideo();
                                }
                                
                                setTimeout(() => {
                                    window.isVideoSyncing = false;
                                }, 1000);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Sync check error:', error);
                }
            }, 3000); // Check every 3 seconds
        }

        // Clean up listeners when leaving room
        function cleanupRoomListeners() {
            window.videoSyncListeners.forEach(({ ref, listener }) => {
                window.off(ref, 'value', listener);
            });
            window.videoSyncListeners = [];
            
            if (window.syncCheckInterval) {
                clearInterval(window.syncCheckInterval);
                window.syncCheckInterval = null;
            }
        }

        // Enhanced message display with notification tracking
        function displayMessages(messages) {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '<div class="message-item other"><div class="message-author">مساعد الدراسة</div><div class="message-text">مرحباً بك في بيئة الدراسة التفاعلية!</div><div class="message-time">الآن</div></div>';
            
            let messageCount = 0;
            let newMessagesCount = 0;
            
            if (messages) {
                const messageArray = Object.values(messages);
                messageCount = messageArray.length;
                
                messageArray.forEach((message, index) => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message-item ${message.userId === window.currentUser.uid ? 'own' : 'other'}`;
                    
                    const time = new Date(message.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    messageDiv.innerHTML = `
                        <div class="message-author">${message.userName}</div>
                        <div class="message-text">${message.text}</div>
                        <div class="message-time">${time}</div>
                    `;
                    
                    chatMessages.appendChild(messageDiv);
                    
                    // NEW: Count new messages from others
                    if (message.userId !== window.currentUser.uid && 
                        window.lastMessageCount > 0 && 
                        index >= window.lastMessageCount) {
                        newMessagesCount++;
                        
                        // Play notification sound
                        setTimeout(() => {
                            notificationSound.play().catch(() => {});
                        }, 100);
                    }
                });
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // NEW: Update unread message count and badge
            if (newMessagesCount > 0 && !window.isChatOpen) {
                window.unreadMessageCount += newMessagesCount;
                updateChatNotificationBadge();
            }
            
            window.lastMessageCount = messageCount;
        }

        // NEW: Update chat notification badge
        function updateChatNotificationBadge() {
            const badge = document.getElementById('chatNotificationBadge');
            if (window.unreadMessageCount > 0) {
                badge.textContent = window.unreadMessageCount > 9 ? '9+' : window.unreadMessageCount;
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        }

        // NEW: Clear unread messages when chat is opened
        function clearUnreadMessages() {
            window.unreadMessageCount = 0;
            updateChatNotificationBadge();
        }

        // Enhanced user display
        function displayUsers(users) {
            const userList = document.getElementById('userList');
            
            userList.innerHTML = '';
            let count = 0;
            
            if (users) {
                Object.values(users).forEach(user => {
                    const li = document.createElement('li');
                    li.textContent = user.name;
                    li.title = `انضم في: ${new Date(user.joinedAt).toLocaleString('ar-SA')}`;
                    userList.appendChild(li);
                    count++;
                });
                
                if (window.lastUserCount > 0 && count > window.lastUserCount) {
                    setTimeout(() => {
                        joinSound.play().catch(() => {});
                    }, 200);
                }
            }
            
            if (count === 0) {
                const li = document.createElement('li');
                li.textContent = 'في انتظار الطلاب...';
                li.style.opacity = '0.7';
                userList.appendChild(li);
            }
            
            window.lastUserCount = count;
        }

        // Enhanced message sending
        function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const text = messageInput.value.trim();
            
            if (!text || !window.currentRoom) return;
            
            if (text.length > 500) {
                showMessage('warning', 'الرسالة طويلة جداً. الحد الأقصى 500 حرف.');
                return;
            }
            
            const messagesRef = window.ref(window.database, `rooms/${window.currentRoom}/messages`);
            window.push(messagesRef, {
                text: text,
                userId: window.currentUser.uid,
                userName: window.currentUser.displayName || window.currentUser.email,
                timestamp: Date.now()
            });
            
            messageInput.value = '';
            messageInput.blur(); // إخفاء لوحة المفاتيح على الهاتف
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }

        // Enhanced video functions with improved sync
        function loadVideo() {
            const videoUrl = document.getElementById('videoUrl').value.trim();
            if (!videoUrl) {
                showMessage('warning', 'الرجاء إدخال رابط الدرس التعليمي.');
                return;
            }
            
            const videoId = extractYouTubeId(videoUrl);
            if (!videoId) {
                showMessage('error', 'رابط يوتيوب غير صحيح. تأكد من صحة الرابط.');
                return;
            }
            
            // Update room video and broadcast to all users
            if (window.currentRoom) {
                const videoRef = window.ref(window.database, `rooms/${window.currentRoom}/currentVideo`);
                window.set(videoRef, {
                    videoId: videoId,
                    currentTime: 0,
                    timestamp: Date.now(),
                    isPlaying: true,
                    loadedBy: window.currentUser.displayName || window.currentUser.email
                });
            }
            
            loadVideoById(videoId, 0, true); // Auto-play enabled
            showMessage('success', 'تم تحميل الدرس بنجاح للجميع في الغرفة.');
        }

        function extractYouTubeId(url) {
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]*)/,
                /youtube\.com\/live\/([^#&?]*)/,
                /youtube\.com\/watch\?.*v=([^#&?]*)/
            ];
            
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1].length === 11) {
                    return match[1];
                }
            }
            return null;
        }

        function loadVideoById(videoId, startTime = 0, autoplay = false) {
            const videoPlayer = document.getElementById('videoPlayer');
            const syncControls = document.getElementById('videoSyncControls');
            
            const isLiveStream = document.getElementById('videoUrl').value.includes('/live/') || 
                                document.getElementById('videoUrl').value.includes('live_stream');
            
            const autoplayParam = autoplay ? '&autoplay=1' : '&autoplay=0';
            const embedParams = isLiveStream ? 
                `enablejsapi=1&controls=1${autoplayParam}&live_stream=1&origin=` + window.location.origin : 
                `enablejsapi=1&controls=1${autoplayParam}&start=${Math.floor(startTime)}&origin=` + window.location.origin;
            
            videoPlayer.innerHTML = `
                <iframe 
                    id="youtubePlayer"
                    src="https://www.youtube.com/embed/${videoId}?${embedParams}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
            
            if (!isLiveStream) {
                // NEW: Always show sync controls when video is loaded (even without room)
                syncControls.classList.add('show');
                videoPlayer.appendChild(syncControls);
            } else {
                syncControls.classList.remove('show');
                showMessage('info', 'تم تحميل البث المباشر - المزامنة غير متاحة للبثوث المباشرة');
            }
            
            window.currentVideoId = videoId;
            window.isLiveStream = isLiveStream;

            // إعداد YouTube API للتزامن المحسن
            setupYouTubeAPI();
        }

        // Enhanced YouTube API setup with better sync
        function setupYouTubeAPI() {
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                
                window.onYouTubeIframeAPIReady = function() {
                    initializeYouTubePlayer();
                };
            } else {
                initializeYouTubePlayer();
            }
        }

        function initializeYouTubePlayer() {
            if (window.youtubePlayer) {
                window.youtubePlayer.destroy();
            }
            
            setTimeout(() => {
                window.youtubePlayer = new YT.Player('youtubePlayer', {
                    events: {
                        'onStateChange': onPlayerStateChange,
                        'onReady': onPlayerReady
                    }
                });
            }, 1000);
        }

        function onPlayerReady(event) {
            console.log('YouTube player ready');
        }

        // Enhanced state change handler with better sync
        function onPlayerStateChange(event) {
            if (!window.currentRoom || window.isLiveStream || window.isVideoSyncing) return;
            
            const currentTime = window.youtubePlayer.getCurrentTime();
            
            if (event.data === YT.PlayerState.PLAYING) {
                broadcastVideoSync('play', currentTime);
            } else if (event.data === YT.PlayerState.PAUSED) {
                broadcastVideoSync('pause', currentTime);
            }
        }

        // Enhanced video sync broadcasting
        function broadcastVideoSync(action, currentTime) {
            if (!window.currentRoom || !window.currentVideoId) return;
            
            const isPlaying = action === 'play';
            
            // Update current video state
            const videoRef = window.ref(window.database, `rooms/${window.currentRoom}/currentVideo`);
            window.set(videoRef, {
                videoId: window.currentVideoId,
                currentTime: currentTime,
                timestamp: Date.now(),
                isPlaying: isPlaying,
                lastUpdatedBy: window.currentUser.uid
            });
            
            // Broadcast sync action
            const syncRef = window.ref(window.database, `rooms/${window.currentRoom}/videoSync`);
            window.set(syncRef, {
                action: action,
                timestamp: Date.now(),
                videoId: window.currentVideoId,
                currentTime: currentTime,
                triggeredBy: window.currentUser.uid
            });
        }

        // Enhanced video sync functions - WORKS EVEN WITHOUT ROOM
        function syncPlay() {
            if (window.currentVideoId && window.youtubePlayer) {
                const currentTime = window.youtubePlayer.getCurrentTime();
                
                // If in room, broadcast to others
                if (window.currentRoom) {
                    broadcastVideoSync('play', currentTime);
                }
                
                // Always play locally
                window.youtubePlayer.playVideo();
            }
        }

        function syncPause() {
            if (window.currentVideoId && window.youtubePlayer) {
                const currentTime = window.youtubePlayer.getCurrentTime();
                
                // If in room, broadcast to others
                if (window.currentRoom) {
                    broadcastVideoSync('pause', currentTime);
                }
                
                // Always pause locally
                window.youtubePlayer.pauseVideo();
            }
        }

        // Enhanced sync handler with better timing
        function handleVideoSync(syncData) {
            if (!syncData || !window.currentVideoId || !window.youtubePlayer || 
                syncData.triggeredBy === window.currentUser.uid) return;
            
            window.isVideoSyncing = true;
            
            const timeDiff = (Date.now() - syncData.timestamp) / 1000;
            let targetTime = syncData.currentTime || 0;
            
            if (syncData.action === 'play') {
                targetTime += timeDiff; // تعديل الوقت حسب التأخير
                window.youtubePlayer.seekTo(targetTime, true);
                setTimeout(() => {
                    window.youtubePlayer.playVideo();
                    window.isVideoSyncing = false;
                }, 500);
            } else if (syncData.action === 'pause') {
                window.youtubePlayer.seekTo(targetTime, true);
                setTimeout(() => {
                    window.youtubePlayer.pauseVideo();
                    window.isVideoSyncing = false;
                }, 500);
            }
        }

        // Enhanced fullscreen functions
        function toggleFullscreen() {
            const videoContainer = document.getElementById('videoContainer');
            
            if (videoContainer.classList.contains('fullscreen')) {
                exitFullscreen();
            } else {
                enterFullscreen();
            }
        }

        function enterFullscreen() {
            const videoContainer = document.getElementById('videoContainer');
            videoContainer.classList.add('fullscreen');
            document.body.style.overflow = 'hidden';
            
            setupKeyboardHandlers();

            if (!document.querySelector('.exit-fullscreen')) {
                const exitBtn = document.createElement('button');
                exitBtn.className = 'exit-fullscreen';
                exitBtn.onclick = exitFullscreen;
                exitBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                `;
                videoContainer.appendChild(exitBtn);
            }
            
            const fullscreenBtn = document.querySelector('.control-btn[onclick="toggleFullscreen()"]');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                    خروج من وضع الدراسة المركز
                `;
            }

            // Show chat tooltip on mobile
            if (window.innerWidth <= 768) {
                showChatTooltip();
            }

            showMessage('info', 'تم تفعيل وضع الدراسة المركز. اضغط ESC للخروج.');
        }

        function exitFullscreen() {
            const videoContainer = document.getElementById('videoContainer');
            videoContainer.classList.remove('fullscreen');
            videoContainer.classList.remove('keyboard-mode');
            document.body.style.overflow = 'auto';
            
            const exitBtn = document.querySelector('.exit-fullscreen');
            if (exitBtn) {
                exitBtn.remove();
            }
            
            const fullscreenBtn = document.querySelector('.control-btn[onclick="toggleFullscreen()"]');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    وضع الدراسة المركز
                `;
            }

            // Hide chat tooltip
            hideChatTooltip();
            
            // Reset chat tooltip shown flag
            window.chatTooltipShown = false;
        }

        // Enhanced chat tooltip functions
        function showChatTooltip() {
            if (window.chatTooltipShown) return;
            
            const tooltip = document.getElementById('chatTooltip');
            tooltip.classList.add('show');
            
            setTimeout(() => {
                hideChatTooltip();
            }, 4000); // Show for 4 seconds
            
            window.chatTooltipShown = true;
        }

        function hideChatTooltip() {
            const tooltip = document.getElementById('chatTooltip');
            tooltip.classList.remove('show');
        }

        // Enhanced chat toggle for fullscreen with notification handling
        function toggleChat() {
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.classList.toggle('show');
            
            // NEW: Update chat state and clear unread messages when opened
            window.isChatOpen = chatContainer.classList.contains('show');
            
            if (window.isChatOpen) {
                clearUnreadMessages();
                hideChatTooltip();
            }
        }

        // Enhanced keyboard handling
        function setupKeyboardHandlers() {
            const messageInput = document.getElementById('messageInput');
            const videoContainer = document.getElementById('videoContainer');

            if (!messageInput || !videoContainer) return;

            messageInput.addEventListener('focus', () => {
                if (videoContainer.classList.contains('fullscreen') && window.innerWidth <= 768) {
                    videoContainer.classList.add('keyboard-mode');
                    setTimeout(() => {
                        messageInput.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    }, 300);
                }
            });

            messageInput.addEventListener('blur', () => {
                if (videoContainer.classList.contains('fullscreen')) {
                    setTimeout(() => {
                        videoContainer.classList.remove('keyboard-mode');
                    }, 300);
                }
            });
        }

        // Enhanced exit room functions
        function showExitConfirmation() {
            const modal = document.getElementById('exitConfirmModal');
            modal.classList.remove('hidden');

            document.getElementById('confirmExitBtn').onclick = function() {
                performExit();
                modal.classList.add('hidden');
            };

            document.getElementById('cancelExitBtn').onclick = function() {
                modal.classList.add('hidden');
            };
        }

        function resetRoomUI() {
            // Clean up listeners
            cleanupRoomListeners();
            
            window.currentRoom = null;
            window.currentVideoId = null;
            
            // ENHANCED: Clear saved room state
            clearRoomState();
            
            const videoPlayer = document.getElementById('videoPlayer');
            const syncControls = document.getElementById('videoSyncControls');
            videoPlayer.innerHTML = `
                <div class="video-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <div>ابدأ رحلة التعلم بوضع رابط الدرس التعليمي لمشاهدة جماعية متزامنة</div>
                </div>
            `;
            if (syncControls) syncControls.classList.remove('show');
            
            document.getElementById('chatMessages').innerHTML = '<div class="message-item other"><div class="message-author">مساعد الدراسة</div><div class="message-text">مرحباً بك في بيئة الدراسة التفاعلية!</div><div class="message-time">الآن</div></div>';
            document.getElementById('userList').innerHTML = '<li style="opacity: 0.7;">في انتظار الطلاب...</li>';
            
            document.getElementById('videoUrl').value = '';
            document.getElementById('roomId').value = '';
            
            document.getElementById('exitRoomBtn').classList.add('hidden');
            
            // NEW: Reset notification state
            window.unreadMessageCount = 0;
            window.isChatOpen = false;
            updateChatNotificationBadge();
        }

        function performExit() {
            if (window.currentRoom && window.currentUser) {
                const userRef = window.ref(window.database, `rooms/${window.currentRoom}/users/${window.currentUser.uid}`);
                window.remove(userRef).then(() => {
                    resetRoomUI();
                    showMessage('success', 'تم الخروج من غرفة الدراسة بنجاح. يمكنك الانضمام لغرفة أخرى.');
                }).catch((error) => {
                    console.error('Error leaving room:', error);
                    showMessage('error', 'حدث خطأ أثناء الخروج من الغرفة. حاول مرة أخرى.');
                });
            } else {
                resetRoomUI();
            }
        }

        function exitRoom() {
            showExitConfirmation();
        }

        // Enhanced dark mode support
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            
            const isDark = document.body.classList.contains('dark-mode');
            showMessage('info', isDark ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري');
        }

        // Initialize dark mode from localStorage
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }

        // Enhanced event listeners
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const videoContainer = document.getElementById('videoContainer');
                if (videoContainer.classList.contains('fullscreen')) {
                    toggleFullscreen();
                }
                
                const exitModal = document.getElementById('exitConfirmModal');
                if (!exitModal.classList.contains('hidden')) {
                    exitModal.classList.add('hidden');
                }
            }
        });

        // Enhanced window resize handler
        window.addEventListener('resize', () => {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100);
            }
        });

        // Initialize keyboard handlers after page load
        setTimeout(setupKeyboardHandlers, 1000);

        // Enhanced page visibility handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && window.currentRoom && window.currentUser) {
                // User switched away from tab
                const userRef = window.ref(window.database, `rooms/${window.currentRoom}/users/${window.currentUser.uid}`);
                window.set(userRef, {
                    name: window.currentUser.displayName || window.currentUser.email,
                    joinedAt: window.serverTimestamp(),
                    status: 'away'
                });
            } else if (!document.hidden && window.currentRoom && window.currentUser) {
                // User returned to tab
                const userRef = window.ref(window.database, `rooms/${window.currentRoom}/users/${window.currentUser.uid}`);
                window.set(userRef, {
                    name: window.currentUser.displayName || window.currentUser.email,
                    joinedAt: window.serverTimestamp(),
                    status: 'active'
                });
            }
        });
// 💡 بعد الانتهاء، تأكد أن جميع الدوال مثل loginUser، registerUser...
// تضاف في النهاية إلى window:

window.loginUser = loginUser;
window.registerUser = registerUser;
window.resetPassword = resetPassword;
window.joinRoom = joinRoom;
window.createRoom = createRoom;
window.sendMessage = sendMessage;
window.handleEnterKey = handleEnterKey;
window.loadVideo = loadVideo;
window.syncPlay = syncPlay;
window.syncPause = syncPause;
window.toggleFullscreen = toggleFullscreen;
window.exitRoom = exitRoom;
window.toggleDarkMode = toggleDarkMode;

// 📌 تأكد أنك تستخدم هذا السكربت في بلوجر هكذا:
// <script src="https://dz15free.github.io/chat-app-script/app.js"></script>
// بدون type="module"

