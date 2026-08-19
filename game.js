/* =================================
   PENNY CURSOR
================================= */

const pennyCursor =
  document.getElementById("penny-cursor");

function movePenny(event) {
  if (!pennyCursor) return;

  pennyCursor.style.left =
    `${event.clientX}px`;

  pennyCursor.style.top =
    `${event.clientY}px`;

  pennyCursor.classList.add("is-visible");
}

document.addEventListener(
  "pointermove",
  movePenny
);

document.addEventListener(
  "pointerdown",
  movePenny
);

document.addEventListener(
  "pointerleave",
  () => {
    pennyCursor?.classList.remove(
      "is-visible"
    );
  }
);


/* =================================
   TICKET FLIP
================================= */

const ticket =
  document.getElementById("ticket");

const frontLogo =
  document.querySelector(
    ".ticket-logo-front"
  );

const backLogo =
  document.querySelector(
    ".ticket-logo-back"
  );

frontLogo?.addEventListener(
  "click",
  () => {
    ticket?.classList.add(
      "is-flipped"
    );
  }
);

backLogo?.addEventListener(
  "click",
  () => {
    ticket?.classList.remove(
      "is-flipped"
    );
  }
);


/* =================================
   SCRATCH ELEMENTS
================================= */

const scratchCanvas =
  document.getElementById(
    "scratch-canvas"
  );

const scratchContext =
  scratchCanvas?.getContext("2d");

const silverLayer =
  document.getElementById(
    "scratch-silver-layer"
  );

const ticketFrontArt =
  document.getElementById(
    "ticket-front-art"
  );

let isScratching = false;
let lastX = null;
let lastY = null;


/* =================================
   SCRATCH ZONES
================================= */

const scratchZones = [

  {
    id: "bonus-1",
    x: 0.1167,
    y: 0.3218,
    width: 0.1458,
    height: 0.0952
  },

  {
    id: "bonus-2",
    x: 0.3312,
    y: 0.3218,
    width: 0.1458,
    height: 0.0952
  },

  {
    id: "bonus-3",
    x: 0.5437,
    y: 0.3218,
    width: 0.1458,
    height: 0.0952
  },

  {
    id: "bonus-4",
    x: 0.7531,
    y: 0.3218,
    width: 0.1458,
    height: 0.0952
  },

  {
    id: "your-numbers",
    x: 0.1458,
    y: 0.5084,
    width: 0.7240,
    height: 0.0611
  },

  {
    id: "winning-numbers",
    x: 0.1479,
    y: 0.5869,
    width: 0.7208,
    height: 0.3958
  }

];


/* =================================
   GAME DATA
================================= */
/* =================================
   GAME DATA
================================= */

let currentGame = null;


/*
  Adjust these whenever you want.
*/

const WIN_CHANCE = 0.15;
const DEBT_CHANCE = 0.50;


const positivePrizes = [
  "$5",
  "$10",
  "$20",
  "$50",
  "$100",
  "$500",
  "$1,000",
  "$10,000"
];


const losingPrizes = [
  "$5",
  "$10",
  "$20",
  "$50",
  "$100",
  "$500",
  "$1,000",
  "$10,000",
  "-$100",
  "-$1,000",
  "-$10,000",
  "ETERNAL DEBT"
];


const debtOutcomes = [
  "-$100",
  "-$1,000",
  "-$10,000",
  "ETERNAL DEBT"
];


const neutralBonuses = [
  "NO BONUS",
  "$0",
  "TRY AGAIN",
  "SORRY"
];


function randomNumber() {

  return (
    Math.floor(
      Math.random() * 50
    ) + 1
  );

}


function randomFrom(array) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}


function uniqueNumbers(count) {

  const numbers =
    new Set();

  while (
    numbers.size < count
  ) {

    numbers.add(
      randomNumber()
    );

  }

  return [...numbers];

}


