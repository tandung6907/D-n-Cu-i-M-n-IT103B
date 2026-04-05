// 1. Thiết lập ngày kết thúc (Bạn chỉnh sửa ngày ở đây)
const countToDate = new Date("April 3, 2026 13:21:00").getTime();

const countdown = setInterval(() => {
    // 2. Lấy thời gian hiện tại
    const now = new Date().getTime();

    // 3. Tính khoảng cách giữa hiện tại và ngày kết thúc
    const distance = countToDate - now;

    // 4. Tính toán số ngày, giờ, phút, giây
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 5. Hiển thị kết quả ra các thẻ HTML tương ứng
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    // 6. Xử lý khi thời gian kết thúc
    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown-container").innerHTML = "<h3>Nigger!</h3>";
    }
}, 1000);