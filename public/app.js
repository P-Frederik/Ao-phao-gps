let map;
let userMarker;
let destMarker;
let routeControl;

// điểm đích
const destination = [10.7769, 106.7009];

function initMap() {
  // tạo map
  map = L.map("map").setView(destination, 15);

  // FIX render map bị xám
  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  // resize fix
  window.addEventListener("resize", () => {
    map.invalidateSize();
  });

  // tile
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // marker đích
  destMarker = L.marker(destination).addTo(map).bindPopup("📍 Điểm đến");

  // toggle card
  const toggleBtn = document.getElementById("toggleBtn");
  const cardBody = document.getElementById("cardBody");

  toggleBtn.addEventListener("click", () => {
    cardBody.classList.toggle("hidden");

    toggleBtn.innerHTML = cardBody.classList.contains("hidden") ? "+" : "−";
  });

  // ===== DRAG CARD =====
  const card = document.querySelector(".info-card");

  let isDragging = false;

  let offsetX = 0;
  let offsetY = 0;

  card.addEventListener("mousedown", (e) => {
    isDragging = true;

    offsetX = e.clientX - card.offsetLeft;
    offsetY = e.clientY - card.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    card.style.left = `${e.clientX - offsetX}px`;
    card.style.top = `${e.clientY - offsetY}px`;

    card.style.right = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // ===== LOCATION BUTTON =====
  const locateBtn = document.getElementById("locateBtn");

  locateBtn.addEventListener("click", () => {
    if (!currentUserPos) return;

    map.flyTo(currentUserPos, 17, {
      animate: true,
      duration: 1.5,
    });

    if (userMarker) {
      userMarker.openPopup();
    }
  });
  getLocation();
}

function getLocation() {
  if (!navigator.geolocation) {
    alert("Browser không hỗ trợ GPS");
    return;
  }

  navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const userPos = [lat, lng];

      // marker user
      if (!userMarker) {
        userMarker = L.marker(userPos)
          .addTo(map)
          .bindPopup("📍 Bạn đang ở đây");
      } else {
        userMarker.setLatLng(userPos);
      }

      // focus map
      map.setView(userPos);

      // route lần đầu
      if (!routeControl) {
        routeControl = L.Routing.control({
          waypoints: [
            L.latLng(userPos[0], userPos[1]),
            L.latLng(destination[0], destination[1]),
          ],

          routeWhileDragging: false,

          addWaypoints: false,

          draggableWaypoints: false,

          fitSelectedRoutes: true,

          show: false,

          createMarker: () => null,

          lineOptions: {
            styles: [
              {
                color: "blue",
                weight: 6,
              },
            ],
          },
        }).addTo(map);

        // khi tìm được route
        routeControl.on("routesfound", function (e) {
          const route = e.routes[0];

          // km
          const distance = (route.summary.totalDistance / 1000).toFixed(2);

          // phút
          const time = Math.round(route.summary.totalTime / 60);

          document.getElementById("gps").innerHTML = `
              <div>
                <b>📍 Vị trí hiện tại</b><br>
                ${lat.toFixed(6)}, ${lng.toFixed(6)}
              </div>

              <hr>

              <div>
                <b>🛣️ Khoảng cách</b><br>
                ${distance} km
              </div>

              <hr>

              <div>
                <b>⏱️ Thời gian dự kiến</b><br>
                ${time} phút
              </div>
            `;
        });
      } else {
        // update route
        routeControl.setWaypoints([
          L.latLng(userPos[0], userPos[1]),
          L.latLng(destination[0], destination[1]),
        ]);
      }
    },

    (err) => {
      console.error(err);

      alert("Không lấy được GPS. Hãy bật location.");
    },

    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    },
  );
}

initMap();
