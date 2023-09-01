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

const fillCharts = (data) => {
  const profileImage = document.getElementById("profile_image");
  profileImage.src = data.account_picture;
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchInflucard();
  fillCharts(data);

  const exitButton = document.getElementById("exit-button");
  exitButton.addEventListener("click", () => {});
});
