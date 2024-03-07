import React, { useEffect, useState, useMemo } from 'react'; // Importer useState et useEffect et Usememo depuis React
import "../../css/informations.css";
import axios from 'axios'; // Importer Axios


const Informations = () => {// Component Sous section Informations du logo Accueil , Dropdown Menu Desktop => chemin liaison Menu.part.jsx + dropdownpart.jsx

  const [informations] = useState([]); // Etat pour la récupération des données infos viala méthode fetch (stock)
  const [rechercheInfos, setRechercheInfos] = useState('');//  Etat pour la recherche d'infos (stock)
  const [categorieFiltree] = useState(null); //  Etat pour le filtre d'infos (stock)
  const [aucuneInfosTrouvees, setAucuneInfosTrouvees] = useState(false); // État pour indiquer si aucune info n'est trouvée (stock)
  
  // Déclaration des IDs à afficher et filtrer depuis l'API wp
  const filteredIds = useMemo(() => [452, 496, 522, 526, 536, 554], []); // fonction filtrage des ID => articles intégrés dans wordpress

  useEffect(() => {
    const fetchArtistes = async () => {
        try {
            const username = 'tom';
            const password = 'Petitcalvejunior2025!!$$';
            
            // Encodage des informations d'authentification de base en base64
            const basicAuth = btoa(`${username}:${password}`);
            
            // Définition de l'URL de l'API à interroger
            const apiUrl = 'https://sonosound.online/wp-json/wp/v2/posts?per_page=150';

            
            // Définition de l'URL du proxy pour contourner les restrictions CORS
            const proxyUrl = '/proxy?url=';
            
            // Effectuer la requête GET à l'API en utilisant Axios
            const response = await axios.get(`${proxyUrl}${encodeURIComponent(apiUrl)}`, {
                headers: {
                    "Content-Type": "application/json", // Type de contenu de la requête
                    "Authorization": `Basic ${basicAuth}`, // Authentification de base
                    "accept": 'application/json', // Type de contenu accepté dans la réponse
                },
            });
            const data = response.data;

            // Vérification de la réussite de la requête
            if (!Array.isArray(data)) {
              throw new Error("Les données ne sont pas un tableau");
          }
  
            // Récupération des données JSON de la réponse
            console.log(data); // Afficher les données JSON récupérées
            
            // Filtrer les articles en fonction des IDs spécifiés
            const filteredArticles = data.filter(article => filteredIds.includes(article.id));
    
            // Mettre à jour l'état des artistes avec les données filtrées
            fetchArtistes(filteredArticles);
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            // Gérer l'erreur réseau ici
        }
    };

    // Appel de la fonction fetchArtistes lors du premier rendu et à chaque changement de filteredIds
    fetchArtistes();
}, [filteredIds]); // Déclenchement du useEffect lors du changement de filteredIds



  

  const rechercherInfos = event => { // Fonction pour rechercher des infos
    setRechercheInfos(event.target.value);// Met à jour l'état de recherche d'infos avec la nouvelle valeur
  };

  // Filtrage des infos en fonction des critères de recherche

  const filteredInfos = informations.filter(info => {
    const infosInclus =
      // vérifie si le contenu de l'info contient le terme de recherche pour le nom de l'info
      info.content.toLowerCase().includes(rechercheInfos.toLowerCase()) ||
      // vérifie si le titre de l'info contient le terme de recherche pour le nom de l'info
      info.title.toLowerCase().includes(rechercheInfos.toLowerCase());
    const idInclus = filteredIds.includes(info.id);
    const categorieInclus = !categorieFiltree || info.categorie === categorieFiltree;

    return infosInclus && idInclus && categorieInclus;
  });

  useEffect(() => {
    // Vérifier si aucune information n'a été trouvée après le filtrage
    setAucuneInfosTrouvees(filteredInfos.length === 0 && rechercheInfos !== '');
  }, [informations, rechercheInfos, categorieFiltree, filteredInfos.length]); 

  return (
    <div className="artistes-container1">
      <div className="artistecotainerchild1">
      <h1 className="titreinfos">LE DÉROULEMENT DU FESTIVAL</h1>
      <div className='catbuttoncontainer'>
      </div>
      <input
        type="text"
        placeholder="Rechercher une information"
        value={rechercheInfos} // stock de l'info rentré par l'utilisateur
        onChange={rechercherInfos}// Appel de la fonction rechercherInfos pour mettre à jour l'état de recherche d'infos(stock)
      />

      {/* Afficher les informations filtrées */}
      <div className="artistes-grid1">
        {aucuneInfosTrouvees && (// stock de l'info rentré par l'utilisateur mais fausse,  Si aucuneInfoTrouvee  est vrai, aucun filtrage n'est appliqué.
          <div className="datefindprog">Aucune information trouvée :(</div>
        )}
        {!aucuneInfosTrouvees &&
          filteredInfos.map(info => (// map d ficher json pour récupérer les donnes du fichier json wordpress pour chaque id filtré (id & titré & contenu)
            <div className={`boxlargeinfos`} key={info.id}>
              <a href={info.link} className="partner-link">
                <div>
                  <h2 className="title">{info.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: info.content }} />
                </div>
              </a>
            </div>
          ))}
      </div>
    </div></div>
  );
};

export default Informations;
