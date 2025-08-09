document.addEventListener('DOMContentLoaded', () => {

    // --- ส่วนที่ 1: โค้ดสำหรับเมนู Burger และการนำทางบนมือถือ ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(item => item.style.animation = '');
        });
    });

    // --- ส่วนที่ 2: โค้ดสำหรับ Booking Form และ Modal สำหรับการจอง ---
    const bookButtons = document.querySelectorAll('.btn-book');
    const bookingModal = document.getElementById('booking-modal');
    const closeBookingModal = bookingModal.querySelector('.close-button');
    const packageNameDisplay = document.getElementById('package-name');
    const packageNameInput = document.getElementById('package-name-input');
    const bookingForm = document.getElementById('booking-form');

    if (bookButtons.length > 0) {
        bookButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const packageName = e.target.getAttribute('data-package');
                packageNameDisplay.textContent = packageName;
                packageNameInput.value = packageName;
                bookingModal.style.display = 'flex';
            });
        });
    }

    if (closeBookingModal) {
        closeBookingModal.addEventListener('click', () => {
            bookingModal.style.display = 'none';
            if (bookingForm) {
                bookingForm.reset();
            }
        });
    }

    if (bookingModal) {
        window.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.style.display = 'none';
                if (bookingForm) {
                    bookingForm.reset();
                }
            }
        });
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const bookingData = {
                clientName: document.getElementById('client-name').value,
                contactNumber: document.getElementById('contact-number').value,
                packageName: document.getElementById('package-name-input').value,
                shootDate: document.getElementById('shoot-date').value,
                shootTime: document.getElementById('shoot-time').value,
                location: document.getElementById('location').value
            };
            
            try {
                const response = await fetch(bookingForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert('ข้อมูลการจองของคุณถูกส่งเรียบร้อยแล้วค่ะ');
                    bookingModal.style.display = 'none';
                    bookingForm.reset();
                } else {
                    alert(`เกิดข้อผิดพลาดในการส่งข้อมูล: ${result.message}`);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองอีกครั้ง');
            }
        });
    }
    
    // --- ส่วนที่ 3: โค้ดสำหรับกรองผลงานตามหมวดหมู่ (ปรับปรุงล่าสุด) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // --- ส่วนที่ 4: โค้ดสำหรับขยายรูปภาพเมื่อกด (Modal) ---
    const imageModal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    const closeImageModalBtn = document.querySelector(".close-image-modal-btn");

    portfolioItems.forEach(item => {
        item.addEventListener("click", () => {
            const imgSrc = item.querySelector("img").getAttribute("data-src");
            if (imgSrc) {
                imageModal.style.display = "flex";
                modalImage.src = imgSrc;
            }
        });
    });

    closeImageModalBtn.addEventListener("click", () => {
        imageModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === imageModal) {
            imageModal.style.display = "none";
        }
    });
});