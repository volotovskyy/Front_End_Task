/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lo3dpv639k65fqf")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lg5ogonz",
    "name": "reactions",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lo3dpv639k65fqf")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lg5ogonz",
    "name": "reactions",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
})
