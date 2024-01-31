const characterContainer = document.querySelector('.cards-list');
let isSearchActive;
const paginationContainer = document.getElementById('pagination-container');
let currentPage = 1;
const itemsPerPage = 6;
const totalPages = 138;

function ArrayWithCounter(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

async function fetchCharacters(page) {
  try {
    const start = (page - 1) * itemsPerPage + 1;
    const end = page * itemsPerPage;
    const parameter = ArrayWithCounter(start, end);

    const response = await api.get(`/character/${parameter.join(',')}`);
    const characters = response.data;
    renderCharacters(characters);
    console.log(characters);

  } catch (error) {
    console.error('Error fetching characters:', error);
  }
}

function renderCharacters(characters) {
    characterContainer.innerHTML = '';
    characters.forEach(async character => {
        const card = document.createElement('div');
        const content = document.createElement('div');
            let cardClass;
            if (character.status == "Alive") {
                cardClass = 'dot-alive'
                } else if (character.status === "Dead") {
                    cardClass = 'dot-dead'
                } else {
                    cardClass = 'dot-unknown'
                }
            card.classList.add('card')
            card.classList.add('bg-black')
            card.style.border= '5px solid #009b00'
            card.style.height= '300px'
            card.style.flexDirection = 'row'
            card.style.animation = 'dropshadows 2s infinite'
            card.data
            content.classList.add('content')
            content.style.flexDirection = 'column'
            const episodeLink = await getEpisode(character.episode[character.episode.length - 1])
            card.innerHTML = `
            <img class="card-image" src="${character.image}">
            `
            content.innerHTML = `
                <h2 class="card-title" > ${character.name}</h2>
                <h3 class="card-status" ><span class="dot ${cardClass}"></span>${character.status} - ${character.species}</h3>
                <p class="card-location">
                    Última localização conhecida <br> ${character.location.name}</p>
                <p class="card-episode">
                    Visto pela última vez em: ${episodeLink}</p>
                    <button id="modalButton" type="button" onclick="openModal(${character.id})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" style="font-family: Space Mono">
                    <i class="bi bi-plus-lg"></i> INFO
                    </button>`;
            card.append(content);
            characterContainer.append(card);
       
        async function getEpisode(link) {
            const response = await api.get(link)
            return response.data.name
         }
        });
}

function renderContent(data) {
    characterContainer.innerHTML = '';
    if (isSearchActive) {
        renderCharacters(data);
    } else {
        renderPaginationButtons();
        renderCharacters(data);
    }
}

async function getEpisode(link) {
    const response = await api.get(link);
    return response.data.name;
}

function renderPaginationButtons() {
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => onPrevButtonClick());
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => onNextButtonClick());
    paginationContainer.appendChild(nextButton);
}

async function onPrevButtonClick() {
    if (currentPage > 1) {
        currentPage--;
        await fetchCharacters(currentPage);
        updatePaginationText();
    }
}

async function onNextButtonClick() {
    if (currentPage < totalPages) {
        currentPage++;
        await fetchCharacters(currentPage);
    }
}

renderPaginationButtons();
fetchCharacters(currentPage);
fetchEverything()

async function searchCharacters() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput !== '') {
        try {
            const response = await api.get(`/character?name=${searchInput}`);
            const searchedCharacter = response.data.results;
            renderContent(searchedCharacter);
        } catch (error) {
            console.error('Error searching characters:', error);
        }
    }
}


async function fetchEverything() {
    const footer = document.getElementById('footer-content');
    const response1 = await api.get('/episode');
    const episodes = (response1.data.info.count);
    const response2 = await api.get('/character');
    const characters = (response2.data.info.count);
    const response3 = await api.get('/location');
    const locations = (response3.data.info.count);
    footer.innerHTML = `<h2> Episodes:${episodes}      Characters:${characters}      Locations:${locations} </h2>`;
}

async function openModal(characterID) {
    const response = await api.get(`/character/${characterID}`)
    const character = response.data
    let cardClass
    const episodeLink = await getEpisode(character.episode[character.episode.length - 1])
    if (character.status == "Alive") {
        cardClass = 'dot-alive'
        } else if (character.status === "Dead") {
            cardClass = 'dot-dead'
        } else {
            cardClass = 'dot-unknown'
    }
    const modalBody = document.querySelector('.modal-body')
    modalBody.innerHTML = '';
    modalBody.innerHTML = `
        <h2 class="modal-text-header"> ${character.name}</h2>          <h3 class= "card-status"> ID: ${character.id}</h3>
        <h3 class="card-status"> Type: ${character.type}
        <h3 class="card-status" ><span class="dot${cardClass}"></span>${character.status} -  ${character.species}</h3>
        <h3 class="card-status">Gênero:${character.gender}</h3>
        <h3 class="card-status">Origem:${character.origin.name}</h3>
        <p class="card-location">
        Última localização conhecida <br>${character.location.name}</p>
        <p class="card-episode">
         Visto pela última vez em: ${episodeLink}</p>
    `

    if (character.type === "") {
        modalBody.innerHTML = '';
    modalBody.innerHTML = `
        <h2 class="modal-text-header"> ${character.name}</h2>          <h3 class= "modal-text"> ID: ${character.id}</h3>
        <h3 class="modal-text"> Type: Not specified </h3>
        <h3 class="modal-text" ><span class="dot${cardClass}"></span>${character.status} -  ${character.species}</h3>
        <h3 class="modal-text">Gênero:${character.gender}</h3>
        <h3 class="modal-text">Origem:${character.origin.name}</h3>
        <p class="modal-text">
        Última localização conhecida <br>${character.location.name}</p>
        <p class="modal-text">
         Visto pela última vez em: ${episodeLink}</p>
    `
    }
    }

function closeModal() {
 const modal = document.getElementById('myModal');
 modal.style.display = 'none';
}

function reload() {
    location.reload();
}