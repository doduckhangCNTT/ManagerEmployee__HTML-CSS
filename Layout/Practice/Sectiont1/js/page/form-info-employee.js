// // const formInfo = document.querySelector("#form-employee");
// window.onload = async function () {
//   await initEvents();
// };

// async function initEvents() {
//   // const contentUnitCombobox = formInfo.querySelector("#contentUnitCombobox");

//   const departments = await fetchApi(
//     "https://cukcuk.manhnv.net/api/v1/Departments"
//   );

//   console.log("Department: ", departments);
//   departments.forEach((dep) => {
//     var newLi = document.createElement("li");
//     newLi.innerHTML = `
//       <li class="option">${dep.DepartmentName}</li>
//     `;
//     contentUnitCombobox.append(newLi);
//   });
// }

// async function fetchApi(url) {
//   const response = await fetch(url);
//   const jsonData = await response.json();

//   return jsonData;
// }
