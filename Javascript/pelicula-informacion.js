async function dibujarWeb() {
	const API_KEY = "4fdf950cfe85e6288de8a6fdec330711";
	const URL_BASE = `https://api.themoviedb.org/3/movie/`;
	const LENGUAJE = "?language=es-MX";
	const id = localStorage.getItem("id");

	//LLamada al endpoint detalles
	let response = await fetch(
		`${URL_BASE}${id}${LENGUAJE}&api_key=${API_KEY}`
	);
	let data = await response.json();
	let titulo = data.title;
	let imagenFondo =
		"https://image.tmdb.org/t/p/original" + data.backdrop_path;
	let portada = "https://image.tmdb.org/t/p/w300" + data.poster_path;
	let resenia = data.overview;
	//Si no esta la reseña en la parte español mexico la traigo desde español españa
	if (resenia == "") {
		let response = await fetch(
			`${URL_BASE}${id}?language=es&api_key=${API_KEY}`
		);
		let data = await response.json();
		resenia =
			data.overview.trim() == ""
				? "Información no disponible por el momento"
				: data.overview.trim();
	}
	let fechaLanzamiento = data.release_date;
	fechaLanzamiento = acomodarFecha(fechaLanzamiento);
	let generos = data.genres.map((genero) => " " + genero.name).join();
	let duracion;
	if (data.runtime == 0) {
		duracion = "";
	} else {
		let horas = Math.floor(data.runtime / 60);
		let minutosRestantes = data.runtime % 60;
		duracion = `• ${horas}h ${minutosRestantes} ${
			minutosRestantes === 1 ? "minuto" : "minutos"
		}`;
	}

	const section1 = document.querySelector(".section_1");
	section1.innerHTML = `
				<div class="section_1-contenido">
					<div class="portada-pelicula">
						<img src="${portada}" alt="imagen-pelicula"/>
					</div>
					<div class="informacion">
						<div class="tituloYClasificacion">
							<h2>${titulo}.</h2>
							<p>
								${fechaLanzamiento} • ${generos}  ${duracion}
							</p>
						</div>
						<div class="descripcion">
							<h3>Reseña</h3>
							<p>
                            ${resenia}.
							</p>
						</div>
						<div class="infodirectores">
						</div>
					</div>
				</div>`;

	/* CAMBIAR PORTADA */
	const gradiente =
		"linear-gradient(to right top, rgba(0, 0, 0, 0.54), rgba(177, 176, 176, 0.742))";
	const urlImagen = `url(${imagenFondo})`;
	section1.style.background = `${gradiente} center center / cover, ${urlImagen}`;
	section1.style.backgroundRepeat = "no-repeat";
	section1.style.backgroundSize = "cover";
	section1.style.backgroundPosition = "top";
	// Establecer el fondo combinando el gradiente y la imagen de fondo

	/* Secction 2 */

	const keyYoutube = await buscarTrailer(id, API_KEY);
	let presupuesto =
		data.budget == 0
			? "No disponible"
			: "$" + data.budget.toLocaleString("de-DE");
	let recaudacion =
		data.revenue == 0
			? "No disponible"
			: "$" + data.revenue.toLocaleString("de-DE");
	let estado = data.status == "Released" ? "Estrenada" : "No estrenada";
	let puntuacion =
		data.vote_average == 0
			? "No disponible"
			: Number(data.vote_average).toFixed(1);
	let cantidadVotos =
		data.vote_count == 0 ? "No disponible" : data.vote_count;

	const section2 = document.querySelector(".section_2");
	section2.innerHTML = `
<div class="section_2-contenido">
<div class="iframe-contenedor">
    <iframe
        id="iframe-youtube"
        src="https://www.youtube.com/embed/${keyYoutube}?rel=0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
    ></iframe>
</div>

<div class="section_2-contenedor">
    <h3>Información</h3>
    
    <div class="redes">
        <a href="#"><i class="fa-brands fa-facebook fa-2x"></i></a>
        <a href="#"><i class="fa-brands fa-twitter fa-2x"></i></a>
        <a href="#"><i class="fa-brands fa-instagram fa-2x"></i></a>
        <a href="#"><i class="fa-solid fa-link fa-2x"></i></a>
    </div>

    <table>
        <tr>
            <td>Puntuación</td>
            <td>${puntuacion}</td>
        </tr>
        <tr>
            <td>Cantidad de votos</td>
            <td>${cantidadVotos}</td>
        </tr>
        <tr>
            <td>Costo</td>
            <td>${presupuesto}</td>
        </tr>
        <tr>
            <td>Recaudación</td>
            <td>${recaudacion}</td>
        </tr>
        <tr>
            <td>Estado</td>
            <td>${estado}</td>
        </tr>
    </table>
</div>
</div>`;
	dibujarActoresDirectoresEscritores(id, LENGUAJE, API_KEY);
}

