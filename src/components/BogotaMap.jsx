
import { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap
} from "react-leaflet";

import { MapPin, Layers, MousePointerClick } from "lucide-react";

// Normaliza los nombres para comparar localidades
function normalizar(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Comprueba si una localidad coincide con una propiedad del GeoJSON
function coincideLocalidad(feature, localidad) {
  const valores = Object.values(feature?.properties || {})
    .filter(value => typeof value === "string")
    .map(normalizar);

  return valores.includes(normalizar(localidad));
}

// Ajusta el mapa para mostrar la localidad seleccionada
function AjustarLocalidad({ geoJsonRef, localidad }) {
  const map = useMap();

  useEffect(() => {
    const capa = geoJsonRef.current;

    if (!capa || !localidad) return;

    let seleccionada = null;

    capa.eachLayer(layer => {
      if (coincideLocalidad(layer.feature, localidad)) {
        seleccionada = layer;
      }
    });

    if (seleccionada) {
      map.fitBounds(seleccionada.getBounds(), {
        padding: [35, 35],
        maxZoom: 13,
        animate: true
      });
    }
  }, [map, localidad, geoJsonRef]);

  return null;
}

export default function BogotaMap({ localidad, sectoresDestacados = []}) {
  const [datos, setDatos] = useState(null);
  const [sectoresDatos, setSectoresDatos] = useState(null);

  const [error, setError] = useState(false);
  const [errorSectores, setErrorSectores] = useState(false);

  const [sectorSeleccionado, setSectorSeleccionado] = useState(null);

  const geoJsonRef = useRef(null);

  // Cargar localidades
  useEffect(() => {
    fetch("/data/localidades.geojson")
      .then(response => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el mapa de localidades");
        }

        return response.json();
      })
      .then(data => setDatos(data))
      .catch(() => setError(true));
  }, []);

  // Cargar sectores catastrales
  useEffect(() => {
    fetch("/data/sectores_bogota_con_localidad.geojson")
      .then(response => {
        if (!response.ok) {
          throw new Error("No se pudieron cargar los sectores");
        }

        return response.json();
      })
      .then(data => setSectoresDatos(data))
      .catch(() => setErrorSectores(true));
  }, []);

  // Limpiar el sector seleccionado cuando cambia la localidad
  useEffect(() => {
    setSectorSeleccionado(null);
  }, [localidad]);

  // Filtrar únicamente los sectores de la localidad seleccionada
  const sectoresFiltrados = useMemo(() => {
    if (!sectoresDatos || !localidad) return null;

    return {
      ...sectoresDatos,
      features: sectoresDatos.features.filter(feature =>
        normalizar(feature.properties?.LocNombre) ===
        normalizar(localidad)
      )
    };
  }, [sectoresDatos, localidad]);

  // Estilo de las localidades
  const estiloLocalidad = useMemo(() => feature => {
    const activa = coincideLocalidad(feature, localidad);

    return {
      fillColor: activa ? "#18A477" : "#BDE5CC",
      fillOpacity: activa ? 0.8 : 0.45,
      color: activa ? "#087B57" : "#FFFFFF",
      weight: activa ? 3 : 1.5,
      opacity: 1
    };
  }, [localidad]);

  // Estilo de los sectores catastrales
