let slideIndex = 0;
let autoSlideInterval;

function initCarousel() {
    showSlides(slideIndex);
    autoSlideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000); // Auto-slide every 5 seconds
}

function plusSlides(n) {
    clearInterval(autoSlideInterval); // Reset auto-slide interval
    slideIndex += n;
    showSlides(slideIndex);
    autoSlideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000); // Restart auto-slide interval
}

function currentSlide(n) {
    clearInterval(autoSlideInterval); // Reset auto-slide interval
    slideIndex = n;
    showSlides(slideIndex);
    autoSlideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000); // Restart auto-slide interval
}

function showSlides(n) {
    const slides = document.querySelectorAll(".carousel-img");
    const dots = document.querySelectorAll(".dot");

    // Wrap around if the index is out of bounds
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    // Display the appropriate slide and highlight the corresponding dot
    slides.forEach((slide, index) => {
        slide.style.display = index === slideIndex ? "block" : "none";
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === slideIndex);
    });
}

// Add keyboard navigation for better accessibility
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") plusSlides(-1);
    if (event.key === "ArrowRight") plusSlides(1);
});

// Auto-slide functionality
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    preloader.style.opacity = "0"; // Smooth fade-out
    setTimeout(() => {
        preloader.style.display = "none"; // Remove preloader from the page
    }, 500); // Match the fade-out duration (500ms)

    // Initialize the carousel after the preloader
    initCarousel();
});

document.addEventListener("DOMContentLoaded", () => {
    // Wait for 1 second, then fade out the preloader
    setTimeout(() => {
        document.body.classList.add("loaded");
    }, 1000); // 1000ms = 1 second
});

// Create the loading screen with a spinning logo and progress bar
const loadingScreen = document.createElement("div");
loadingScreen.id = "loading-screen";
loadingScreen.innerHTML = `
  <img src="rugbylogo.png" alt="Loading" class="loading-logo" />
  <div class="progress-container">
    <div class="progress-bar"></div>
  </div>
`;
document.body.prepend(loadingScreen);

document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.querySelector(".progress-bar");

  // Simulate progress bar for demo purposes
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
      }, 500); // Delay for smooth transition
    }
  }, 200); // Adjust interval speed as needed
});

