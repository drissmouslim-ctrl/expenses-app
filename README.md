# Dépenses Famille

Application web mobile-first (PWA) pour enregistrer les dépenses quotidiennes familiales.
Installable sur iPhone, sans compte, protégée par un code PIN commun.

---

## Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL hébergé)
- PWA (manifest + service worker)

---

## Installation locale

### 1. Prérequis

- Node.js ≥ 20
- Un compte [Supabase](https://supabase.com) (gratuit)

### 2. Cloner et installer

```bash
cd expenses
npm install
```

### 3. Créer la base de données Supabase

1. Connecte-toi sur [app.supabase.com](https://app.supabase.com)
2. Crée un nouveau projet
3. Va dans **SQL Editor**
4. Colle et exécute le contenu du fichier `schema.sql`

### 4. Variables d'environnement

Copie le fichier exemple et remplis les valeurs :

```bash
cp .env.local.example .env.local
```

Édite `.env.local` :

```env
# URL de ton projet Supabase (Project Settings > API > Project URL)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

# Clé service role (Project Settings > API > service_role)
# ⚠️ Ne jamais exposer cette clé côté client
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PIN d'accès (chiffres uniquement)
APP_PIN=1234

# Secret aléatoire pour signer le cookie de session
# Génère-en un avec : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=une-longue-chaine-aleatoire
```

### 5. Ajouter les icônes PWA

Place deux images PNG dans `public/icons/` :
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

Tu peux générer ces icônes depuis n'importe quelle image sur [maskable.app](https://maskable.app/editor).

### 6. Lancer en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## Utilisation

1. **Écran PIN** : saisis le code PIN défini dans `APP_PIN`
2. **Ajouter** (onglet +) : formulaire de saisie rapide
3. **Historique** : liste des dépenses, modifiable et supprimable
4. **Export** : télécharge un CSV compatible Excel

### Persistance locale

Le dernier utilisateur, la dernière catégorie et le dernier type de paiement sont mémorisés dans `localStorage` pour accélérer la saisie suivante.

---

## Déploiement sur Vercel

### Option A — Via l'interface Vercel (recommandé)

1. Pousse le code sur GitHub
2. Connecte-toi sur [vercel.com](https://vercel.com) et importe le dépôt
3. Dans **Settings > Environment Variables**, ajoute les 4 variables :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_PIN`
   - `SESSION_SECRET`
4. Clique **Deploy**

### Option B — Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
# Renseigne les variables d'env quand demandé
```

### Installer l'app sur iPhone

1. Ouvre l'URL de l'app dans **Safari**
2. Touche le bouton **Partager** (carré avec flèche)
3. Sélectionne **"Sur l'écran d'accueil"**
4. Confirme

L'application apparaît comme une app native sur l'écran d'accueil.

---

## Structure du projet

```
src/
├── app/
│   ├── api/
│   │   ├── auth/route.ts         Validation du PIN
│   │   ├── expenses/route.ts     GET (liste) + POST (création)
│   │   ├── expenses/[id]/route.ts PUT (modif) + DELETE
│   │   └── export/route.ts       Export CSV
│   ├── (app)/
│   │   ├── layout.tsx            Layout avec navigation
│   │   ├── add/page.tsx          Formulaire nouvelle dépense
│   │   ├── history/page.tsx      Historique
│   │   └── export/page.tsx       Export CSV
│   ├── layout.tsx                Layout racine (PWA meta)
│   └── page.tsx                  Écran PIN
├── components/
│   ├── BottomNav.tsx             Navigation bas de page
│   ├── ExpenseForm.tsx           Formulaire partagé
│   ├── ExpenseList.tsx           Liste avec édition/suppression
│   ├── EditModal.tsx             Modale d'édition
│   └── Toast.tsx                 Notifications
├── lib/
│   ├── auth.ts                   Logique PIN/cookie
│   ├── supabase.ts               Client Supabase serveur
│   └── types.ts                  Types TypeScript + constantes
└── middleware.ts                 Protection des routes
```

---

## Changer le PIN

Modifie simplement `APP_PIN` dans `.env.local` (local) ou dans les variables d'environnement Vercel, puis redéploie.

## Sécurité

Le PIN est validé côté serveur uniquement. Le cookie de session est signé avec `SESSION_SECRET`. Cette sécurité est adaptée à un usage familial domestique — elle n'est pas conçue pour protéger des données sensibles exposées sur internet.
