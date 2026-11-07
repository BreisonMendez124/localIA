
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Store,
  Sparkles,
  ArrowRight,
  Building2,
  Trees,
  Coffee,
  Bot,
  Users,
  ShoppingBag,
  CalendarDays,
  ArrowLeft,
  Footprints,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  LayoutDashboard,
  Map as MapIcon,
  Trophy,
  BarChart3
} from "lucide-react";
import "./App.css";
import BogotaMap from "./components/BogotaMap";

const localidades = [
  "Chapinero",
  "Kennedy",
  "Suba",
  "Usaquén",
  "Bosa",
  "Engativá",
  "Ciudad Bolívar",
  "Teusaquillo",
  "Fontibón",
  "San Cristóbal"
];

const establecimientos = [
  "Tienda de ropa",
  "Restaurante",
  "Cafetería",
  "Papelería",
  "Farmacia",
  "Supermercado",
  "Tienda de tecnología"
];

const etapas = [
  {
    titulo: "Analizando población",
    descripcion: "Consultando información demográfica...",
    icono: Users
  },
  {
    titulo: "Evaluando competencia",
    descripcion: "Identificando establecimientos similares...",
    icono: Store
  },
  {
    titulo: "Estudiando demanda",
    descripcion: "Analizando indicadores comerciales...",
    icono: ShoppingBag
  },
  {
    titulo: "Revisando factores adicionales",
    descripcion: "Considerando eventos y temporadas...",
    icono: CalendarDays
  },
  {
    titulo: "¡Análisis preparado!",
    descripcion: "Ya podemos consultar el resultado.",
    icono: Sparkles
  }
];

const resultadoDemo = {
  categoria: "Recomendable",
  poblacion: "180.000",
  competencia: "42 negocios",
  flujo: "Medio",
  demanda: "Alta",
  fortalezas: [
    "La zona cuenta con una población potencialmente interesante.",
    "Existe demanda comercial para el tipo de establecimiento."
  ],
  riesgos: [
    "Es importante estudiar la competencia cercana.",
    "Se debe validar el flujo real de personas."
  ],
  recomendaciones: [
    "Comparar varias zonas dentro de la localidad.",
    "Investigar los precios de negocios similares.",
    "Validar la demanda antes de tomar una decisión."
  ]
};

function App() {
  const [establecimiento, setEstablecimiento] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [pagina, setPagina] = useState("inicio");
  const [resultadoModelo, setResultadoModelo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState(null);

  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    if (pagina !== "analisis") return;

    setEtapa(0);

    let contador = 0;

    const intervalo = setInterval(() => {
      contador++;

      setEtapa(contador);

      if (contador >= etapas.length - 1) {
        clearInterval(intervalo);
      }
    }, 2200);

    return () => clearInterval(intervalo);
  }, [pagina]);

const IconoEtapa = etapas[etapa].icono;

const posicionesRobot = [5, 25, 45, 65, 85];

  function comenzarAnalisis() {
  if (!establecimiento || !localidad) {
    alert("Selecciona tu negocio y una localidad.");
    return;
  }

  // Limpiar el resultado anterior
  setResultadoModelo(null);

  // Iniciar recorrido
  setPagina("analisis");
}

  
const analizarLocalidad = async () => {
  try {
    setCargando(true);

    // 1. Consultar el modelo de Machine Learning
    const respuestaModelo = await fetch(
      "http://127.0.0.1:8000/predecir",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo_establecimiento: establecimiento,
          localidad: localidad
        })
      }
    );

    if (!respuestaModelo.ok) {
      throw new Error("No se pudo realizar la predicción.");
    }

    const resultado = await respuestaModelo.json();

    // 2. Consultar el Top 3 de sectores
    const respuestaSectores = await fetch(
      "http://127.0.0.1:8000/top-sectores",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo_establecimiento: establecimiento,
          localidad: localidad
        })
      }
    );

    if (!respuestaSectores.ok) {
      throw new Error("No se pudieron obtener los sectores recomendados.");
    }

    const resultadoSectores = await respuestaSectores.json();

    // 3. Guardar resultados
    setResultadoModelo(resultado);
    setRecomendaciones(resultadoSectores);

    // 4. Mostrar resultados
    setPagina("resultados");

  } catch (error) {
    console.error("Error al conectar con la API:", error);
    alert(error.message || "No fue posible conectar con el modelo.");

  } finally {
    setCargando(false);
  }
};


