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

    // --- Dynamic Art Card Creation ---
    const createArtCard = (art) => {
        const artCard = document.createElement('div');
        artCard.className = 'art-card gallery-card cursor-pointer scroll-reveal-item';
        artCard.dataset.categories = art.categories.join(' ');
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
                </div>
            </div>
        `;
        // Attach click listener to open the modal
        artCard.addEventListener('click', () => openArtModal(art.id));
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
