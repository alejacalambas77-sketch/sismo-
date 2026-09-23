// static/recursos/scripts/puntos_encuentro.js

// 🟢 1. Datos de respaldo (Fallback) en caso de fallo al leer el archivo JSON
const puntosEncuentroFallback = [
    {
        nombre: "Punto 1: Plazoleta Principal",
        lat: 2.4421,
        lng: -76.6065,
        capacidad: "150 personas",
        descripcion: "Zona verde despejada frente a la entrada principal."
    },
    {
        nombre: "Punto 2: Cancha Múltiple",
        lat: 2.4415,
        lng: -76.6060,
        capacidad: "300 personas",
        descripcion: "Espacio amplio alejado de estructuras altas."
    },
    {
        nombre: "Punto 3: Parqueadero Posterior",
        lat: 2.4425,
        lng: -76.6070,
        capacidad: "100 personas",
        descripcion: "Área de evacuación secundaria."
    }
];

// 🟢 2. Función global asíncrona para renderizar puntos desde el JSON (o Fallback)
window.cargarPuntosEncuentro = async function(instanciaMapa) {
    if (!instanciaMapa || typeof L === 'undefined') return;

    let puntos = [];

    try {
        // Intenta obtener la ruta definida en la plantilla Django
        const urlFetch = typeof URL_JSON !== 'undefined' ? URL_JSON : '/static/recursos/datos/json/puntos_encuentro.json';
        const respuesta = await fetch(urlFetch);
        
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo JSON.");
        puntos = await respuesta.json();
    } catch (error) {
        console.warn("⚠️ Usando datos estáticos de respaldo para los puntos de encuentro:", error);
        puntos = puntosEncuentroFallback;
    }

    // Configuración del icono de evacuación
    const iconoEncuentro = L.divIcon({
        className: 'custom-pin-encuentro',
        html: `<div style="background-color: #22c55e; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);">
                <i class="fa-solid fa-person-running" style="font-size: 14px;"></i>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Renderizar los marcadores en la instancia del mapa
    puntos.forEach(punto => {
        L.marker([punto.lat, punto.lng], { icon: iconoEncuentro })
            .addTo(instanciaMapa)
            .bindPopup(`
                <div style="color: #333; font-family: sans-serif;">
                    <h4 style="margin: 0 0 5px 0; color: #16a34a;">🟢 ${punto.nombre}</h4>
                    <p style="margin: 0; font-size: 0.85rem;"><strong>Capacidad:</strong> ${punto.capacidad}</p>
                    <p style="margin: 0; font-size: 0.8rem; color: #555;">${punto.descripcion}</p>
                </div>
            `);
    });
};

// 🟢 3. Evento para ejecución automática si el mapa ya existe en el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (typeof mapa !== 'undefined' && mapa) {
        window.cargarPuntosEncuentro(mapa);
    }
});