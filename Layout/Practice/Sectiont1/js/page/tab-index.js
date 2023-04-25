// JavaScript
const firstElement = document.querySelector(".firstElement");
const lastTabIndex = 21; // Giá trị tabIndex cuối cùng

firstElement.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && event.shiftKey) {
    // Kiểm tra nếu phím Tab được nhấn cùng với phím Shift
    event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Tab
    document.querySelector(`[tabindex="${lastTabIndex}"]`).focus(); // Đặt trỏ chuột vào phần tử có tabIndex cuối cùng
  }
});

document
  .querySelector(`[tabindex="${lastTabIndex}"]`)
  .addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      // Kiểm tra nếu phím Tab được nhấn
      event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Tab
      firstElement.focus(); // Đặt trỏ chuột vào phần tử có tabIndex ban đầu
    }
  });
