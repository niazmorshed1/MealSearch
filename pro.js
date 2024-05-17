const searchField = document.getElementById("searchField");
const searchBtn = document.getElementById("searchBtn");
const mealsDirectory = document.getElementById("foodDirectory");
const modalToggle = document.getElementById("modalMain");

searchBtn.addEventListener("click", () => {
  const searchValue = searchField.value.trim();
  if (!searchValue) {
    alert("Please insert a letter (A to Z).");
  } else if (searchValue.length > 1) {
    alert("For search, you can't insert more than one letter.");
  } else {
    searchMeals(searchValue);
  }
});

const searchMeals = async (searchVal) => {
  try {
    const fetchMeals = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchVal}`);
    const res = await fetchMeals.json();
    mealsDirectory.innerHTML = "";
    if (res.meals) {
      res.meals.forEach((meal) => {
        const itemCard = document.createElement("div");
        itemCard.classList.add("itemCard");
        itemCard.innerHTML = `
          <div class="innerItem">
            <img class="itemImg" src="${meal.strMealThumb}" alt="">
            <div>
              <h2>${meal.strMeal}</h2>
              <p class="tag">${meal.strTags || "No tags"}</p>
              <p class="details">${meal.strInstructions.slice(0, 50)}...</p>
            </div>
          </div>`;
        itemCard.addEventListener("click", () => modalOpen(meal.idMeal));
        mealsDirectory.appendChild(itemCard);
      });
    } else {
      mealsDirectory.innerHTML = "<p style='text-align:center;font-size:20px;'>Not Found</p>";
    }
  } catch (err) {
    console.log("Error:", err);
  }
};

const modalOpen = async (itemID) => {
  const mainModal = document.getElementById("modalMain");
  mainModal.innerHTML = ""; 
  mainModal.style.display = "block";

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${itemID}`);
    const resdata = await res.json();
    const info = resdata.meals[0];
    
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal");
    modalContent.innerHTML = `
      <div class="img-icon">
        <div class="close-icon">
          <i class="fa-solid fa-circle-xmark" onclick="closeToggle()"></i>
        </div>
        <img src="${info.strMealThumb}" alt="">
      </div>
      <h2>${info.strMeal}</h2>
      <p class="tag">${info.strTags || "No tags"}</p>
      <p class="details">${info.strInstructions}</p>
      <h4>Ingredients</h4>
      <ul>
        ${Object.keys(info)
          .filter(key => key.startsWith("strIngredient") && info[key])
          .map(key => `<li>${info[key]}</li>`).join("")}
      </ul>`;
    mainModal.appendChild(modalContent);
  } catch (err) {
    console.log("Error:", err);
  }
};

const closeToggle = () => {
  modalToggle.style.display = "none";
};
