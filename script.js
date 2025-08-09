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

    // --- ส่วนที่เพิ่ม: Modal สำหรับแสดงสถานะการส่งข้อมูล ---
    const statusModal = document.getElementById('status-modal');
    const modalContent = statusModal ? statusModal.querySelector('.modal-content') : null;
    const modalIcon = statusModal ? statusModal.querySelector('.icon') : null;
    const modalTitle = statusModal ? statusModal.querySelector('h3') : null;
    const modalMessage = statusModal ? statusModal.querySelector('p') : null;

    const showStatus = (status, title, message) => {
        if (!statusModal || !modalContent || !modalIcon || !modalTitle || !modalMessage) return;
        modalContent.className = `modal-content ${status}`;
        modalIcon.textContent = status === 'loading' ? '⏳' : '✅';
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        statusModal.style.display = 'flex';
    };

    const hideStatus = () => {
        if (!statusModal) return;
        statusModal.style.display = 'none';
    };
    
    // ตั้งค่า URL ของ Backend ที่ Deploy บน Render
    const backendURL = 'https://sano-backend2.onrender.com';

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // แสดง Modal แจ้งเตือนว่า "กำลังส่ง"
            showStatus('loading', 'กำลังส่งข้อมูล...', 'กรุณารอสักครู่');

            const bookingData = {
                clientName: document.getElementById('client-name').value,
                contactNumber: document.getElementById('contact-number').value,
                packageName: document.getElementById('package-name-input').value,
                shootDate: document.getElementById('shoot-date').value,
                shootTime: document.getElementById('shoot-time').value,
                location: document.getElementById('location').value
            };
            
            try {
                // แก้ไข fetch ให้ใช้ URL ของ Render
                const response = await fetch(`${backendURL}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });
                
                if (response.ok) {
                    // แสดง Modal "ส่งเรียบร้อยแล้ว"
                    showStatus('success', 'ส่งข้อมูลสำเร็จ!', 'เราได้รับข้อมูลการจองของคุณแล้ว');
                    bookingForm.reset(); // ล้างฟอร์ม
                    // ซ่อน Modal หลังจาก 3 วินาที
                    setTimeout(() => {
                        hideStatus();
                        bookingModal.style.display = 'none'; // ปิด Modal การจองด้วย
                    }, 3000);
                } else {
                    // แสดง Modal "เกิดข้อผิดพลาด"
                    const result = await response.json();
                    showStatus('error', 'เกิดข้อผิดพลาด', `ไม่สามารถส่งข้อมูลได้: ${result.message}`);
                    console.error('Error from server:', result);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                showStatus('error', 'เกิดข้อผิดพลาด', 'การเชื่อมต่อมีปัญหา กรุณาตรวจสอบอินเทอร์เน็ต');
            }
        });
    }
    
    // --- ส่วนที่ 3: โค้ดสำหรับกรองผลงานตามหมวดหมู่ (ปรับปรุงล่าสุด) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
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