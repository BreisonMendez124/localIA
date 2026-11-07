# LocalIA - Frontend

Aplicación web de **LocalIA**, una herramienta de análisis y recomendación de ubicaciones para nuevos establecimientos comerciales en Bogotá.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- CSS
- React Leaflet
- Leaflet
- Framer Motion
- Lucide React

## Requisitos previos

Antes de ejecutar el proyecto, debes tener instalado:

- [Node.js](https://nodejs.org/)
- npm (se instala junto con Node.js)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/TU-USUARIO/LocalIA.git
   ```

2. Ingresa a la carpeta del frontend:

   ```bash
   cd LocalIA
   ```

   Si el frontend está dentro de una carpeta llamada `frontend`, ingresa también a ella:

   ```bash
   cd frontend
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

## Ejecución

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará una dirección local, normalmente:

```text
http://localhost:5173
```

Abre esa dirección en tu navegador.

## Conexión con el backend

El frontend consume los servicios de la API desarrollada con FastAPI.

Para utilizar todas las funcionalidades, el backend debe estar iniciado y disponible en la dirección configurada en el frontend.

Dirección local utilizada durante el desarrollo:

```text
http://127.0.0.1:8000
```

Consulta el README del backend para conocer sus instrucciones de instalación y ejecución.

## Notas

Este proyecto forma parte de LocalIA, una solución demostrativa de análisis de ubicaciones comerciales en Bogotá.

Algunos indicadores y resultados se generan mediante datos sintéticos, por lo que deben interpretarse como simulaciones y no como mediciones comerciales reales.