function uniqueNumbersExcluding(
  count,
  excludedNumbers
) {

  const excluded =
    new Set(excludedNumbers);

  const numbers =
    new Set();


  while (
    numbers.size < count
  ) {

    const number =
      randomNumber();


    if (
      !excluded.has(number)
    ) {

      numbers.add(number);

    }

  }


  return [...numbers];

}


/* =================================
   GENERATE TICKET
================================= */

function generateGame() {

  /*
    Determine ticket type first.
  */

  const roll =
    Math.random();


  let outcome;

  if (
    roll < WIN_CHANCE
  ) {

    outcome = "win";

  } else if (
    roll <
    WIN_CHANCE +
    DEBT_CHANCE
  ) {

    outcome = "debt";

  } else {

    outcome = "loss";

  }


  /*
    Five numbers in top strip.
  */

  const yourNumbers =
    uniqueNumbers(5);


  /*
    Start with 25 numbers that
    absolutely DO NOT match.
  */

  const winningNumbers =
    uniqueNumbersExcluding(
      25,
      yourNumbers
    );


  /*
    Every grid number gets a prize
    printed underneath it.

    Most don't matter because
    they don't match.
  */

  const gridPrizes =
    winningNumbers.map(
      () =>
        randomFrom(
          losingPrizes
        )
    );


  let matchedNumber = null;
  let winningPrize = null;


  /*
    For winning tickets, deliberately
    inject exactly one match.
  */

  if (
    outcome === "win"
  ) {

    matchedNumber =
      randomFrom(
        yourNumbers
      );


    const winningIndex =
      Math.floor(
        Math.random() *
        winningNumbers.length
      );


    winningNumbers[
      winningIndex
    ] =
      matchedNumber;


    winningPrize =
      randomFrom(
        positivePrizes
      );


    gridPrizes[
      winningIndex
    ] =
      winningPrize;

  }


  /*
    Bonus section.
  */

  const bonuses = [
    randomFrom(neutralBonuses),
    randomFrom(neutralBonuses),
    randomFrom(neutralBonuses),
    randomFrom(neutralBonuses)
  ];


  let debtResult = null;


  /*
    Debt ticket gets one especially
    unfortunate bonus.
  */

  if (
    outcome === "debt"
  ) {

    debtResult =
      randomFrom(
        debtOutcomes
      );


    const debtIndex =
      Math.floor(
        Math.random() * 4
      );


    bonuses[
      debtIndex
    ] =
      debtResult;

  }


  currentGame = {

    outcome,

    yourNumbers,

    winningNumbers,

    gridPrizes,

    bonuses,

    matchedNumber,

    winningPrize,

    debtResult

  };

}






/* =================================
   SCRATCH COMPLETION
================================= */

const REQUIRED_SCRATCH_PERCENT =
  0.50;

const checkTicketButton =
  document.getElementById(
    "check-ticket-button"
  );


function getZoneScratchPercent(zone) {

  if (
    !scratchCanvas ||
    !scratchContext
  ) {
    return 0;
  }


  /*
    Ignore a small margin around the
    outside of each zone so messy,
    realistic edges don't count
    against the player.
  */

  const marginX =
    zone.width * 0.06;

  const marginY =
    zone.height * 0.06;


  const x =
    Math.floor(
      scratchCanvas.width *
      (zone.x + marginX)
    );

  const y =
    Math.floor(
      scratchCanvas.height *
      (zone.y + marginY)
    );


  const width =
    Math.max(
      1,
      Math.floor(
        scratchCanvas.width *
        (
          zone.width -
          marginX * 2
        )
      )
    );


  const height =
    Math.max(
      1,
      Math.floor(
        scratchCanvas.height *
        (
          zone.height -
          marginY * 2
        )
      )
    );


  const imageData =
    scratchContext.getImageData(
      x,
      y,
      width,
      height
    );


  const pixels =
    imageData.data;


  let transparentPixels = 0;
  let totalPixels = 0;


  /*
    Every fourth value is alpha.

    alpha 0   = erased
    alpha 255 = opaque
  */

  for (
    let i = 3;
    i < pixels.length;
    i += 4
  ) {

    totalPixels++;

    if (pixels[i] < 40) {
      transparentPixels++;
    }

  }


  if (totalPixels === 0) {
    return 0;
  }


  return (
    transparentPixels /
    totalPixels
  );

}


