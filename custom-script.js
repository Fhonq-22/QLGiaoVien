document.addEventListener('DOMContentLoaded', function() {
    var filePath = 'https://Fhonq-22.github.io/QLGiaoVien/QLGiaoVien.xlsx';

    function readExcel(file, sheetName) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });

            if (workbook.SheetNames.includes(sheetName)) {
                var worksheet = workbook.Sheets[sheetName];
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                var headers = jsonData[0];
                var users = [];

                // Lặp qua từng dòng dữ liệu (bỏ qua dòng header)
                for (var i = 1; i < jsonData.length; i++) {
                    var row = jsonData[i];
                    var user = {};
                    for (var j = 0; j < headers.length; j++) {
                        user[headers[j]] = row[j];
                    }
                    users.push(user);
                }

                // Lưu thông tin người dùng vào sessionStorage
                sessionStorage.setItem('users', JSON.stringify(users));
            } else {
                console.error('Sheet ' + sheetName + ' không tìm thấy trong workbook.');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // Đọc dữ liệu từ file Excel khi trang được tải
    fetch(filePath)
        .then(response => response.blob())
        .then(blob => {
            readExcel(blob, 'User');
        })
        .catch(error => console.error('Lỗi khi tải file Excel:', error));

    var loginForm = document.getElementById('loginForm');
    var menu = document.getElementById('menu');
    var logoutMessage = document.getElementById('logoutMessage');
    var loggedInUserID = sessionStorage.getItem('loggedInUserID');

    // Hiển thị menu nếu đã đăng nhập
    if (loggedInUserID) {
        loginForm.style.display = 'none';
        menu.style.display = 'block';
    }

    // Xử lý sự kiện submit form đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            var userID = document.getElementById('userID').value.trim();
            var password = document.getElementById('password').value.trim();

            var users = JSON.parse(sessionStorage.getItem('users')) || [];
            var authenticated = false;

            // Kiểm tra đăng nhập
            for (var i = 0; i < users.length; i++) {
                if (users[i].ID === userID && users[i].MatKhau === password) {
                    authenticated = true;
                    break;
                }
            }

            if (authenticated) {
                sessionStorage.setItem('loggedInUserID', userID);
                loginForm.style.display = 'none';
                menu.style.display = 'block';
                logoutMessage.style.display = 'none';
            } else {
                alert('Đăng nhập không thành công. Vui lòng thử lại.');
            }
        });
    } else {
        console.error('Không tìm thấy form đăng nhập.');
    }

    // Xử lý sự kiện đăng xuất
    var logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.removeItem('loggedInUserID');
            menu.style.display = 'none';
            loginForm.style.display = 'block';
            logoutMessage.style.display = 'block';
        });
    }
});
