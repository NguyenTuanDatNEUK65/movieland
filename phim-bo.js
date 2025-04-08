document.addEventListener('DOMContentLoaded', function() {
    // Các biến cho phân trang
    let currentPage = 1;
    const itemsPerPage = 30;
    let totalPages = 0;

    // Các selector DOM
    const moviesContainer = document.getElementById('movies-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    
    // Các bộ lọc
    const categoryFilter = document.getElementById('category-filter');
    const countryFilter = document.getElementById('country-filter');
    const yearFilter = document.getElementById('year-filter');

    // Thêm sự kiện cho nút phân trang
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchMovies();
        }
    });

    // Thêm sự kiện cho bộ lọc
    categoryFilter.addEventListener('change', resetAndFetch);
    countryFilter.addEventListener('change', resetAndFetch);
    yearFilter.addEventListener('change', resetAndFetch);

    // Reset trang và fetch lại khi lọc
    function resetAndFetch() {
        currentPage = 1;
        fetchMovies();
    }

    // Fetch dữ liệu phim từ API
    function fetchMovies() {
        // Hiển thị loading
        moviesContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang tải phim...</p>
            </div>
        `;

        // Cập nhật hiển thị trang hiện tại
        currentPageSpan.textContent = `Trang ${currentPage}`;
        
        // Vô hiệu hóa nút phân trang nếu cần
        prevPageBtn.disabled = currentPage === 1;
        
        // Tạo URL với tham số bộ lọc
        let apiUrl = `https://phimapi.com/v1/api/danh-sach/phim-bo?page=${currentPage}&limit=${itemsPerPage}`;
        
        // Thêm các tham số bộ lọc nếu được chọn
        const category = categoryFilter.value;
        const country = countryFilter.value;
        const year = yearFilter.value;
        
        if (category) apiUrl += `&category=${category}`;
        if (country) apiUrl += `&country=${country}`;
        if (year) apiUrl += `&year=${year}`;

        // Gọi API để lấy dữ liệu
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                // Xử lý dữ liệu và hiển thị phim
                displayMovies(data);
                
                // Cập nhật thông tin phân trang
                if (data.data && data.data.params && data.data.params.pagination) {
                    totalPages = data.data.params.pagination.totalPages;
                    nextPageBtn.disabled = currentPage >= totalPages;
                }
            })
            .catch(error => {
                // Hiển thị lỗi nếu có
                moviesContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${error.message || 'Đã xảy ra lỗi khi tải dữ liệu phim.'}</p>
                        <button id="retry-btn">Thử lại</button>
                    </div>
                `;
                
                // Thêm sự kiện thử lại
                document.getElementById('retry-btn').addEventListener('click', fetchMovies);
            });
    }

    // Hiển thị danh sách phim
    function displayMovies(data) {
        // Kiểm tra xem có dữ liệu phim không
        if (!data || !data.data || !data.data.items || data.data.items.length === 0) {
            moviesContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-film"></i>
                    <p>Không tìm thấy phim phù hợp</p>
                </div>
            `;
            return;
        }

        // Tạo HTML cho từng phim
        let moviesHTML = '';
        
        data.data.items.forEach(movie => {
            const posterUrl = movie.poster_url ? 
                `https://phimimg.com/${movie.poster_url}` : 
                'placeholder-poster.jpg';
            
            const categories = movie.category ? 
                movie.category.map(cat => cat.name).join(', ') : 
                '';
                
            const countries = movie.country ? 
                movie.country.map(c => c.name).join(', ') : 
                '';
            
            moviesHTML += `
                <div class="movie-card" data-id="${movie._id}">
                    <div class="movie-poster" style="background-image: url('${posterUrl}')">
                        <span class="movie-quality">${movie.quality || 'HD'}</span>
                        <span class="movie-episode">${movie.episode_current || 'Full'}</span>
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.name}</h3>
                        <div class="movie-meta">
                            <span class="movie-year">${movie.year || ''}</span>
                            ${categories ? `<span class="movie-categories">• ${categories}</span>` : ''}
                            ${countries ? `<span class="movie-countries">• ${countries}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        // Cập nhật container phim
        moviesContainer.innerHTML = moviesHTML;
        
        // Thêm sự kiện click cho từng phim
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('click', () => {
                const movieId = card.getAttribute('data-id');
                const movieTitle = card.querySelector('.movie-title').textContent;
                alert(`Bạn đã chọn phim: ${movieTitle}`);
                // Trong thực tế, có thể chuyển hướng đến trang chi tiết phim
                // window.location.href = `movie-detail.html?id=${movieId}`;
            });
        });
    }

    // Hiển thị dữ liệu phim mẫu từ API thực tế
    function displaySampleMovies() {
        // Dữ liệu mẫu từ API phim bộ thực tế
        const sampleMovies = [
            {
                _id: "77b7032b2e237ae78e3c520b9a0fd5fa",
                name: "Trò Chơi Tình Ái",
                slug: "tro-choi-tinh-ai-2025",
                origin_name: "Game Of True Love",
                year: 2025,
                poster_url: "upload/vod/20250323-1/ff55d4a9611eef1d013bbf24f575e0cb.jpg",
                quality: "FHD",
                episode_current: "Hoàn Tất (56/56)",
                category: [
                    { name: "Chính Kịch" },
                    { name: "Tình Cảm" },
                    { name: "Tâm Lý" }
                ],
                country: [
                    { name: "Trung Quốc" }
                ]
            },
            {
                _id: "6991aa40ef4b66fb372bd171ba9ad7f2",
                name: "Top Form The Series",
                slug: "top-form-the-series",
                origin_name: "Top Form",
                year: 2025,
                poster_url: "upload/vod/20250321-1/56976051d34dcac987bd77347cb33c04.jpg",
                quality: "FHD",
                episode_current: "Tập 4",
                category: [
                    { name: "Hành Động" },
                    { name: "Hình Sự" }
                ],
                country: [
                    { name: "Thái Lan" }
                ]
            },
            {
                _id: "a1d29909828423591afb051b28d964a9",
                name: "Xin Hãy Kết Hôn Với Tôi Lần Nữa",
                slug: "xin-hay-ket-hon-voi-toi-lan-nua",
                origin_name: "Marry Me Again",
                year: 2025,
                poster_url: "upload/vod/20250403-1/00305654f3ee5486d1f4645097976eb3.jpg",
                quality: "FHD",
                episode_current: "Tập 8",
                category: [
                    { name: "Chính Kịch" },
                    { name: "Tình Cảm" },
                    { name: "Tâm Lý" }
                ],
                country: [
                    { name: "Trung Quốc" }
                ]
            },
            {
                _id: "42c558afca2928af13d868d104e2dca5",
                name: "Tôi Là Triệu Xuất Tức",
                slug: "toi-la-trieu-xuat-tuc",
                origin_name: "My Name is Zhao Chuxi",
                year: 2025,
                poster_url: "upload/vod/20250314-1/3c828e6e1b62f8fe4a9ab14c9fd10141.jpg",
                quality: "FHD",
                episode_current: "Tập 28",
                category: [
                    { name: "Chính Kịch" },
                    { name: "Tình Cảm" },
                    { name: "Tâm Lý" }
                ],
                country: [
                    { name: "Trung Quốc" }
                ]
            },
            {
                _id: "fe56468d0a4575b7aa9eca5f72a60ae4",
                name: "Người Gác Đêm Mao Sơn",
                slug: "nguoi-gac-dem-mao-son",
                origin_name: "Maoshan Night Watchman",
                year: 2025,
                poster_url: "upload/vod/20250331-1/e4106e9f517e1406d5fd3b608dfff174.jpg",
                quality: "FHD",
                episode_current: "Hoàn Tất (24/24)",
                category: [
                    { name: "Chính Kịch" },
                    { name: "Bí Ẩn" }
                ],
                country: [
                    { name: "Trung Quốc" }
                ]
            },
            {
                _id: "556fe7056165f3f6490139ca118e1c49",
                name: "Nửa Đời Sau Của Tôi",
                slug: "nua-doi-sau-cua-toi",
                origin_name: "Love Again",
                year: 2025,
                poster_url: "upload/vod/20250331-1/a60ff6c8ab9de1d057458687fbbc8304.jpg",
                quality: "FHD",
                episode_current: "Tập 11",
                category: [
                    { name: "Chính Kịch" },
                    { name: "Tình Cảm" },
                    { name: "Tâm Lý" }
                ],
                country: [
                    { name: "Trung Quốc" }
                ]
            }
        ];

        // Tạo HTML cho các phim mẫu
        let moviesHTML = '';
        
        sampleMovies.forEach(movie => {
            const posterUrl = movie.poster_url ? 
                `https://phimimg.com/${movie.poster_url}` : 
                'placeholder-poster.jpg';
                
            const categories = movie.category ? 
                movie.category.map(cat => cat.name).join(', ') : 
                '';
            
            const countries = movie.country ? 
                movie.country.map(c => c.name).join(', ') : 
                '';
            
            moviesHTML += `
                <div class="movie-card" data-id="${movie._id}">
                    <div class="movie-poster" style="background-image: url('${posterUrl}')">
                        <span class="movie-quality">${movie.quality || 'HD'}</span>
                        <span class="movie-episode">${movie.episode_current || 'Full'}</span>
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.name}</h3>
                        <div class="movie-meta">
                            <span class="movie-year">${movie.year || ''}</span>
                            ${categories ? `<span class="movie-categories">• ${categories}</span>` : ''}
                            ${countries ? `<span class="movie-countries">• ${countries}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        // Hiển thị 12 phim mẫu (duplicate phim để đủ số lượng)
        const duplicatedHTML = moviesHTML.repeat(2);
        moviesContainer.innerHTML = duplicatedHTML;
        
        // Cập nhật tổng số trang giả
        totalPages = 193;  // Số trang thực tế từ API
        nextPageBtn.disabled = currentPage >= totalPages;
        
        // Thêm sự kiện click cho từng phim
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('click', () => {
                const movieTitle = card.querySelector('.movie-title').textContent;
                alert(`Bạn đã chọn phim: ${movieTitle}`);
            });
        });
    }

    // Xử lý CORS lỗi khi gọi API trực tiếp
    function handleCorsIssue() {
        // Thông báo cho người dùng về vấn đề CORS
        const corsMessage = `
            <div class="cors-warning">
                <h3>Lưu ý về API</h3>
                <p>Do chính sách CORS của trình duyệt, việc gọi API trực tiếp có thể bị chặn. Trong môi trường thực tế, bạn cần:</p>
                <ol>
                    <li>Thiết lập proxy server</li>
                    <li>Hoặc sử dụng API có hỗ trợ CORS</li>
                    <li>Hoặc dùng dữ liệu mẫu từ một tệp JSON cục bộ</li>
                </ol>
                <p>Hiện tại, chúng tôi đang hiển thị dữ liệu mẫu từ API phim bộ thực tế.</p>
            </div>
        `;
        
        // Hiển thị thông báo
        const infoContainer = document.createElement('div');
        infoContainer.className = 'cors-info-container';
        infoContainer.innerHTML = corsMessage;
        document.querySelector('.page-title').appendChild(infoContainer);
        
        // Sử dụng dữ liệu mẫu
        displaySampleMovies();
    }

    // Khởi chạy khi trang được tải
    try {
        // Thử gọi API thực
        fetchMovies();
        
        // Nếu có lỗi CORS, sử dụng dữ liệu mẫu
        // Đây là phương pháp xử lý tạm thời. Trong thực tế cần proxy server
        setTimeout(() => {
            if (document.querySelector('.error-message')) {
                handleCorsIssue();
            }
        }, 3000);
    } catch (error) {
        console.error('Lỗi khởi tạo:', error);
        displaySampleMovies();
    }
}); 