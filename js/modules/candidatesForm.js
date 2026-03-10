// xử lí logic cho form thêm/ sửa ứng viên

let _editingId = null; // lưu id của ứng viên đang sửa, null nếu đang thêm mới

// hàm đọc, lấy giá trị từ form
function getFormValues() {
    return {
        fullName: document.getElementById("input-fullName").value,
        phoneNumber: document.getElementById("input-phone").value,
        email: document.getElementById("input-email").value,
        country: document.getElementById('input-country').value
    }
}

/**
 * hàm validate data cho form
 */
function validateForm(candidate) {
    if(!candidate.fullName.trim()) {
        return false;
    }

    if(!candidate.phoneNumber.trim()) {
        return false;
    }

    if(!candidate.email.trim()) {
        return false;
    }

    return true;
}

/**
 * hàm reset form khi nhập xong
 */
function resetForm() {
    document.getElementById("form__add")
    .querySelectorAll("input, select").forEach((item) => {
        item.value = "";
    })
    // reset id đang sửa về null 
    _editingId = null;

    // reset title của form về "Thêm ứng viên"
    document.querySelector(".form__header__title").textContent = "Thêm ứng viên";
}

// hàm mở form sửa, điền data vào form
function openEditForm(employeeId) {
    // lấy ra ứng viên đó 
    const candidate = getCandadateById(employeeId);

    if(!candidate) return;

    // lưu id đang sửa vào biến toàn cục
    _editingId = candidate.employeeId;

    // điền thông tin đã có vào form
    document.getElementById("input-fullName").value = candidate.fullName || "";
    document.getElementById("input-phone").value = candidate.phoneNumber || "";
    document.getElementById("input-email").value = candidate.email || "";
    document.getElementById('input-country').value = candidate.country || "";

    // đổi title của form về "Sửa ứng viên"
    document.querySelector(".form__header__title").textContent = "Sửa ứng viên";

    // Mở modal
    document.getElementById("form__add").classList.add("display-block");
}

// hàm lấy id đang sửa
function getEditingId() {
    return _editingId;
}