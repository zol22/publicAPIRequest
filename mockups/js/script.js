
const gallery = document.getElementById('gallery');


function fetchData(url){
    return fetch(url)
          .then(res => res.json())
          .catch(  error => console.log('Looks like there was a problem', error));
}
   
function  addGalery(){

    fetchData('https://randomuser.me/api/')
    .then (data => {
        const divCard = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src=${data.results[0].picture.large} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${data.results[0].name.first} ${ data.results[0].name.last}</h3>
                    <p class="card-text">${data.results[0].email}</p>
                    <p class="card-text cap">${ data.results[0].location.city} , ${data.results[0].location.state}</p>
                </div>
            </div>
        `
        gallery.insertAdjacentHTML("beforeend", divCard);
    });


}
addGalery();


   