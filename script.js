const data = {
    projets: [],
    modules: [],
    taches: [],
    membres: [],
    ressources: []
};

// Fonction pour afficher une section
function showSection(section) {
    const content = document.getElementById("content");
    const title = document.getElementById("section-title");

    title.textContent = section.charAt(0).toUpperCase() + section.slice(1);
    content.innerHTML = '';

    if (section !== 'liste') {
        content.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <h3>Ajouter un ${section}</h3>
                    <button class="close-btn" onclick="closeForm()">X</button>
                </div>
                <div class="form">
                    ${getFormFields(section)}
                    <input type="hidden" id="edit-index" value=""> <!-- Stocker l'index pour modification -->
                    <button onclick="ajouterElement('${section}')" class="btn-green" id="submit-btn">Ajouter</button>
                    <button onclick="afficherListe('${section}')" class="btn-blue" id="liste-btn">📋 Liste des ${section.charAt(0).toUpperCase() + section.slice(1)}</button>
                </div>
            </div>
            <div id="${section}-table"></div>
        `;
        afficherElements(section);
    } else {
        afficherListeComplete();
    }
}

// Fonction pour fermer le formulaire et réinitialiser le titre de la section
function closeForm() {
    document.getElementById("content").innerHTML = "";
    document.getElementById("section-title").textContent = ""; // Réinitialiser le titre
}

// Champs dynamiques pour chaque section
function getFormFields(section) {
    switch (section) {
        case 'projets':
            return `<label id="name">Nom</label><input type="text" id="nom" placeholder="Nom">
                    <label>Description</label><input type="text" id="description" placeholder="Description">
                    <label>Date Début</label><input type="date" id="date_debut">
                    <label>Date Fin</label><input type="date" id="date_fin">
                    <label>Coût</label><input type="number" id="cout" placeholder="Coût">`;
        case 'modules':
            return `<label id="name">Nom</label><input type="text" id="nom" placeholder="Nom">
                    <label>Description</label><input type="text" id="description" placeholder="Description">
                    <label>Date Début</label><input type="date" id="date_debut">
                    <label>Date Fin</label><input type="date" id="date_fin">
                    <label>Priorité</label><select id="priorite">
                        <option>Haute</option><option>Moyenne</option><option>Basse</option>
                    </select>`;
        case 'taches':
            return `<label id="name">Nom</label><input type="text" id="nom" placeholder="Nom">
                    <label>Description</label><input type="text" id="description" placeholder="Description">
                    <label>Date Début</label><input type="date" id="date_debut">
                    <label>Date Fin</label><input type="date" id="date_fin">
                    <label>État</label><select id="etat">
                        <option>A faire</option><option>En cours</option><option>Terminé</option>
                    </select>`;
        case 'membres':
            return `<label id="name">ID</label><input type="text" id="id" placeholder="ID">
                    <label>Nom</label><input type="text" id="nom" placeholder="Nom">
                    <label>Prénom</label><input type="text" id="prenom" placeholder="Prénom">
                    <label>Email</label><input type="email" id="email" placeholder="Email">`;
        case 'ressources':
            return `<label id="name">ID</label><input type="text" id="id" placeholder="ID">
                    <label>Nom</label><input type="text" id="nom" placeholder="Nom">
                    <label>Utilité</label><input type="text" id="utilite" placeholder="Utilité">
                    <label>Coût</label><input type="number" id="cout" placeholder="Coût">`;
    }
}

// Ajouter ou Modifier un élément
function ajouterElement(section) {
    const inputs = document.querySelectorAll(`#content input, #content select`);
    let newElement = {};
    inputs.forEach(input => {
        if (input.id !== "edit-index") {
            newElement[input.id] = input.value;
        }
    });

    let editIndex = document.getElementById("edit-index").value;
    if (editIndex === "") {
        // Ajout d'un nouvel élément
        data[section].push(newElement);
    } else {
        // Modification d'un élément existant
        data[section][editIndex] = newElement;
        document.getElementById("edit-index").value = ""; // Réinitialiser
        document.getElementById("submit-btn").textContent = "Ajouter";
    }

    showSection(section); // Recharger la section pour afficher la mise à jour
}

// Fonction pour afficher la liste d'une section sous forme de tableau
function afficherListe(section) {
    const content = document.getElementById("content");
    content.innerHTML = `
        <div class="form-header">
            <h3>Liste des ${section.charAt(0).toUpperCase() + section.slice(1)}</h3>
            <button class="close-btn" onclick="closeForm()">X</button>
        </div>
        <button class="btn-back" onclick="goBack()">Retour</button>
        <div id="liste-container">${genererTableau(section)}</div>
    `;
}

// Fonction pour revenir au Menu principal
function goBack() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Menu Principal</h2>
        <button class="btn-green" onclick="showSection('projets')">Projets</button>
        <button class="btn-green" onclick="showSection('modules')">Modules</button>
        <button class="btn-green" onclick="showSection('taches')">Tâches</button>
        <button class="btn-green" onclick="showSection('membres')">Membres</button>
        <button class="btn-green" onclick="showSection('ressources')">Ressources</button>
    `;
}

// Générer un tableau pour afficher les enregistrements d'une section donnée
function genererTableau(section) {
    if (data[section].length === 0) {
        return `<p>Aucun ${section} enregistré.</p>`;
    }

    let table = `<table class="styled-table">
                    <thead>
                        <tr>
                            ${Object.keys(data[section][0]).map(key => `<th>${key.toUpperCase()}</th>`).join('')}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data[section].map((item, index) => `
                            <tr>
                                ${Object.values(item).map(value => `<td>${value}</td>`).join('')}
                                <td>
                                    <button onclick="modifierElement('${section}', ${index})" class="btn-yellow">Modifier</button>
                                    <button onclick="supprimerElement('${section}', ${index})" class="btn-red">Supprimer</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
    return table;
}

// Supprimer un élément de la liste
function supprimerElement(section, index) {
    data[section].splice(index, 1);
    afficherListe(section);
}

// Modifier un élément dans la liste
function modifierElement(section, index) {
    showSection(section);
    let element = data[section][index];
    Object.keys(element).forEach(key => {
        document.getElementById(key).value = element[key];
    });
    document.getElementById("edit-index").value = index;
    document.getElementById("submit-btn").textContent = "Modifier";
}