function checkScratchCompletion() {

  let scratchedPixels = 0;
  let totalPixels = 0;


  scratchZones.forEach((zone) => {

    const marginX =
      zone.width * 0.06;

    const marginY =
      zone.height * 0.06;


    const x =
      Math.floor(
        scratchCanvas.width *
        (zone.x + marginX)
      );

    const y =
      Math.floor(
        scratchCanvas.height *
        (zone.y + marginY)
      );


    const width =
      Math.max(
        1,
        Math.floor(
          scratchCanvas.width *
          (
            zone.width -
            marginX * 2
          )
        )
      );


    const height =
      Math.max(
        1,
        Math.floor(
          scratchCanvas.height *
          (
            zone.height -
            marginY * 2
          )
        )
      );


    const imageData =
      scratchContext.getImageData(
        x,
        y,
        width,
        height
      );


    const pixels =
      imageData.data;


    for (
      let i = 3;
      i < pixels.length;
      i += 4
    ) {

      totalPixels++;

      if (pixels[i] < 40) {
        scratchedPixels++;
      }

    }

  });


  const overallScratchPercent =
    totalPixels > 0
      ? scratchedPixels / totalPixels
      : 0;


  console.log(
    "TOTAL SCRATCHED:",
    Math.round(
      overallScratchPercent * 100
    ) + "%"
  );


  if (
    overallScratchPercent >=
    REQUIRED_SCRATCH_PERCENT
  ) {

    checkTicketButton?.removeAttribute(
      "hidden"
    );

  }

}

/* =================================
   CHECK TICKET RESULT
================================= */

const resultModal =
  document.getElementById(
    "game-result-modal"
  );

const resultTitle =
  document.getElementById(
    "game-result-title"
  );

const resultMessage =
  document.getElementById(
    "game-result-message"
  );

const cashInButton =
  document.getElementById(
    "cash-in-button"
  );

const playAgainButton =
  document.getElementById(
    "play-again-button"
  );


checkTicketButton?.addEventListener(
  "click",
  () => {

    if (!currentGame) return;

    if (typeof gtag === "function") {
  gtag("event", "game_play", {
    game_name: "more_money_less_problems",
    outcome: currentGame.outcome
  });
}
if (typeof gtag === "function") {
  gtag("event", "game_result", {
    game_name: "more_money_less_problems",
    outcome: currentGame.outcome,
    prize:
      currentGame.winningPrize ||
      currentGame.debtResult ||
      "none"
  });
}

    checkTicketButton.setAttribute(
      "hidden",
      ""
    );


    /* WIN */

    if (
      currentGame.outcome ===
      "win"
    ) {

      resultTitle.textContent =
        "YOU WIN";

      resultMessage.textContent =
        `Number ${currentGame.matchedNumber} wins ${currentGame.winningPrize}.`;

      cashInButton.textContent =
        "CASH IN";

      cashInButton.hidden =
        false;


      startWinCelebration();


      setTimeout(() => {

        resultModal?.removeAttribute(
          "hidden"
        );

      }, 2100);

    }


    /* DEBT */

else if (
  currentGame.outcome ===
  "debt"
) {

  resultTitle.textContent =
    currentGame.debtResult ===
    "ETERNAL DEBT"
      ? "ETERNAL DEBT"
      : "YOU OWE";

  resultMessage.textContent =
    currentGame.debtResult ===
    "ETERNAL DEBT"
      ? "Congratulations. All debts are final."
      : `Congratulations. ${currentGame.debtResult} is now due.`;

  cashInButton.textContent =
    currentGame.debtResult ===
    "ETERNAL DEBT"
      ? "ACCEPT FATE"
      : "PAY DEBT";

  cashInButton.hidden =
    false;

  startWinCelebration();

  setTimeout(() => {

    resultModal?.removeAttribute(
      "hidden"
    );

  }, 4000);

}

    /* LOSS */

    else {

      resultTitle.textContent =
        "NOT A WINNER";

      resultMessage.textContent =
        "Please try again.";

      cashInButton.hidden =
        true;

      resultModal?.removeAttribute(
        "hidden"
      );

    }

  }
);


