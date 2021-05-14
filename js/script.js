
const gallery = document.getElementById('gallery');
let currentCard = 0; // Initial position of a card modal


/**
 * FecthData(url) 
 * @para url is passed as parameter to fetch data 
 * Asynchronously request data and call the .json() method on the response
*/
async function fetchData(url){

    try {
        const dataResults = await fetch(url);
        const dataResultsJSON = await dataResults.json();
        
        return dataResultsJSON;
    }
    catch(error) {
        return console.log('Looks like there was a problem', error);
    }

    /*return fetch(url)
          .then(res => res.json())
          .catch(  error => console.log('Looks like there was a problem', error));*/

}
   

/**
 * addGallery(results) 
 * @para array of results returned from the fetchData function
 * It creates the 12 div elements with employee information
*/

function  addGallery(results){
    let divCard;
     // Loop over parameter array
    results.map(emp => {
        // Use example markup from the index.html file and interpolated template literals with the info in the parameter to generate an employee cards
        divCard = `
                <div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src=${emp.picture.large} alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${emp.name.first} ${ emp.name.last}</h3>
                        <p class="card-text">${emp.email}</p>
                        <p class="card-text cap">${ emp.location.city} , ${emp.location.state}</p>
                    </div>
                </div>
            `
        //That technique will allow you to add strings of HTML to the DOM without 
        //disrupting what already exists in the DOM.
        gallery.insertAdjacentHTML("beforeend", divCard);
    });   
}

/**
 * generateModal()
 * It uses an example markup to create a template literal for all the parts of the modal that 
 * never change, which is everything except what's inside the "modal-info-container" div: 
 * 'modal container div, modal div, close button, and modal info container div'.
 * It is hidden by default first.
 * Event listener on modal close button to hide modal windown when clicking the 'X' .
*/
function generateModal(){
    let divModal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                </div>
            </div>

            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;

    // Adding it to before the end of the body isn't the best because then it 
    //ends up after the script tags.  Better to append after the end of the gallery.
    gallery.insertAdjacentHTML('afterend', divModal);

    //Target the modal container and hide it with the style.dsiplay property
    document.querySelector('.modal-container').style.display = 'none';

    //Target the modal close btn and give it a click handler that also hides the modal container
    document.getElementById('modal-close-btn').addEventListener('click', (e) => {
        document.querySelector(".modal-container").style.display = "none";
    })
}


function formatTelephone(number){
    const regex = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
    return number.replace(regex, '($1) $2-$3');
}

function formatDate(text){
      //The below code is to get the DOB data and structure it like mm/dd/yyyy on the modal
      const date = new Date (text);
      const month = date.getMonth() + 1,
              day = date.getDate(),
              year = date.getFullYear();
      const mmddyy = `${month}/${day}/${year}`;
      return mmddyy;

}


/**
 * updateModal(employee) 
 * @para employee object paramater passed from clickCard() function.
 * It updates the markup and information in the modal info container.
*/
function updateModal(employee){

    // Target the "modal-info-container" div and use insertAdjacentHTML method with 'afterbegin' option to append unique modal info
    let modalInfoContainer = document.querySelector('.modal-info-container');

     //Target the "modal-info-container" div and set its inner HTML to an empty string
     modalInfoContainer.innerHTML = '';

     // Use example markup and interpolated template literals with the info in the parameter to add the unique parts of the modal
     modalInfoContainer.insertAdjacentHTML('afterbegin', `
        <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.location.city}</p>
        <hr>
        <p class="modal-text">${formatTelephone(employee.cell)}</p>
        <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
        <p class="modal-text">Birthday: ${formatDate(employee.dob.date)}</p>
     `);
}


/**
 * clickCard(results) 
 * @para array of results returned from fetchData function
 * When clicking a card, make the modal container visible and call updateModal
 * with the information of the specific card.
*/
function clickCard(results){
    const cards = document.querySelectorAll('.card');
    // Target all the cards and loop over them
    cards.forEach((card, currentCard) => {
        // Add click handler to each card
        card.addEventListener('click', () => {
            // Target and display the modal container
            document.querySelector('.modal-container').style.display = 'block';
            // Call the update modal function, passing in the object at the loop's current iteration.
            updateModal(results[currentCard]);

        })
    })

    /*
    for (let i = 0; i < cards.length; i++){
        console.log(cards[i]);
        cards[i].addEventListener('click', () => {
            document.querySelector('.modal-container').style.display = 'block';
            updateModal(results[i]);
        })
    }
    */

}


function nextPrevModal(data) {
    const nextPrevContainer = document.querySelector('.modal-btn-container');
    const nextBtn = document.getElementById('modal-next');
    const prevBtn = document.getElementById('modal-prev');
 
    nextPrevContainer.addEventListener('click', (e)=> {
        const cards = document.querySelectorAll('.card');
        if (e.target == nextBtn){
            currentCard++;
            updateModal(data[currentCard]);
            console.log('nextbtn');

            // Removes next button if it reaches the last employee modal
            if (currentCard >=11){
                nextBtn.style.display = 'none';
            }
            if (currentCard <= 11){
                prevBtn.style.display = 'block';
            }
        }

        if (e.target == prevBtn){   
            currentCard--;
            updateModal(data[currentCard]);

            // removes the prev button if it reaches 1st employee modal
            if (currentCard <= 0 ){
                prevBtn.style.display = 'none';
            }
            if (currentCard < 11){
                nextBtn.style.display = 'block';
            }
            console.log('prevBtn');
        }

    })

}

function generateSearchDiv() {
    const searchContainer = document.querySelector('.search-container');
     const searchHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
    searchContainer.insertAdjacentHTML('beforeend', searchHTML);

}


function searchNames() {
    const names = document.querySelectorAll('#name');
    const input = document.querySelector('#search-input');
    const searchButton = document.querySelector('.search-submit');

    names.forEach( name => {
        const fullname = name.textContent.toLowerCase();
        const cardDiv = name.parentElement.parentElement;

        input.addEventListener('keyup' , e => {
            const inputValue = e.target.value.toLowerCase();
            if ( fullname.includes(inputValue)){
                cardDiv.style.display = '';
            }
            else {
                // if name doesnt match the inputvalue, hide de card div
                cardDiv.style.display = 'none';
            }
        })
  
    });
}



    fetchData('https://randomuser.me/api/?results=12&nat=us')
        .then( data => {
            addGallery(data.results);
            generateModal();
            clickCard(data.results);
            nextPrevModal(data.results);
            generateSearchDiv();
            searchNames();

        })



   