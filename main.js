// main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Art Data (Simulated) ---
    // Removed the 'dimensions' property as it will be dynamically calculated.
    const artPieces = [
        {
            id: 'art1',
            src: 'art/his_silly_gaze.png',
            alt: 'his silly gaze',
            title: 'his silly gaze',
            date: '2025-07-09',
            categories: ['black_white', 'portraits'],
            description: 'A whimsical black and white portrait that captures a guy\'s playful expression.',
            theme: 'Pencil Art',
            creationDate: 'July 9th, 2025',
            timeTaken: '1hr 42 min',
            appUsed: 'ibis paint x',
            wacom: 'xp-pen STAR 03 V2'
        },
        {
            id: 'art2',
            src: 'art/fine_shyt_(lol).png',
            alt: 'fine shyt (lol)',
            title: 'fine shyt (lol)',
            date: '2025-07-10',
            categories: ['black_white', 'portraits'],
            description: 'A whimsical black and white portrait that captures a girl\'s playful expression.',
            theme: 'Pencil Art',
            creationDate: 'July 10th, 2025',
            timeTaken: '1hr 17 min',
            appUsed: 'ibis paint x',
            wacom: 'xp-pen STAR 03 V2'
        },
        {
            id: 'art3',
            src: 'art/her_emerald_eyes.png',
            alt: 'her emerald eyes',
            title: 'her emerald eyes',
            date: '2025-07-25',
            categories: ['colored', 'portraits'],
            description: 'Her emerald eyes held galaxies of secrets - each blink a shimmer of mystery.',
            theme: 'Pencil Art',
            creationDate: 'July 25th, 2025',
            timeTaken: '1hr 52 min',
            appUsed: 'ibis paint x',
            wacom: 'xp-pen STAR 03 V2'
        }
    ];

    // --- Element Selectors ---
    const artGrid = document.getElementById('art-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const artModal = document.getElementById('art-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDimensions = document.getElementById('modal-dimensions');
    const modalDate = document.getElementById('modal-date');
    const modalCategories = document.getElementById('modal-categories');
    const mainContent = document.getElementById('main-content');
    const modalContentWrapper = document.getElementById('modal-content-wrapper');
    const modalTheme = document.getElementById('modal-theme');
    const modalCreationDate = document.getElementById('modal-creation-date');
    const modalTimeTaken = document.getElementById('modal-time-taken');
    const modalAppUsed = document.getElementById('modal-app-used');
    const modalWacom = document.getElementById('modal-wacom');
    const toastNotification = document.getElementById('toast-notification');

    let currentFilter = 'all';

    // --- Intersection Observer for Scroll Reveal ---
    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // --- Lazy Loading with Intersection Observer ---
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const artCard = entry.target;
                const img = artCard.querySelector('img');
                const shimmerPlaceholder = artCard.querySelector('.shimmer-image-placeholder');

                if (img && img.dataset.src) {
                    img.src = img.dataset.src;
                    img.onload = () => {
                        if (shimmerPlaceholder) shimmerPlaceholder.remove();
                        img.classList.remove('opacity-0');
                        img.classList.add('opacity-100');
                    };
                    img.onerror = () => {
                        console.error('Error loading image:', img.dataset.src);
                        if (shimmerPlaceholder) shimmerPlaceholder.remove();
                        img.src = 'https://placehold.co/600x600/CCCCCC/000000?text=Error';
                        img.classList.remove('opacity-0');
                        img.classList.add('opacity-100');
                    };
                }
                observer.unobserve(artCard);
            }
        });
    }, { rootMargin: '0px 0px 100px 0px', threshold: 0 });

    // --- Function to show a toast notification ---
    function showToast(message) {
        toastNotification.textContent = message;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    }

    // --- Dynamic Share Text Generator ---
    const getDynamicSharePhrase = (art) => { // Now accepts the full art object
        const titleLower = art.title.toLowerCase();
        const themeLower = art.theme ? art.theme.toLowerCase() : '';
        const categoriesLower = art.categories.map(cat => cat.toLowerCase());

        const phrases = {
            'humorous': [
                'Get a kick out of',
                'Laugh along with',
                'Check out this gem:',
                'You won\'t believe this one:',
                'Prepare for some giggles with',
                'Discover the playful side of',
                'Find your smile with'
            ],
            'pencil art': [
                'Uncover the magic of',
                'Witness the delicate strokes of',
                'Explore the intricate details of',
                'Admire the precision in',
                'See the subtle beauty of'
            ],
            'abstract': [
                'Dive into the depths of',
                'Experience the vibrant chaos of',
                'Contemplate the beauty of',
                'Lose yourself in the lines of',
                'Unlock the mystery of'
            ],
            'nature': [
                'Breathe in the tranquility of',
                'Get lost in the serene landscapes of',
                'Discover the organic beauty of',
                'Find peace in the scenery of',
                'Connect with nature through'
            ],
            'portraits': [
                'Connect with the soul of',
                'Admire the captivating gaze of',
                'Feel the emotion in',
                'Behold the character of',
                'Meet the subject of'
            ],
            'colored': [
                'Immerse yourself in the hues of',
                'Brighten your day with',
                'See the world in full color with',
                'Experience the vibrant palette of',
                'Celebrate the colors of'
            ],
            'black & white': [
                'Appreciate the timeless elegance of',
                'Experience the stark beauty of',
                'Find depth in the contrasts of',
                'See the classic charm of',
                'Explore the monochrome world of'
            ],
            'default': [ // A more general, positive default
                'Discover',
                'Check out',
                'Explore',
                'Be inspired by',
                'Take a look at'
            ]
        };

        // Prioritize humorous phrases if keywords are present in title
        if (titleLower.includes('(lol)') || titleLower.includes('silly') || titleLower.includes('shyt') || titleLower.includes('funny') || titleLower.includes('humor')) {
            return phrases['humorous'][Math.floor(Math.random() * phrases['humorous'].length)];
        }

        // Then check themes and categories, giving preference to theme if available
        if (themeLower.includes('pencil art')) {
            return phrases['pencil art'][Math.floor(Math.random() * phrases['pencil art'].length)];
        }
        if (themeLower.includes('abstract')) {
            return phrases['abstract'][Math.floor(Math.random() * phrases['abstract'].length)];
        }
        if (themeLower.includes('nature') || categoriesLower.includes('landscapes')) {
            return phrases['nature'][Math.floor(Math.random() * phrases['nature'].length)];
        }
        if (themeLower.includes('portraits') || categoriesLower.includes('portraits')) {
            return phrases['portraits'][Math.floor(Math.random() * phrases['portraits'].length)];
        }
        if (themeLower.includes('colored') || categoriesLower.includes('colored')) {
            return phrases['colored'][Math.floor(Math.random() * phrases['colored'].length)];
        }
        if (themeLower.includes('black & white') || categoriesLower.includes('black_white')) {
            return phrases['black & white'][Math.floor(Math.random() * phrases['black & white'].length)];
        }

        // Fallback to default if no specific theme/title matches
        return phrases['default'][Math.floor(Math.random() * phrases['default'].length)];
    };

    // --- Share Art Function ---
    const shareArt = (art) => {
        const dynamicPhrase = getDynamicSharePhrase(art); // Pass the full art object
        const shareUrl = `${window.location.origin}${window.location.pathname}#art-${art.id}`;
        const shareText = `${dynamicPhrase} "${art.title}" by Dhanishta's Art: ${shareUrl}`;

        if (navigator.share) {
            navigator.share({
                title: 'Dhanista\'s Art',
                text: shareText,
                url: shareUrl
            }).catch((error) => {
                // User cancelled share or other error
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            });
        } else {
            // Fallback for browsers that do not support navigator.share
            const textarea = document.createElement('textarea');
            textarea.value = shareText;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showToast('Could not copy link. Please copy manually.');
            }
            document.body.removeChild(textarea);
        }
    };

    // --- Dynamic Art Card Creation ---
    const createArtCard = (art) => {
        const artCard = document.createElement('div');
        artCard.className = 'art-card gallery-card cursor-pointer scroll-reveal-item relative group'; // Added group for hover effect
        artCard.dataset.categories = art.categories.join(' ');
        artCard.id = `art-${art.id}`; // Add ID for direct linking
        artCard.dataset.id = art.id;

        const formattedDate = new Date(art.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        artCard.innerHTML = `
            <div class="art-image-container">
                <div class="shimmer-image-placeholder"></div>
                <img data-src="${art.src}" alt="${art.alt}" class="w-full h-full object-cover opacity-0 transition-opacity duration-500">
                <div class="art-image-overlay">
                    <h3 class="overlay-title">${art.title}</h3>
                    <p class="overlay-date">${formattedDate}</p>
                    <button class="share-button absolute bottom-4 right-4 p-2 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.882 13.07 9 12.716 9 12c0-.716-.118-1.07-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.516 4.654a3 3 0 00-4.045 4.045L8.684 13.342zm6.516 4.654a3 3 0 10-4.045-4.045l4.045-4.045a3 3 0 104.045 4.045l-4.045 4.045z"></path></svg>
                    </button>
                </div>
            </div>
        `;
        // Attach click listener to open the modal
        artCard.addEventListener('click', (e) => {
            // Prevent modal from opening if share button is clicked
            if (!e.target.closest('.share-button')) { // Use closest to check if the clicked element or its parent is the share button
                openArtModal(art.id);
            }
        });

        // Attach share functionality to the share button
        const shareButton = artCard.querySelector('.share-button');
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop event propagation to prevent modal from opening
            shareArt(art);
        });

        return artCard;
    };

    // --- Render Art Gallery ---
    const renderGallery = (filter) => {
        artGrid.innerHTML = '';
        // Add shimmer placeholders while content loads
        for (let i = 0; i < 8; i++) {
            const shimmerCard = document.createElement('div');
            shimmerCard.className = 'art-card gallery-card cursor-pointer scroll-reveal-item';
            shimmerCard.innerHTML = `<div class="art-image-container"><div class="shimmer-image-placeholder"></div></div>`;
            artGrid.appendChild(shimmerCard);
            scrollRevealObserver.observe(shimmerCard);
        }

        // Simulate a network delay for loading images
        setTimeout(() => {
            artGrid.innerHTML = ''; // Clear shimmer cards
            const filteredArt = artPieces.filter(art => filter === 'all' || art.categories.includes(filter));

            if (filteredArt.length === 0) {
                artGrid.innerHTML = `<p class="col-span-full text-center text-gray-300 dark:text-gray-400 text-xl py-10">No art found for this category.</p>`;
                return;
            }

            filteredArt.forEach(art => {
                const card = createArtCard(art);
                artGrid.appendChild(card);
                lazyLoadObserver.observe(card); // Observe for lazy loading
                scrollRevealObserver.observe(card); // Observe for scroll reveal
            });

            // After rendering, check for hash in URL and scroll/highlight
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1); // Remove '#'
                const targetElement = document.getElementById(targetId);
                const gallerySection = document.getElementById('gallery'); // Get the gallery section
                // Adjusted padding for desktop to move the gallery section further down
                const desktopHeaderOffset = document.getElementById('main-header').offsetHeight + -55; 
                const mobileHeaderOffset = document.getElementById('main-header').offsetHeight + 20;


                if (targetElement && gallerySection) {
                    // Determine if on mobile based on screen width
                    const isMobile = window.innerWidth < 768; // Adjust breakpoint as needed

                    if (isMobile) {
                        // On mobile, scroll to center the art card vertically
                        const elementRect = targetElement.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        // Calculate scroll position to center the element
                        const scrollToPosition = window.pageYOffset + elementRect.top - (viewportHeight / 2) + (elementRect.height / 2);
                        
                        window.scrollTo({
                            top: scrollToPosition,
                            behavior: 'smooth'
                        });
                    } else {
                        // On desktop, first scroll to the gallery section
                        const galleryPosition = gallerySection.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: galleryPosition - desktopHeaderOffset,
                            behavior: 'smooth'
                        });

                        // After a short delay, check if the target artwork is still below the viewframe
                        // and scroll to it if necessary
                        setTimeout(() => {
                            const currentTargetRect = targetElement.getBoundingClientRect();
                            const currentViewportHeight = window.innerHeight;

                            // Check if the artwork is below the current viewport
                            if (currentTargetRect.top >= currentViewportHeight || currentTargetRect.bottom <= 0) {
                                const scrollToPosition = window.pageYOffset + currentTargetRect.top - (currentViewportHeight / 2) + (currentTargetRect.height / 2);
                                window.scrollTo({
                                    top: scrollToPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 700); // Give some time for the first scroll to settle
                    }

                    // Highlight the specific art card after a short delay to allow scrolling to finish
                    setTimeout(() => {
                        targetElement.classList.add('highlight-art-card');
                        setTimeout(() => {
                            targetElement.classList.remove('highlight-art-card');
                        }, 3000); // Remove highlight after 3 seconds
                    }, 500); // Adjust delay as needed
                }
            }

        }, 800); // Simulate 0.8 seconds loading time
    };

    // --- Category Filtering ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');
            currentFilter = button.dataset.category;
            renderGallery(currentFilter);
        });
    });

    // --- Modal Functionality ---
    const openArtModal = (artId) => {
        const art = artPieces.find(a => a.id === artId);
        if (art) {
            modalImage.src = art.src;
            modalImage.alt = art.alt;
            modalTitle.textContent = art.title;
            modalDescription.textContent = art.description;
            modalTheme.textContent = `Theme: ${art.theme || 'N/A'}`;
            modalCreationDate.textContent = `Creation Date: ${art.creationDate || 'N/A'}`;
            modalTimeTaken.textContent = `Time Taken: ${art.timeTaken || 'N/A'}`;
            modalAppUsed.textContent = `App Used: ${art.appUsed || 'N/A'}`;
            modalWacom.textContent = `Tablet: ${art.wacom || 'N/A'}`;
            
            // --- Dynamically get image dimensions ---
            // Temporarily set dimensions to 'Loading...' while image loads
            modalDimensions.textContent = `Dimensions: Loading...`; 
            const img = new Image();
            img.onload = () => {
                modalDimensions.textContent = `Dimensions: ${img.naturalWidth} x ${img.naturalHeight} px`;
            };
            img.onerror = () => {
                modalDimensions.textContent = `Dimensions: Could not load`;
                console.error(`Failed to load image for dimensions: ${art.src}`);
            };
            img.src = art.src; // Set src to trigger loading

            modalDate.textContent = `Uploaded: ${new Date(art.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
            modalCategories.innerHTML = '';
            art.categories.forEach(cat => {
                const categoryChip = document.createElement('span');
                categoryChip.className = 'bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full';
                const formattedCat = cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                categoryChip.textContent = formattedCat;
                modalCategories.appendChild(categoryChip);
            });

            // Add share button to modal
            let shareButtonModal = document.getElementById('modal-share-button');
            if (!shareButtonModal) {
                shareButtonModal = document.createElement('button');
                shareButtonModal.id = 'modal-share-button';
                // Add better styling
                shareButtonModal.className = 'mt-6 px-6 py-3 liquid-glass-button inline-flex items-center justify-center text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300';
                // Add a share icon
                shareButtonModal.innerHTML = `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.882 13.07 9 12.716 9 12c0-.716-.118-1.07-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.516 4.654a3 3 0 00-4.045 4.045L8.684 13.342zm6.516 4.654a3 3 0 10-4.045-4.045l4.045-4.045a3 3 0 104.045 4.045l-4.045 4.045z"></path></svg>Share This Art`;
                modalContentWrapper.querySelector('.flex-1.text-white.flex.flex-col.justify-center.p-4.lg\\:p-0').appendChild(shareButtonModal);
            }
            shareButtonModal.onclick = () => shareArt(art); // Re-assign click handler to ensure correct art object

            mainContent.classList.add('blur-effect');
            artModal.classList.remove('hidden');
            setTimeout(() => {
                modalContentWrapper.classList.remove('modal-content-initial');
                modalContentWrapper.classList.add('modal-content-active');
            }, 10);
        }
    };

    // =================================================================
    // --- DESKTOP-ONLY MOUSE TILT EFFECT ---
    // =================================================================
    const initDesktopTilt = () => {
        // This regex checks if the user agent string contains 'Mobi' (for most mobile browsers)
        // or 'Android'. If it doesn't, we assume it's a desktop.
        const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);

        if (!isDesktop) {
            return; // Exit if not a desktop device
        }

        const contactCard = document.getElementById('contact-card');
        if (!contactCard) return;

        const tiltConfig = {
            maxTilt: 6,       // Max tilt in degrees
            perspective: 1000, // 3D perspective in pixels
            scale: 1.03,      // Scale factor on hover
            speed: 300,       // Transition speed in ms
        };

        contactCard.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = contactCard.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            // Calculate tilt values based on mouse position inside the card
            const tiltX = ((y / height) - 0.5) * tiltConfig.maxTilt * -2; // Invert for natural feel
            const tiltY = ((x / width) - 0.5) * tiltConfig.maxTilt * 2;

            // Apply the transformation
            contactCard.style.transition = `transform ${tiltConfig.speed}ms ease-out`;
            contactCard.style.transform = `
                perspective(${tiltConfig.perspective}px) 
                rotateX(${tiltX}deg) 
                rotateY(${tiltY}deg) 
                scale3d(${tiltConfig.scale}, ${tiltConfig.scale}, ${tiltConfig.scale})
            `;
        });

        contactCard.addEventListener('mouseleave', () => {
            // Reset the card to its original state when the mouse leaves
            contactCard.style.transition = `transform ${tiltConfig.speed}ms ease-in-out`;
            contactCard.style.transform = `perspective(${tiltConfig.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    };

    // --- Initial Load ---
    document.querySelectorAll('.scroll-reveal-item').forEach(item => {
        scrollRevealObserver.observe(item);
    });
    renderGallery(currentFilter);
    initDesktopTilt(); // Initialize the tilt effect on page load
});
