# Améliorations API Backend

## Nouveaux endpoints ajoutés

### Statistiques

#### 1. Statistiques globales
```
GET /api/transactions/stats
```
Retourne:
- Nombre total de transactions
- Montant total
- Montant moyen
- Montant max/min
- Nombre d'utilisateurs uniques

Exemple réponse:
```json
{
  "totalTransactions": 10,
  "totalAmount": 5000.50,
  "averageAmount": 500.05,
  "maxAmount": 1250.00,
  "minAmount": 45.50,
  "uniqueUsers": 3
}
```

#### 2. Statistiques par utilisateur
```
GET /api/transactions/stats/users
```
Retourne les stats pour chaque utilisateur:
- Nombre de transactions
- Total dépensé
- Moyenne par transaction

Exemple:
```json
[
  {
    "userId": 1,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "transactionCount": 5,
    "totalSpent": 2500.00,
    "averageTransaction": 500.00
  }
]
```

### Recherche et filtrage

#### 3. Transactions par utilisateur
```
GET /api/transactions/user/{userId}
```
Toutes les transactions d'un utilisateur spécifique

#### 4. Recherche par lieu
```
GET /api/transactions/search/place?place=Paris
```
Cherche dans les noms de lieux (insensible à la casse)

#### 5. Recherche par device
```
GET /api/transactions/search/device?device=iPhone
```
Cherche dans les noms d'appareils

#### 6. Filtrer par montant
```
GET /api/transactions/filter/amount?min=100&max=500
```
Transactions entre deux montants

#### 7. Transactions à montant élevé
```
GET /api/transactions/high-value?threshold=1000
```
Transactions supérieures à un seuil (défaut: 1000)

#### 8. Filtrer par date
```
GET /api/transactions/filter/date?startDate=2026-08-01T00:00:00&endDate=2026-08-31T23:59:59
```
Transactions dans une période donnée

## Validations ajoutées

Le DTO TransactionRequestDTO inclut maintenant:

- `type`: requis, doit être PAYMENT|TRANSFER|CASH_OUT|DEBIT|CASH_IN
- `amount`: requis, entre 0.01 et 1,000,000
- `oldBalanceOrig`: requis, >= 0
- `newBalanceOrig`: requis, >= 0
- `oldBalanceDest`: requis, >= 0
- `newBalanceDest`: requis, >= 0
- `place`: requis, 2-100 caractères
- `device`: requis, 2-100 caractères
- `time`: requis, pas dans le futur

## Exemples de tests

### Statistiques globales
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/stats" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Chercher transactions à Paris
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/search/place?place=Paris" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Transactions entre 50 et 200 euros
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/filter/amount?min=50&max=200" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Transactions à montant élevé (>500)
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/high-value?threshold=500" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Stats par utilisateur
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/stats/users" -UseBasicParsing | Select-Object -ExpandProperty Content
```

## Fichiers modifiés/créés

Nouveaux DTOs:
- `TransactionStatsDTO.java`
- `UserStatsDTO.java`

Modifiés:
- `TransactionRepository.java` - ajout de requêtes custom
- `TransactionService.java` - nouvelles méthodes
- `TransactionController.java` - nouveaux endpoints
- `TransactionRequestDTO.java` - validations renforcées

## Notes

Toutes ces fonctionnalités sont accessibles sans authentification (comme le reste de l'API /api/**)
