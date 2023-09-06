const fetchInflucard = async () => {
  try {
    const response = await fetch(
      "https://prueba-brandmanic-humberto.netlify.app/data.json"
    );

    if (!response.ok) throw new Error("Error fetching data.");

    let data = await response.json();

    console.log(data.influcard);
    return data.influcard;
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  Swal.fire({
    timer: 2000,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await fetchInflucard();
    fillCard(data);

    const numberOfExtraCards = 12;

    const cardContainer = document.getElementById("card-container");

    for (let i = 0; i < numberOfExtraCards; i++) {
      const cardClone = document.querySelector(".card").cloneNode(true);
      cardContainer.appendChild(cardClone);
    }

    setTimeout(() => {
      Swal.close();
    }, 300);
  } catch {}
  const profileImages = document.querySelectorAll(".container");

  profileImages.forEach((image) => {
    image.addEventListener("click", async () => {
      Swal.fire({
        timer: 2000,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        fetch("profile-view.html")
          .then((response) => response.text())
          .then((html) => {
            Swal.close();
            setTimeout(() => {
              window.location.href = "profile-view.html";
            }, 100);
          });
      });
    });
  });
});

function fillCard(data) {
  const {
    rrss_icon,
    account_picture,
    username,
    gender,
    age,
    country,
    interests,
    name,
    followers_formated,
    fake_followers_formated,
    avg_engagement_formated,
    er_audiencia,
    avg_impressions_formated,
  } = data;

  const getElement = (id) => document.getElementById(id);

  const profileImage = getElement("profile_image");
  const rrssIcon = getElement("rrss_icon");
  const usernameElement = getElement("username");
  const genderAge = getElement("gender_age");
  const locationDescription = getElement("location_description");
  const interestsElement = getElement("interests");
  const profileName = getElement("profile_name");
  const audienceStat = getElement("audience_stat");
  const fakesStat = getElement("fakes_stat");
  const mediaEngStat = getElement("media_eng_stat");
  const engRateStat = getElement("eng_rate_stat");
  const impressionsStat = getElement("impressions_stat");
  const flagIcon = getElement("flag-icon");

  setClass(rrssIcon, rrss_icon);
  setImage(profileImage, account_picture);
  setFlag(flagIcon, country);
  setText(usernameElement, username);
  setGenderAge(genderAge, gender, age);
  setLocation(locationDescription, country);
  setInterests(interestsElement, interests);
  setName(profileName, name);
  setText(audienceStat, followers_formated);
  setFakeStat(fakesStat, fake_followers_formated);
  setText(mediaEngStat, avg_engagement_formated);
  setEngRate(engRateStat, er_audiencia);
  setText(impressionsStat, avg_impressions_formated);
}

function setClass(element, className) {
  element.className = className;
}

function setImage(imageElement, src) {
  imageElement.src = src;
  imageElement.alt = "Foto de perfil";
}

function setFlag(flagElement, country) {
  flagElement.src = `assets/flags/4x3/${country}.svg`;
}

function setText(element, text) {
  element.textContent = text;
}

function setGenderAge(element, gender, age) {
  const genderText = gender === "1" ? "Mujer" : "Hombre";
  element.textContent = `${genderText}, ${age} años`;
}

function setLocation(element, country) {
  const countryText = country === "ES" ? "España" : "";
  element.append(countryText);
}

function setInterests(element, interests) {
  element.textContent = interests.split(",").slice(0, 2).join(", ") + ", ...";
}

function setName(element, name) {
  element.textContent = name.charAt(0).toUpperCase() + name.slice(1);
}

function setFakeStat(element, fakeFollowers) {
  element.textContent = `${fakeFollowers} %`;
}

function setEngRate(element, erAudiencia) {
  element.textContent = `${erAudiencia} %`;
}