const estiloSector = useMemo(() => feature => {
  const codigo = String(feature.properties?.SCACODIGO || "").trim();

  const seleccionado =
    codigo === String(sectorSeleccionado?.SCACODIGO || "").trim();

  // Acepta tanto códigos de texto como objetos con propiedad codigo
  const posicionRecomendada = sectoresDestacados.findIndex(sector => {
    const codigoRecomendado =
      typeof sector === "object" && sector !== null
        ? sector.codigo
        : sector;

    return String(codigoRecomendado || "").trim() === codigo;
  });

  if (seleccionado) {
    return {
      fillColor: "#F59E0B",
      fillOpacity: 0.85,
      color: "#D97706",
      weight: 3,
      opacity: 1
    };
  }

  const colores = [
    { fill: "#FACC15", borde: "#CA8A04" },
    { fill: "#CBD5E1", borde: "#64748B" },
    { fill: "#CD7F32", borde: "#92400E" }
  ];

  if (posicionRecomendada !== -1) {
    const color = colores[posicionRecomendada];

    return {
      fillColor: color.fill,
      fillOpacity: 0.85,
      color: color.borde,
      weight: 3,
      opacity: 1
    };
  }

  return {
    fillColor: "#38BDF8",
    fillOpacity: 0.18,
    color: "#0284C7",
    weight: 1,
    opacity: 1
  };

}, [sectorSeleccionado, sectoresDestacados]);

  // Interacciones de cada sector
  const configurarSector = (feature, layer) => {
    const propiedades = feature.properties || {};

    const nombre = propiedades.SCANOMBRE || "Sector sin nombre";
    const codigo = propiedades.SCACODIGO || "Sin código";

    layer.bindTooltip(
      `<strong>${nombre}</strong><br/>Código: ${codigo}`,
      { sticky: true }
    );

    layer.on({
      click: () => {
        setSectorSeleccionado({
          SCANOMBRE: nombre,
          SCACODIGO: codigo,
          SCATIPO: propiedades.SCATIPO,
          LocNombre: propiedades.LocNombre,
          LocCodigo: propiedades.LocCodigo
        });
      }
    });
  };

  if (error) {
    return (
      <div className="map-loading">
        No se pudo cargar el mapa. Comprueba el archivo de localidades.
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="map-loading">
        Cargando mapa de Bogotá...
      </div>
    );
  }

  const tipoSector = {
    0: "Urbano",
    1: "Rural",
    2: "Mixto"
  };

  return (
    <div className="bogota-map-wrapper">

      <MapContainer
        center={[4.6486, -74.0817]}
        zoom={10}
        scrollWheelZoom={true}
        className="bogota-map"
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Capa original de localidades */}
        <GeoJSON
          ref={geoJsonRef}
          data={datos}
          style={estiloLocalidad}
          onEachFeature={(feature, layer) => {
            const nombre = feature.properties?.LocNombre;

            if (nombre) {
              layer.bindTooltip(nombre, {
                sticky: true
              });
            }
          }}
        />

        {/* Nueva capa de sectores catastrales */}
        {sectoresFiltrados && (
          <GeoJSON
              key={`${normalizar(localidad)}-${sectoresDestacados.join("-")}`}
              data={sectoresFiltrados}
              style={estiloSector}
              onEachFeature={configurarSector}
            />
        )}

        {/* Zoom automático a la localidad */}
        <AjustarLocalidad
          geoJsonRef={geoJsonRef}
          localidad={localidad}
        />

      </MapContainer>

      {/* Etiqueta de localidad */}
      <div className="map-selection-label">
        <MapPin size={17} />
        <span>{localidad}</span>
      </div>

      {/* Leyenda */}
      <div className="map-legend">
        <div className="map-legend-title">
          <Layers size={16} />
          <strong>Capas del mapa</strong>
        </div>

        <div className="map-legend-item">
          <span className="legend-color locality-color"></span>
          Localidad seleccionada
        </div>

        <div className="map-legend-item">
          <span className="legend-color sector-color"></span>
          Sectores catastrales
        </div>

        <div className="map-legend-item">
          <span className="legend-color selected-color"></span>
          Sector seleccionado
        </div>

        <div className="map-legend-item">
          <span className="legend-color top-1-color"></span>
          Top 1 recomendado
        </div>

        <div className="map-legend-item">
          <span className="legend-color top-2-color"></span>
          Top 2 recomendado
        </div>

        <div className="map-legend-item">
          <span className="legend-color top-3-color"></span>
          Top 3 recomendado
        </div>
      </div>

      {/* Información del sector seleccionado */}
      {sectorSeleccionado && (
        <div className="sector-info-panel">
          <div className="sector-info-header">
            <div>
              <span className="sector-info-subtitle">
                SECTOR SELECCIONADO
              </span>

              <h3>{sectorSeleccionado.SCANOMBRE}</h3>
            </div>

            <MapPin size={22} />
          </div>

          <div className="sector-info-details">
            <div>
              <span>Código catastral</span>
              <strong>{sectorSeleccionado.SCACODIGO}</strong>
            </div>

            <div>
              <span>Localidad</span>
              <strong>{sectorSeleccionado.LocNombre}</strong>
            </div>

            <div>
              <span>Tipo de sector</span>
              <strong>
                {tipoSector[sectorSeleccionado.SCATIPO] || "No especificado"}
              </strong>
            </div>
          </div>
        </div>
      )}

      {!sectorSeleccionado && sectoresFiltrados?.features?.length > 0 && (
        <div className="sector-instruction">
          <MousePointerClick size={17} />
          Selecciona un sector en el mapa para consultar su información.
        </div>
      )}

      {errorSectores && (
        <div className="sector-instruction">
          No se pudo cargar la capa de sectores catastrales.
          El mapa de localidades sigue disponible.
        </div>
      )}

      {sectoresFiltrados && sectoresFiltrados.features.length === 0 && (
        <div className="sector-instruction">
          No se encontraron sectores para esta localidad.
        </div>
      )}

    </div>
  );
}
