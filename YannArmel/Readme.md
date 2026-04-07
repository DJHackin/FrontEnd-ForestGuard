
# 🌳 ForestGuard IoT Platform

## 📌 Description

**ForestGuard IoT Platform** est un projet IoT complet qui regroupe :

* le code d’un **ESP32 principal (récepteur)** chargé de **recevoir les données envoyées par un ou plusieurs ESP32 capteurs**,
* le **code du serveur backend** qui traite, valide et organise ces données,
* la logique d’**envoi et de synchronisation vers le cloud** pour stockage et exploitation.

Le projet est conçu autour d’un **ESP32 passerelle** jouant le rôle de point d’entrée des données IoT, avant leur transmission vers un serveur puis vers une infrastructure cloud.

---

## 🎯 Objectifs du projet

* Recevoir des données envoyées par des ESP32 (capteurs, modules de communication)
* Centraliser le traitement des données côté serveur
* Acheminer les données vers le cloud pour stockage et analyse
* Fournir une base claire, modulaire et évolutive pour des projets IoT

---

## 🧱 Architecture générale

```
[ ESP32 Capteurs ]  →  [ ESP32 Récepteur ]  →  [ Serveur Backend ]  →  [ Cloud ]
        ↑                     ↓                     ↓                   ↓
     Capteurs            Réception locale       Traitement        Stockage / Analyse
```

* **ESP32 Capteurs** : collectent les données (température, fumée, etc.)
* **ESP32 Récepteur** : reçoit les données du premier niveau ESP32
* **Serveur** : validation, traitement et routage
* **Cloud** : stockage et exploitation long terme

```

- **ESP32** : collecte et envoi des données
- **Serveur** : réception, validation, traitement et routage
- **Cloud** : stockage, visualisation, exploitation long terme

---

## 📂 Structure du dépôt


/
├── Esp32/                     # Code embarqué pour l’ESP32
│   ├── include/               # Headers (.h)
│   ├── lib/                   # Bibliothèques externes
│   ├── src/                   # Code source principal (.cpp)
│   ├── test/                  # Tests unitaires PlatformIO
│   └── platformio.ini         # Configuration PlatformIO
│
├── Server/                    # Serveur Node.js
│   ├── config/
│   │   └── .env               # Variables d'environnement (config sensible)
│   ├── node_modules/          # Dépendances Node.js
│   ├── app.js                 # Entrée principale de l’application
│   ├── server.js              # Configuration du serveur / routes / API
│   ├── package.json           # Dépendances et scripts npm
│   └── package-lock.json      # Verrouillage des versions
│
└── .gitignore                 # Fichiers ignorés par Git



---

## 🔌 Côté ESP32

Le projet comporte **deux rôles ESP32 distincts** :

### 1️⃣ ESP32 Capteur (émetteur)
- Lecture des données capteurs
- Envoi des données vers l’ESP32 récepteur (WiFi / LoRa)

### 2️⃣ ESP32 Récepteur (passerelle)
- Réception des données provenant des ESP32 capteurs
- Pré-traitement basique (formatage, filtrage)
- Transmission des données vers le serveur backend

---

## 🖥️ Côté Serveur

Rôles du serveur :

* Réception des données provenant des ESP32
* Validation et normalisation des données
* Stockage temporaire ou en base de données
* Envoi des données vers le cloud
* Journalisation (logs)

Le serveur agit comme **pont entre l’edge (ESP32) et le cloud**.

---

## ☁️ Cloud

Fonction :

* Stockage des données IoT
* Analyse ultérieure
* Visualisation (dashboards, statistiques)

Peut être connecté à :

* un service cloud public
* une base de données distante
* une plateforme IoT

---

## 🚀 Installation & démarrage

### 1️⃣ ESP32

* Installer PlatformIO
* Configurer le réseau (LoRa)
* Flasher le code contenu dans `/Esp32`

### 2️⃣ Serveur

```bash
cd Server
# Exemple
npm install  
npm start    
```

---

## 🔐 Sécurité (à prévoir / en cours)

* Validation des données entrantes
* Authentification des appareils ESP32
* Chiffrement des communications

---

## 📈 Évolutions prévues

* Ajout de MQTT
* Authentification des devices
* Dashboard web
* Intégration IA pour analyse automatique
* Gestion multi‑ESP32

---

## 👤 Auteur

Projet développé par **GALLIE Koffi Yann Armel**

---

## 📜 Licence

Ce projet est sous licence **MIT** (modifiable selon besoin).

---

✅ Ce dépôt constitue une base solide pour des projets IoT intégrant objets connectés, serveurs et cloud.


