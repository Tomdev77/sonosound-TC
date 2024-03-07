import React, { useEffect, useState, useMemo } from 'react'; // Importer useState et useEffect et Usememo depuis React
import "../../css/partenaires.css";
import axios from 'axios'; // Importer Axios




const Partenaires = () => {
  const [categories, setCategories] = useState([]);// Etat pour la récupération des données catégories  via la méthode fetch
  const [rechercheCategorie, setRechercheCategorie] = useState('');//  Etat pour la recherche de catégories (stock)
  const [aucunecategoriesTrouvees, setAucunecategoriesTrouvees] = useState(false); //  État pour indiquer si aucune catégorie n'est trouvée, affiche le message false
  const filteredIds = useMemo(() => [370, 375, 392, 395, 398, 412, 417, 425, 431, 434, 435, 440, 443, 540, 545, 550], []); // fonction filtrage des ID => articles intégrés dans wordpress
  const [artistes, setArtistes] = useState([]);

  useEffect(() => {
    const fetchArtistes = async () => {
        try {
            const username = 'tom';
            const password = 'Petitcalvejunior2025!!$$';
            
            // Encodage des informations d'authentification de base en base64
            const basicAuth = btoa(`${username}:${password}`);
            
            // Définition de l'URL de l'API à interroger
            const apiUrl = 'https://sonosound.online/wp-json/wp/v2/posts?per_page=100';

            
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
            setArtistes(filteredArticles);
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            // Gérer l'erreur réseau ici
        }
    };

    // Appel de la fonction fetchArtistes lors du premier rendu et à chaque changement de filteredIds
    fetchArtistes();
}, [filteredIds]); // Déclenchement du useEffect lors du changement de filteredIds
;

  
  const Recherchercategorie = (categorie) => {// Fonction pour rechercher des catégories
    setRechercheCategorie(categorie);// Met à jour l'état de recherche de catégories avec la nouvelle valeur
  };


  const resetcategorie = () => {// Fonction pour réinitialiser des catégories
    setRechercheCategorie('');// Met à jour l'état de recherche de catégories avec la nouvelle valeur
  };

// Filtrage des artistes en fonction des critères de recherche
  const filtrercategories = categories.filter(categorie => {
      // vérifie si le contenu de la catégorie contient le terme de recherche pour la catégorie
    const categorieInclus = categorie.content.rendered.toLowerCase().includes(rechercheCategorie.toLowerCase());
    const idInclus = filteredIds.includes(categorie.id); 
    return categorieInclus && idInclus;
  });

  useEffect(() => {
    // Vérification, si aucune catégorie n'est trouvé après le filtrage basé sur les catégories
    setAucunecategoriesTrouvees(filtrercategories.length === 0 && rechercheCategorie !== '');
  }, [filtrercategories, rechercheCategorie]);

  return (
    <div className="partner-container">
      <h1 className="titrepartenaires">NOS PARTENAIRES</h1>

      {/* Category buttons */}
      <div className='catbuttoncontainer'>
        <button className='categorie' onClick={() => Recherchercategorie('Food')}>Food</button>
        {/* Bouton de filtre, appel de la fonction Recherchercategorie qui met à jour l'état de recherche catégorie avec l'évenement on click (stock) */}

        <button className='categorie' onClick={() => Recherchercategorie('Collectivite')}>Collectivite</button>
        {/* Bouton de filtre, appel de la fonction Recherchercategorie qui met à jour l'état de recherche catégorie avec l'évenement on click (stock) */}

        <button className='categorie' onClick={() => Recherchercategorie('Transports')}>Transports</button>
        {/* Bouton de filtre, appel de la fonction Recherchercategorie qui met à jour l'état de recherche catégorie avec l'évenement on click (stock) */}

        <button className='categorie' onClick={() => Recherchercategorie('Media')}>Media</button>
        {/* Bouton de filtre, appel de la fonction Recherchercategorie qui met à jour l'état de recherche catégorie avec l'évenement on click (stock) */}

        <button className='categorie' onClick={() => Recherchercategorie('Tourisme')}>Tourisme</button>
        {/* Bouton de filtre, appel de la fonction Recherchercategorie qui met à jour l'état de recherche catégorie avec l'évenement on click (stock) */}

        <button className='categorie' onClick={() => Recherchercategorie('Sécurité')}>Sécurité</button>
        {/* Bouton de filtre, appel de la fonction Recherchercategorie qui met à jour l'état de recherche catégorie avec l'évenement on click (stock) */}

        <button className='categorie' onClick={() => Recherchercategorie('Environnement')}>Environnement</button>
        {/* Bouton de filtre, appel de la fonction Recherchercategorie qui met à jour l'état de recherche catégorie avec l'évenement on click (stock) */}



        <button className='reset2' onClick={resetcategorie}>Réinitialiser les catégories</button>
      {/* La fonction est appelée et met à jour la clé de réinitialisation du carrousel à chaque clic */}
      </div>

      <div className="artistes-grid">
        {/* Filtre les catégories dont le contenu inclut la valeur de recherche (rechercheCategorie)
        Si aucuneCategorieTrouvee  est vrai, aucun filtrage n'est appliqué.
        */} {aucunecategoriesTrouvees && <div className='catfindprog'>Aucune catégorie trouvée :(</div>}
        {!aucunecategoriesTrouvees && filtrercategories.map(category => (// map d ficher json pour récupérer les donnes du fichier json wordpress pour chaque id filtré (id & titré & contenu)
          <div className={`boxlargepart`} key={category.id}>
            <a href={category.link} className="partner-link">
              <div>
                <h2 className='title'>{category.title.rendered}</h2>
                <div dangerouslySetInnerHTML={{ __html: category.content.rendered }} />
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partenaires;
