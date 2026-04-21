const express = require('express');
const app = express();

app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

let comptes = [];
let id = 1;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Vérifier si l'API fonctionne
 *     responses:
 *       200:
 *         description: API fonctionne
 */
app.get('/', (req, res) => {
  res.send("API bancaire fonctionne !");
});

/**
 * @swagger
 * /comptes:
 *   post:
 *     summary: Créer un compte
 *     description: Permet de créer un compte bancaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nom: Jean
 *     responses:
 *       200:
 *         description: Compte créé avec succès
 */
app.post('/comptes', (req, res) => {
  const compte = {
    id: id++,
    nom: req.body.nom,
    solde: 0
  };

  comptes.push(compte);
  res.json(compte);
});

/**
 * @swagger
 * /comptes:
 *   get:
 *     summary: Voir tous les comptes
 *     description: Retourne la liste des comptes
 *     responses:
 *       200:
 *         description: Liste des comptes
 */
app.get('/comptes', (req, res) => {
  res.json(comptes);
});

/**
 * @swagger
 * /comptes/{id}/depot:
 *   post:
 *     summary: Déposer de l'argent
 *     description: Ajouter de l'argent au compte
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             montant: 1000
 *     responses:
 *       200:
 *         description: Dépôt réussi
 *       404:
 *         description: Compte non trouvé
 */
app.post('/comptes/:id/depot', (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);

  if (!compte) {
    return res.status(404).send("Compte non trouvé");
  }

  compte.solde += req.body.montant;
  res.json(compte);
});

/**
 * @swagger
 * /comptes/{id}/retrait:
 *   post:
 *     summary: Retirer de l'argent
 *     description: Retirer de l'argent du compte
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             montant: 500
 *     responses:
 *       200:
 *         description: Retrait réussi
 *       400:
 *         description: Solde insuffisant
 */
app.post('/comptes/:id/retrait', (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);

  if (!compte) {
    return res.status(404).send("Compte non trouvé");
  }

  if (compte.solde < req.body.montant) {
    return res.status(400).send("Solde insuffisant");
  }

  compte.solde -= req.body.montant;
  res.json(compte);
});

// Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Banque",
      version: "1.0.0",
      description: "API pour gérer comptes, dépôts et retraits"
    },
  },
  apis: ["./server.js"],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// PORT Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});