// Display the loading screen when navigating to a new page
window.addEventListener("beforeunload", () => {
  document.getElementById("loading-screen").classList.remove("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  // Roster Data
  const rosterData = [
    {
      timestamp: "1/1/2025 16:27:12",
      name: "Kyle Poudyal",
      position: "Flanker",
      major: "Computer Science",
      heightWeight: "5’10/205",
      hometown: "Damascus, Maryland",
      previousClubs: "",
      experience: "Joined UMBC rugby in Fall 2024",
      whyPlay: "Rugby is the ultimate team sport! It combines the best of both sports I played growing up, football and soccer.",
      funFact: "I have been to more different countries than different states."
    },
    // Add more players here...
  ];

  const tableBody = document.querySelector("#roster-table tbody");
  const modal = document.getElementById("player-modal");
  const closeModal = document.querySelector(".close-modal");
  const playerName = document.getElementById("player-name");
  const playerDetails = document.getElementById("player-details");

  // Render Roster Table
  const renderTable = () => {
    tableBody.innerHTML = "";
    rosterData.forEach((player, index) => {
      const row = document.createElement("tr");
      row.dataset.index = index;
      row.innerHTML = `
        <td>${player.timestamp}</td>
        <td>${player.name}</td>
        <td>${player.position}</td>
        <td>${player.major}</td>
        <td>${player.heightWeight}</td>
        <td>${player.hometown}</td>
        <td>${player.experience}</td>
      `;
      tableBody.appendChild(row);
    });
  };

  // Show Player Modal
  const showModal = (player) => {
    playerName.textContent = player.name;
    playerDetails.innerHTML = `
      <li><strong>Position:</strong> ${player.position}</li>
      <li><strong>Major:</strong> ${player.major}</li>
      <li><strong>Height/Weight:</strong> ${player.heightWeight}</li>
      <li><strong>Hometown:</strong> ${player.hometown}</li>
      <li><strong>Previous Clubs:</strong> ${player.previousClubs || "None"}</li>
      <li><strong>Experience:</strong> ${player.experience}</li>
      <li><strong>Why I Play Rugby:</strong> ${player.whyPlay}</li>
      <li><strong>Fun Fact:</strong> ${player.funFact}</li>
    `;
    modal.style.display = "flex";
  };

  // Table Click Event
  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (row) {
      const player = rosterData[row.dataset.index];
      showModal(player);
    }
  });

  // Close Modal
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Initialize Table
  renderTable();
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("alumni-popup");
  const closeBtn = document.getElementById("close-popup");

  // Show the modal when the page loads
  modal.style.display = "flex";

  // Close the modal when the close button is clicked
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close the modal when clicking outside of the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("alumni-popup");
  const closePopup = document.getElementById("close-popup");
  const addToCalendar = document.getElementById("add-to-calendar");

  // Show the popup
  popup.style.display = "block";

  // Close the popup
  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Close the popup when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });

  // Generate ICS file for calendar
  addToCalendar.addEventListener("click", () => {
    const eventDetails = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UMBC Rugby//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${Date.now()}@umbcrugby.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:20250503T160000Z
DTEND:20250503T180000Z
SUMMARY:UMBC Rugby Alumni Game
DESCRIPTION:Join us for the annual UMBC Rugby Alumni Game on May 3rd, 2025 at 12:00 PM at Walker Avenue Field. Be part of the tradition!
LOCATION:Walker Avenue Field, UMBC
END:VEVENT
END:VCALENDAR
    `;

    // Create a blob for the ICS file
    const blob = new Blob([eventDetails], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "UMBC_Rugby_Alumni_Game.ics";

    // Trigger the download
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("alumni-popup");
    const closeModal = document.getElementById("close-popup");
    const addToCalendar = document.getElementById("add-to-calendar");

    // Show the modal (you can trigger this on a button click or other event)
    setTimeout(() => {
      modal.style.display = "block";
    }, 1000); // Show modal after 1 second

    // Close the modal
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Add event to calendar
    addToCalendar.addEventListener("click", () => {
      const eventDetails = {
        title: "UMBC Rugby Alumni Game",
        start: "2025-05-03T12:00:00",
        description: "Join us for the UMBC Rugby Alumni Game!",
        location: "Walker Avenue Field, UMBC",
      };

      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventDetails.title
      )}&dates=${eventDetails.start.replace(/[-:]/g, "")}/${
        eventDetails.start.replace(/[-:]/g, "")
      }&details=${encodeURIComponent(
        eventDetails.description
      )}&location=${encodeURIComponent(eventDetails.location)}`;

      window.open(calendarUrl, "_blank");
    });

    // Close modal when clicking outside the content
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("counter");
  const startYear = 1986;
  const currentYear = new Date().getFullYear();
  const years = currentYear - startYear;
  let currentCount = 0;
  const duration = 2000; // Animation duration in milliseconds
  const increment = Math.ceil((years / duration) * 20); // Calculate increment

  const updateCounter = () => {
    if (currentCount < years) {
      currentCount += increment;
      counter.textContent = Math.min(currentCount, years);
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
});
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".new-carousel-track");
  const images = Array.from(track.children);
  const prevButton = document.querySelector(".new-carousel-btn.prev");
  const nextButton = document.querySelector(".new-carousel-btn.next");
  const dotsContainer = document.querySelector(".new-carousel-dots");

  let currentIndex = 0;
  let autoplayInterval;

  // Dynamically create dots
  images.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  // Update carousel position
  const updateCarousel = () => {
    const slideWidth = images[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  // Navigate to next slide
  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  };

  // Navigate to previous slide
  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  };

  // Pause autoplay when interacting
  const pauseAutoplay = () => clearInterval(autoplayInterval);

  // Restart autoplay
  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
  };

  // Autoplay
  startAutoplay();

  // Button event listeners
  nextButton.addEventListener("click", () => {
    nextSlide();
    pauseAutoplay();
    startAutoplay();
  });

  prevButton.addEventListener("click", () => {
    prevSlide();
    pauseAutoplay();
    startAutoplay();
  });

  // Navigate via dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      pauseAutoplay();
      startAutoplay();
    });
  });

  // Swipe gestures
  let startX;
  let isSwiping = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    pauseAutoplay();
  });

  track.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    const moveX = e.touches[0].clientX - startX;

    if (moveX > 50) {
      prevSlide();
      isSwiping = false;
    } else if (moveX < -50) {
      nextSlide();
      isSwiping = false;
    }
  });

  track.addEventListener("touchend", () => {
    isSwiping = false;
    startAutoplay();
  });

  // Handle resizing for responsiveness
  window.addEventListener("resize", updateCarousel);

  // Initialize carousel
  updateCarousel();
});
document.addEventListener('DOMContentLoaded', function () {
  const carouselTrack = document.querySelector('.fancy-carousel-track');
  const slides = Array.from(document.querySelectorAll('.fancy-carousel-slide'));
  const nextBtn = document.querySelector('.fancy-carousel-btn.next');
  const prevBtn = document.querySelector('.fancy-carousel-btn.prev');
  const dotsContainer = document.querySelector('.fancy-carousel-dots');

  // Number of slides
  const totalSlides = slides.length;
  // Angle between slides (360 degrees / number of slides)
  const angle = 360 / totalSlides;

  // Current index (which slide is "facing" front)
  let currentIndex = 0;

  // --- 1) Position each slide in a 3D circle ---
  slides.forEach((slide, i) => {
    // Each slide is rotated i * angle around Y axis.
    // We'll place them "in front" with translateZ(...) so they form a ring.
    const rotateY = i * angle;
    slide.style.transform = `rotateY(${rotateY}deg) translateZ(450px)`;
  });

  // --- 2) Create dots for each slide ---
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(document.querySelectorAll('.fancy-carousel-dots .dot'));

  // --- 3) Rotation function: Moves the track so the "currentIndex" slide faces front ---
  function updateCarousel() {
    // We rotate the track in the *opposite* direction of the slide index
    // so that the correct slide is centered.
    const rotation = -angle * currentIndex;
    carouselTrack.style.transform = `translateZ(-450px) rotateY(${rotation}deg)`;

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  // Move to a specific slide
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  // --- 4) Button Handlers ---
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    // handle negative wrap-around
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  // Initial state
  updateCarousel();
});
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const images = Array.from(track.children);
  const prevButton = document.querySelector(".carousel-btn.prev");
  const nextButton = document.querySelector(".carousel-btn.next");
  const indicators = document.querySelectorAll(".indicator");
  const modal = document.querySelector(".modal");
  const modalImg = document.querySelector(".modal-content");
  const closeModal = document.querySelector(".close-modal");

  let currentIndex = 0;

  // Update Carousel Position
  const updateCarousel = () => {
    const slideWidth = images[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    indicators.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  // Navigate to Next Slide
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  });

  // Navigate to Previous Slide
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  });

  // Navigate via Indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Show Modal on Image Click
  images.forEach((img) => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
    });
  });

  // Close Modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close Modal on Outside Click
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Initialize Carousel Position
  updateCarousel();
});

