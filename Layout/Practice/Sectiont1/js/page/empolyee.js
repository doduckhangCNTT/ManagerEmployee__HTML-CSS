let formEmployee = document.querySelector("#form-employee");
let dialog = document.querySelector("#dialog");
let btnCloseDialogs = document.querySelectorAll(".dialog-btn--close");
let btnHamburger = document.querySelector(".header-icon--hamburger");
let body1 = document.body;

// Lấy toàn bộ thẻ tr bên trong tbody

window.onload = async function () {
  await initEvents();
  await fetchApi();

  handleVisitableElement(
    "#table-employee tbody tr",
    ".table-employee__options"
  );

  handleShowContentBtnCustom(
    ".btn-custom-rounded-custom",
    ".table-employee__options-edit",
    ".main__table-info-icon-option-items"
  );
};

// === Function ===

/**
 * Params: null
 * Des: Xử lí các sự kiện khởi đầu
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
async function initEvents() {
  let btnAddEmployee = document.querySelector("#btn-add-employee");
  let btnSaveAddEmployee = document.querySelector("#btnSaveAndAdd");
  let iconClose = document.querySelector(".icon-close");

  try {
    btnHamburger.addEventListener("click", toggleNavbar);
    btnAddEmployee.addEventListener("click", await handleBtnAddEmployee);
    // btnSaveAddEmployee.addEventListener("click", handleBtnSaveAddEmployee);
    // dialog.addEventListener("click");
    /**
     * - Check sự kiện click xem thẻ được nhấn có phải thẻ cha không
     * - Nếu là thẻ cha thì bắt sự kiện (không ảnh hưởng đến thẻ con)
     */
    formEmployee.addEventListener("click", function (event) {
      if (event.target === formEmployee) {
        formEmployee.style.display = "none";
      }
    });
    /**
     * - Xử lí sự kiện đóng trên nhiều form & dialog
     */
    // iconClose.addEventListener("click", function () {
    //   formEmployee.style.display = "none";
    // });
    btnCloseDialogs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tagParent = this.closest(".dialog-close");
        tagParent.style.display = "none";
      });
    });
  } catch (error) {
    alert("Error: " + error);
  }
}

/**
 * Params: null
 * Des: Xử lí các nghiệp vụ khi nhấn `btnAdd`
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
async function handleBtnAddEmployee() {
  let textfieldCodeEmployee = document.getElementById("textfield_codeEmployee");

  // 1. Hiển thị form add Employee
  formEmployee.style.display = "block";
  // 2. Gán mã nhân viên
  textfieldCodeEmployee.value = "NV00";
  // 3. Thực hiện focus
  textfieldCodeEmployee.focus();

  // ============ Thực hiện hiển thị và xử lí trong combobox Unit ============
  // Lấy dữ liệu department từ api
  const departments = await getDataApi(
    "https://cukcuk.manhnv.net/api/v1/Departments"
  );

  // Thực hiện truyền nội dung vào combobox đơn vị
  departments.forEach((dep) => {
    var newLi = document.createElement("li");
    newLi.innerHTML = `
        <li class="option">${dep.DepartmentName}</li>
      `;
    contentUnitCombobox.append(newLi);
  });

  // Tham chiếu lại đến tất cả option
  const listOfOptions1 = document.querySelectorAll(".option");
  // Thực hiện bắt sự kiện trên mỗi option và lấy giá trị đẩy vào input combobox
  // function selectOption trong file combobox.js
  listOfOptions1.forEach((option) => {
    option.addEventListener("click", selectOption);
  });
}

async function getDataApi(url) {
  const response = await fetch(url);
  const jsonData = await response.json();

  return jsonData;
}

/**
 * Params: null
 * Des: Xử lí khi click button `Cất và Thêm`
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
function handleBtnSaveAddEmployee() {
  // 1. Thực hiện validate Dữ liệu
  const errors = validateData();
  // 2. Nếu dữ liệu hợp lệ thì gọi `Api` cất dữ liệu
  if (errors.length > 0) {
    document.querySelector("#dialog").style.display = "block";
  }
  // 3. Nếu không hợp lệ thì thông báo lỗi
}

/**
 * Params: null
 * Des: Xử lí kiểm tra định dạng dữ liệu trước khi thêm vào db
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
function validateData() {
  let textfieldCodeEmployee = document.getElementById("textfield_codeEmployee");
  let textfieldEmployeeName = document.getElementById("textfield_EmployeeName");

  let errors = [];

  // 1.Kiểm tra dữ liệu bắt buộc nhập
  const inputsRequired = document.querySelectorAll("[required]");
  for (const input of inputsRequired) {
    if (input.value.trim() == "") {
      errors.push(input.getAttribute("field-label"));
    }
  }

  // 2.Kiểm tra dữ liệu đúng định dạng (email, password)

  // 3.Kiểm tra độ dài chuỗi

  // 4.Kiểm tra định dạng ngày tháng

  return errors;
}

/**
 * Params: null
 * Des: bật tắt navbar, khi nhấn nút hambeger
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
function toggleNavbar() {
  document.querySelector(".navbar").classList.toggle("hidden");
}

/**
 * Params:
 *  + page: lấy trang hiện tại (mặc định =1)
 *  + limit: giới hạn employee của trang hiện tại
 * Des: Gọi api lấy dữ liệu từ server
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
async function fetchApi(page = 1, limit = 20) {
  const response = await fetch("https://cukcuk.manhnv.net/api/v1/Employees");
  const jsonData = await response.json();

  const rowDataEmployee = document.querySelector("#table-employee tbody");

  jsonData.slice(0, 10).forEach((data) => {
    var newTr = document.createElement("tr");
    const dateOfBirth = convertDate(data.DateOfBirth);

    newTr.innerHTML = `<td class="sticky-column">
                      <input type="checkbox" />
                    </td>
                    <td class="sticky-column">${data.EmployeeCode}</td>
                    <td class="sticky-column">${data.FullName}</td>
                    <td>${data.GenderName}</td>
                    <td class="table-employee-dateOfBirth">${dateOfBirth}</td>
                    <td>123456789</td>
                    <td>${data.PositionName}</td>
                    <td>MISA</td>
                    <td colspan="2" class="table-employee__options visible">
                      <div class="table-employee__options-edit">
                        <button
                          class="btn-custom-rounded btn-custom-rounded-custom"
                        >
                          <!-- <div class="btn-custom-edit"></div> -->
                          <i class="fas fa-pen"></i>
                        </button>
                        <!-- Content Dropdown Icon -->
                        <div class="main__table-info-icon-option-items hidden">
                          <div class="main__table-info-icon-option-item">
                            Nhân bản
                          </div>
                          <div class="main__table-info-icon-option-item">
                            Xóa
                          </div>
                        </div>
                      </div>
                      <button
                        class="btn-custom-rounded btn-custom-rounded-option"
                      >
                        <i class="fas fa-ellipsis-h"></i>
                      </button>
                    </td>`;
    rowDataEmployee.appendChild(newTr);
  });
}

/**
 * Params:
 *  + listElement: Toàn bộ danh sách các thẻ muốn thao tác
 *  + selector: Selector của thẻ con muốn hiển thị
 * Des: Xử lí việc hover hiển thị các button "Sửa & Options"
 * Author: DDKhang
 * CreateAt: 24/4/2023
 * ModifierAt: 24/4/2023
 */
