const vocabContainer = document.querySelector(".vocab-cards")

vocab.forEach(({term, link, definition, image}) => {
  let cardText = `<h2>${term} <a href="${link}" class="mask external-open" aria-label="Learn more about ${term}" target="_blank"><div></div></a></h2>` + `<p>${definition}</p>`
  cardText = `<div class="vocab-content-container">` + cardText + "</div>"
  let imageText = "";
  if (image) {
    imageText = `<img class="vocab-img" src="${image}">`
    imageText += `<img class="magnify" src="/icons/magnify.svg">`;
    imageText =  `<div class="vocab-img-container" tabindex="0">${imageText}</div>`
  }
  let out = cardText + imageText;
  out = `<div class="vocab-card content-block">${out}</div>`
  vocabContainer.insertAdjacentHTML("beforeend", out)
})

const vocabCardImages = document.querySelectorAll(".vocab-img-container");

vocabCardImages.forEach(container => {
  const img = container.querySelector("img");
  container.addEventListener("click", e => {
    imgEnlarged.src = "";
    imgEnlarged.src = img.src;
  })
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      container.focus()
      imgEnlarged.src = "";
      imgEnlarged.src = img.src;
    }
  })
})

const flashcardBlock = document.querySelector(".flashcard-block")
const flashcardContainer = flashcardBlock.querySelector(".flashcard")
const flashcardTitle = flashcardContainer.querySelector(".flashcard-front h2")
const flashcardText = flashcardContainer.querySelector(".flashcard-back p")
const flashcardImage = flashcardContainer.querySelector(".flashcard-back img")

const flashcardControls = flashcardBlock.querySelector(".flashcard-controls")
const flashcardShuffle = flashcardControls.querySelector(".shuffle")
const flashcardSwap = flashcardControls.querySelector(".swap")
const flashcardPrev = flashcardControls.querySelector(".prev")
const flashcardNext = flashcardControls.querySelector(".next")
const flashcardMaximize = flashcardControls.querySelector(".fullscreen")
const flashcardProgress = flashcardControls.querySelector(".progress")

let flashcardCurrentIdx = 0;
let flashcardPrevIdx = 0;
let flashcardSideDefault = true;

let shuffledVocab = [...vocab];
let shuffled = false;

const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

setFlashcardIdx(0, false)
flashcardPrev.disabled = true;
if (vocab.length <= 1) flashcardNext.disabled = true;

function loadCard({term, link, definition, image}, animate) {
  let anim;
  const curOpacity = flashcardContainer.style.opacity || 1;
  const duration = 200 * animate;
  if (flashcardPrevIdx >= flashcardCurrentIdx) {
    anim = flashcardContainer.animate([
      {transform: "", opacity: curOpacity},
      {transform: "rotateY(-5deg) translateX(7px) translateZ(-20px)", opacity: 0}
    ], { duration: duration, easing: easing })
  } else {
    anim = flashcardContainer.animate([
      {transform: "", opacity: curOpacity},
      {transform: "rotateY(5deg) translateX(-7px) translateZ(-20px)", opacity: 0}
    ], { duration: duration, easing: easing })
  }
  flashcardContainer.style.opacity = ""
  

  anim.finished.then(() => {
    flashcardContainer.style.translate = ""
    flashcardProgress.textContent = (flashcardCurrentIdx + 1) + " / " + vocab.length;

    flashcardTitle.textContent = term;
    flashcardText.textContent = definition;
    if (image) flashcardImage.src = image;
    flashcardImage.hidden = !image;


    flashcardContainer.classList.add("no-transition")
    if (flashcardSideDefault) {
      flashcardContainer.classList.add("front")
    } else {
      flashcardContainer.classList.remove("front")
    }
    flashcardContainer.getBoundingClientRect()
    flashcardContainer.classList.remove("no-transition")

    if (!animate) return;
    if (flashcardPrevIdx >= flashcardCurrentIdx) {
      flashcardContainer.animate([
        {transform: "rotateY(10deg) translateX(-15px) translateZ(-40px)", opacity: 0},
        {transform: ""}
      ], { duration: 400, easing: easing })
    } else {
      flashcardContainer.animate([
        {transform: "rotateY(-10deg) translateX(15px) translateZ(-40px)", opacity: 0},
        {transform: ""}
      ], { duration: 400, easing: easing })
    }
  })
}

