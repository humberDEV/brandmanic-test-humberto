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
            <p class="location-description">
              <img src="./src/spain_flag.jpg" alt="Bandera" class="flag-icon" />
              ${data.country === "ES" ? "España" : ""}
            </p>
            <p>${data.interests.split(",").slice(0, 2) + ",..."}</p>
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
              <p class="stat-data">${data.followers_formated}</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-user-xmark"></i>
            <p class="stat-label">
              <p class="stat-text">Fakes:</p>
              <p class="stat-data">${data.fake_followers_formated} K</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-heart"></i>
            <p class="stat-label">
              <p class="stat-text">Media Eng:</p>
              <p class="stat-data">${data.er_audiencia} %</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-heart-pulse"></i>
            <p class="stat-label">
              <p class="stat-text">Eng Rate:</p>
              <p class="stat-data">${data.avg_engagement_formated}</p>
            </p>
          </div>
          <div class="stat">
            <i class="fa-solid fa-eye"></i>
            <p class="stat-label">
              <p class="stat-text">Impresiones:</p>
              <p class="stat-data">${data.avg_impressions_formated}</p>
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

  const profileImages = document.querySelectorAll(".container");

  profileImages.forEach((image) => {
    image.addEventListener("click", async () => {
      Swal.fire({
        timer: 2000,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    });
  });
});
