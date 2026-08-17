# Frontend Development Plan

## Stack
- React 19.2
- Pas de librairie UI (CSS custom)
- Axios pour API calls

## Pages à créer

### 1. Dashboard (Home)
- Stats globales
- Graphiques simples
- Liste récente transactions

### 2. Users
- Liste users
- Ajouter user
- Détails user avec ses transactions

### 3. Transactions
- Liste transactions
- Filtres (montant, date, lieu, device)
- Ajouter transaction
- Voir détails (fraud prediction)

### 4. Stats
- Graphiques et statistiques
- Par utilisateur
- Par période

## Composants

- Navbar
- Card
- Table
- Form
- Button
- Input
- Modal (peut-être)

## API Endpoints à utiliser

```
GET /api/users
POST /api/users
GET /api/users/{id}

GET /api/transactions
POST /api/transactions
GET /api/transactions/{id}
GET /api/transactions/stats
GET /api/transactions/stats/users
GET /api/transactions/search/place?place=X
GET /api/transactions/filter/amount?min=X&max=Y
GET /api/transactions/high-value?threshold=X
```

## Étapes

1. Setup projet
2. Structure de base + routing
3. Composants réutilisables
4. Page Dashboard
5. Page Users
6. Page Transactions
7. Page Stats
8. Styling
