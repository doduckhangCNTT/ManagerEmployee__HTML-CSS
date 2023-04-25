/**
 * Params:
 *  + options: Các thuộc tính cần thiết trên form, có rules trên input
 * Des: Hàm khởi tạo validator
 * Author: DDKhang
 * CreateAt: 19/4/2023
 * ModifierAt: 19/4/2023
 */
function Validator(options) {
  // 1. Tham chiếu đến form cần xử lí
  let formElement = document.querySelector(options.form);
  let btnSaveAndAdd = document.querySelector("#btnSaveAndAdd");

  /**
   * Params:
   * Des: Xử lí việc bấm vào button `Cất && Add`
   * Author: DDKhang
   * CreateAt: 19/4/2023
   * ModifierAt: 19/4/2023
   */
  btnSaveAndAdd.addEventListener("click", function () {
    let isValid = false;
    options.rules.forEach(function (rule) {
      let inputElement = formElement.querySelector(rule.selector);
      isValid = validate(inputElement, rule);
    });
    // Khi không có lỗi nào trên form
    if (isValid) {
      // Submit với function onSubmit
      if (typeof options.onSubmit === "function") {
        // Tham chiếu đến "tất cả" các thẻ input có thuộc tính "name"
        let enableInputs = formElement.querySelectorAll("[name]");
        let formValues = Array.from(enableInputs).reduce(function (
          values,
          input
        ) {
          switch (input.type) {
            case "radio":
              values[input.name] =
                formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                )?.value || "";
              break;
            case "checkbox":
              if (!input.matches(":checked")) return values;
              if (!Array.isArray(values[input.name])) {
                values[input.name] = [];
              }
              values[input.name].push(input.value);
              break;
            default:
              values[input.name] = input.value;
          }
          return values;
        },
        {});
        options.onSubmit(formValues);

        // Làm trắng tất các các ô input
        Array.from(enableInputs).forEach((input) => {
          input.value = "";
        });
      } else {
      }
    }
  });

  /**
   * Params:
   *  + element: Phần tử con
   *  + selector: id/class/attr của thẻ cha
   * Des: Xử lí việc truy xuất thẻ cha từ vị trí của thẻ con
   * Author: DDKhang
   * CreateAt: 19/4/2023
   * ModifierAt: 19/4/2023
   */
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  // Lưu giữ các input mà có nhiều valid
  let selectorInputs = {};

  if (formElement) {
    // 2. Thực hiện bắt sự kiện trên mỗi thẻ input
    options.rules.forEach((rule) => {
      // Tham chiếu đến thẻ input hiện tại
      let inputElementNow = formElement.querySelector(rule.selector);

      // Xử lí sự kiện hover chuột vào input tương ứng và hiển thị lỗi
      inputElementNow.addEventListener("mouseover", function (event) {
        console.log("Có Invalid");
        let eleParentInput = getParent(
          inputElementNow,
          options.formGroupSelector
        );
        if (eleParentInput.classList.contains("invalid")) {
          // Hiển thị lỗi
          eleParentInput.querySelector(options.errorSelector).style.display =
            "block";
        } else {
          console.log("Không có Invalid");
        }
      });
      // Xử lí sự kiện di chuột ra ngoài thẻ input tương ứng
      inputElementNow.addEventListener("mouseout", function (event) {
        let eleParentInput = getParent(
          inputElementNow,
          options.formGroupSelector
        );
        // Không hiển thị lỗi
        eleParentInput.querySelector(options.errorSelector).style.display =
          "none";
      });

      let inputElements = formElement.querySelectorAll(rule.selector);
      // Tham chiếu đến thẻ cha của input hiện tại
      let formGroup = inputElementNow.parentElement;
      // Tham chiếu đến thể chứa msg lỗi
      let showErrorElement = getParent(
        inputElementNow,
        options.formGroupSelector
      ).querySelector(options.errorSelector);

      // Thêm các roles vào tương ứng với key (id của thẻ input) vào cùng 1 mảng
      if (Array.isArray(selectorInputs[rule.selector])) {
        selectorInputs[rule.selector].push(rule);
      } else {
        selectorInputs[rule.selector] = [rule];
      }

      // Do khi xử lí với thẻ radio/checkbox thì các thẻ input sẽ giống nhau
      // lên phải thực hiện qua từng cái để bắt sự kiện
      Array.from(inputElements).forEach(function (inputElement) {
        if (inputElement) {
          // Xử lí blur ra ngoài thẻ input
          inputElement.onblur = function () {
            // Thực hiện validate input đang focus
            validate(inputElement, rule);
          };
          // Xử lí khi người dùng thay đổi giá trị trên thẻ input -> ko hiển thị lỗi trước đó
          inputElement.oninput = function () {
            showErrorElement.innerText = "";
            formGroup.classList.remove("invalid");
          };
        }
      });
    });
  }

  /**
   * Params:
   *  + `inputElement`: thẻ input hiện tại đang thao tác
   *  + `rule`: yêu cầu xử lí valid
   * Des: Xử lí kiểm tra định dạng dữ liệu trước khi thêm vào db
   * Author: DDKhang
   * CreateAt: 19/4/2023
   * ModifierAt: 19/4/2023
   */
  function validate(inputElement, rule) {
    let formGroup = getParent(inputElement, options.formGroupSelector);
    let showErrorElement = formGroup.querySelector(options.errorSelector);

    // Thực hiện lấy mảng các rule tương ứng với input
    const validRules = selectorInputs[rule.selector];
    let msgError;
    for (let i = 0; i < validRules.length; i++) {
      //
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          msgError = validRules[i].handleValid(
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          msgError = validRules[i].handleValid(inputElement.value);
      }
      if (msgError) break; // nếu có lỗi xảy ra thì dừng tại lỗi đó
    }

    if (msgError) {
      // Hiển thị msg lỗi
      showErrorElement.innerText = msgError;
      // Thêm class invalid -> hiển thị lỗi
      formGroup.classList.add("invalid");
    } else {
      showErrorElement.innerText = "";
      formGroup.classList.remove("invalid");
    }
    return !msgError;
  }
}

