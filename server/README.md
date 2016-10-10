# myfood-server

## API endpoints

### Creating records
POST to `/recipe/create` in the following schema model:

```{
  name            :   String
  ingredients   :   [  
    {
      name          :   String
      ingredient    :   String
      quantity      :   Number
      measure       :   String
    }, {more ingredients....}
  ]
  picture       :   String
  author        :   String
}```

### Reading records
GET to `/recipe/all` for all records

GET to `/recipe/id/:idNum` for a specific record, where `:idNum` is the record ID

### Updating records
PUT to `/recipe/update/:idNum` to update a specific record, where `:idNum` is the record ID. The data sent should include the full record following the Recipe model posted above.

### Deleting records
DELETE to `/recipe/delete/:idNum` to delete a specific record, where `:idNum` is the record ID
