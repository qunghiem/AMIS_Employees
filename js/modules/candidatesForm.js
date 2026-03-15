// xử lí logic cho form thêm/ sửa ứng viên

// xử lý riêng cho Avatar ứng viên
let _currentAvatar = null;

function initAvatarUpload() {
  const wrapper = document.getElementById("avatar-upload-wrapper");
  const input = document.getElementById("avatar-upload-input");
  const removeBtn = document.getElementById("avatar-remove-btn");
  if (!wrapper || !input) return;

  wrapper.addEventListener("click", (e) => {
    // kiểm tra nếu click button xóa thì bỏ qua
    if (e.target === removeBtn || removeBtn.contains(e.target)) return;
    input.click();
  });

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // kiểm tra file có bắt đầu = "image/" không
    if (!file.type.startsWith("image/")) {
      alert("Chỉ chấp nhận file ảnh!");
      input.value = "";
      return;
    }

    // kiểm tra kích thước ảnh
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 5MB!");
      input.value = "";
      return;
    }

    // đọc file 
    const reader = new FileReader();
    reader.onload = (ev) => {
      console.log(ev);
      _currentAvatar = ev.target.result;
      setAvatarPreview(_currentAvatar);
    };  
    // chuyển file sang dạng string 
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearAvatar();
  });
}

function setAvatarPreview(src) {
  const imgBox = document.getElementById("avatar-preview-box");
  const removeBtn = document.getElementById("avatar-remove-btn");
  imgBox.innerHTML = src
    ? `<img src="${src}" alt="Avatar">`
    : `<span style="font-size:12px;color:#9ca3af;">Ảnh</span>`;
  if (removeBtn) removeBtn.classList.toggle("visible", !!src);
}

function clearAvatar() {
  _currentAvatar = null;
  setAvatarPreview(null);
  const input = document.getElementById("avatar-upload-input");
  if (input) input.value = "";
}

function getCurrentAvatar() {
  return _currentAvatar;
}
function setCurrentAvatar(src) {
  _currentAvatar = src || null;
  setAvatarPreview(src || null);
}
//kết thúc xử lí cho AVATAR

let _editingId = null;

// Đọc giá trị từ form
function getFormValues() {
  return {
    fullName: document.getElementById("input-fullName").value.trim(),
    phoneNumber: document.getElementById("input-phone").value.trim(),
    email: document.getElementById("input-email").value.trim(),
    country: document.getElementById("input-country").value.trim(),
    dob: document.getElementById("input-dob").value,
    gender: document.getElementById("input-gender").value,
    area: document.getElementById("input-area").value.trim(),
    province: document.getElementById("input-province").value,
    ward: document.getElementById("input-ward").value,
    address: document.getElementById("input-address").value.trim(),
    educationLevel: document
      .getElementById("input-educationLevel")
      .value.trim(),
    educationPlace: document
      .getElementById("input-educationPlace")
      .value.trim(),
    major: document.getElementById("input-major").value.trim(),
    applicationDate: document.getElementById("input-applicationDate").value,
    candidateSource: document.getElementById("input-candidate-source").value,
    recentWorkplace: document
      .getElementById("input-recentWorkplace")
      .value.trim(),
    recruiter: document.getElementById("input-recruiter").value,
    collaborator: document.getElementById("input-collaborator").value,
    avatar: getCurrentAvatar(),
  };
}

// Validat
function validateForm(candidate) {
  if (!candidate.fullName) {
    alert("Vui lòng nhập họ và tên!");
    return false;
  }
  if (!candidate.phoneNumber) {
    alert("Vui lòng nhập số điện thoại!");
    return false;
  }
  if (!candidate.email) {
    alert("Vui lòng nhập email!");
    return false;
  }
  return true;
}

//Reset form và state
function resetForm() {
  document
    .getElementById("form__add")
    .querySelectorAll("input, select")
    .forEach((el) => (el.value = ""));

  _editingId = null;
  clearAvatar();
  document.querySelector(".form__header__title").textContent = "Thêm ứng viên";
}

//Fill form khi sửa
function fillFormForEdit(candidate) {
  document.getElementById("input-fullName").value = candidate.fullName || "";
  document.getElementById("input-phone").value = candidate.phoneNumber || "";
  document.getElementById("input-email").value = candidate.email || "";
  document.getElementById("input-country").value = candidate.country || "";
  document.getElementById("input-dob").value = candidate.dob || "";
  document.getElementById("input-gender").value = candidate.gender || "";
  document.getElementById("input-area").value = candidate.area || "";
  document.getElementById("input-province").value = candidate.province || "";
  document.getElementById("input-ward").value = candidate.ward || "";
  document.getElementById("input-address").value = candidate.address || "";
  document.getElementById("input-educationLevel").value =
    candidate.educationLevel || "";
  document.getElementById("input-educationPlace").value =
    candidate.educationPlace || "";
  document.getElementById("input-major").value = candidate.major || "";
  document.getElementById("input-applicationDate").value =
    candidate.applicationDate || "";
  document.getElementById("input-candidate-source").value =
    candidate.candidateSource || "";
  document.getElementById("input-recentWorkplace").value =
    candidate.recentWorkplace || "";
  document.getElementById("input-recruiter").value = candidate.recruiter || "";
  document.getElementById("input-collaborator").value =
    candidate.collaborator || "";

  setCurrentAvatar(candidate.avatar || null);
}

//Getter / Setter cho editingId
function getEditingId() {
  return _editingId;
}

function setEditingId(id) {
  _editingId = id;
}
