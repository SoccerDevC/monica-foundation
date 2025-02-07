document.addEventListener('DOMContentLoaded', function() {
    // Quick View Modal
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.querySelector('#quickViewModal');
    const closeModal = document.querySelector('.close-modal');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Quantity Controls
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const qtyInput = document.querySelector('.quantity input');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        qtyInput.value = currentValue + 1;
    });

    // Filter Functionality
    const filterInputs = document.querySelectorAll('.shop-filters input[type="checkbox"]');
    const priceRange = document.querySelector('#price');
    const colorBtns = document.querySelectorAll('.color-btn');

    filterInputs.forEach(input => {
        input.addEventListener('change', updateFilters);
    });

    priceRange.addEventListener('input', updateFilters);

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            updateFilters();
        });
    });

    function updateFilters() {
        // Add filter logic here
        console.log('Filters updated');
    }

    // Sort Functionality
    const sortSelect = document.querySelector('#sort');
    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        // Add sort logic here
        console.log('Sort by:', sortValue);
    });

    // Mobile Filter Toggle
    const mobileFilterBtn = document.createElement('button');
    mobileFilterBtn.classList.add('mobile-filter-btn');
    mobileFilterBtn.innerHTML = '<i class="fas fa-filter"></i> Filters';
    
    document.querySelector('.products-header').prepend(mobileFilterBtn);

    mobileFilterBtn.addEventListener('click', () => {
        document.querySelector('.shop-filters').classList.toggle('active');
    });
}); 