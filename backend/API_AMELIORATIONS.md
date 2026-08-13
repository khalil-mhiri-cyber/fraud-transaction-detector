# API Improvements

Added new endpoints for stats and searching.

## New Endpoints

### Stats
- `GET /api/transactions/stats` - global stats
- `GET /api/transactions/stats/users` - per user stats

### Search/Filter
- `GET /api/transactions/user/{userId}` - get user transactions
- `GET /api/transactions/search/place?place=X` - search by place
- `GET /api/transactions/search/device?device=X` - search by device
- `GET /api/transactions/filter/amount?min=X&max=Y` - filter by amount
- `GET /api/transactions/high-value?threshold=X` - high value transactions
- `GET /api/transactions/filter/date?startDate=X&endDate=Y` - filter by date

## Validations

Added validations to TransactionRequestDTO:
- type must be valid
- amounts must be positive
- dates can't be in future

## Test Examples

```powershell
# Stats
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/stats" -UseBasicParsing

# Search
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/search/place?place=Paris" -UseBasicParsing

# Filter
Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/filter/amount?min=50&max=200" -UseBasicParsing
```

## Files Changed

- TransactionStatsDTO.java (new)
- UserStatsDTO.java (new)
- TransactionRepository.java (added queries)
- TransactionService.java (new methods)
- TransactionController.java (new endpoints)
- TransactionRequestDTO.java (validations)
