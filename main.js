const root = document.documentElement;
const coinContainer = document.querySelector(".coin-container");
const coinFront = document.querySelector(".coin-front");
const coinFrontContent = coinFront.innerHTML;
const coinBack = document.querySelector(".coin-back");
const coinBackContent = coinBack.innerHTML;
const latestFlips = document.querySelector(".latest-flips");
const statsTotalCoinFront = document.querySelector(".stats-total-coin-front");
const statsTotalNumberFront = document.querySelector("#stats-total-number-front");
const statsTotalPercentageFront = document.querySelector("#stats-total-percentage-front");
const statsTotalCoinBack = document.querySelector(".stats-total-coin-back");
const statsTotalNumberBack = document.querySelector("#stats-total-number-back");
const statsTotalPercentageBack = document.querySelector("#stats-total-percentage-back");

const coinFrontBgColor = getComputedStyle(root).getPropertyValue("--coin-front-bg-color");
const coinBackBgColor = getComputedStyle(root).getPropertyValue("--coin-back-bg-color");
const flipDuration = +getComputedStyle(root).getPropertyValue("--flip-duration").slice(0, -1) * 1000; // in ms (milliseconds)
const latestFlipsAnimationDuration = +getComputedStyle(root).getPropertyValue("--latest-flips-animation-duration").slice(0, -1) * 1000; // in ms (milliseconds)
const latestFlipsNum = +getComputedStyle(root).getPropertyValue("--latest-flips-num");

coinContainer.addEventListener("click", function() {

  coinContainer.style.pointerEvents = "none"; // Temporarily disable pointer events

  // Generate Result and Flip Coin
  const currentFlipDeg = +getComputedStyle(root).getPropertyValue("--flip-deg").slice(0, -3);
  const flipResult = getRandomInt(2);
  const newFlipDeg = `${((currentFlipDeg/180)%2===0 ? currentFlipDeg : currentFlipDeg + 180) + flipResult*180 + (getRandomInt(2)+4)*360}deg`;
  root.style.setProperty("--flip-deg", newFlipDeg);

  // After Coin Flip animation ends, update stats and re-enable pointer events
  setTimeout(() => {
    addLatestFlip(flipResult); // Create and Add the new Flip Result (in Latest Flips)
    updateStats(flipResult);
    coinContainer.style.pointerEvents = "auto"; // Re-enable pointer events
  }, flipDuration);

});

function addLatestFlip(flipResult) {
  latestFlips.insertAdjacentHTML(
    "beforeend",
    `<div class="latest-flip-container">
      <div class="latest-flip ${flipResult===0 ? "latest-flip-front" : "latest-flip-back"}">${flipResult===0 ? coinFrontContent : coinBackContent}</div>
    </div>`
  );

  const latestFlipsTransformationsArray = getComputedStyle(latestFlips).getPropertyValue('transform').match(/(-?[0-9\.]+)/g);
  let latestFlipsTranslateX = +latestFlipsTransformationsArray[latestFlipsTransformationsArray.length-2];
  const rootFontSize = +getComputedStyle(root).fontSize.slice(0, -2);
  const latestFlipContainerDim = +getComputedStyle(root).getPropertyValue("--latest-flip-container-dim").slice(0, -3);
  latestFlipsTranslateX -= rootFontSize * latestFlipContainerDim;

  latestFlips.style.transform = `translateX(${latestFlipsTranslateX}px)`;
  latestFlips.lastElementChild.style.opacity = 1; // fade-in the newly created element
  if(latestFlips.children.length > latestFlipsNum) { // in this case fade-out the oldest currently displayed element and then remove it
    // latestFlips.children[latestFlips.children.length - latestFlipsNum - 1].style.opacity = 0;
    latestFlips.firstElementChild.style.opacity = 0;
    setTimeout(() => {
      latestFlips.firstElementChild.remove();
      latestFlips.style.transitionDuration = "0s";
      latestFlips.style.transform = "translateX(0px)";
      setTimeout(() => {
        latestFlips.style.transitionDuration = `${latestFlipsAnimationDuration}ms`;
      }, 20);
    }, latestFlipsAnimationDuration);
  }
}

function updateStats(flipResult) {
  let totalNumberFront = +statsTotalNumberFront.textContent;
  let totalNumberBack = +statsTotalNumberBack.textContent;

  flipResult===0 ? totalNumberFront++ : totalNumberBack++;

  const totalPercentageFront = Math.round((totalNumberFront / (totalNumberFront + totalNumberBack)) * 100);
  const totalPercentageBack = 100 - totalPercentageFront;

  if(flipResult===0) {
    statsTotalNumberFront.textContent = totalNumberFront;
    statsTotalCoinFront.classList.add("active");
    setTimeout(() => {
      statsTotalCoinFront.classList.remove("active");
    }, latestFlipsAnimationDuration);
  }
  else {
    statsTotalNumberBack.textContent = totalNumberBack;
    statsTotalCoinBack.classList.add("active");
    setTimeout(() => {
      statsTotalCoinBack.classList.remove("active");
    }, latestFlipsAnimationDuration);
  }

  statsTotalPercentageFront.textContent = totalPercentageFront;
  statsTotalPercentageBack.textContent = totalPercentageBack;
}

// Auxilliary Functions

function getRandomInt(max) { // Returns a random Integer in the range 0,...,max-1
  return Math.floor(Math.random()*max);
}