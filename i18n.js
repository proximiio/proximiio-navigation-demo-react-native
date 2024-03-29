import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      'app.title_map': 'Map',
      'app.title_search': 'Search',
      'app.title_settings': 'Settings',
      'app.title_policy': 'Privacy Policy',
      'app.loading': 'Loading...',

      'common.search_hint': 'Where do you want to go?',
      'common.floor_-1': '-1st Floor',
      'common.floor_0': 'Ground Floor',
      'common.floor_1': '1st Floor',
      'common.floor_2': '2nd Floor',
      'common.floor_3': '3rd Floor',
      'common.floor_4': '4th Floor',
      'common.floor_5': '5th Floor',
      'common.floor_n': '{{count}}nth Floor',

      'common.category.cafeteria': 'Cafeteria',
      'common.category.washroom': 'Washroom',
      'common.category.meeting_room': 'Meeting room',
      'common.category.parking': 'Parking',
      'common.category.entrance': 'Entrance',
      'common.steps': '{{count}} step',
      'common.steps_plural': '{{count}} steps',
      'common.meters': '{{count}} meter',
      'common.meters_plural': '{{count}} meters',

      'searchscreen.no_items': 'No results',
      'searchscreen.no_items_less_specific': 'Try a less specific search or\nbrowse available rooms and items.',
      'searchscreen.end_of_results': 'End of results',
      'searchscreen.results': '{{count}} result found',
      'searchscreen.results_plural': '{{count}} results found',

      'navigation.you_are_in': 'You are currently in',
      'navigation.watch_out_for': 'Watch out for',

      'policyscreen.privacy-policy-text': '<h2>Proximi.io sisäpaikannus Novapolis-ympäristössä – sovelluksen käyttöehdot</h2> 1.4.2021 alkaen <br/> <br/> <h2>1. Käyttöehdot ja niiden muodostama sopimus</h2> Näitä käyttöehtoja (”Käyttöehdot”) sovelletaan Proximi.io ja KPY Novapoliksen (”Novapolis” tai ”Rekisterinpitäjä”) yhteistyössä kehittämän mobiilisovelluksen (”Sovellus”) käyttöön. Sovelluksen avulla Käyttäjälle tarjotaan sisäpaikannuspalvelua Novapoliksen omistamissa kiinteistöissä. <br/> <br/> Käyttöehdot muodostavat Sovelluksen käyttöä koskevan sopimuksen Sovellusta käyttävän henkilön (”Käyttäjä”) ja Novapoliksen välille (”Osapuolet”). Käyttöehtojen muodostama sopimus kumoaa kaikki aiemmat Sovellusta koskevat sopimukset tai tahdonilmaisut Osapuolten välillä. <br/> <br/> Jotta Käyttäjä voi käyttää Sovellusta, Käyttäjän pitää hyväksyä Käyttöehdot itseään sitoviksi Sovelluksessa. Jos Käyttäjä ei hyväksy näitä Käyttöehtoja, ei Käyttäjällä ole oikeutettu käyttää Sovellusta. <br/> <br/> <h2>2. Käyttöoikeus</h2> Novapolis myöntää Käyttäjälle henkilökohtaisen oikeuden käyttää Sovellusta näiden Käyttöehtojen mukaisesti (”Käyttöoikeus”). Käyttöoikeus Sovellukseen on maksuton, mutta se ei ole yksinomainen eikä siirrettävissä kolmannelle. <br/> <br/> Käyttöoikeus on voimassa määräajan, sovelluksen pilotti-käyttöjakson ajan. Käyttäjä voi itse päättää Käyttöoikeuden milloin tahansa poistamalla Sovelluksen mobiililaitteestaan. <br/> <br/> Novapoliksella on oikeus päättää käyttöoikeus, jos Käyttäjä käyttää Sovellusta tai sen sisältöä Käyttöehtojen, lain tai hyvän tavan vastaisesti. Käyttäjä ei saa: <ul> <li>kopioida, muokata tai muuttaa, alilisensoida, jälleenmyydä tai muulla tavoin kaupallisesti hyödyntää Sovellusta, sen osia tai sisältöä tai tätä henkilökohtaista käyttöoikeutta;</li><li>antaa tahallisesti virheellisiä rekisteröintitietoja, joita Sovelluksen käyttäminen edellyttää;</li><li>kiertää mitään Sovellukseen mahdollisesti asetettuja pääsy- ja käyttörajoituksia;</li><li>purkaa (reverse engineer), kääntää tai muulla tavoin selvittää Sovelluksen ohjelmakoodia, ellei sitä ole laissa erikseen sallittu;</li><li>käyttää Sovellusta toimintaan tai tavalla, joka vaikeuttaa toisten käyttäjien mahdollisuutta käyttää Sovellusta;</li><li>käyttää Sovellusta muiden henkilöiden tai tahojen oikeuksia loukkaavan, lainvastaisen, halventavan, siveettömän tai muuten loukkaavan aineiston tai joitakin tuotteita tai palveluja oikeudettomasti mainostavan aineiston julkaisemiseen tai välittämiseen.</li></ul> <h2>3. Käyttäjän vastuu</h2> Käyttäjä vastaa itse Sovelluksen käytön edellyttämien laitteiden, ohjelmistojen sekä viestintä- ja tietoliikenneyhteyksien hankkimisesta, kustannuksista ja toimivuudesta. <br/> <br/> Käyttäjän tulee noudattaa Sovelluksen käytössä kulloinkin voimassa olevia käyttö-, turvallisuus- ja muita ohjeita. <br/> <br/> Käyttäjä vastaa Käyttöehtojen, mahdollisten muiden sopimusehtojen ja lain tai hyvän tavan vastaisesta Sovelluksen käytöstä Novapolikselle, muille käyttäjille ja kolmansille aiheuttamastasi vahingosta täysimääräisesti. <br/> <br/> <h2>4. Käyttäjätietojen kerääminen ja niiden käyttö</h2> Jotta Käyttäjä voi käyttää Sovellusta, tulee hänen antaa tiedot, joita Sovelluksen käyttö edellyttää. Tällaiset tiedot saattavat sisältää myös henkilötietoja. Lisäksi Sovellus kerää käyttäjän sijaintiin ja liikkumiseen liittyviä tietoja, mikäli Käyttäjä antaa siihen nimenomaisen suostumuksen. Käyttäjä voi perua suostumuksensa milloin tahansa. Sovelluksen käyttäminen edellyttää Käyttäjää antamaan Sovellukselle oikeuden käyttää päätelaitteensa sijaintitietoja ja Bluetooth dataa. Sovellus ei kerää tietoja mistään muusta päätelaitteessa tapahtuvasta toiminnasta kuten puheluista, tekstiviesteistä tai sähköpostista. <br/> <br/> Käyttäjätietojen käsittelyn tarkoituksena on sijaintikohtaisen paikannuspalvelun tarjoaminen Käyttäjälle sekä paikannuspalvelun kehitystyö ja ylläpito. Novapoliksella on rekisterinpitäjänä tässä tarkoituksessa oikeus käsitellä Käyttäjän Sovelluksen käyttöönoton yhteydessä ilmoittamia tai siinä viitattuja henkilötietoja sekä Sovelluksen käytön aikana kerättyjä tietoja, joiden keräämiseen rekisteröity on antanut suostumuksensa. <br/> <br/> Käyttäjätiedot tallennetaan salatulle kävijätunnukselle (Vistor ID). Visitor ID on UUID-muotoinen tunniste, joka luodaan aikaleiman (timestamp) perusteella. Visitor ID muuttuu, mikäli Käyttäjä poistaa Sovelluksen ja asentaa sen uudelleen. Muussa tapauksessa Käyttäjällä pysyy sama Visitor ID. Sovelluksen poisto Käyttäjän päätelaitteelta ei poista sovelluksen taustajärjestelmiin tallennettuja tietoja välittömästi. Poistetun sovelluksen johdosta käytöstä poistunutta kävijätunnusta säilytetään kuitenkin enintään 36 tuntia sovelluksen poistamisesta lukien. Sovelluksen poistamisen jälkeen Käyttäjän päätelaitteelle ei jää pysyvää seurantamekanismia. Visitor ID tietoja hyödynnetään Novapoliksen sijaintikohtaisen paikannuspalvelun tarjoamiseen Käyttäjälle sekä paikannuspalvelun kehitystyöhön ja ylläpitoon. <br/> <br/> Sovellus voi kerätä seuraavia käyttäjätietoja: <ul> <li>Käyttäjän käyttämän päätelaitteen käyttöjärjestelmän tietoja (informaatio vaihtelee päätelaitteen valmistajan mukaan).</li><li>Käyttäjän sijaintiin perustuvia tietoja.</li></ul> <br/> Käyttäjän päätelaitteen käyttöjärjestelmätietoja käytetään mahdollisten vikatilanteiden korjaamiseen ja analysointiin. Käyttäjän sijaintitietoja käytetään sijaintikohtaisen paikannuspalvelun tarjoamiseen Sovelluksen Käyttäjälle. Novapolis tai sen alihankkijat eivät muutoin käsittele rekisteröidyn sijaintitietoihin perustuvaa tietoa miltään osin. Novapoliksella on oikeus määrittää mistä kohtaa KPY Novapoliksen kiinteistöjä sijaintitiedot kerätään tai kerätäänkö niitä ollenkaan. <br/> <br/> Kävijätunnukselle (Visitor ID) kerättävät sijaintitiedot sisältävät tietoja Käyttäjän päätelaitteen nykyisestä ja aiemmista sijainneista. Laitteen sijaintitiedot kerätään sähköisesti käyttämällä useita menetelmiä (mm. GPS, Bluetooth majakat, Wi-Fi verkko, matkapuhelinverkot, LiFin tai muu käyttökelpoinen tekniikka). <br/> <br/> Käyttäjätietoja käsitellään tietosuojalainsäädännön, viranomaisohjeistusten, Käyttöehtojen ja Novapoliksen tietosuojakäytäntöjen mukaisesti. Novapoliksella ja sen alihankkijoilla on oikeus käsitellä henkilötietoja EU:n yleisen tietosuoja-asetuksen, muun soveltuvan lainsäädännön, viranomaisohjeistusten ja Käyttöehtojen ja Novapoliksen tietosuojakäytäntöjen mukaisesti. <br/> <br/> Käyttäjälää on rekisteröitynä tietosuojalainsäädännön mukaisin edellytyksin oikeudet omiin henkilötietoihinsa. Rekisteröidyllä on oikeus saada pääsy omiin henkilötietoihin, pyytää rekisterinpitäjää korjaamaan puutteelliset tai virheelliset henkilötiedot, vastustaa tai rajoittaa henkilötietojen käsittelyä, sekä vastustaa automaattista päätöksentekoa sekä pyytää rekisterinpitäjää poistamaan henkilötiedot. Rekisteröidyn oikeuksiin liittyvät pyynnöt tulee tehdä kirjallisesti asiakaspalveluun. Yhteystiedot löytyvät kohdasta 9. Koska Sovellus ei yksilöi käyttäjiään, eikä Novapoliksella siten ole täsmällisiä henkilötietoja käyttäjistä, tulee Käyttäjän ilmoittaa edellä mainitun pyynnön yhteydessä kävijätunnuksensa (Visitor ID). <br/> <br/> Novapolis käsittelee tietoja huolellisesti ja turvallisesti, ja Novapolis edellyttää samaa myös alihankkijoiltaan ja yhteistyökumppaneiltaan. Käyttäjätiedot säilytetään Euroopan Unionin alueella, eikä tietoja siirretä EU:n tai ETA:n ulkopuolelle ilman Käyttäjän suostumusta. Käyttäjätietoja sisältävät palvelimet on suojattu palomuurein. <br/> <br/> Novapolis kerää Rekisteröidyn käyttäjätietoja, jotta Novapolis pystyy tarjoamaan Sovelluksen Käyttäjälle sujuvan ja toimivan käyttökokemuksen. Lisätietoja henkilötietojen keräämisestä, käsittelystä ja rekisteröidyn oikeuksista saa Novapoliksen tietosuojakäytännöistä osoitteesta <a href="https://www.novapolis.fi">www.novapolis.fi</a>. <br/> <br/> Käyttäjän on myös syytä huomioida, että sijainnin käyttämisellä Sovelluksessa Käyttäjä ottaa käyttöönsä myös päätelaitteen paikannuksen Googlen tai Applen sovelluksilla. Lisätietoja Googlen yksityisyyden suojasta <a href="https://policies.google.com/privacy">policies.google.com/privacy</a> ja Applen yksityisyyden suojasta <a href="https://www.apple.com/legal/privacy/en-ww/">www.apple.com/legal/privacy/en-ww/</a>. <br/> <h2>5. Immateriaalioikeudet</h2> Sovellusta, sen sisältöä ja ulkoasua suojaavat tekijänoikeuslaki ja kaikki muu soveltuva lainsäädäntö. <br/> <br/> Kaikki oikeudet, kuten omistusoikeus, tekijänoikeus ja muut immateriaalioikeudet Sovellukseen sekä siihen sisältyvään tai liittyvään materiaaliin ovat Novapoliksen tai lisenssinantajiemme omaisuutta. Novapolis pidättää kaikki oikeudet, joita ei nimenomaisesti luovuteta näissä Käyttöehdoissa. <br/> <br/> <h2>6. Vastuunrajoitukset</h2> Sovelluksessa saattaa ilmetä käyttökatkoksia, käytön estymistä tai Sovelluksessa tai sen sisällössä virheitä tai puutteellisuuksia, jotka johtuvat esimerkiksi Sovelluksen ylläpitotoimista, teknisistä ongelmista tai muista samankaltaisista syistä tai tiedonsiirron ongelmista, jotka johtuvat kolmansista osapuolista. <br/> <br/> Sovelluksen käyttöoikeus myönnetään käyttäjälle ”sellaisena kuin se on” -ehdolla. Novapolis ei takaa, että Sovellus täyttäisi Käyttäjä vaatimukset tai toimisi kaikissa käyttöympäristöissä. Sijaintitietojen tarkkuus riippuu useista tekijöistä, kuten käytössä olevasta sijaintitiedon keräämistekniikasta, päätelaitteen merkistä ja mallista, päätelaitteen asetuksista sekä kiinteistössä vallitsevista olosuhteista. <br/> <br/> Novapolis ei vastaa Käyttäjälle tai kolmannelle osapuolelle virheistä, viivästyksistä ja vahingoista. <br/> Novapolis ei vastaa kolmansien osapuolten Käyttäjään kohdentamista kanteista, vaatimuksista tai toimenpiteistä taikka vahingoista, jotka aiheutuvat tietojen katoamisesta tai niiden vahingoittumisesta riippumatta katoamisen tai vahingon syistä. <br/> <br/> Novapolis ei ole vastuussa virheestä, viivästyksestä tai sopimusvelvoitteiden täyttämättä jäämisestä siltä osin kuin se johtuu ylivoimaisesta esteestä (force majeure). Ylivoimaisena esteenä pidetään tapahtumaa, joka estää tai tekee velvoitteiden täyttämisen kohtuuttoman vaikeaksi määräajassa. Tällaisia esteitä ovat muun muassa sota, kapina, pandemia, epidemia, luonnonmullistus, yleinen energianjakelun tai liikenteen keskeytyminen, häiriöt yleisissä tietoliikenneyhteyksissä, työtaistelutoimenpiteet, tulipalo, viranomaisen asettama oleellinen rajoitus tai muu yhtä merkittävä, epätavallinen, ennakoimaton ja Novapoliksesta riippumaton syy. Novapolis ei vastaa myöskään alihankkijan virheestä tai viivästyksestä, joka on aiheutunut ylivoimaisesta esteestä. <br/> <br/> <h2>7. Käyttöehtojen muuttaminen ja voimassaolo</h2> Novapoliksella on oikeus muuttaa näitä Käyttöehtoja. Kulloinkin voimassa olevat Käyttöehdot löytyvät Sovelluksesta. Tiedotamme ehtojen muutoksista Sovelluksessa, tai muulla sopivalla tavalla ennen muutoksen voimaantuloa. Muutokset astuvat voimaan ilmoitettuna ajankohtana. Kun Käyttäjä jatkaa Sovelluksen käyttöä Käyttöehtojen muuttamisen jälkeen, sitoutuu Käyttäjä noudattamaan uusia ehtoja. Käyttöehdot pysyvät muilta osin voimassa, vaikka jokin osa katsottaisiin pätemättömäksi tai täytäntöönpanokelvottomaksi. <br/> <br/> <h2>8. Sovellettava laki ja erimielisyyksien ratkaisu</h2> Käyttöehtoihin sovelletaan Suomen lakia. <br/> <br/> Erimielisyystilanteissa ota aina ensin yhteyttä Novapoliksen asiakaspalveluun. <br/> <br/> Jos erimielisyyttä ei saada ratkaistua Osapuolten välisillä neuvotteluilla, on Käyttäjällä oikeus kuluttajana saattaa asia kuluttajariitalautakunnan ratkaistavaksi. <br/> <br/> <h2>9. Yhteystiedot</h2> KPY Novapolis Oy <br/> Y-tunnus: 2682876-2 <br/> Verkkosivut: <a href="https://www.novapolis.fi/">www.novapolis.fi</a> <br/> Käyntiosoite: Viestikatu 7, 70600 Kuopio <br/> Postiosoite: PL 1199, 70211 Kuopio <br/> Puhelin: 017 369 7800 <br/> Sähköposti: <a href="mailto:asiakaspalvelu@novapolis.fi">asiakaspalvelu@novapolis.fi</a> <br/>',
      'policyscreen.accept': 'Accept & continue',
      'policyscreen.decline': 'Close',
      'policyscreen.visitor-id': 'Your visitor ID:',

      'preview.start_navigation': 'Start navigation',
      'preview.hide_trip': 'Hide trip',
      'preview.show_trip': 'Show Trip',
      'preview.start': 'Start',
      'preview.summary_minutes': '{{count}} minute',
      'preview.summary_minutes_plural': '{{count}} minutes',
      'preview.nearest_parking': 'Nearest parking on route',
      'preview.nearest_parking_remove': 'Remove parking',

      'mapscreen.calculating': 'Calculating...',

      'preferencescreen.route_options': 'Route options',
      'preferencescreen.avoid_stairs': 'Avoid stairs',
      'preferencescreen.avoid_elevators': 'Avoid elevators',
      'preferencescreen.avoid_revolving_doors': 'Avoid revolving doors',
      'preferencescreen.accessible_routes': 'Use accessible routes',
      'preferencescreen.distance_units': 'Measure distance in',
      'preferencescreen.voice_guidance': 'Voice guidance',
      'preferencescreen.voice_guidance_enable': 'Enable voice guidance',
      'preferencescreen.voice_guidance_confirm_direction': 'Confirm direction of travel',
      'preferencescreen.voice_guidance_decision_points': 'Tell me about decision points',
      'preferencescreen.voice_guidance_hazards': 'Tell me about hazards',
      'preferencescreen.voice_guidance_landmarks': 'Tell me about landmarks',
      'preferencescreen.voice_guidance_areas': 'Tell me about areas',
      'preferencescreen.voice_guidance_reasurrance': 'Confirm route',
      'preferencescreen.voice_guidance_reasurrance_distance': 'Confirm route every',
      'preferencescreen.accessibility_options': 'Accessibility options',
      'preferencescreen.accessibility_guidance': 'Guidance based on disability',
      'preferencescreen.reassurance_10m': '10 meters',
      'preferencescreen.reassurance_15m': '15 meters',
      'preferencescreen.reassurance_20m': '20 meters',
      'preferencescreen.reassurance_25m': '25 meters',
      'preferencescreen.unit_steps': 'steps',
      'preferencescreen.unit_meters': 'meters',
      'preferencescreen.accessibility_option_none': 'none',
      'preferencescreen.accessibility_option_visual': 'visually impaired',
      'preferencescreen.privacy_policy': 'Privacy Policy',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