playAgainButton?.addEventListener(
  "click",
  () => {

    window.location.reload();

  }
);


/* =================================
   SOLITAIRE WIN ANIMATION
================================= */

const winCanvas =
  document.getElementById(
    "win-canvas"
  );

const winContext =
  winCanvas?.getContext("2d");


function resizeWinCanvas() {

  if (
    !winCanvas ||
    !winContext
  ) {
    return;
  }

  const dpr =
    window.devicePixelRatio || 1;

  winCanvas.width =
    Math.round(
      window.innerWidth * dpr
    );

  winCanvas.height =
    Math.round(
      window.innerHeight * dpr
    );

  winCanvas.style.width =
    `${window.innerWidth}px`;

  winCanvas.style.height =
    `${window.innerHeight}px`;

  winContext.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

}


window.addEventListener(
  "resize",
  resizeWinCanvas
);


function startWinCelebration() {

  if (
    !winCanvas ||
    !winContext ||
    !ticketFrontArt
  ) {
    return;
  }

  resizeWinCanvas();

  winCanvas.classList.add(
    "is-active"
  );

  winContext.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );


  const ticketWidth =
    Math.min(
      170,
      window.innerWidth * 0.20
    );

  const ticketHeight =
    ticketWidth *
    (
      ticketFrontArt.naturalHeight /
      ticketFrontArt.naturalWidth
    );


  const copies = [];

  const copyCount =
    6;


  for (
    let i = 0;
    i < copyCount;
    i++
  ) {

    copies.push({

      x:
        Math.random() *
        Math.max(
          1,
          window.innerWidth -
          ticketWidth
        ),

      y:
        -ticketHeight -
        Math.random() * 300,

      vx:
        3 +
        Math.random() * 7,

      vy:
        1 +
        Math.random() * 4,

      gravity:
        0.28 +
        Math.random() * 0.12,

      bounce:
        0.72 +
        Math.random() * 0.12

    });

  }


  const startTime =
    performance.now();

  const CELEBRATION_TIME =
    10000;


  function animate(now) {

    const elapsed =
      now - startTime;


    copies.forEach(
      (copy) => {

        copy.vy +=
          copy.gravity;

        copy.x +=
          copy.vx;

        copy.y +=
          copy.vy;


        if (
          copy.x <= 0 ||
          copy.x + ticketWidth >=
          window.innerWidth
        ) {

          copy.vx *= -1;

        }


        if (
          copy.y + ticketHeight >=
          window.innerHeight
        ) {

          copy.y =
            window.innerHeight -
            ticketHeight;

          copy.vy =
            -Math.abs(copy.vy) *
            copy.bounce;

        }


        winContext.drawImage(
          ticketFrontArt,
          copy.x,
          copy.y,
          ticketWidth,
          ticketHeight
        );

      }
    );


    if (
      elapsed <
      CELEBRATION_TIME
    ) {

      requestAnimationFrame(
        animate
      );

    }

  }


  requestAnimationFrame(
    animate
  );

}

/* =================================
   CREATE SILVER AREAS
================================= */

function createSilverZones() {

  if (!silverLayer) return;

  silverLayer.innerHTML = "";

  scratchZones.forEach((zone) => {

    const element =
      document.createElement("div");

    element.className =
      "silver-zone";

    element.dataset.zone =
      zone.id;

    element.style.left =
      `${zone.x * 100}%`;

    element.style.top =
      `${zone.y * 100}%`;

    element.style.width =
      `${zone.width * 100}%`;

    element.style.height =
      `${zone.height * 100}%`;

    silverLayer.appendChild(element);

  });

}

