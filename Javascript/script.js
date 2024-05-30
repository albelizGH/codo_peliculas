const API_KEY = "4fdf950cfe85e6288de8a6fdec330711";
const URL_BASE = "https://api.themoviedb.org/3";
const URL_TENDENCIAS = `${URL_BASE}/discover/movie?language=es-MX&page=`;
const URL_ACLAMADAS = `${URL_BASE}/movie/top_rated?region=AR%2CUS%2CCA%2CGB%2CES%2CMX&language=es&page=`;
const URL_IMAGEN_BASICA = "https://image.tmdb.org/t/p/w300";
let pagina = 1;

const BOTON_SIGUIENTE = document.querySelector(".button-next");
const BOTON_ATRAS = document.querySelector(".button-back");
const LOGO = document.querySelector(".logo");
const BUSCADOR = document.getElementById("buscador");

dibujarWeb(pagina);

BOTON_SIGUIENTE.addEventListener("click", () => cambiarPagina(1));
BOTON_ATRAS.addEventListener("click", () => cambiarPagina(-1));
LOGO.addEventListener("click", () => dibujarTendencias(1));
document.querySelector(".section-busqueda-boton").addEventListener("click", realizarBusqueda);

async function dibujarWeb(pagina) {
	dibujarTendencias(pagina);
	dibujarAclamadas(pagina);
}

async function dibujarTendencias(pagina) {
	const CONTENEDOR_PRINCIPAL = document.querySelector(".cont-all-movies");
	const url = `${URL_TENDENCIAS}${pagina}&primary_release_date=2024&region=AR%2CUS%2CMX%2CES&sort_by=popularity.desc&year=2024&api_key=${API_KEY}`;
	const resultados = await obtenerDatos(url);

	const estructuraHtml = resultados
		.map((pelicula) => crearTarjetaPelicula(pelicula))
		.join("");
	CONTENEDOR_PRINCIPAL.innerHTML = estructuraHtml;
	setearIDLocalStorage(".div-cont-img-movie");
}

async function dibujarAclamadas(pagina) {
	const CONTENEDOR_PRINCIPAL = document.querySelector(".aclamadas");
	const url = `${URL_ACLAMADAS}${pagina}&api_key=${API_KEY}`;
	const resultados = await obtenerDatos(url);
	resultados.sort(
		(a, b) => new Date(b.release_date) - new Date(a.release_date)
	);

	const estructuraHtml = resultados
		.map((pelicula) => crearTarjetaPeliculaAclamada(pelicula))
		.join("");
	CONTENEDOR_PRINCIPAL.innerHTML = estructuraHtml;
	setearIDLocalStorage(".peliculaItem");
}

async function obtenerDatos(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data.results;
}

function crearTarjetaPelicula(pelicula) {
	return `
        <div class="div-cont-img-movie" data-id="${pelicula.id}">
            <a href="./html/pelicula-informacion.html" target="_blank">
                <img src="${URL_IMAGEN_BASICA}${pelicula.poster_path}" alt="${pelicula.title}" class="size-movie"/>
            </a>
            <div class="movie-title">${pelicula.title}</div>
        </div>`;
}

function crearTarjetaPeliculaAclamada(pelicula) {
	return `
        <div data-id="${pelicula.id}" class="peliculaItem">
            <a href="./html/pelicula-informacion.html" target="_blank">
                <img class="imgAclamada" src="${URL_IMAGEN_BASICA}${pelicula.poster_path}" alt="${pelicula.title}"/>
            </a>
        </div>`;
}

function setearIDLocalStorage(selector) {
	const peliculas = document.querySelectorAll(selector);
	peliculas.forEach((pelicula) => {
		pelicula.addEventListener("click", function () {
			const id = this.getAttribute("data-id");
			localStorage.setItem("id", id);
		});
	});
}

function cambiarPagina(direccion) {
	pagina += direccion;
	if (pagina < 1) {
		pagina = 1;
		return;
	}
	document
		.getElementById("tendencias")
		.scrollIntoView({ behavior: "smooth" });
	dibujarTendencias(pagina);
}

function realizarBusqueda() {
	localStorage.setItem("busquedaInicial", BUSCADOR.value);
	window.location.href = "./html/busqueda.html";
}