async function buscarTrailer(id, API_KEY) {
	//Hacemos un fetch para conseguir el trailer de youtube
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/${id}/videos?language=es-MX&api_key=${API_KEY}`
	);
	let data = await response.json();
	let keyYoutube = "";

	// Buscar el tráiler en español latino
	for (let video of data.results) {
		if (video.type === "Trailer" && !video.name.includes("Subtitulado")) {
			keyYoutube = video.key;
			break;
		}
	}
	if (keyYoutube !== "") {
		return keyYoutube;
	}

	// Si no se encuentra, buscar en español de España
	let responseEspania = await fetch(
		`https://api.themoviedb.org/3/movie/${id}/videos?language=es&api_key=${API_KEY}`
	);
	let dataEspania = await responseEspania.json();
	console.log(dataEspania);
	for (let video of dataEspania.results) {
		if (video.type === "Trailer") {
			keyYoutube = video.key;
		}
	}
	if (keyYoutube !== "") {
		return keyYoutube;
	}

	// Si aún no se encuentra, buscar cualquier tráiler disponible
	for (let video of data.results) {
		if (video.type === "Trailer" && video.key) {
			keyYoutube = video.key;
			break;
		}
	}
	if (keyYoutube !== "") {
		return keyYoutube;
	}

	// Como última opción busco en inglés
	response = await fetch(
		`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${API_KEY}`
	);
	data = await response.json();
	for (let video of data.results) {
		if (video.type === "Trailer") {
			keyYoutube = video.key;
			break;
		}
	}
	return keyYoutube;
}

async function dibujarActoresDirectoresEscritores(id, LENGUAJE, API_KEY) {
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${id}/credits${LENGUAJE}&api_key=${API_KEY}`
	);
	const data = await response.json();

	const escritoresDirectores = [];
	const nombresRegistrados = new Set();

	data.crew.forEach((escritorDirector) => {
		if (
			(escritorDirector.known_for_department === "Directing" ||
				escritorDirector.known_for_department === "Writing") &&
			!nombresRegistrados.has(escritorDirector.name)
		) {
			escritoresDirectores.push({
				rol: escritorDirector.known_for_department,
				nombre: escritorDirector.name,
				personaje: escritorDirector.character,
				foto: escritorDirector.profile_path
					? "https://image.tmdb.org/t/p/original" +
					  escritorDirector.profile_path
					: "",
			});
			nombresRegistrados.add(escritorDirector.name);
		}
	});

	let escritores = escritoresDirectores
		.filter((escritor) => escritor.rol === "Writing")
		.slice(0, 2);
	let directores = escritoresDirectores
		.filter((director) => director.rol === "Directing")
		.slice(0, 2);

	let arrayHTML = [];

	directores.forEach((persona) => {
		arrayHTML.push(`
                <div>
                    <h4>${persona.nombre}</h4>
                    <p>Director</p>
                </div>
            `);
	});

	escritores.forEach((persona) => {
		arrayHTML.push(`
                <div>
                    <h4>${persona.nombre}</h4>
                    <p>Escritor</p>
                </div>
            `);
	});

	const CONTENEDOR = document.querySelector(".infodirectores");
	CONTENEDOR.innerHTML = `${arrayHTML.join("")}`;

	const actores = [];
	const nombreGuardados = new Set();

	let actoresCast = data.cast;
	console.log(actoresCast);
	//Primero vemos si el array tiene 15 elementos, si no los tiene dibujo todos, si tiene mas de 15 solo dibujo 15
	if (actoresCast.length < 15) {
		for (let i = 0; i < actoresCast.length; i++) {
			if (
				!nombreGuardados.has(actoresCast[i].name) &&
				actoresCast[i].profile_path != null
			) {
				actores.push({
					nombre: actoresCast[i].name,
					personaje: actoresCast[i].character,
					foto:
						"https://image.tmdb.org/t/p/original" +
						actoresCast[i].profile_path,
				});
				nombresRegistrados.add(actoresCast[i].name);
			}
		}
	} else {
		for (let i = 0; i < 15; i++) {
			if (
				!nombresRegistrados.has(actoresCast[i].name) &&
				actoresCast[i].profile_path != null
			) {
				actores.push({
					nombre: actoresCast[i].name,
					personaje: actoresCast[i].character,
					foto:
						"https://image.tmdb.org/t/p/original" +
						actoresCast[i].profile_path,
				});
				nombresRegistrados.add(actoresCast[i].name);
			}
		}
	}

	const CONTENEDOR_PRINCIPAL = document.querySelector(".actores");
	let estructuraHtml = actores.map((actor) => {
		return `
    <div class="actorItem">
							<img
								class="imgActor"
								src=${actor.foto}
                                alt="${actor.nombre}"
							/>
                            <div class="actor_info">
                                <span class="actor_personaje">${actor.personaje}</span>
                                <span class="actor_nombre">${actor.nombre}</span>
                            </div>
					</div>`;
	});
	CONTENEDOR_PRINCIPAL.innerHTML = `${estructuraHtml.join("")}`;
}

function acomodarFecha(fecha) {
	let fechaArray = fecha.split("-");
	let fechaNueva = fechaArray[2] + "-" + fechaArray[1] + "-" + fechaArray[0];
	return fechaNueva;
}

dibujarWeb();
