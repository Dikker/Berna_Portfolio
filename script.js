// script.js
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');

    // --- 1. CLIENT-SIDE ROUTER FOR UNINTERRUPTED MUSIC PLAYBACK ---
    function initPageJS() {
        initAboutMe();
        initFamilyAndCircles();
    }

    async function loadPage(url, pushHistory = true) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Page network response failed');
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newMain = doc.querySelector('main');

            if (newMain && mainContent) {
                mainContent.innerHTML = newMain.innerHTML;
                document.title = doc.title;

                // Update Active Navigation Highlight
                const currentPath = url.split('/').pop() || 'index.html';
                document.querySelectorAll('nav a').forEach(link => {
                    const hrefPath = link.getAttribute('href').split('/').pop();
                    if (hrefPath === currentPath) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                if (pushHistory) {
                    history.pushState({ url }, '', url);
                }

                // Re-bind page specific interactivity
                initPageJS();
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Routing error, falling back to traditional page load:', error);
            window.location.href = url;
        }
    }

    // Global Link Click Interceptor
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.origin === window.location.origin) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                e.preventDefault();
                loadPage(href);
            }
        }
    });

    // Browser Back and Forward Button Support
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.url) {
            loadPage(e.state.url, false);
        } else {
            loadPage(window.location.pathname, false);
        }
    });

    // --- 2. ABOUT ME PAGE SIDE PANEL TOGGLES ---
    function initAboutMe() {
        const clickCards = document.querySelectorAll('.click-card');
        const sidePanels = document.querySelectorAll('.side-panel');

        if (clickCards.length > 0 && sidePanels.length > 0) {
            clickCards.forEach(card => {
                card.addEventListener('click', () => {
                    const targetPanelId = card.getAttribute('data-panel') + 'Panel';
                    
                    sidePanels.forEach(panel => {
                        if (panel.id === targetPanelId) {
                            panel.classList.toggle('active');
                        } else {
                            panel.classList.remove('active');
                        }
                    });
                });
            });

            document.querySelectorAll('.side-panel .close-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.closest('.side-panel').classList.remove('active');
                });
            });
        }
    }

    // --- 3. FAMILY & CIRCLES BULLETIN & GALLERY DATA ---
    function initFamilyAndCircles() {
        const bulletinBoard = document.getElementById('bulletinBoard');
        const galleryContainer = document.getElementById('galleryContainer');
        const backToFoldersBtn = document.getElementById('backToFoldersBtn');
        const galleryTitle = document.getElementById('galleryTitle');
        const polaroidList = document.getElementById('polaroidList');
        const openDescBtn = document.getElementById('openDescBtn');
        
        const closeDescBtn = document.getElementById('closeDescBtn');
        const imageModalBackdrop = document.getElementById('imageModalBackdrop');

        const folderData = {
            family: {
                title: "My Family",
                description: "This is my mom, and my brother. The people who watched me grow up, taught me discipline, whom the people I love so much, and the people who will always be there for me no matter what.",
                photos: [
                    { src: "assets/family3.png", caption: "My Recognition as Deportment" }
                ]
            },
            scallywag: {
                title: "Scallywag (SLCV Dance Company)",
                description: "I'm so glad that I met these peeps, especially my ate's and kuya's, but we all had to walk on our own paths. However, we were still able to cross our paths and hangout again whenever we had time. I love these people so much, I love performing and practicing with them, and I will forever cherish our memories together.",
                photos: [
                    { src: "assets/scallywag1.png", caption: "Scally 25-26" },
                    { src: "assets/scallywag2.png", caption: "Our Photoshoot for the concert" },
                    { src: "assets/scallywag3.png", caption: "Our last dance" }
                ]
            },
            choir: {
                title: "Church Choir",
                description: "Serving the Lord through music and singing in our church choir brings so much peace and joy to my heart. I am glad that I met these people and I always enjoy singing in church with them, having breakfast together every after mass.",
                photos: [
                    { src: "assets/choir1.png", caption: "Sunday Choir" },
                    { src: "assets/choir2.png", caption: "Rhoanne my alto buddy" },
                    { src: "assets/choir3.png", caption: "Our serve in Maysan" }
                ]
            },
            friends: {
                title: "My Friends & Classmates",
                description: "I am also grateful that I met Shamila, the girl I met in 7th grade and became closed with in 2 years, I'm very lucky to have her by my side, and my ride or die. I'm also grateful that I met my friends as well, who never fail to support me, who never bring me down, and never fail to make me laugh and brighten my day.",
                photos: [
                    { src: "assets/friends1.png", caption: "My femboy" },
                    { src: "assets/friends2.png", caption: "Photobooth" },
                    { src: "assets/friends3.png", caption: "My Birthday" },
                    { src: "assets/friends4.png", caption: "Shami" }
                ]
            },
            taekwondo: {
                title: "Taekwondo Team",
                description: "I'm so glad to have the same sports with these peeps, I enjoy training with them, having a competition with them, and the peeps who always support me everytime I compete and step on the mats.",
                photos: [
                    { src: "assets/tkd1.png", caption: "Training Day" },
                    { src: "assets/tkd2.png", caption: "Competition Day with idol Pauline Lopez" },
                    { src: "assets/tkd3.png", caption: "Us after getting beaten" }
                ]
            }
        };

        let activeFolderKey = null;

        if (bulletinBoard && galleryContainer) {
            document.querySelectorAll('.folder-card').forEach(folderCard => {
                folderCard.addEventListener('click', () => {
                    const folderKey = folderCard.getAttribute('data-folder');
                    const data = folderData[folderKey];

                    if (!data) return;
                    activeFolderKey = folderKey;

                    galleryTitle.innerText = data.title;
                    polaroidList.innerHTML = '';

                    data.photos.forEach(photo => {
                        const item = document.createElement('div');
                        item.className = 'polaroid-item';
                        item.innerHTML = `
                            <img src="${photo.src}" alt="${photo.caption}">
                            <p>${photo.caption}</p>
                        `;
                        
                        item.querySelector('img').addEventListener('click', () => {
                            const currentZoomedImg = document.getElementById('zoomedImage');
                            const currentImgModal = document.getElementById('imageModal');
                            if (currentZoomedImg && currentImgModal) {
                                currentZoomedImg.src = photo.src;
                                currentImgModal.classList.add('active');
                            }
                        });

                        polaroidList.appendChild(item);
                    });

                    bulletinBoard.style.display = 'none';
                    galleryContainer.style.display = 'block';
                });
            });

            if (backToFoldersBtn) {
                backToFoldersBtn.addEventListener('click', () => {
                    galleryContainer.style.display = 'none';
                    bulletinBoard.style.display = 'block';
                    activeFolderKey = null;
                });
            }

            if (openDescBtn) {
                openDescBtn.addEventListener('click', () => {
                    if (!activeFolderKey || !folderData[activeFolderKey]) return;
                    const data = folderData[activeFolderKey];
                    const currentDescModal = document.getElementById('descModal');
                    const currentDescTitle = document.getElementById('descTitle');
                    const currentDescText = document.getElementById('descText');
                    
                    if (currentDescTitle && currentDescText && currentDescModal) {
                        currentDescTitle.innerText = data.title;
                        currentDescText.innerText = data.description;
                        currentDescModal.classList.add('active');
                    }
                });
            }

            if (closeDescBtn) {
                closeDescBtn.addEventListener('click', () => {
                    const currentDescModal = document.getElementById('descModal');
                    if (currentDescModal) currentDescModal.classList.remove('active');
                });
            }

            if (imageModalBackdrop) {
                imageModalBackdrop.addEventListener('click', () => {
                    const currentImgModal = document.getElementById('imageModal');
                    if (currentImgModal) currentImgModal.classList.remove('active');
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const currentDescModal = document.getElementById('descModal');
                    const currentImgModal = document.getElementById('imageModal');
                    if (currentDescModal) currentDescModal.classList.remove('active');
                    if (currentImgModal) currentImgModal.classList.remove('active');
                }
            });
        }
    }

    // Initial page load scripts execution
    initPageJS();
});