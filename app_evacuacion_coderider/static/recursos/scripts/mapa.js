let mapa;
let controlRuta = null; // 🚗 Maneja la ruta inteligente por las calles

// Coordenadas SENA Centro de Comercio y Servicios (Popayán) 📍
const latSENA = 2.4419;
const lngSENA = -76.6063;

document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('mapa-interactivo');
    if (!mapDiv) return;

    // 1. Inicializar Mapa 🗺️
    mapa = L.map('mapa-interactivo').setView([latSENA, lngSENA], 15);

    // 2. Servidor de OpenStreetMap 🌐
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap SENA Evacuación'
    }).addTo(mapa);

    // 3. Marker inicial en el SENA
    L.marker([latSENA, lngSENA])
        .addTo(mapa)
        .bindPopup("<b>SENA Centro de Comercio</b><br>Punto de Evacuación Principal")
        .openPopup();

    // 4. Cargar Puntos de Encuentro y Sismos enviando la variable "mapa" 🚀
    if (typeof window.cargarPuntosEncuentro === "function") {
        window.cargarPuntosEncuentro(mapa);
    }
    if (typeof window.cargarPuntosSismos === "function") {
        window.cargarPuntosSismos(mapa);
    }

    // 5. 🎯 Trazar ruta por las calles al hacer clic en el mapa
    mapa.on('click', function(e) {
        const userLat = e.latlng.lat;
        const userLng = e.latlng.lng;
        colocarRutaPersonalizada(userLat, userLng, "Ubicación Seleccionada");
    });

    // Forzar redimensionado del mapa para evitar errores gráficos 📐
    setTimeout(() => { mapa.invalidateSize(); }, 500);
});

// Función principal para trazar la ruta inteligente 🛣️
// Función principal para trazar la ruta inteligente 🛣️
function colocarRutaPersonalizada(lat, lng, nombre) {
    if (controlRuta) {
        mapa.removeControl(controlRuta);
    }

    // Configuración con la URL actual y estable del servidor OSRM v1
    controlRuta = L.Routing.control({
        waypoints: [
            L.latLng(lat, lng),         // Punto A: Clic / GPS
            L.latLng(latSENA, lngSENA)  // Punto B: SENA
        ],
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        routeWhileDragging: true,
        language: 'es',
        showAlternatives: true,
        fitSelectedRoutes: true,
        show: false,
        lineOptions: {
            styles: [{ color: '#2563eb', weight: 6, opacity: 0.9 }]
        }
    }).addTo(mapa);

    const input = document.getElementById('origen-input');
    if (input) input.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Búsqueda por palabra clave en Popayán 🔍
function trazarRutaManual() {
    const query = document.getElementById('origen-input').value;
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Popayan')}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                colocarRutaPersonalizada(lat, lon, query);
            } else {
                alert("No se encontró la ubicación en Popayán. 😅");
            }
        })
        .catch(err => {
            console.error("Error al buscar ubicación:", err);
            alert("Ocurrió un error al buscar la dirección.");
        });
}

// Botones de Opciones de Ruta 🔘
function seleccionarRuta(index) {
    const alternativas = [
        { lat: 2.4480, lng: -76.6020, nombre: "Ruta 1 (Por Cra. 9)" },
        { lat: 2.4380, lng: -76.6120, nombre: "Ruta 2 (Por Cra. 6)" },
        { lat: 2.4510, lng: -76.5980, nombre: "Ruta 3 (Por Variante Norte)" }
    ];
    
    const punto = alternativas[index] || alternativas[0];
    colocarRutaPersonalizada(punto.lat, punto.lng, punto.nombre);
}

// 📍 Geolocalización por GPS
function obtenerUbicacionActual() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                mapa.setView([userLat, userLng], 16);
                colocarRutaPersonalizada(userLat, userLng, "Mi Ubicación Actual");
            },
            (error) => {
                alert("No se pudo obtener la ubicación. Verifica los permisos de GPS de tu navegador.");
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}