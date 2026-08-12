# Tests API - Backend

Date: 12/08/2026
Backend: Spring Boot + PostgreSQL

## Tests effectués

### Config backend
- PostgreSQL sur port 5432
- Base de données fraud_detector_db créée
- Spring Boot sur port 8080
- Tables users et transactions créées par Hibernate
- Spring Security configuré (CSRF désactivé pour l'API)

### API Utilisateurs
- POST /api/users - création OK
- GET /api/users - liste OK
- GET /api/users/{id} - récup OK
- PUT /api/users/{id} - update OK
- DELETE /api/users/{id} - suppression OK

### API Transactions
- POST /api/transactions/{userId} - création OK
- GET /api/transactions - liste OK
- GET /api/transactions/{id} - récup OK

### PostgreSQL
Vérifications faites, données bien enregistrées

## Données de test

Quelques users et transactions créés pour tester:
- 2 utilisateurs (John Doe, Alice Martin)
- 4 transactions avec différents montants et devices

## Config

Base de données:
- URL: jdbc:postgresql://localhost:5432/fraud_detector_db
- User: postgres
- Pass: postgres123

Security:
- CSRF off pour l'API
- Pas d'auth requise sur /api/**

## Commandes de test

### 1. Créer un utilisateur
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "pass123"
    role = "USER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/users" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing
```

### 2. Récupérer tous les utilisateurs
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/users" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 3. Créer une transaction
```powershell
$transaction = @{
    amount = 99.99
    place = "Paris"
    device = "iPhone"
    time = "2026-08-12T15:00:00"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/1" `
  -Method POST `
  -ContentType "application/json" `
  -Body $transaction `
  -UseBasicParsing
```

### 4. Récupérer toutes les transactions
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 5. Vérifier dans PostgreSQL
```powershell
$env:PGPASSWORD="postgres123"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d fraud_detector_db -c "SELECT * FROM users;"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d fraud_detector_db -c "SELECT * FROM transactions;"
```

## Endpoints API

- POST /api/users - créer user
- GET /api/users - liste users
- GET /api/users/{id} - détails user
- PUT /api/users/{id} - modifier user
- DELETE /api/users/{id} - supprimer user
- POST /api/transactions/{userId} - créer transaction
- GET /api/transactions - liste transactions
- GET /api/transactions/{id} - détails transaction

## Notes

Problèmes rencontrés et résolus:
- 401 au début à cause de Spring Security -> créé SecurityConfig
- CSRF bloquait les requetes -> désactivé
- Typo dans TransactionController (getalltransactions)
- pom.xml avait un soucis avec la dépendance validation

A faire:
- Intégrer le modèle ML
- Créer endpoint pour prédiction fraude
- Frontend
