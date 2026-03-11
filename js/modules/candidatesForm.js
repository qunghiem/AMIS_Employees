// xử lí logic cho form thêm/ sửa ứng viên

let _editingId = null; // lưu id của ứng viên đang sửa, null nếu đang thêm mới

// hàm đọc, lấy giá trị từ form
function getFormValues() {
    return {
        fullName: document.getElementById("input-fullName").value,
        phoneNumber: document.getElementById("input-phone").value,
        email: document.getElementById("input-email").value,
        country: document.getElementById('input-country').value,
        dob: document.getElementById('input-dob').value,
        gender: document.getElementById('input-gender').value,
        area: document.getElementById("input-area").value,
        province: document.getElementById("input-province").value,
        ward: document.getElementById('input-ward').value,
        address: document.getElementById('input-address').value,
        educationLevel: document.getElementById('input-educationLevel').value,
        educationPlace: document.getElementById('input-educationPlace').value,
        major: document.getElementById('input-major').value,
        applicationDate: document.getElementById('input-applicationDate').value,
        candidateSource: document.getElementById('input-candidate-source').value,
        recentWorkplace: document.getElementById('input-recentWorkplace').value,
        recruiter: document.getElementById('input-recruiter').value,
        collaborator: document.getElementById('input-collaborator').value,
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
    document.getElementById('input-dob').value = candidate.dob || "";
    document.getElementById('input-gender').value = candidate.gender || "";
    document.getElementById("input-area").value = candidate.area || "";
    document.getElementById("input-province").value = candidate.province || "";
    document.getElementById('input-ward').value = candidate.ward || "";
    document.getElementById('input-address').value = candidate.address || "";
    document.getElementById('input-educationLevel').value = candidate.educationLevel || "";
    document.getElementById('input-educationPlace').value = candidate.educationPlace || "";
    document.getElementById('input-major').value = candidate.major || "";
    document.getElementById('input-applicationDate').value = candidate.applicationDate || "";
    document.getElementById('input-candidate-source').value = candidate.candidateSource || "";
    document.getElementById('input-recentWorkplace').value = candidate.recentWorkplace || "";
    document.getElementById('input-recruiter').value = candidate.recruiter || "";   
    document.getElementById('input-collaborator').value = candidate.collaborator || "";
    // đổi title của form về "Sửa ứng viên"
    document.querySelector(".form__header__title").textContent = "Chỉnh sửa thông tin ứng viên";

    // Mở modal
    document.getElementById("form__add").classList.add("display-block");
}

// hàm lấy id đang sửa
function getEditingId() {
    return _editingId;
}