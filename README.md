# MyRecipes, server

## API endpoints

API URL: [`api.myrecipes.pw/v1`](http://api.myrecipes.pw/v1)

### Creating records
POST to `/recipe/new` in the following schema model:

```{
  name            :   String
  ingredients     :   [  
    {
      name        :   String
      ingredient  :   String
      quantity    :   Number
      measure     :   String
    }, {more ingredients....}
  ]
  picture         :   String
  author          :   String
}
```

### Reading records
GET to `/recipe/all` for all records

GET to `/recipe/:idNum` for a specific record, where `:idNum` is the record ID

### Updating records
PUT to `/recipe/:idNum` to update a specific record, where `:idNum` is the record ID. The data sent should include the full record following the Recipe model posted above.

### Deleting records
DELETE to `/recipe/:idNum` to delete a specific record, where `:idNum` is the record ID







---
Ingredients API will eventually be fed from here: https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md