function irASeccion(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

  return (
    <div className="app">
      {
        pagina !== "resultados" && (
      <header className="header">
        <a className="logo" href="#">
          <span className="logo-icon">
            <Store size={23} />
          </span>
          <span>Local<span className="logo-highlight">IA</span></span>
        </a>

        <span className="header-label">
          Inteligencia para emprender
        </span>
      </header>
     )}

      <main>
        {pagina === "inicio" && (
          <>
             <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">
                <Sparkles size={16} />
                TU PRÓXIMO NEGOCIO COMIENZA AQUÍ
              </span>

              <h1>
                Encuentra el lugar ideal
                <span> para tu negocio.</span>
              </h1>

              <p>
                Descubre el potencial comercial de las localidades
                de Bogotá con ayuda de inteligencia artificial.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  document.getElementById("formulario")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Analizar mi ubicación
                <ArrowRight size={19} />
              </button>

              <div className="hero-benefits">
                <span><MapPin size={16} /> Bogotá</span>
                <span><Sparkles size={16} /> Análisis inteligente</span>
              </div>
            </div>

            <div className="city-scene">
              <div className="sun"></div>
              <div className="cloud cloud-one"></div>
              <div className="cloud cloud-two"></div>

              <div className="city-hill"></div>

              <div className="building building-one">
                <span>LOCAL</span>
                <div className="windows"></div>
              </div>

              <div className="building building-two">
                <span>CAFÉ</span>
                <Coffee size={28} />
              </div>

              <div className="building building-three">
                <span>TIENDA</span>
                <div className="windows"></div>
              </div>

              <div className="tree tree-one">
                <Trees size={54} />
              </div>

              <div className="tree tree-two">
                <Trees size={44} />
              </div>

              <div className="mascot">
                <Bot size={54} />
                <span>¡Hola!</span>
              </div>

              <div className="city-road"></div>
            </div>
          </section>

           <section className="form-section" id="formulario">
            <div className="section-heading">
              <span className="eyebrow">EMPECEMOS</span>
              <h2>Cuéntanos tu idea de negocio</h2>
              <p>Solo necesitamos dos datos para comenzar.</p>
            </div>

            <div className="form-card">
              <label>
                <span><Store size={18} /> Tipo de establecimiento</span>
                <select
                  value={establecimiento}
                  onChange={(e) =>
                    setEstablecimiento(e.target.value)
                  }
                >
                  <option value="">Selecciona tu negocio</option>
                  {establecimientos.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span><MapPin size={18} /> Localidad de Bogotá</span>
                <select
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                >
                  <option value="">Selecciona una localidad</option>
                  {localidades.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="primary-button full-button"
                onClick={comenzarAnalisis}
              >
                Comenzar análisis
                <ArrowRight size={19} />
              </button>
            </div>
          </section>
          </>
         
        )}         
        {pagina === "analisis" && (
          <section className="journey-section">

            <button
              className="back-button"
              onClick={() => setPagina("inicio")}
            >
              <ArrowLeft size={18} />
              Volver
            </button>

            <div className="journey-heading">
              <span className="eyebrow">
                <Sparkles size={16} />
                EXPLORANDO BOGOTÁ
              </span>

              <h2>¡Vamos a encontrar el potencial de tu negocio!</h2>

              <p>
                Nuestro asistente está explorando la localidad de
                <strong> {localidad}</strong> para analizar tu
                <strong> {establecimiento}</strong>.
              </p>
            </div>

            <div className="journey-city">

              <div className="journey-sun"></div>

              <div className="journey-hill"></div>

              <div className="journey-building building-a">
                <span>LOCAL</span>
                <Store size={34} />
              </div>

              <div className="journey-building building-b">
                <span>CAFÉ</span>
                <ShoppingBag size={34} />
              </div>

              <div className="journey-building building-c">
                <span>TIENDA</span>
                <Store size={34} />
              </div>

              <div className="journey-road">
                <div className="road-line"></div>
              </div>

              <div className="journey-stations">
                {etapas.map((item, index) => {
                  const Icon = item.icono;

                  return (
                    <div
                      key={index}
                      className={`station ${
                        index <= etapa ? "station-active" : ""
                      }`}
                      style={{ left: `${posicionesRobot[index]}%` }}
                    >
                      <div className="station-icon">
                        <Icon size={22} />
                      </div>

                      <span>{index + 1}</span>
                    </div>
                  );
                })}
              </div>

              <motion.div
                className="journey-robot"
                animate={{
                  left: `${posicionesRobot[etapa]}%`
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut"
                }}
              >
                <Bot size={48} />
                <span>Localito</span>
              </motion.div>

            </div>

            <div className="journey-progress-card">

              <div className="current-stage-icon">
                <IconoEtapa size={30} />
              </div>

              <div className="stage-information">
                <span className="stage-counter">
                  ETAPA {etapa + 1} DE {etapas.length}
                </span>

                <h3>{etapas[etapa].titulo}</h3>

                <p>{etapas[etapa].descripcion}</p>

                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    animate={{
                      width: `${((etapa + 1) / etapas.length) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

            </div>

            {etapa === etapas.length - 1 && (
              <div className="journey-complete">
                <Sparkles size={24} />
                <h3>¡Nuestro recorrido ha terminado!</h3>

                <p>
                  Ya puedes continuar a la pantalla de resultados.
                  Recuerda que esta versión utiliza un recorrido
                  demostrativo, todavía sin conexión al modelo.
                </p>

                <button
                  className="primary-button"
                  onClick={analizarLocalidad} disabled={cargando}
                >
                  {cargando ? "Analizando..." : "Analizar ubicación"}
                  <ArrowLeft
                    size={18}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </button>
              </div>
            )}

          </section>
        )}
        {pagina === "resultados" && (
          <section className="dashboard-page">

            {/* BARRA LATERAL */}

            <aside className="dashboard-sidebar">

              <div className="sidebar-brand">
                <span className="logo-icon">
                  <Store size={23} />
                </span>
                <span>Local<span className="logo-highlight">IA</span></span>
              </div>

              <span className="sidebar-section-label">ANÁLISIS</span>

              <nav className="sidebar-nav">

                <button
                  className="sidebar-link active"
                  onClick={() => irASeccion("dashboard-resumen")}
                >
                  <LayoutDashboard size={19} />
                  Resumen
                </button>

                <button
                  className="sidebar-link"
                  onClick={() => irASeccion("dashboard-mapa")}
                >
                  <MapIcon size={19} />
                  Mapa
                </button>

                <button
                  className="sidebar-link"
                  onClick={() => irASeccion("dashboard-ranking")}
                >
                  <Trophy size={19} />
                  Top 3 zonas
                </button>

                <button
                  className="sidebar-link"
                  onClick={() => irASeccion("dashboard-indicadores")}
                >
                  <BarChart3 size={19} />
                  Indicadores
                </button>

              </nav>

              <div className="sidebar-bottom">
                <div className="sidebar-project">
                  <Bot size={23} />
                  <div>
                    <strong>Localito</strong>
                    <small>Asistente de LocalIA</small>
                  </div>
                </div>

                <button
                  className="sidebar-back"
                  onClick={() => setPagina("inicio")}
                >
                  <ArrowLeft size={17} />
                  Volver al inicio
                </button>
              </div>

            </aside>


            {/* CONTENIDO PRINCIPAL */}

            <div className="dashboard-content">

              {/* ENCABEZADO */}

              <header className="dashboard-header">

                <div>
                  <span className="dashboard-eyebrow">
                    <Sparkles size={15} />
                    PANEL DE INTELIGENCIA COMERCIAL
                  </span>

                  <h1>Resumen del análisis</h1>

                  <p>
                    Resultados para tu <strong>{establecimiento}</strong>
                    {" "}en <strong>{localidad}</strong>.
                  </p>
                </div>

                <button
                  className="dashboard-new-analysis"
                  onClick={() => setPagina("inicio")}
                >
                  <RotateCcw size={17} />
                  Nuevo análisis
                </button>

              </header>


              {/* RESUMEN Y TARJETAS KPI */}

              <section id="dashboard-resumen" className="dashboard-section">

                <div className="dashboard-welcome">
                  <div>
                    <span className="dashboard-welcome-label">
                      RESULTADO GENERAL
                    </span>

                    <h2>
                      Tu análisis está listo
                    </h2>

                    <p>
                      Consulta el potencial comercial de la localidad
                      y las zonas destacadas para tu establecimiento.
                    </p>
                  </div>

                  <div className="dashboard-welcome-icon">
                    <Sparkles size={35} />
                  </div>
                </div>


                <div className="dashboard-kpis">

                  <div className="dashboard-kpi">
                    <div className="kpi-icon kpi-green">
                      <TrendingUp size={21} />
                    </div>

                    <span>Clasificación del modelo</span>

                    <strong>
                      {resultadoModelo?.categoria || "Sin resultado"}
                    </strong>

                    <small>
                      Clase: {resultadoModelo?.clase ?? "N/D"}
                    </small>
                  </div>


                  <div className="dashboard-kpi">
                    <div className="kpi-icon kpi-blue">
                      <MapIcon size={21} />
                    </div>

                    <span>Sectores evaluados</span>

                    <strong>
                      {recomendaciones?.total_sectores_evaluados ?? 0}
                    </strong>

                    <small>
                      Localidad de {localidad}
                    </small>
                  </div>


                  <div className="dashboard-kpi">
                    <div className="kpi-icon kpi-orange">
                      <Trophy size={21} />
                    </div>

                    <span>Zonas destacadas</span>

                    <strong>
                      {recomendaciones?.top_3?.length ?? 0}
                    </strong>

                    <small>
                      Sectores recomendados
                    </small>
                  </div>


                  <div className="dashboard-kpi">
                    <div className="kpi-icon kpi-purple">
                      <Store size={21} />
                    </div>

                    <span>Establecimiento</span>

                    <strong className="kpi-business">
                      {establecimiento}
                    </strong>

                    <small>
                      Tipo de negocio analizado
                    </small>
                  </div>

                </div>

              </section>


              {/* MAPA Y TOP 3 */}

              <div className="dashboard-main-grid">

                {/* MAPA */}

                <section
                  id="dashboard-mapa"
                  className="dashboard-panel dashboard-map-panel"
                >

                  <div className="dashboard-panel-heading">
                    <div>
                      <span className="dashboard-panel-label">
                        EXPLORACIÓN GEOGRÁFICA
                      </span>

                      <h3>Mapa de oportunidades</h3>

                      <p>
                        Sectores catastrales de {localidad}.
                      </p>
                    </div>

                    <div className="panel-icon">
                      <MapPin size={21} />
                    </div>
                  </div>

                  <BogotaMap
                    localidad={localidad}
                    sectoresDestacados={
                      recomendaciones?.top_3?.map(
                        sector => sector.codigo
                      ) || []
                    }
                  />

                  <div className="dashboard-map-footer">
                    <MapPin size={15} />
                    Selecciona un sector para consultar su información.
                  </div>

                </section>


                {/* TOP 3 */}

                <section
                  id="dashboard-ranking"
                  className="dashboard-panel dashboard-ranking-panel"
                >

                  <div className="dashboard-panel-heading">
                    <div>
                      <span className="dashboard-panel-label">
                        RECOMENDACIONES
                      </span>

                      <h3>Top 3 zonas</h3>

                      <p>
                        Sectores con mayor puntuación.
                      </p>
                    </div>

                    <div className="panel-icon">
                      <Trophy size={21} />
                    </div>
                  </div>


                  <div className="dashboard-ranking-list">

                    {recomendaciones?.top_3?.length > 0 ? (

                      recomendaciones.top_3.map((sector, index) => (

                        <article
                          className="dashboard-ranking-item"
                          key={sector.codigo}
                        >

                          <div className={`ranking-number ranking-${index + 1}`}>
                            {index + 1}
                          </div>

                          <div className="ranking-content">

                            <div className="ranking-title">
                              <h4>{sector.nombre}</h4>

                              <strong>
                                {Number(sector.puntaje).toFixed(1)}
                              </strong>
                            </div>

                            <span className="ranking-category">
                              {sector.categoria}
                            </span>

                            <div className="ranking-progress">
                              <div
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, Number(sector.puntaje) || 0)
                                  )}%`
                                }}
                              />
                            </div>

                            <small>
                              Código: {sector.codigo}
                            </small>

                          </div>

                        </article>

                      ))

                    ) : (

                      <p className="dashboard-empty">
                        No hay sectores recomendados disponibles.
                      </p>

                    )}

                  </div>


                  <div className="dashboard-ranking-footer">
                    <Sparkles size={16} />

                    Evaluación de {
                      recomendaciones?.total_sectores_evaluados ?? 0
                    } sectores.
                  </div>

                </section>

              </div>


              {/* INDICADORES */}

              <section
                id="dashboard-indicadores"
                className="dashboard-panel dashboard-indicators-panel"
              >

                <div className="dashboard-panel-heading">
                  <div>
                    <span className="dashboard-panel-label">
                      DATOS DEL ANÁLISIS
                    </span>

                    <h3>Indicadores comerciales</h3>

                    <p>
                      Información demostrativa para explorar la interfaz.
                    </p>
                  </div>

                  <div className="panel-icon">
                    <BarChart3 size={21} />
                  </div>
                </div>


                <div className="dashboard-metrics">

                  <div className="dashboard-metric metric-blue">
                    <Users size={23} />
                    <span>Población</span>
                    <strong>{resultadoDemo.poblacion}</strong>
                    <small>Dato calculado</small>
                  </div>

                  <div className="dashboard-metric metric-orange">
                    <Store size={23} />
                    <span>Competencia</span>
                    <strong>{resultadoDemo.competencia}</strong>
                    <small>Dato calculado</small>
                  </div>

                  <div className="dashboard-metric metric-green">
                    <Footprints size={23} />
                    <span>Flujo de personas</span>
                    <strong>{resultadoDemo.flujo}</strong>
                    <small>Dato calculado</small>
                  </div>

                  <div className="dashboard-metric metric-purple">
                    <ShoppingBag size={23} />
                    <span>Demanda</span>
                    <strong>{resultadoDemo.demanda}</strong>
                    <small>Dato calculado</small>
                  </div>

                </div>

              </section>


              {/* FORTALEZAS Y RIESGOS */}

              <div className="dashboard-bottom-grid">

                <section className="dashboard-panel">

                  <div className="dashboard-panel-heading">
                    <div>
                      <span className="dashboard-panel-label">
                        ASPECTOS FAVORABLES
                      </span>

                      <h3>Fortalezas</h3>
                    </div>

                    <CheckCircle size={22} color="#159b70" />
                  </div>

                  {resultadoDemo.fortalezas.map((item, index) => (

                    <div className="dashboard-list-item" key={index}>
                      <CheckCircle size={17} />
                      <p>{item}</p>
                    </div>

                  ))}

                </section>


                <section className="dashboard-panel">

                  <div className="dashboard-panel-heading">
                    <div>
                      <span className="dashboard-panel-label">
                        ASPECTOS POR REVISAR
                      </span>

                      <h3>Riesgos a considerar</h3>
                    </div>

                    <AlertTriangle size={22} color="#d18a2e" />
                  </div>

                  {resultadoDemo.riesgos.map((item, index) => (

                    <div
                      className="dashboard-list-item dashboard-risk-item"
                      key={index}
                    >
                      <AlertTriangle size={17} />
                      <p>{item}</p>
                    </div>

                  ))}

                </section>

              </div>


              {/* RECOMENDACIONES */}

              <section className="dashboard-recommendations">

                <div className="recommendations-heading">
                  <div className="recommendations-bot">
                    <Bot size={29} />
                  </div>

                  <div>
                    <span>LOCALITO TE RECOMIENDA</span>
                    <h3>Antes de abrir tu negocio...</h3>
                  </div>
                </div>

                <div className="recommendations-grid">

                  {resultadoDemo.recomendaciones.map((item, index) => (

                    <div className="dashboard-recommendation" key={index}>
                      <span>{index + 1}</span>
                      <p>{item}</p>
                    </div>

                  ))}

                </div>

              </section>


              {/* AVISO DE SIMULACIÓN */}

              <div className="dashboard-demo-notice">

                <AlertTriangle size={20} />

                <div>
                  <strong>Información demostrativa</strong>

                  <p>
                    La clasificación del modelo proviene de un modelo de
                    Machine Learning entrenado con 500 registros sintéticos.
                    Los indicadores comerciales, fortalezas, riesgos y
                    recomendaciones generales son simulados. El Top 3
                    utiliza indicadores sintéticos y una puntuación ponderada.
                    Estos resultados no representan mediciones comerciales
                    verificadas ni garantizan el éxito de un negocio.
                  </p>
                </div>

              </div>


              {/* ACCIONES */}

              <div className="dashboard-actions">

                <button
                  className="dashboard-new-analysis"
                  onClick={() => setPagina("inicio")}
                >
                  <RotateCcw size={17} />
                  Realizar otro análisis
                </button>

              </div>

            </div>

          </section>
        )}

      </main>

      <footer>
        <Building2 size={17} />
        LocalIA · Proyecto de inteligencia artificial
      </footer>
    </div>
  );
}

export default App;