document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.getElementById("ask-btn");
  const questionInput = document.getElementById("user-question");
  const answerDiv = document.getElementById("answer");

  askBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();
    if (!question) {
      answerDiv.textContent = "Please type a question first.";
      return;
    }

    // Clear answer area
    answerDiv.textContent = "Thinking...";

    try {
      // Make a POST request to your Flask endpoint
      const response = await fetch("/ask_rugby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });
      const data = await response.json();

      if (data.error) {
        answerDiv.textContent = data.error;
      } else {
        answerDiv.textContent = data.answer;
      }
    } catch (error) {
      console.error("Error:", error);
      answerDiv.textContent = "Error contacting the server.";
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  // 1) Show the popup on page load
  const popupOverlay = document.getElementById("schedule-popup-overlay");
  const popup = document.getElementById("schedule-popup");
  const closeBtn = document.getElementById("schedule-popup-close");

  // Only show once per load, or you could store a flag in localStorage
  popupOverlay.style.display = "block";
  popup.style.display = "block";

  // 2) Close popup logic
  closeBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
    popup.style.display = "none";
  });

  // 3) ICS Download button logic
  const icsButton = document.getElementById("download-ics-btn");
  icsButton.addEventListener("click", () => {
    // Build ICS string with multiple VEVENTS
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//UMBC Rugby//Spring 2025//EN
${createVEVENT("20250301","Frostbite 7s (CRC Qualifiers)")}
${createVEVENT("20250308","Rutgers University")}
${createVEVENT("20250322","American University")}
${createVEVENT("20250329","Bucknell 7s (CRC Qualifiers)")}
${createVEVENT("20250405","Virginia Commonwealth")}
${createVEVENT("20250412","George Washington")}
${createVEVENT("20250426","William & Mary")}
${createVEVENT("20250503","Alumni Game")}
END:VCALENDAR`;

    // Convert the string to a Blob
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const blobUrl = URL.createObjectURL(blob);

    // Create a hidden <a> to trigger download
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = "UMBC-Spring2025-Schedule.ics";  // file name
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // (Optional) Revoke object URL later
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  });

  // Helper function to generate each VEVENT (all-day event)
  function createVEVENT(yyyymmdd, summary) {
    return `BEGIN:VEVENT
DTSTAMP:${todayAsUTC()}
UID:${yyyymmdd}-${Math.random().toString(36).substring(2)}
DTSTART;VALUE=DATE:${yyyymmdd}
DTEND;VALUE=DATE:${incrementDate(yyyymmdd)}
SUMMARY:${summary}
END:VEVENT`;
  }

  // Returns today's date/time in UTC as an ICS-compatible stamp, e.g. 20240223T150000Z
  function todayAsUTC() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  // Simple function that returns the next day as YYYYMMDD (for DTEND)
  function incrementDate(yyyymmdd) {
    // yyyymmdd => year, month, day
    const year = parseInt(yyyymmdd.slice(0,4), 10);
    const month = parseInt(yyyymmdd.slice(4,6), 10) - 1; // zero-based
    const day = parseInt(yyyymmdd.slice(6), 10);
    const dateObj = new Date(year, month, day);
    dateObj.setDate(dateObj.getDate() + 1); // next day
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  }
});

if (!localStorage.getItem("spring2025popupShown")) {
  // show popup
  localStorage.setItem("spring2025popupShown", "true");
}