function handleVisitableElement(selectorParent, selectorChild) {
  let trTags = document.querySelectorAll(selectorParent);

  trTags.forEach((tr) => {
    tr.addEventListener("mouseover", function () {
      console.log("Hello");
      // Truy vấn đến thẻ con
      const tagOption = tr.querySelector(selectorChild);
      if (tagOption.classList.contains("visible")) {
        tagOption.classList.remove("visible");
      }
    });
    tr.addEventListener("mouseout", function () {
      // Truy vấn đến thẻ con
      const tagOption = tr.querySelector(selectorChild);
      if (!tagOption.classList.contains("visible")) {
        tagOption.classList.add("visible");
      }
    });
  });
}

/**
 * Params:
 *  + dateTime: Javascript datetime onbject
 * Des: Xử lí việc chuyển đổi datetime -> dd/mm/yyyy
 * Author: DDKhang
 * CreateAt: 24/4/2023
 * ModifierAt: 24/4/2023
 */
function convertDate(dateTime) {
  const date = new Date(dateTime);

  // Get values day, month, year
  const day = date.getDay();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  var formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    year;

  return formattedDate;
}

/**
 * Params:
 *  + selectorBtn: Btn hiện tại
    + selectorParentOfBtn: Thẻ cha của btn đó
    + selectorContentShow: Nội dụng muốn show lên
 * Des: Xử lí việc hiển thị nội dung của btn tùy chỉnh trên mỗi thẻ tr của table
 * Author: DDKhang
 * CreateAt: 24/4/2023
 * ModifierAt: 24/4/2023
 */
function handleShowContentBtnCustom(
  selectorBtn,
  selectorParentOfBtn,
  selectorContentShow
) {
  // Xử lí thực hiện bật tắt content Custom trên từng thẻ tr của table
  const btnRoundedCustoms = document.querySelectorAll(selectorBtn);

  btnRoundedCustoms.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      // Tham chieu ra the cha
      const contentOptionCustom = btn
        .closest(selectorParentOfBtn)
        .querySelector(selectorContentShow);
      contentOptionCustom.classList.toggle("hidden");
    });
  });

  body1.addEventListener("click", function (event) {
    let contentOptionCustoms = document.querySelectorAll(
      ".main__table-info-icon-option-items"
    );

    Array.from(contentOptionCustoms).forEach((c) => {
      if (!c.classList.contains("hidden")) {
        c.classList.add("hidden");
      }
    });
  });
}
