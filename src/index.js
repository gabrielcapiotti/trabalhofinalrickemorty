const api = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});

const cards = document.getElementById("cards");
const cardsPerPage = 6;
let currentPage = 1;

async function renderizarCards(pageNumber, filtro = '') {
  try {
    let response;
    if (filtro) {
      response = await api.get(`/character?name=${filtro}&page=${pageNumber}`);
    } else {
      response = await api.get(`/character?page=${pageNumber}`);
    }
    
    const characters = response.data.results;

    let cardHtml = "";

    const startIndex = (pageNumber - 1) * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, characters.length);

    for (let i = startIndex; i < endIndex; i++) {
      const character = characters[i];
      const statusClass = getStatusClass(character.status);
      cardHtml += `
        <div class="card mb-3 me-3 mt-3" style="max-width: 520px; background-color: rgb(61, 61, 61); ">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${character.image}" class="card-img-top img-fluid" style="height: 230px; width: 400px;" alt="...">
            </div>
            <div class="col-md-8" style="max-height: 230px;">
              <div class="card-body" style="max-height: 230px;">
                <h5 class="card-text" id="characterName">${character.name}</h5>
                <section class="função">
                  <div class="informação">
                    <div class="d-flex">
                      <div class="status ${statusClass}"></div>
                      <p id="characterStatus">${character.status}</p>
                    </div>
                    <p class="entitular">Localização:</p>
                    <p class="localizacao" id="characterLocation">${character.location.name}</p>
                    <p class="entitular">Primeira Aparição:</p>
                    <p class="episodio" id="characterFirstAppearance">${character.episode[0]}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    cards.innerHTML = cardHtml;
  } catch (error) {
    console.log(error);
  }
}

async function renderizarValores() {
  try {
    const [responseCharacters, responseLocations, responseEpisodes] = await Promise.all([
      api.get("/character"),
      api.get("/location"),
      api.get("/episode")
    ]);

    const totalCharacters = responseCharacters.data.info.count;
    const totalLocations = responseLocations.data.info.count;
    const totalEpisodes = responseEpisodes.data.info.count;

    document.getElementById("totalCharacters").innerText = totalCharacters;
    document.getElementById("totalLocations").innerText = totalLocations;
    document.getElementById("totalEpisodes").innerText = totalEpisodes;
  } catch (error) {
    console.log(error);
  }
}

// Função para ir para a próxima página
function nextPage() {
  currentPage++;
  renderizarCards(currentPage);
}

// Função para ir para a página anterior
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderizarCards(currentPage);
  }
}

// Adicione um evento de entrada ao campo de pesquisa
const campoPesquisa = document.querySelector('.form-control');
campoPesquisa.addEventListener('input', () => {
  const filtro = campoPesquisa.value.trim();
  renderizarCards(currentPage, filtro);
});

function getStatusClass(status) {
  if (status === 'Alive') {
    return 'alive';
  } else if (status === 'Dead') {
    return 'dead';
  } else {
    return 'unknown';
  }
}

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o envio do formulário padrão

  const searchTerm = document.querySelector('input[type="search"]').value.toLowerCase();

  // Filtrar personagens com base no termo de pesquisa
  const filteredCharacters = personagens.filter(character => {
      const fullName = `${character.name.toLowerCase()} ${character.last_name.toLowerCase()}`;
      return fullName.includes(searchTerm);
  });

  // Renderizar os cards filtrados
  renderFilteredCards(filteredCharacters);
});

function renderFilteredCards(filteredCharacters) {
  const cardHtml = filteredCharacters.map(character => `
    <div class="card mb-3 me-3 mt-3" style="max-width: 520px; background-color: rgb(61, 61, 61); ">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${character.image}" class="card-img-top img-fluid" style="height: 230px; width: 400px;" alt="...">
        </div>
        <div class="col-md-8" style="max-height: 230px;">
          <div class="card-body" style="max-height: 230px;">
            <h5 class="card-text" id="characterName">${character.name}</h5>
            <section class="função">
              <div class="informação">
                <div class="d-flex">
                  <div class="status ${getStatusClass(character.status)}"></div>
                  <p id="characterStatus">${character.status}</p>
                </div>
                <p class="entitular">Localização:</p>
                <p class="localizacao" id="characterLocation">${character.location.name}</p>
                <p class="entitular">Primeira Aparição:</p>
                <p class="episodio" id="characterFirstAppearance">${character.episode[0]}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById("filteredCards").innerHTML = cardHtml;
}

renderizarCards(currentPage);
renderizarValores();
