particlesJS("particles-js", {
    "particles": {
        "number": { "value": 100 },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.2 },
        "size": { "value": 2 }, // Cho hạt nhỏ lại xíu nhìn cho sang
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.3, // Cho dây mờ lại nhìn nó huyền bí
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2, // Tốc độ vừa phải cho nó chuyên nghiệp
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out"
        }
    },
    "interactivity": {
        "detect_on": "window", // Giúp bấm được nút 404
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            }
        },
        "modes": { // ĐÂY LÀ CHỖ OG MUỐN SỬA THÔNG SỐ NÈ!
            "repulse": {
                "distance": 60,  // Bán kính đẩy (nhỏ lại theo ý og)
                "duration": 0.4,  // Thời gian tác động
                "speed": 1,       // Tốc độ phản hồi
                "factor": 100     // Độ văng (tăng nếu muốn hạt bay xa hơn)
            }
        }
    },
    "retina_detect": true // Giúp hiển thị sắc nét trên màn hình xịn
});