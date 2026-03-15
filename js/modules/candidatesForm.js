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

// XỬ LÝ CV
let _currentCV = null;
const CV_ACCEPTED_EXT = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"];
const CV_MAX_SIZE = 15 * 1024 * 1024;

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getCVIcon(type) {
  if (type === "application/pdf") return "fa-file-pdf";
  if (type && type.startsWith("image/")) return "fa-file-image";
  return "fa-file-word";
}

function initCVUpload() {
  const zone = document.getElementById("cv-upload-zone");
  const input = document.getElementById("cv-upload-input");
  if (!zone || !input) return;

  zone.addEventListener("click", () => {
    // kiểm tra xem đã upload CV chưa
    if (!zone.classList.contains("has-cv")) input.click();
  });

  // khi chọn file
  input.addEventListener("change", (e) => {
    if (e.target.files[0]) handleCVFile(e.target.files[0]);
    input.value = "";
  });

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("dragover");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) handleCVFile(e.dataTransfer.files[0]);
  });
  document.getElementById("cv-remove-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    clearCV();
  });
  document
    .getElementById("cv-preview-quick-btn")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (_currentCV) openCVPreviewPanel(_currentCV);
    });
}

// xử lí hiển thị file sau khi chọn
function handleCVFile(file) {
  // lấy đuôi file
  const ext = "." + file.name.split(".").pop().toLowerCase();

  // kiểm tra đuôi file có đúng định dạng cho phép k
  if (!CV_ACCEPTED_EXT.includes(ext)) {
    alert("Chỉ chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png");
    return;
  }

  // kiểm tra size file
  if (file.size > CV_MAX_SIZE) {
    alert("Dung lượng file không được vượt quá 15MB!");
    return;
  }

  // đọc file qua FileReader
  const reader = new FileReader();

  //onload đợi đọc file đọc file xong mới chạy
  reader.onload = (ev) => {
    _currentCV = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      dataUrl: ev.target.result,
    };
    updateCVZoneUI(_currentCV);
    openCVPreviewPanel(_currentCV);
  };
  reader.readAsDataURL(file);
}

// cập nhật giao diện vùng upload CV sau khi upload file 
function updateCVZoneUI(cv) {
  const zone = document.getElementById("cv-upload-zone");
  if (!zone) return;

  // nếu có CV
  if (cv) {
    zone.classList.add("has-cv");
    document.getElementById("cv-uploaded-icon").className =
      `fa-solid ${getCVIcon(cv.type)}`;
    document.getElementById("cv-uploaded-name").textContent = cv.name;
    document.getElementById("cv-uploaded-size").textContent = cv.size;
  } else {
    zone.classList.remove("has-cv");
  }
}

function clearCV() {
  _currentCV = null;
  updateCVZoneUI(null);
  closeCVPreviewPanel();
}

function getCurrentCV() {
  return _currentCV;
}
function setCurrentCV(cv) {
  _currentCV = cv || null;
  updateCVZoneUI(_currentCV);
}

// mở preview CV
function openCVPreviewPanel(cv) {
  const formEl = document.getElementById("form__add");

  // wrapper chứa preview+model
  let wrapper = formEl.querySelector(".form__wrapper");

  // nếu chưa có thì thêm vào
  if (!wrapper) {
    const container = formEl.querySelector(".form__container");
    
    // Bỏ border-radius & shadow của form gốc khi vào wrapper
    container.style.borderRadius = "0";
    wrapper = document.createElement("div");
    wrapper.className = "form__wrapper";
    formEl.appendChild(wrapper);
    wrapper.appendChild(container);
  }

  // xác định loại file
  const isPDF = cv.type === "application/pdf";
  const isImage = cv.type?.startsWith("image/");


  let previewBody = "";
  if (isPDF) {
    previewBody = `
      <div class="cv-loading" id="cv-iframe-loading">
        <div class="spinner"></div>
        <span>Đang tải CV...</span>
      </div>

      <iframe src="${cv.dataUrl}" title="CV"
        onload="document.getElementById('cv-iframe-loading')?.remove()">
      </iframe>`;
  } else if (isImage) {
    previewBody = `<img class="cv-image-preview" src="${cv.dataUrl}" alt="CV">`;
  } else {
    previewBody = `
      <div class="cv-loading">
        <i class="fa-solid fa-file-word" style="font-size:44px;color:#2970f6;margin-bottom:6px;"></i>
        <span>Không thể xem trước file Word</span>
        <span style="font-size:11px;color:#d1d5db;">${cv.name}</span>
      </div>`;
  }

  const iconClass = getCVIcon(cv.type);
  // Tạo panel preview
  const panel = document.createElement("div");
  panel.className = "form__cv-preview-panel";
  // gán nội dung preview
  panel.innerHTML = `
    
    <div class="cv-panel__body">${previewBody}</div>
  `;

  // chèn panel vào wrapper
  wrapper.insertBefore(panel, wrapper.querySelector(".form__container"));

  // Nút "Tải CV khác" → mở lại input file
  document.querySelector("#cv-reupload-btn").addEventListener("click", () => {
    document.getElementById("cv-upload-input").click();
  });
}