function renderGameResults() {

  if (!currentGame) return;


  /* =================================
     BONUSES
  ================================== */

  currentGame.bonuses.forEach(
    (result, index) => {

      const zone =
        silverLayer.querySelector(
          `[data-zone="bonus-${index + 1}"]`
        );

      if (!zone) return;

      zone.innerHTML = "";


      const text =
        document.createElement(
          "span"
        );

      text.className =
        "silver-bonus-result";

      text.textContent =
        result;


      zone.appendChild(text);

    }
  );


  /* =================================
     YOUR NUMBERS
  ================================== */

  const yourZone =
    silverLayer.querySelector(
      '[data-zone="your-numbers"]'
    );


  if (yourZone) {

    yourZone.innerHTML = "";


    const grid =
      document.createElement(
        "div"
      );


    grid.className =
      "silver-your-numbers";


    currentGame.yourNumbers
      .forEach(
        (number) => {

          const item =
            document.createElement(
              "span"
            );

          item.textContent =
            number;

          grid.appendChild(
            item
          );

        }
      );


    yourZone.appendChild(
      grid
    );

  }


  /* =================================
     WINNING NUMBER GRID
  ================================== */

  const winningZone =
    silverLayer.querySelector(
      '[data-zone="winning-numbers"]'
    );


  if (winningZone) {

    winningZone.innerHTML = "";


    const grid =
      document.createElement(
        "div"
      );


    grid.className =
      "silver-winning-numbers";


    currentGame.winningNumbers
      .forEach(
        (number, index) => {

          const item =
            document.createElement(
              "div"
            );


          item.className =
            "winning-result-cell";


          const numberElement =
            document.createElement(
              "span"
            );


          numberElement.className =
            "result-number";


          numberElement.textContent =
            number;


          const prizeElement =
            document.createElement(
              "span"
            );


          prizeElement.className =
            "result-prize";


          prizeElement.textContent =
            currentGame
              .gridPrizes[index];


          item.appendChild(
            numberElement
          );


          item.appendChild(
            prizeElement
          );


          grid.appendChild(
            item
          );

        }
      );


    winningZone.appendChild(
      grid
    );

  }

}


/* =================================
   DRAW SCRATCHABLE ART
================================= */

function setupScratchCanvas() {

  if (
    !scratchCanvas ||
    !scratchContext ||
    !ticketFrontArt
  ) {
    return;
  }

  const rect =
    scratchCanvas.parentElement
      .getBoundingClientRect();

  const dpr =
    window.devicePixelRatio || 1;

  scratchCanvas.width =
    Math.round(
      rect.width * dpr
    );

  scratchCanvas.height =
    Math.round(
      rect.height * dpr
    );

  scratchContext.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  scratchContext.clearRect(
    0,
    0,
    rect.width,
    rect.height
  );

  /*
    Copy only the six scratchable
    portions of the ticket onto canvas.
  */

  scratchZones.forEach((zone) => {

    const sourceX =
      ticketFrontArt.naturalWidth *
      zone.x;

    const sourceY =
      ticketFrontArt.naturalHeight *
      zone.y;

    const sourceWidth =
      ticketFrontArt.naturalWidth *
      zone.width;

    const sourceHeight =
      ticketFrontArt.naturalHeight *
      zone.height;

    const destinationX =
      rect.width *
      zone.x;

    const destinationY =
      rect.height *
      zone.y;

    const destinationWidth =
      rect.width *
      zone.width;

    const destinationHeight =
      rect.height *
      zone.height;

    scratchContext.drawImage(
      ticketFrontArt,

      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,

      destinationX,
      destinationY,
      destinationWidth,
      destinationHeight
    );

  });

}


/* =================================
   CHECK SCRATCH AREA
================================= */

