document.addEventListener('DOMContentLoaded', function() {
    // Lấy dropdown elements
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Khởi tạo dropdown menus
    dropdowns.forEach((dropdown, index) => {
        const toggleElement = dropdown.querySelector('.dropdown-toggle');
        
        // Tạo dropdown menu element
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        dropdown.appendChild(dropdownMenu);
        
        // Xác định loại dropdown (Thể Loại hoặc Quốc Gia)
        if (toggleElement.textContent.includes('Thể Loại')) {
            dropdown.classList.add('genre-dropdown');
            fetchGenres(dropdownMenu);
        } else if (toggleElement.textContent.includes('Quốc Gia')) {
            dropdown.classList.add('country-dropdown');
            fetchCountries(dropdownMenu);
        }
    });
    
    // Lấy danh sách thể loại từ API
    function fetchGenres(menuElement) {
        fetch('https://phimapi.com/the-loai')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                displayInColumns(data, menuElement, 5, 'genre-column', 'the-loai');
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách thể loại:', error);
                // Sử dụng dữ liệu mẫu nếu không thể kết nối API
               
                displayInColumns(sampleGenres, menuElement, 5, 'genre-column', 'the-loai');
            });
    }
    
    // Lấy danh sách quốc gia từ API
    function fetchCountries(menuElement) {
        fetch('https://phimapi.com/quoc-gia')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                // Sắp xếp danh sách, đưa "quốc gia khác" xuống cuối
                const sortedData = [...data];
                const otherCountryIndex = sortedData.findIndex(country => country.name === "Quốc Gia Khác");
                
                if (otherCountryIndex !== -1) {
                    const otherCountry = sortedData.splice(otherCountryIndex, 1)[0];
                    sortedData.push(otherCountry);
                }
                
                displayInColumns(sortedData, menuElement, 4, 'country-column', 'quoc-gia');
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách quốc gia:', error);

                
                // Đảm bảo mẫu cũng có "Quốc Gia Khác" ở cuối nếu cần
                const sampleOtherCountryIndex = sampleCountries.findIndex(country => country.name === "Quốc Gia Khác");
                if (sampleOtherCountryIndex !== -1) {
                    const otherCountry = sampleCountries.splice(sampleOtherCountryIndex, 1)[0];
                    sampleCountries.push(otherCountry);
                }
                
                displayInColumns(sampleCountries, menuElement, 4, 'country-column', 'quoc-gia');
            });
    }
    
    // Hiển thị danh sách thành nhiều cột
    function displayInColumns(items, menuElement, columnCount, columnClass, urlPrefix) {
        // Tính toán số lượng items mỗi cột
        const totalItems = items.length;
        const itemsPerColumn = Math.ceil(totalItems / columnCount);
        
        // Tạo các cột
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = `dropdown-column ${columnClass}`;
            
            // Tính toán chỉ số bắt đầu và kết thúc cho mỗi cột
            const startIndex = i * itemsPerColumn;
            const endIndex = Math.min(startIndex + itemsPerColumn, totalItems);
            
            // Thêm các mục vào cột
            for (let j = startIndex; j < endIndex; j++) {
                if (items[j]) {
                    const item = items[j];
                    const link = document.createElement('a');
                    link.className = 'dropdown-link';
                    link.href = `/${urlPrefix}/${item.slug}`;
                    link.textContent = item.name;
                    column.appendChild(link);
                }
            }
            
            menuElement.appendChild(column);
        }
    }
}); 