function closeCVPreviewPanel() {
  const formEl = document.getElementById("form__add");
  const wrapper = formEl.querySelector(".form__wrapper");
  if (!wrapper) return;
  const container = wrapper.querySelector(".form__container");
  if (container) {
    formEl.appendChild(container);
    wrapper.remove();
  }
}

// kết thúc xử lí upload CV

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
    cv: getCurrentCV(),
  };
}

// Validate form
function validateForm(candidate) {
  let isValid = true;

  const fields = [
    { id: "input-fullName",  value: candidate.fullName,    message: "Vui lòng nhập họ và tên" },
    { id: "input-phone",     value: candidate.phoneNumber, message: "Vui lòng nhập số điện thoại" },
    { id: "input-email",     value: candidate.email,       message: "Vui lòng nhập email" },
    { id: "input-country",   value: candidate.country,     message: "Vui lòng nhập quốc gia" },
    { id: "input-province",  value: candidate.province,    message: "Vui lòng chọn tỉnh / thành phố" },
    { id: "input-dob", value: candidate.dob, message: "Vui lòng nhập ngày sinh" },
  ];

  // Xóa lỗi cũ
  fields.forEach(({ id }) => {
    const el = document.getElementById(id);
    el.classList.remove("is-invalid");
    el.parentElement.querySelector(".field-error")?.remove();
  });

  // Kiểm tra từng field
  fields.forEach(({ id, value, message }) => {
    // kiểm tra giá trị nếu chưa nhập
    if (!value) {
      showError(id, message);
      isValid = false;
      return;
    }

    // Validate email
    if (id === "input-email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError(id, "Email không hợp lệ");
      isValid = false;
    }

    // Validate SĐT (số VN 10 chữ số bắt đầu 0)
    if (id === "input-phone" && !/^0[0-9]{9}$/.test(value)) {
      showError(id, "Số điện thoại không hợp lệ");
      isValid = false;
    }

    // kiểm tra ngày sinh
    if (id === "input-dob" && new Date(value) > new Date()) {
      showError(id, "Ngày sinh không được lớn hơn ngày hiện tại");
      isValid = false;
    }

  });

  // tự động cuộn tới lỗi gặp đầu tiên nếu gặp lỗi
  if (!isValid) {
    document.querySelector("#form__add .is-invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return isValid;
}

function showError(fieldId, message) {
  const el = document.getElementById(fieldId);
  el.classList.add("is-invalid");
  const err = document.createElement("div");
  err.className = "field-error";
  err.textContent = message;
  el.parentElement.appendChild(err);
}
// Kết thúc Validate form

//Reset form và state
function resetForm() {
  document
    .getElementById("form__add")
    .querySelectorAll("input, select")
    .forEach((el) => (el.value = ""));

  _editingId = null;
  clearAvatar();
  clearCV();
  closeCVPreviewPanel();

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

  if (candidate.cv) {
    setCurrentCV(candidate.cv);
    openCVPreviewPanel(candidate.cv);
  } else {
    setCurrentCV(null);
  }
}

//Getter / Setter cho editingId
function getEditingId() {
  return _editingId;
}

function setEditingId(id) {
  _editingId = id;
}
