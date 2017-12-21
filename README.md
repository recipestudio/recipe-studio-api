# Recipe Studio, server

## API endpoints

API URL: [`https://api.recipe.studio`](https://api.recipe.studio)

### Creating records
POST to `/recipe/new` in the following schema model:

```{
  name            :   String
  ingredients     :   [  
    {
      ingredient  :   String (ingredient ID)
      quantity    :   Number
      units       :   String
    }, {more ingredients....}
  ]
  image           :   String
  author          :   String (user ID)
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
