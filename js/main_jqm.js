// 1. Firebase alustus (Lisää omat tunnuksesi tähän)
const firebaseConfig = {
  apiKey: "AIzaSyCUrEm-JY8IVxsE_UtUYWLYu6NUf-n6Tv0",
  authDomain: "kauppalista-perhe.firebaseapp.com",
  databaseURL: "https://kauppalista-perhe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kauppalista-perhe",
  storageBucket: "kauppalista-perhe.firebasestorage.app",
  messagingSenderId: "20430762401",
  appId: "1:20430762401:web:ab2b6becd21c89a49e1be0"
};

// Alustetaan Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Haetaan listan tunnus URL-parametrilla (esim. index.html?lista=perhe1)
// Jos parametria ei ole, oletus on 'yleinen'
const urlParams = new URLSearchParams(window.location.search);
const listaId = urlParams.get('lista') || 'yleinen';
const listaRef = db.ref('kauppalista/' + listaId);

var lista = [];

// JQM init - kun sivu on valmis
$(document).on("pageinit", "#paasivu", function() {
    
    // --- REAALIAIKAINEN SYNKRONOINTI ---
    // Tämä korvaa vanhan lataa()-kutsun. 
    // Kun data muuttuu pilvessä, tämä suoritetaan automaattisesti kaikilla laitteilla.
    listaRef.on('value', function(snapshot) {
        var data = snapshot.val();
        lista = data ? data : [];
        piirraLista(); // Päivittää käyttöliittymän
    });

    // Tuotteen lisäysnappi
    $('#lisaa-nappi').on('click', function() {
        var tuote = $('#uusi-tuote').val();
        if (tuote) {
            lisaaTuote(tuote);
            $('#uusi-tuote').val(""); // Tyhjennetään kenttä
        }
    });
});

// Tallennus pilveen
function tallenna() {
    listaRef.set(lista);
}

function lisaaTuote(tuoteNimi) {
    var uusiTuote = {
        nimi: tuoteNimi,
        ostettu: false
    };
    lista.push(uusiTuote);
    tallenna();
}

function poistaTuote(index) {
    lista.splice(index, 1);
    tallenna();
}

function muutaTila(index) {
    lista[index].ostettu = !lista[index].ostettu;
    tallenna();
}

// Käyttöliittymän piirtäminen
function piirraLista() {
    var $listaUl = $('#kauppalista');
    $listaUl.empty(); // Tyhjennetään nykyinen lista

    $.each(lista, function(index, tuote) {
        var tyyli = tuote.ostettu ? 'style="text-decoration: line-through; color: gray;"' : '';
        
        var li = $('<li><a href="#" ' + tyyli + '>' + tuote.nimi + '</a>' +
                   '<a href="#" class="poista" data-index="' + index + '">Poista</a></li>');
        
        // Merkataan ostetuksi klikkaamalla tekstiä
        li.find('a').first().on('click', function() {
            muutaTila(index);
        });

        // Poistetaan tuote
        li.find('.poista').on('click', function() {
            poistaTuote(index);
        });

        $listaUl.append(li);
    });

    // Tärkeää jQuery Mobilelle: päivitetään listan ulkoasu
    $listaUl.listview('refresh');
}
