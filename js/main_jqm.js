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

// Haetaan listan tunnus URL:sta (esim. kauppalista.html?lista=perhe)
const urlParams = new URLSearchParams(window.location.search);
const listaId = urlParams.get('lista') || 'yleinen';
const listaRef = db.ref('kauppalista/' + listaId);

var lista = [];

// jQuery Mobile sivun alustus
$(document).on("pagecreate", "#paasivu", function() {
    
    // REAALIAIKAINEN SYNKRONOINTI PILVESTÄ
    listaRef.on('value', function(snapshot) {
        var data = snapshot.val();
        lista = data ? data : [];
        piirraLista();
    });

    // LISÄÄ-NAPPI (ID: #nappi HTML-tiedostossasi)
    $('#nappi').on('click', function() {
        var tuoteNimi = $('#uusi-tuote').val();
        if (tuoteNimi.trim() !== "") {
            lista.push({ nimi: tuoteNimi, ostettu: false });
            tallenna();
            $('#uusi-tuote').val("");
        }
    });

    // TAPAHTUMIEN DELEGOINTI: Klikkaukset listalla
    // Käytetään delegointia, koska lista tyhjennetään ja piirretään uusiksi joka muutoksessa
    $('#kauppalista').on('click', 'li a', function(e) {
        var index = $(this).closest('li').index();
        
        // Jos klikattiin poisto-nappia (JQM:n split-button-ikoniosa)
        if ($(this).hasClass('ui-li-link-alt')) {
            lista.splice(index, 1);
            tallenna();
        } else {
            // Klikattiin itse tuotetta -> muuta tila
            if(lista[index]) {
                lista[index].ostettu = !lista[index].ostettu;
                tallenna();
            }
        }
    });
});

function tallenna() {
    listaRef.set(lista);
}

function piirraLista() {
    var $listaUl = $('#kauppalista');
    $listaUl.empty();

    $.each(lista, function(index, tuote) {
        var tyyli = tuote.ostettu ? 'style="text-decoration: line-through; opacity: 0.5;"' : '';
        
        // Rakennetaan JQM-yhteensopiva split-button lista-alkio
        var li = '<li>' +
                 '<a href="#" ' + tyyli + '>' + tuote.nimi + '</a>' +
                 '<a href="#">Poista</a>' +
                 '</li>';
        
        $listaUl.append(li);
    });

    // Virkistetään jQuery Mobilen lista-ulkoasu
    $listaUl.listview('refresh');
}