/**
 * Params:
 *  + `selector`: id/class/attr của thẻ input muốn xử lí
 *  + `message`: thông báo lỗi khác nếu có
 * Des: Xử lí kiểm tra định dạng dữ liệu có rỗng hay không
 * Author: DDKhang
 * CreateAt: 19/4/2023
 * ModifierAt: 19/4/2023
 */
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    handleValid: function (value) {
      return value ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

/**
 * Params:
 *  + `selector`: id/class/attr của thẻ input muốn xử lí
 *  + `message`: thông báo lỗi khác nếu có
 * Des: Xử lí kiểm tra định dạng dữ liệu có là email hay không
 * Author: DDKhang
 * CreateAt: 19/4/2023
 * ModifierAt: 19/4/2023
 */
Validator.isEmail = function (selector, message) {
  return {
    selector,
    handleValid: function (value) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};

/**
 * Params:
 *  + `selector`: id/class/attr của thẻ input muốn xử lí
 *  + `message`: thông báo lỗi khác nếu có
 * Des: Xử lí kiểm tra định dạng dữ liệu ngày sinh có nhở hơn ngày hiện tại hay không
 * Author: DDKhang
 * CreateAt: 19/4/2023
 * ModifierAt: 19/4/2023
 */
Validator.checkDateOfBirth = function (selector, message) {
  return {
    selector,
    handleValid: function (value) {
      // Chuyen doi date thanh dang so
      const dateNow = new Date();
      const dateOfBirth = new Date(value);
      return dateOfBirth.getTime() < dateNow.getTime()
        ? undefined
        : message || "Ngày sinh nhỏ hơn ngày hiện tại";
    },
  };
};
