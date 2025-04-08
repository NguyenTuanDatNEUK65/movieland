document.addEventListener('DOMContentLoaded', function() {
    // Banner/Slider functionality
    const dots = document.querySelectorAll('.dot');
    const nextSlide = document.querySelector('.next-slide');
    
    // Simulate slider functionality
    let currentSlide = 0;
    const totalSlides = dots.length;
    
    // Initialize first slide
    updateSlider();
    
    // Handle dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Handle next button click
    if (nextSlide) {
        nextSlide.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
    }
    
    // Update slider visuals
    function updateSlider() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Here you would also change the banner background image and content
        // This is just a placeholder for the real functionality
        const bannerElement = document.querySelector('.hero-banner');
        if (bannerElement) {
            // In a real implementation, you would have different images and content for each slide
            // This is just to show the concept
            bannerElement.style.backgroundPosition = `${currentSlide * 20}% center`;
        }
    }
    
    // Simulate search functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchButton && searchBar) {
        searchButton.addEventListener('click', () => {
            performSearch();
        });
        
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            // For demo purposes, we're just alerting the search term
            // In a real implementation, you would navigate to search results
            console.log(`Tìm kiếm: ${searchTerm}`);
            alert(`Bạn đã tìm kiếm: ${searchTerm}`);
        }
    }
    
    // Simulate login button functionality
    const loginButton = document.querySelector('.login-button button');
    
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            // In a real implementation, this would show a login form or navigate to login page
            alert('Chức năng đăng nhập sẽ được hiển thị ở đây');
        });
    }
    
    // Add hover effects to movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('click', () => {
            // In a real implementation, this would navigate to the movie details page
            const movieTitle = card.querySelector('.movie-title').textContent;
            alert(`Bạn đã chọn phim: ${movieTitle}`);
        });
    });
    
    // Auto play banner slider
    setInterval(() => {
        if (totalSlides > 1) {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
    }, 5000); // Change slide every 5 seconds
   
    // Thêm code để lấy danh sách thể loại cho category-grid
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
        populateCategoryGrid(categoryGrid);
    }
    
    // Hàm để lấy và hiển thị danh sách thể loại trong category-grid
    function populateCategoryGrid(gridElement) {
        fetch('https://phimapi.com/the-loai')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                // Xóa nội dung hiện tại
                gridElement.innerHTML = '';
                
                // Thêm các thể loại từ API
                data.forEach(genre => {
                    const categoryCard = document.createElement('a');
                    categoryCard.href = `/the-loai/${genre.slug}`;
                    categoryCard.className = 'category-card';
                    categoryCard.textContent = genre.name;
                    gridElement.appendChild(categoryCard);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách thể loại cho lưới:', error);
                
                // Xóa nội dung hiện tại
                gridElement.innerHTML = '';
                
                // Thêm các thể loại mẫu
                sampleGenres.forEach(genre => {
                    const categoryCard = document.createElement('a');
                    categoryCard.href = `/the-loai/${genre.slug}`;
                    categoryCard.className = 'category-card';
                    categoryCard.textContent = genre.name;
                    gridElement.appendChild(categoryCard);
                });
            });
    }
}); 