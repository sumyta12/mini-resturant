import dataMealinfo from "./ResturantData.js";
import userdata from "./User.js";
let validation = false;

const erroreltext = document.querySelector(".error-el-text");
let MealdataArr = [];
document
  .querySelector(".searchBoxResturentItem form button")
  .addEventListener("click", (e) => {
    e.preventDefault();
    const input = document.querySelector("input[type='search']");
    let data = [];
    for (let mealitem of MealdataArr) {
      if (
        mealitem.strCategory.toLowerCase().includes(input.value.toLowerCase())
      ) {
        data.push(mealitem);
      }
    }
    if (data.length > 0) {
      erroreltext.textContent = ``;
      return render(data);
    } else if (input.value === " ") {
      console.log("click");
      erroreltext.textContent = "Please Write Something on Input Box";
      return (document.getElementById("itemlistResturant").innerHTML = ``);
    }
  });

function dataFeting() {
  dataMealinfo().then((data) => {
    render(data.categories);
    MealdataArr = data.categories;
  });
}
dataFeting();
function render(data) {
  let text = ``;
  if (data.length > 0) {
    for (let mealdata of data) {
      text += `
        <div class="col-4 mt-4">
          <div class="card" style="width: 100%">
          <img src="${
            mealdata.strCategoryThumb
          }" class="card-img-top" alt="...">
          <div class="card-body d-flex flex-column justify-content-end">
            <h5 class="card-title">${mealdata.strCategory}</h5>
            <p class="card-text">${mealdata.strCategoryDescription.slice(
              0,
              70
            )} ......</p>
            <div class="d-flex justify-content-between">
            <a class="btn btn-warning ">Full Recipe</a>
            <a class="btn btn-warning " data-id='${
              mealdata.idCategory
            }'>Add To Cart</a>
            </div>
            </div>
        </div>
        </div>
      `;
    }
  }
  document.getElementById("itemlistResturant").innerHTML = text;
}
let summaryItemArr = [];
const key = [];
let total = 0;
document.addEventListener("click", function (e) {
  if (e.target.id === "formbtnguest") {
    validation = true;
    samefunctionallity();
  }
  if (e.target.dataset.id) {
    const id = e.target.dataset.id;
    MealdataArr.forEach((item) => {
      if (item.idCategory === id) {
        if (!key.includes(id)) {
          item.quantity = 1;
          key.push(id);
          summaryItemArr.push(item);
        } else if (key.includes(id)) {
          summaryItemArr.forEach((item) => {
            if (item.idCategory === id) {
              item.quantity += 1;
            }
          });
        }
      }
    });
    // locastoragework
    localStorage.setItem("summary-food", JSON.stringify(summaryItemArr));
    const item = JSON.parse(localStorage.getItem("summary-food"));
    const foodarr = item ? item : [];
    updateSummary(foodarr);
  } else if (e.target.tagName === "INPUT") {
    const itemres = document.querySelectorAll(".itemres");
    itemres.forEach((item, indexnumber) => {
      if (itemres[indexnumber] === item) {
        document
          .querySelector(`.${item.classList[2]}  input`)
          .addEventListener("change", (e) => {
            let price = parseInt(e.target.value);
            const inputitemp = document.querySelector(
              `.${item.classList[2]}  .quantity${indexnumber}`
            );
            const p = parseInt(inputitemp.textContent);
            const sum = price * p;

            console.log(total, sum);
            document.querySelector(
              `.result-el${indexnumber}`
            ).textContent = `rs : ${sum}`;

            document.querySelector(
              `.total-el`
            ).textContent = `Total : ${(total += sum)}`;
          });
      }
    });
  } else if (e.target.classList[4] === "procced-el") {
    localStorage.clear();
    resultprevview();
  } else if (e.target.classList[3] === "cross") {
    modalfunction();
  }
});

resultprevview();
function resultprevview() {
  let summaryitem = JSON.parse(localStorage.getItem("summary-food"));
  let result = summaryitem ? summaryitem : [];

  if (result.length > 0) {
    updateSummary(result);
  }
  if (result.length === 0) {
    document.querySelector(
      ".card-body.Summary-Output"
    ).innerHTML = `<div class="text-center mt-4 mb-4">
  <h1>🥧</h1>
  <p>Add Something On Your Card</p>
  </div>`;
  }
}
function updateSummary(dataItem) {
  let text = ``;
  dataItem.forEach((item, index) => {
    const { idCategory, strCategory, quantity } = item;
    text += `
   
      <div class='row itemres itemres${index}'>
        <div class="col-3">
        <p>${strCategory}</p>
        </div>
        <div class="col-3">
        <p class='quantity${index}'>${quantity}</p>
        </div>
        
        <div class="col-3">
        <input  class="w-100" type="text" name="price${index}"  placeholder="Price" />
        </div>

        <div class="col-3">
        <span class='result-el${index}'>rs : 1</span>
        </div>
      </div>
     `;
  });

  document.querySelector(".Summary-Output").innerHTML =
    ` <h5 class="card-title">Special Item Foodie ✨</h5>
  ` +
    text +
    `
    <div class="button-top-border">
        <h3 class="d-flex justify-content-end me-3 total-el">Total : 0</h3>
    </div>
    <div >
      <a class="btn d-block m-2 btn-outline-warning procced-el">Proceed To Next</a>
    </div>
  `;
}
// modal
document.querySelector(".clipboard").addEventListener("click", async (e) => {
  const cupone = document.querySelector(".cupone").textContent;
  try {
    await navigator.clipboard.writeText(cupone);
    document.querySelector(
      ".clipboard"
    ).innerHTML = `<i class="fa-solid fa-clipboard-check"></i>`;
  } catch (e) {
    document.querySelector(".clipboard").textContent = e;
  }
});

function modalfunction() {
  document.querySelector(".Modal-el").style.display = "none";
}
setTimeout(() => {
  document.querySelector(".Modal-el").style.display = "block";
}, 5000);

// form-user-details-input
const formuinput = document.querySelector(".form-user-details-input");

formuinput.addEventListener("submit", (e) => {
  e.preventDefault();

  const form = new FormData(formuinput);
  let user = {
    email: form.get("email"),
    password: form.get("password"),
  };
  for (let userinfo of userdata) {
    if (userinfo.email === user.email && userinfo.password === user.password) {
      validation = true;
      samefunctionallity();
    } else {
      document.querySelector(
        ".wrong-user-el"
      ).textContent = `Ohhoh ! you are not user of this site`;
    }
  }
});

function samefunctionallity() {
  document.querySelector(".wrong-user-el").textContent = ``;
  document.querySelector(".form-login-display").style.display = "none";
  document.querySelector(".card-display-list").classList.add("card-show");
}
