// xử lí logic cho form thêm/ sửa ứng viên


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
 * hàm validate dât cho form
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
}