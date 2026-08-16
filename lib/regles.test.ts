// Harnais de tests — vit dans le dépôt, versionné (méthode §3).
// Tourne avant chaque déploiement : `npm test` (appelé par le script de déploiement).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  APP_VERSION,
  CATEGORIES,
  SLOTS,
  isCommercial,
  peutAjouterAuJour,
  railAutoriseDansSlot,
  visibleDansMaJournee,
} from "./regles.ts";

test("APP_VERSION est posée", () => {
  assert.match(APP_VERSION, /^\d+\.\d+$/);
});

test("D03 — neuf catégories, commercial en tête", () => {
  assert.equal(CATEGORIES.length, 9);
  assert.equal(CATEGORIES[0], "commercial");
});

test("D06 — moteur découle de la catégorie, pas d'un champ", () => {
  assert.equal(isCommercial("commercial"), true);
  assert.equal(isCommercial("finance"), false);
  assert.equal(isCommercial("perso"), false);
});

test("D39 — départ : 1 Créer, 2 Performer, 2 Mécanique", () => {
  assert.deepEqual(SLOTS, { creer: 1, performer: 2, mecanique: 2 });
});

test("D39 — un rail plein refuse, un rail libéré accepte (réapprovisionnement)", () => {
  assert.equal(peutAjouterAuJour("creer", 0), true);
  assert.equal(peutAjouterAuJour("creer", 1), false); // refus ferme, pas une alerte
  assert.equal(peutAjouterAuJour("performer", 2), false);
  assert.equal(peutAjouterAuJour("performer", 1), true); // slot libéré → candidat possible
  assert.equal(peutAjouterAuJour("mecanique", 2), false);
});

test("D30/D39 — le slot Créer est protégé contre Performer et Mécanique", () => {
  assert.equal(railAutoriseDansSlot("creer", "creer"), true);
  assert.equal(railAutoriseDansSlot("creer", "performer"), false);
  assert.equal(railAutoriseDansSlot("creer", "mecanique"), false);
  assert.equal(railAutoriseDansSlot("performer", "performer"), true);
  assert.equal(railAutoriseDansSlot("performer", "creer"), false);
});

test("D19 — l'écran quotidien n'affiche que porteur=moi", () => {
  assert.equal(visibleDansMaJournee("moi"), true);
  assert.equal(visibleDansMaJournee("delegue"), false);
  assert.equal(visibleDansMaJournee("supervise"), false);
});
