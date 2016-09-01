# kauppalista
html5 harjoitustyö
Päiväys 6.6.2013

Kauppalistasovellus

Tekijä
Harri Kyllönen

Tavoite/alkuperäinen suunnitelma

  1. Suht simppeli offline appis
    1. Tarkoituksena oppia miten tallennetaan offline dataa web-muistiin
    2. json-tietorakenteet ja niiden sorttausta yms javascriptillä
  2. Voit lisätä ruoan listaan, määrä myös
  3. Joka päivälle oma lista tai joku threshold esim 1h
    1. Rastilla voi merkata noukituksi
  4. Pitää kirjaa kaikista lisätyistä ruoista
    1. Eli top x ruokatarvikelistasta voi helposti valita suosikit
    2. tässä olisi tarkoitus pureutua käytettävyyteen, että sovellus olisi mahdollisimman jouheva käyttää puhelimessa
  5. Kirjaudut nimellä, ehkä salasanakin (lisäominaisuus jos on aikaa kehitellä)
    1. Eli halutessa voisi olla useampikin käyttäjä
    2. Ja voisi käyttää miltä laitteelta vaan
    3. Mutta sitten tarvii backendin esim. Node.js:llä tehtynä

Käyttöohjeet

Sovellus käynnistetään avaamalla verkkosivu
kauppalista.html
Sovelluksesta itsestään löytyy käyttöohje klikkaamalla Ohjeet nappia.
Toiminnallisuus on pidetty minimaalisena välttäen ylimääräisiä rönsyjä. Tavoitteena oli tehdä helppokäyttäinen kauppalista, joka on aina mukana puhelimessa.

Käytetyt tekniset ratkaisut

Sovellus on toteutettu käyttäen jQuery Mobile alustaa. Lisäksi on käytetty autocomplete.js kirjastoa. Omia css tyylitiedostoja ei käytetty, vaan käytetään jQuery Mobilen vakiomäärittelyitä.

Päiväkirja sovelluksen toteuttamisesta

21.5 1 h sovellusidean alustava kehittely 
23.5 3h, Twitter bootstrap analysointia, testailuja, ensimmäinen kömpelö versio ( yhteensä 4h)
24.5 4h, javascript ja twitter bootstrap säätämistä. Tietoja dialog. Tietorakenteiden miettimistä. (8h)
26.5 3h, totesin, että en ymmärrä dynaamisesta DOM manipuloinnista javascriptin kautta juuri mitään ja opiskelin jquery:ä (11h)
27.5 2h lisää jquery opiskelua (13h)
28.5 2h tietorakenteiden ja dynaamisen UI:n yhteenliittämistä (15h)
29.5 1h päivityksiä perustoiminnallisuuteen (16h)
30.5 1,5h tietorakenteiden ja UI:n synkronoimista. Twitter bootstrap bugaa ja on hidas Androidin chrome selaimessa. Saattaa johtua chromesta. (17,5h)
31.5 2h Sain ostosten syötön filtteröinnin toimimaan kivutta käyttämällä typeahead.js kirjastoa. Twitter bootstrap ei ole hyvä. Kokeiluja jQuery Mobilella. Jostain syystä ei demot toimi chromessa, missähän vika kun renderöi vain default html:ää. (19,5h)
1.6 1h jQuery Mobilea (20,5h)
2.6 7h jQuery Mobile. Chrome ei rendannut, koska scriptit haettiin eri sivuilta. Käyttöliittymän päivitystä jQuery Mobilea käyttäen. Siinäkin on näköjään omat ongelmansa, mm. dynaamisten elementtien refresh on muistettava tehdä javascript koodissa. Lisäsin autocomplete ominaisuuden käyttäen autocomplete.js kirjastoa. Lähes samanlainen kuin Twitter bootstrapin typeahead.js, mutta meni hetki jos toinenkin, että sai pelaamaan. (27,5h)
3.6 4h Ruokalistan tallennus ja lataus. UI säätämistä. Autocomplete hajosi, kun siirsin ostosten syötön data-role="collapsible" div:in alle. Eli ei sitten hienostella sen(kään) ominaisuuden suhteen (31,5h)
4.6 2,5h Viimeistelyä. Perustoiminnallisuus nyt kasassa. (34h)
5.6 3h Viimeistelyä. AllItems listalta yksittäisen itemin poisto. Koodin kommentointia, rönsyjen siivousta. (37h)
X.6 2h Raportti ja toimitus (39h)

Huomioita

Alussa oli suuria ongelmia ymmärtää jQuery kirjaston toimintaperiaate. Mutta aikansa kun sitä tutkaili, niin alkoi helpottaa. Suorastaan nerokas kirjasto. Toinen paljon aikaa vienyt asia oli erinäiset omituisuudet ensin Twitter bootstrap kirjaston kanssa ja sittemmin jQuery Mobile kirjaston kanssa. Esimerkit molemmista oli yleensä tehty HTML:nä, mutta kun piti toteuttaa dynaamisesti sama asia javascriptillä, niin ohjeita olikin vähemmän. Stackoverflow sivustosta oli suurta apua etsiessäni ongelmiiin ratkaisuja.

Yritin pitää käyttöliittymä- ja sovelluslogiikkakoodin toisistaan erillään. Ei aivan täydellisesti onnistunut. Merkitsin javascript funktioihin Ui, jos niissä käpisteltiin käyttöliittymäelementtejä.

Sovellukseen jäi viime hetken bugi. Jostain syystä <span> elementti, johon halusin laittaa kunkin ostoksen määrän,  ei renderöidy aina oikein pääsivulla. Opin ainakin sen, että kaikki pienetkin muutokset pitää _aina_ varmentaa. Jotain hajoaa jossain kuitenkin ja jos on tehnyt paljon muutoksia, on rikkinäisen kohdan löytäminen hankalaa.

