document.addEventListener('DOMContentLoaded', () => {
    // กำหนดราคาของแต่ละแพ็กเกจไว้ใน JavaScript
    const packagePrices = {
        'Bronze': '2,000',
        'Silver': '3,000',
        'Gold': '5,000',
        'Platinum': '15,000',
        'Custom': 'ตามบรีฟงาน',
        'Plus': 'ตามบรีฟงาน',
    };

    const billModal = document.getElementById('bill-modal');
    const closeBillButton = billModal ? billModal.querySelector('.close-button') : null;
    const billDetailsContainer = document.getElementById('bill-details');
    const tableBody = document.getElementById('booking-data');

    // ตั้งค่า URL ของ Backend ที่ Deploy บน Render ตรงนี้
    const backendURL = 'https://sano-backend2.onrender.com';

    const fetchBookings = () => {
        // แก้ไข fetch ให้ใช้ URL ของ Render
        fetch(`${backendURL}/api/bookings`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(bookings => {
                if (!tableBody) {
                    console.error('Element with ID "booking-data" not found.');
                    return;
                }
                tableBody.innerHTML = '';

                if (bookings.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="8">ยังไม่มีข้อมูลการจอง</td></tr>';
                    return;
                }

                bookings.forEach(booking => {
                    const price = packagePrices[booking.packageName] || 'ไม่ระบุ';
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${booking.clientName}</td>
                        <td>${booking.contactNumber || 'N/A'}</td>
                        <td>${booking.packageName}</td>
                        <td>${booking.shootDate}</td>
                        <td>${booking.shootTime}</td>
                        <td>${booking.location}</td>
                        <td>${price}</td>
                        <td>
                            <button class="btn-bill" data-id="${booking._id}">ดูบิล</button>
                            <button class="btn-delete" data-id="${booking._id}">ลบ</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                document.querySelectorAll('.btn-bill').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const bookingId = e.target.getAttribute('data-id');
                        fetchBillDetails(bookingId);
                    });
                });

                document.querySelectorAll('.btn-delete').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const bookingId = e.target.getAttribute('data-id');
                        if (confirm('คุณต้องการลบรายการจองนี้ใช่หรือไม่?')) {
                            deleteBooking(bookingId);
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (tableBody) {
                    tableBody.innerHTML = `<tr><td colspan="8">เกิดข้อผิดพลาดในการดึงข้อมูล</td></tr>`;
                }
            });
    };

    const fetchBillDetails = (id) => {
        // แก้ไข fetch ให้ใช้ URL ของ Render
        fetch(`${backendURL}/api/bookings/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch bill details');
                }
                return response.json();
            })
            .then(booking => {
                const price = packagePrices[booking.packageName] || 'ไม่ระบุ';
                billDetailsContainer.innerHTML = `
                    <div class="bill-detail-item"><strong>ชื่อลูกค้า:</strong> ${booking.clientName}</div>
                    <div class="bill-detail-item"><strong>เบอร์ติดต่อ:</strong> ${booking.contactNumber || 'N/A'}</div>
                    <div class="bill-detail-item"><strong>แพ็กเกจ:</strong> ${booking.packageName}</div>
                    <div class="bill-detail-item"><strong>วันที่ถ่าย:</strong> ${booking.shootDate}</div>
                    <div class="bill-detail-item"><strong>เวลาถ่าย:</strong> ${booking.shootTime}</div>
                    <div class="bill-detail-item"><strong>สถานที่:</strong> ${booking.location}</div>
                    <div class="bill-total">ยอดรวม: ${price} บาท</div>
                `;
                billModal.style.display = 'flex';
            })
            .catch(error => {
                console.error('Error fetching bill details:', error);
                alert('เกิดข้อผิดพลาดในการดึงรายละเอียดบิล');
            });
    };

    const deleteBooking = (id) => {
        // แก้ไข fetch ให้ใช้ URL ของ Render
        fetch(`${backendURL}/api/bookings/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('ลบรายการจองเรียบร้อยแล้ว');
                fetchBookings();
            } else {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        })
        .catch(error => console.error('Error deleting booking:', error));
    };

    if (closeBillButton) {
        closeBillButton.addEventListener('click', () => {
            billModal.style.display = 'none';
        });
    }

    if (billModal) {
        window.addEventListener('click', (e) => {
            if (e.target === billModal) {
                billModal.style.display = 'none';
            }
        });
    }

    fetchBookings();
});