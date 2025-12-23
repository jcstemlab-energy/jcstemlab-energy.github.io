// 幻灯片功能
let slideIndex = 1;
let slideInterval;

function showSlides(n) {
    const slides = document.getElementsByClassName("hero-slide");
    const dots = document.getElementsByClassName("hero-dot");

    if (!slides.length || !dots.length) return;

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }

    // Deactivate all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    // Show current slide
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].classList.add("active");
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function autoSlide() {
    plusSlides(1);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 6000);
}

// 初始化幻灯片
function initSlideshow() {
    showSlides(slideIndex);
    resetAutoSlide();

    // 添加鼠标悬停事件
    const container = document.getElementById("hero");
    if (container) {
        container.addEventListener("mouseenter", function () {
            clearInterval(slideInterval);
        });

        container.addEventListener("mouseleave", function () {
            resetAutoSlide();
        });
    }

    // 添加视频点击事件
    const clickableVideos = document.querySelectorAll('.clickable-video');
    clickableVideos.forEach(video => {
        video.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 跳转到视频播放页面
            window.location.href = 'pages/video-player.html';
        });

        // 添加鼠标悬停效果
        video.addEventListener('mouseenter', function () {
            this.style.cursor = 'pointer';
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        video.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    if (container) {
        container.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        container.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // 向左滑动 - 下一张
            plusSlides(1);
        } else if (touchEndX > touchStartX) {
            // 向右滑动 - 上一张
            plusSlides(-1);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize slideshow
    initSlideshow();

    // Navigation Scroll Effect
    const mainNav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Load profile info
    loadProfileInfo();

    // Load publications
    loadPublications();

    // Load news items
    if (document.getElementById('news-container')) {
        fetch('data/news.json')
            .then(response => response.json())
            .then(data => {
                renderNewsItems(data, 'news-container', 8); // Show the most recent 8 news items
            })
            .catch(error => console.error('Error loading news:', error));
    }

    // All news page specific
    if (document.getElementById('all-news-container')) {
        fetch('../data/news.json')
            .then(response => response.json())
            .then(data => {
                renderNewsItems(data, 'all-news-container', Infinity); // Show ALL news items, no limit
            })
            .catch(error => console.error('Error loading all news:', error));
    }

    // Navigation active link handling
    const navLinksList = document.querySelectorAll('.nav-links a');
    const pageSections = document.querySelectorAll('section[id]');

    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '') {
        window.addEventListener('scroll', () => {
            let current = '';
            pageSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinksList.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.section, .research-card, .news-item');
    revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Update Copyright Year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Function to load profile information
function loadProfileInfo() {
    let profileJsonPath = 'data/profile-info.json';
    let isSubpage = window.location.pathname.includes('/pages/');
    if (isSubpage) {
        profileJsonPath = '../data/profile-info.json';
    }

    // Get profile-info container
    const profileInfoContainer = document.querySelector('.profile-info');
    if (!profileInfoContainer) return;

    fetch(profileJsonPath)
        .then(response => response.json())
        .then(data => {
            // Clear existing content
            profileInfoContainer.innerHTML = '';

            // Add name
            const nameElement = document.createElement('h1');
            nameElement.textContent = data.name;
            profileInfoContainer.appendChild(nameElement);

            // Add subtitle
            const subtitleElement = document.createElement('p');
            subtitleElement.className = 'subtitle';
            subtitleElement.innerHTML = processChinese(data.subtitle);
            profileInfoContainer.appendChild(subtitleElement);

            // Add social links container
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';

            // Add each social link
            data.socialLinks.forEach(link => {
                const linkContainer = document.createElement('p');
                const anchor = document.createElement('a');
                // Adjust URL paths for subpages
                if (isSubpage && link.url.startsWith('assets/')) {
                    anchor.href = '../' + link.url;
                } else {
                    anchor.href = link.url;
                }

                if (link.target) {
                    anchor.target = link.target;
                }

                // Fix SVG icon paths for subpages
                let iconHtml = link.icon;
                if (isSubpage && link.type === 'dblp') {
                    iconHtml = iconHtml.replace('src="assets/', 'src="../assets/');
                }

                anchor.innerHTML = iconHtml;

                // Add text content if available (e.g., for office)
                if (link.text) {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = ' ' + link.text;
                    anchor.appendChild(textSpan);
                } else if (link.type === 'office' && data.office) {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = ' ' + data.office;
                    anchor.appendChild(textSpan);
                }
                // Note: phone number is not displayed, only icon

                linkContainer.appendChild(anchor);
                contactInfo.appendChild(linkContainer);
            });

            profileInfoContainer.appendChild(contactInfo);

            // Update profile image if there's a profile-image container
            const profileImageContainer = document.querySelector('.profile-image img');
            if (profileImageContainer && data.profileImage) {
                profileImageContainer.src = isSubpage ?
                    '../' + data.profileImage : data.profileImage;
                profileImageContainer.alt = data.name;
            }
        })
        .catch(error => {
            console.error('Error loading profile information:', error);
        });
}

// Helper: Wrap Chinese characters in a span for font styling
function processChinese(text) {
    if (!text) return text;
    return text.replace(/([\u4e00-\u9fa5]+)/g, '<span class="chinese-text">$1</span>');
}

// Function to load publications from JSON
function loadPublications() {
    let publicationsJsonPath = 'data/publications.json';
    if (window.location.pathname.includes('/pages/')) {
        publicationsJsonPath = '../data/publications.json';
    }

    // Check if we're on the homepage or publications page
    const isHomepage = !window.location.pathname.includes('/pages/publications.html');

    fetch(publicationsJsonPath)
        .then(response => response.json())
        .then(publications => {
            // If on publications page, handle like before
            if (!isHomepage) {
                const publicationsList = document.querySelector('.publications-list');
                if (publicationsList) {
                    renderPublications(publications, publicationsList);
                }
                return;
            }

            // Sort publications by year in descending order
            publications.sort((a, b) => {
                return parseInt(b.year) - parseInt(a.year);
            });

            // Filter publications for current year only (2025)
            const currentYear = new Date().getFullYear().toString();
            const currentYearPublications = publications.filter(pub => pub.year === currentYear);

            // Group the current year publications by year
            const pubsByYear = {};
            currentYearPublications.forEach(pub => {
                if (!pubsByYear[pub.year]) {
                    pubsByYear[pub.year] = [];
                }
                pubsByYear[pub.year].push(pub);
            });

            // Get years in descending order
            const years = Object.keys(pubsByYear).sort((a, b) => b - a);

            // Render publications for each year
            years.forEach(year => {
                const yearContainer = document.getElementById(`publications-${year}`);
                if (yearContainer) {
                    yearContainer.innerHTML = ''; // Clear existing content
                    renderPublications(pubsByYear[year], yearContainer);
                }
            });
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
        });
}

// Helper function to render publications to a specific container
function renderPublications(publications, container) {
    if (!container) return;

    // Counter for auto-numbering publications
    let counter = 1;

    publications.forEach(pub => {
        const pubElement = document.createElement('div');
        const classes = ['publication', pub.type];
        if (pub.isFirstAuthor) classes.push('first-author');
        pubElement.className = classes.join(' ');

        // Create venue/type label for left side
        const venueElement = document.createElement('div');
        venueElement.className = 'pub-venue-label';

        // Determine what text to show in the left column
        let venueText = '';
        if (pub.type === 'preprint') {
            venueText = 'Preprint';
        } else if (pub.venue) {
            // Extract short venue name from the venue string or tags
            const venueTag = pub.tags.find(tag => tag.class === 'venue-tag');
            venueText = venueTag ? venueTag.text : pub.venue.split(',')[0].split(' ').pop();
        }

        // Create publication number
        const numberElement = document.createElement('span');
        numberElement.className = 'pub-number';
        numberElement.textContent = counter++;

        venueElement.appendChild(numberElement);

        // Add venue text below the number
        const venueTextElement = document.createElement('span');
        venueTextElement.className = 'venue-text';
        venueTextElement.textContent = venueText;
        venueElement.appendChild(venueTextElement);

        // Create publication content container
        const contentElement = document.createElement('div');
        contentElement.className = 'pub-content';

        // Add title
        const titleElement = document.createElement('h3');
        titleElement.textContent = pub.title;
        contentElement.appendChild(titleElement);

        // Add authors
        const authorsElement = document.createElement('p');
        authorsElement.className = 'authors';
        authorsElement.innerHTML = pub.authors;
        contentElement.appendChild(authorsElement);

        // Add full venue if it exists (for accepted papers)
        if (pub.venue) {
            const fullVenueElement = document.createElement('p');
            fullVenueElement.className = 'venue';
            fullVenueElement.textContent = pub.venue;
            contentElement.appendChild(fullVenueElement);
        }

        // Add tags
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'pub-tags';

        pub.tags.forEach(tag => {
            // Skip venue tag as we're now showing it on the left
            if (tag.class === 'venue-tag') return;

            if (tag.link) {
                const tagLink = document.createElement('a');
                tagLink.href = tag.link;
                tagLink.className = `tag ${tag.class}`;
                tagLink.textContent = tag.text;
                tagLink.target = "_blank";
                tagLink.rel = "noopener noreferrer";
                tagsContainer.appendChild(tagLink);
            } else {
                const tagSpan = document.createElement('span');
                tagSpan.className = `tag ${tag.class}`;
                tagSpan.textContent = tag.text;
                tagsContainer.appendChild(tagSpan);
            }
        });

        contentElement.appendChild(tagsContainer);

        // Combine elements and add to publications list
        pubElement.appendChild(venueElement);
        pubElement.appendChild(contentElement);
        container.appendChild(pubElement);
    });
}

// Function to generate gallery HTML
function generateGalleryHTML(images) {
    if (!images || images.length === 0) return '';

    const imageWidth = 280; // Fixed image width in pixels
    const totalWidth = images.length * imageWidth;
    const gaps = images.length - 1; // Number of gaps between images

    let galleryHtml = '<div class="news-gallery">';

    images.forEach((imgSrc, index) => {
        // Calculate z-index: first image has highest z-index, last image has lowest
        // z-index decreases from images.length (first) to 1 (last)
        const zIndex = images.length - index;

        // First image doesn't need margin-left
        if (index === 0) {
            galleryHtml += `
                <a href="${imgSrc}" target="_blank" class="news-gallery-item" style="z-index: ${zIndex};">
                    <img src="${imgSrc}" alt="News Photo" class="news-gallery-img">
                </a>
            `;
        } else {
            // Dynamic margin calculation: min(-60px, calc((100% - totalWidth) / gaps))
            // This ensures images don't overflow while maintaining overlap on wider screens
            const dynamicMargin = `min(-60px, calc((100% - ${totalWidth}px) / ${gaps}))`;
            galleryHtml += `
                <a href="${imgSrc}" target="_blank" class="news-gallery-item" style="margin-left: ${dynamicMargin}; z-index: ${zIndex};">
                    <img src="${imgSrc}" alt="News Photo" class="news-gallery-img">
                </a>
            `;
        }
    });

    galleryHtml += '</div>';
    return galleryHtml;
}

// Function to render news items
function renderNewsItems(newsData, containerId, limit = 8) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Add each news item to the container
    newsData.slice(0, limit).forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';

        // Create the date element
        const dateElement = document.createElement('div');
        dateElement.className = 'news-date';

        const dateHighlight = document.createElement('span');
        dateHighlight.className = 'year-highlight';
        dateHighlight.textContent = newsItem.date;
        dateElement.appendChild(dateHighlight);

        // Create the content element
        const contentElement = document.createElement('div');
        contentElement.className = 'news-content';

        // Create the title element
        const titleElement = document.createElement('h3');

        // Check if title contains HTML (like '<a href=')
        if (newsItem.title && newsItem.title.includes('<a href=')) {
            // Parse HTML in title
            titleElement.innerHTML = newsItem.title;
        } else {
            titleElement.textContent = newsItem.title;
        }

        contentElement.appendChild(titleElement);

        // Create the paragraph for content
        const paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = newsItem.content;

        // Add links if provided in the links array format
        if (newsItem.links && newsItem.links.length > 0) {
            newsItem.links.forEach(link => {
                // Add a space if needed
                const space = document.createTextNode(' ');
                paragraphElement.appendChild(space);

                // Create link
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.text;
                linkElement.target = "_blank";
                linkElement.rel = "noopener noreferrer";
                paragraphElement.appendChild(linkElement);
            });
        }

        // Check for old style link (backward compatibility)
        if (newsItem.link && newsItem.linkText) {
            const space = document.createTextNode(' ');
            paragraphElement.appendChild(space);

            const linkElement = document.createElement('a');
            linkElement.href = newsItem.link;
            linkElement.textContent = newsItem.linkText;
            linkElement.target = "_blank";
            linkElement.rel = "noopener noreferrer";
            paragraphElement.appendChild(linkElement);
        }

        contentElement.appendChild(paragraphElement);

        // Append Gallery if images exist
        if (newsItem.images && newsItem.images.length > 0) {
            const galleryContainer = document.createElement('div');
            galleryContainer.innerHTML = generateGalleryHTML(newsItem.images);
            contentElement.appendChild(galleryContainer);
        }

        // Add date and content to the news item
        newsElement.appendChild(dateElement);
        newsElement.appendChild(contentElement);

        // Add the news item to the container
        container.appendChild(newsElement);
    });
} 