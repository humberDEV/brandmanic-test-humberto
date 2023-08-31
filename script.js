// Load influencers from Json
const fetchInflucard = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5500/src/data.json");

    if (!response.ok) throw new Error("Error fetching data.");

    let data = await response.json();

    console.log(data.influcard);
    return data.influcard;
  } catch (err) {
    console.error(err);
  }
};

// Meter datos de la influcard en la tarjeta
function createCard(data) {
  const cardContainer = document.getElementById("cardContainer");

  const newCard = document.createElement("div");
  newCard.className = "card";

  newCard.innerHTML = `
        <div class="card-left">
          <div class="container">
            <img
              class="profile-image"
              src="${data.account_picture}"
              alt="Foto de perfil"
            />
            <div class="overlay">
              <div class="text">Ver influcard</div>
            </div>
          </div>
          <div class="profile-info">
            <p>
              <i class="${data.rrss_icon} alt="${data.rrss_name}"></i>
              ${data.username}
            </p>
            <p>${data.gender === "1" ? "Mujer" : "Hombre"}, ${data.age} años</p>
            <p>
              <img src="./src/spain_flag.jpg" alt="Bandera" class="flag-icon" />
              España
            </p>
            <p>Fotografía, Veggie</p>
          </div>
        </div>

        <div class="card-right">
          <h1 class="profile-name">${
            data.name.charAt(0).toUpperCase() + data.name.slice(1)
          }</h1>
          <div class="stat">
            <i class="fa-solid fa-people-group"></i>
            <p class="stat-label">
              <p class="stat-text">Audiencia:</p>
              <p class="stat-data">661.01k</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-user-xmark"></i>
            <p class="stat-label">
              <p class="stat-text">Fakes:</p>
              <p class="stat-data">32.57k</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-heart"></i>
            <p class="stat-label">
              <p class="stat-text">Media Eng:</p>
              <p class="stat-data">11.82k</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-heart-pulse"></i>
            <p class="stat-label">
              <p class="stat-text">Eng Rate:</p>
              <p class="stat-data">1.93%</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-eye"></i>
            <p class="stat-label">
              <p class="stat-text">Impresiones:</p>
              <p class="stat-data">272.68k</p>
            </p>
          </div>
        </div>
  `;
  cardContainer.appendChild(newCard);
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchInflucard();
  for (let i = 0; i < 9; i++) {
    createCard(data);
  }
});
