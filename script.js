document.addEventListener('DOMContentLoaded', function() {
    var filePath = 'https://Fhonq-22.github.io/QLGiaoVien/QLGiaoVien.xlsx';

    // Hàm đọc Excel
    function readExcel(file, sheetName, loggedInUserID) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });

            if (workbook.SheetNames.includes(sheetName)) {
                var worksheet = workbook.Sheets[sheetName];
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                var headers = jsonData[0];

                var container = document.getElementById(sheetName + 'Container');
                if (container) {
                    container.innerHTML = ''; // Xóa dữ liệu cũ trong container
                }

                // Nếu có loggedInUserID, chỉ tìm giáo viên có ID tương ứng
                if (loggedInUserID) {
                    for (var i = 1; i < jsonData.length; i++) {
                        var row = jsonData[i];
                        if (row[0] === loggedInUserID) {
                            var divHang = document.createElement('div');
                            divHang.classList.add('hang');

                            for (var j = 0; j < headers.length; j++) {
                                var spanThongTin = document.createElement('span');
                                spanThongTin.classList.add('thongtin');
                                spanThongTin.textContent = headers[j] + ': ' + row[j];
                                divHang.appendChild(spanThongTin);
                            }

                            container.appendChild(divHang);
                        }
                    }

                    if (container.childElementCount === 0) {
                        var noDataMessage = document.createElement('p');
                        noDataMessage.textContent = 'Không tìm thấy "'+pageName+'" của bạn!';
                        container.appendChild(noDataMessage);
                    }
                } else {
                    // Hiển thị tất cả dữ liệu cho các trang khác
                    for (var i = 1; i < jsonData.length; i++) {
                        var row = jsonData[i];

                        var divHang = document.createElement('div');
                        divHang.classList.add('hang');

                        for (var j = 0; j < headers.length; j++) {
                            var spanThongTin = document.createElement('span');
                            spanThongTin.classList.add('thongtin');
                            spanThongTin.textContent = headers[j] + ': ' + row[j];
                            divHang.appendChild(spanThongTin);
                        }

                        container.appendChild(divHang);
                    }
                }
            } else {
                console.error('Sheet ' + sheetName + ' không tìm thấy trong workbook.');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // Hàm fetch dữ liệu và hiển thị
    function fetchDataAndDisplay(sheetName, containerId, loggedInUserID = null) {
        fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                readExcel(blob, sheetName, loggedInUserID);
            })
            .catch(error => console.error('Lỗi khi tải file Excel:', error));
    }

    // Xử lý sự kiện khi tài liệu HTML được tải xong
    var pageName = document.title;

    switch (pageName) {
        case 'Thông tin giáo viên':
            var loggedInUserID = sessionStorage.getItem('loggedInUserID');
            if (loggedInUserID) {
                fetchDataAndDisplay('GiaoVien', 'GiaoVienContainer', loggedInUserID);
            } else {
                console.error('Không tìm thấy ID người dùng đã đăng nhập.');
            }
            break;
        case 'Thông tin môn học':
            fetchDataAndDisplay('MonHoc', 'MonHocContainer');
            break;
        case 'Thông tin lớp học':
            fetchDataAndDisplay('Lop', 'LopContainer');
            break;
        case 'Phân công môn học':
            var loggedInUserID = sessionStorage.getItem('loggedInUserID');
            if (loggedInUserID) {
                fetchDataAndDisplay('PhanCong', 'PhanCongContainer', loggedInUserID);
            } else {
                console.error('Không tìm thấy ID người dùng đã đăng nhập.');
            }
            break;
        default:
            console.error('Trang không xác định:', pageName);
    }
});
