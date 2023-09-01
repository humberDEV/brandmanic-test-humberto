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

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchInflucard();
  fillCard(data);

  const profileImages = document.querySelectorAll(".container");

  profileImages.forEach((image) => {
    image.addEventListener("click", async () => {
      Swal.fire({
        timer: 2000,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        const profileViewContainer = document.createElement("div");
        profileViewContainer.classList.add("profile-view-enter");

        fetch("profile-view.html")
          .then((response) => response.text())
          .then((html) => {
            profileViewContainer.innerHTML = html;
            document.body.appendChild(profileViewContainer);
            setTimeout(() => {
              profileViewContainer.classList.add("active");
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

  const profileImage = document.getElementById("profile_image");
  const rrssIcon = document.getElementById("rrss_icon");
  const usernameElement = document.getElementById("username");
  const genderAge = document.getElementById("gender_age");
  const locationDescription = document.getElementById("location_description");
  const interestsElement = document.getElementById("interests");
  const profileName = document.getElementById("profile_name");
  const audienceStat = document.getElementById("audience_stat");
  const fakesStat = document.getElementById("fakes_stat");
  const mediaEngStat = document.getElementById("media_eng_stat");
  const engRateStat = document.getElementById("eng_rate_stat");
  const impressionsStat = document.getElementById("impressions_stat");

  setClass(rrssIcon, rrss_icon);
  setImage(profileImage, account_picture);
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