function pointIsScratchable(x, y) {

  if (!scratchCanvas) {
    return false;
  }

  const rect =
    scratchCanvas.getBoundingClientRect();

  const normalizedX =
    x / rect.width;

  const normalizedY =
    y / rect.height;

  return scratchZones.some((zone) => {

    return (
      normalizedX >= zone.x &&
      normalizedX <=
        zone.x + zone.width &&
      normalizedY >= zone.y &&
      normalizedY <=
        zone.y + zone.height
    );

  });

}

/* =================================
   SCRATCH DEBRIS
================================= */

const debrisContainer =
  document.getElementById(
    "scratch-debris"
  );

/*
  More columns = debris spreads out
  instead of building tall piles.
*/

const debrisColumns =
  new Array(100).fill(0);

const MAX_DEBRIS =
  260;


function createScratchDebris(
  screenX,
  screenY
) {

  if (!debrisContainer) return;

  if (Math.random() > 0.40) {
    return;
  }


  const piece =
    document.createElement("span");

  piece.className =
    "scratch-debris-piece";


  const width =
    2 + Math.random() * 7;

  const height =
    1 + Math.random() * 4;

  piece.style.width =
    `${width}px`;

  piece.style.height =
    `${height}px`;


  /*
    Convert viewport coordinates
    into DOCUMENT coordinates.
  */

  const startX =
    screenX +
    window.scrollX;

  const startY =
    screenY +
    window.scrollY;


  piece.style.left =
    `${startX}px`;

  piece.style.top =
    `${startY}px`;

  debrisContainer.appendChild(piece);


  /*
    getBoundingClientRect() gives
    viewport position, so add scrollY
    to get the actual ticket position
    in the document.
  */

  const ticketRect =
    ticket.getBoundingClientRect();

  const ticketBottom =
    ticketRect.bottom +
    window.scrollY;


  /*
    Target roughly the bottom pink
    border of the ticket.
  */

  const targetY =
    ticketBottom - 6;


  const fallDistance =
    Math.max(
      0,
      targetY - startY
    );


  const horizontalDrift =
    -50 +
    Math.random() * 100;


  /*
    Some pieces stop slightly above
    the border — intentionally messy.
  */

  const verticalVariation =
    -8 +
    Math.random() * 12;


  const finalY =
    fallDistance +
    verticalVariation;


  const rotation =
    360 +
    Math.random() * 900;


  const duration =
    650 +
    Math.random() * 750;


  piece.animate(
    [

      {
        transform:
          "translate(0px, 0px) rotate(0deg)"
      },

      {
        offset: 0.72,

        transform:
          `translate(
            ${horizontalDrift * 0.7}px,
            ${Math.max(0, finalY - 10)}px
          )
          rotate(${rotation * 0.75}deg)`
      },

      {
        transform:
          `translate(
            ${horizontalDrift}px,
            ${finalY}px
          )
          rotate(${rotation}deg)`
      }

    ],

    {
      duration,
      easing:
        "cubic-bezier(.35,.15,.55,1)",

      fill: "forwards"
    }
  );


  /*
    Keep the DOM manageable while
    still allowing endless scratching.
  */

  while (
    debrisContainer.children.length >
    300
  ) {

    debrisContainer
      .firstElementChild
      ?.remove();

  }

}


/* =================================
   SCRATCH ACTION
================================= */