let mouseX;
let mousingFlashcard = false;
let flipFlashcard = true;
flashcardContainer.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  mouseX = e.clientX;
  mousingFlashcard = true;
  flashcardContainer.style.transition = "";
})
document.addEventListener("pointermove", (e) => {
  if (mousingFlashcard) {
    const screenWidth = window.screen.width;
    const displacement = e.clientX - mouseX;
    const offset = Math.sqrt(Math.abs(displacement)) * Math.sign(displacement);
    let opacity = Math.max(1 - Math.abs(displacement)*2.5 / screenWidth, 0.1)
    if (displacement < 0 && flashcardCurrentIdx === vocab.length - 1) opacity = 1; 
    if (displacement > 0 && flashcardCurrentIdx === 0) opacity = 1; 
    flashcardContainer.style.translate = offset + "px";
    flashcardContainer.style.opacity = opacity;
    if (Math.abs(displacement) > screenWidth / 50) flipFlashcard = false;
  }
})
document.addEventListener("pointerup", (e) => {
  if (mousingFlashcard) {
    mousingFlashcard = false;

    const dist = e.clientX - mouseX
    const screenWidth = window.screen.width;
    if (Math.abs(dist) > screenWidth / 15) {
      if (dist > 0) setFlashcardIdx(flashcardCurrentIdx - 1)
      if (dist < 0) setFlashcardIdx(flashcardCurrentIdx + 1)
    } else {
      flashcardContainer.style.opacity = ""
      flashcardContainer.style.translate = "";
      flashcardContainer.style.transition = "all 0.2s ease-in-out"
    }
    
    if (flipFlashcard) flashcardContainer.classList.toggle("front")
    else flipFlashcard = true;
  }
})
document.addEventListener("pointercancel", () => {
  if (mousingFlashcard) {
    mousingFlashcard = false;
    flipFlashcard = true;
    flashcardContainer.style.opacity = ""
    flashcardContainer.style.translate = "";
    flashcardContainer.style.transition = "all 0.2s ease-in-out"
  }
})


flashcardContainer.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flashcardContainer.classList.toggle("front")
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    setFlashcardIdx(flashcardCurrentIdx - 1)
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    setFlashcardIdx(flashcardCurrentIdx + 1)
  } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    flashcardContainer.classList.toggle("front");
  }
})


flashcardShuffle.addEventListener("click", () => {
  shuffled = !shuffled;
  shuffleArray(shuffledVocab);
  setFlashcardIdx(0)
  flashcardShuffle.classList.toggle("active")
})


flashcardSwap.addEventListener("click", () => {
  flashcardSideDefault = !flashcardSideDefault;
  flashcardSwap.classList.toggle("active")
  flashcardContainer.classList.toggle("front")
})


flashcardPrev.addEventListener("click", () => {
  setFlashcardIdx(flashcardCurrentIdx - 1)
})


flashcardNext.addEventListener("click", () => {
  setFlashcardIdx(flashcardCurrentIdx + 1)
})

flashcardMaximize.addEventListener("click", () => {
  requestAnimationFrame(() => {
    flashcardMaximize.classList.toggle("active");
    toggleFullscreen(flashcardBlock, flashcardMaximize)
  })
})

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function setFlashcardIdx(idx, animate = true) {
  if (idx < 0) {
    flashcardContainer.style.opacity = ""
    flashcardContainer.style.translate = "";
    flashcardContainer.style.transition = "all 0.2s ease-in-out"
    return;
  }
  if (idx >= vocab.length) {
    flashcardContainer.style.opacity = ""
    flashcardContainer.style.translate = "";
    flashcardContainer.style.transition = "all 0.2s ease-in-out"
    return;
  }

  flashcardPrevIdx = flashcardCurrentIdx;
  flashcardCurrentIdx = idx;

  flashcardPrev.disabled = idx === 0;
  flashcardNext.disabled = idx === vocab.length - 1;

  if (shuffled) loadCard(shuffledVocab[flashcardCurrentIdx], animate)
  else loadCard(vocab[flashcardCurrentIdx], animate)
}