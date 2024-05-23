const URL_TENDENCIAS = `'https://api.themoviedb.org/3/movie/now_playing?language=es-MX&page=`;
const API_KEY = "4fdf950cfe85e6288de8a6fdec330711";
let pagina=1;
const BOTON_SIGUIENTE=document.querySelector('.button-next');
const BOTON_ATRAS=document.querySelector('.button-back');
const LOGO=document.querySelector('.logo');

function dibujarWeb(pagina) {
	dibujarTendencias(pagina);
    dibujarAclamadas();
}
async function dibujarTendencias(pagina) {
    const CONTENEDOR_PRINCIPAL=document.querySelector('.cont-all-movies');
    const URL_IMAGEN_BASICA="https://image.tmdb.org/t/p/w300";
	let response =await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=es&page=${pagina}&api_key=${API_KEY}`);
	let data = await response.json();
	let resultados = data.results;
    console.log(resultados)
	let estructuraHtml=resultados
                .map(pelicula=>{return`
                <div class="div-cont-img-movie" data-id="${pelicula.id}">
                    <a href="./html/pelicula-informacion.html" target="_blank">
                    <img
                        src=${URL_IMAGEN_BASICA}${pelicula.poster_path}
                        alt="${pelicula.title}"
                        class="size-movie"
                    /></a>
                    <div class="movie-title">${pelicula.title}</div>
                </div>`
                }
                );
    CONTENEDOR_PRINCIPAL.innerHTML=`${estructuraHtml.join("")}`;

     // Asignar evento después de renderizar las películas
     const peliculasTendencias = document.querySelectorAll('.div-cont-img-movie');
     peliculasTendencias.forEach(pelicula => {
         pelicula.addEventListener('click', function () {
             let id = this.getAttribute('data-id');
             localStorage.setItem("id", id);
         });
     });
}

async function dibujarAclamadas(){
    const CONTENEDOR_PRINCIPAL=document.querySelector('.aclamadas');
    const URL_IMAGEN_BASICA="https://image.tmdb.org/t/p/w300";
	let response =await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=es&page=${pagina}&api_key=${API_KEY}`);
	let data = await response.json();
	let resultados = data.results;
	let estructuraHtml=resultados.map(pelicula=>{return`
    <div data-id="${pelicula.id}" class="peliculaItem">
						<a href="./html/pelicula-informacion.html" target="_blank">
							<img
								class="imgAclamada"
								src=${URL_IMAGEN_BASICA}${pelicula.poster_path}
								alt="${pelicula.title}"
							/>
						</a>
					</div>`
    }
    )
    CONTENEDOR_PRINCIPAL.innerHTML=`${estructuraHtml.join("")}`;

    const peliculasAclamadas = document.querySelectorAll('.peliculaItem');
     peliculasAclamadas.forEach(pelicula => {
         pelicula.addEventListener('click', function () {
             let id = this.getAttribute('data-id');
             localStorage.setItem("id", id);
         });
     });
}


BOTON_SIGUIENTE.addEventListener('click',()=>{
    pagina++;
    document.getElementById('tendencias').scrollIntoView({ behavior: 'smooth' });
    dibujarTendencias(pagina);
})

BOTON_ATRAS.addEventListener('click',()=>{
    if(pagina==1){return;}
    pagina--;
    document.getElementById('tendencias').scrollIntoView({ behavior: 'smooth' });
    dibujarTendencias(pagina);
})

LOGO.addEventListener('click',()=>{
    dibujarTendencias(1);
    
});


dibujarWeb(1);