function scratchAt(event) {

  if (
    !scratchCanvas ||
    !scratchContext ||
    !isScratching
  ) {
    return;
  }

  const rect =
    scratchCanvas
      .getBoundingClientRect();

  const x =
    event.clientX -
    rect.left;

  const y =
    event.clientY -
    rect.top;

  /*
    Outside a valid zone:
    stop this stroke.
  */

  if (!pointIsScratchable(x, y)) {

    lastX = null;
    lastY = null;

    return;
  }

  scratchContext.save();

  scratchContext
    .globalCompositeOperation =
    "destination-out";

  scratchContext.lineCap =
    "round";

  scratchContext.lineJoin =
    "round";


  /* Main scrape */

/* =============================
   ROUGH MAIN SCRAPE
============================== */

if (
  lastX !== null &&
  lastY !== null
) {

  /*
    Several parallel uneven grooves
    give us roughly the same overall
    scratch width without one smooth
    digital eraser stripe.
  */

  for (let i = 0; i < 7; i++) {

const offset =
  -24 + i * 8 +
  (Math.random() - 0.5) * 6;

    scratchContext.lineWidth =
      6 + Math.random() * 6;

    scratchContext.beginPath();

    scratchContext.moveTo(
      lastX +
        (Math.random() - 0.5) * 3,

      lastY + offset
    );

    scratchContext.lineTo(
      x +
        (Math.random() - 0.5) * 3,

      y + offset
    );

    scratchContext.stroke();

  }

} else {

  /*
    First contact should also be
    irregular instead of one big
    perfect circle.
  */

  for (let i = 0; i < 8; i++) {

    const angle =
      Math.random() *
      Math.PI * 2;

    const distance =
      Math.random() * 24;

    const chipX =
      x +
      Math.cos(angle) *
      distance;

    const chipY =
      y +
      Math.sin(angle) *
      distance;

    scratchContext.beginPath();

    scratchContext.arc(
      chipX,
      chipY,
      3 + Math.random() * 6,
      0,
      Math.PI * 2
    );

    scratchContext.fill();

  }

}


  /* Thin scratch streaks */

  for (let i = 0; i < 5; i++) {

    const offsetX =
      (Math.random() - 0.5) * 24;

    const offsetY =
      (Math.random() - 0.5) * 24;

    scratchContext.lineWidth =
      1 + Math.random() * 4;

    scratchContext.beginPath();

    scratchContext.moveTo(
      x + offsetX,
      y + offsetY
    );

    scratchContext.lineTo(
      x +
        offsetX +
        (Math.random() - 0.5) *
        18,

      y +
        offsetY +
        (Math.random() - 0.5) *
        18
    );

    scratchContext.stroke();

  }


  /* Small chips */

  for (let i = 0; i < 3; i++) {

    scratchContext.beginPath();

    scratchContext.arc(
      x +
        (Math.random() - 0.5) *
        25,

      y +
        (Math.random() - 0.5) *
        25,

      1 + Math.random() * 3,

      0,
      Math.PI * 2
    );

    scratchContext.fill();

  }

  scratchContext.restore();

  createScratchDebris(
    event.clientX,
    event.clientY
  );

  lastX = x;
  lastY = y;


}


/* =================================
   POINTER CONTROLS
================================= */

scratchCanvas?.addEventListener(
  "pointerdown",
  (event) => {

    event.preventDefault();

    isScratching = true;

    lastX = null;
    lastY = null;

    pennyCursor?.classList.add(
      "is-scratching"
    );

    scratchCanvas.setPointerCapture(
      event.pointerId
    );

    scratchAt(event);

  }
);

scratchCanvas?.addEventListener(
  "pointermove",
  (event) => {

    if (!isScratching) return;

    event.preventDefault();

    scratchAt(event);

  }
);

scratchCanvas?.addEventListener(
  "pointerup",
  (event) => {

    isScratching = false;

    lastX = null;
    lastY = null;

    pennyCursor?.classList.remove(
      "is-scratching"
    );

    if (
      scratchCanvas.hasPointerCapture(
        event.pointerId
      )
    ) {

      scratchCanvas
        .releasePointerCapture(
          event.pointerId
        );

    }

    checkScratchCompletion();

  }
  
);

scratchCanvas?.addEventListener(
  "pointercancel",
  () => {

    isScratching = false;

    lastX = null;
    lastY = null;

    pennyCursor?.classList.remove(
      "is-scratching"
    );

  }
);


/* =================================
   INITIALIZE
================================= */

function initializeScratchGame() {

  generateGame();

  createSilverZones();

  renderGameResults();

  setupScratchCanvas();

}

if (ticketFrontArt?.complete) {

  initializeScratchGame();

} else {

  ticketFrontArt?.addEventListener(
    "load",
    initializeScratchGame
  );

}

window.addEventListener(
  "resize",
  setupScratchCanvas
);
