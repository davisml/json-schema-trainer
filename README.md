# json-schema-trainer

Create JSON Schemas through training with objects.

## Features

* Detect property type(s)
* Set required properties
* Set minimum number value
* Set minimum array length
* Create enum properties based on the number of options

## Example

Feed the SchemaTrainer some objects:

```javascript
var schemaTrainer = new SchemaTrainer

schemaTrainer.train({
	gender: 'male',
	name: 'Joe'
})

schemaTrainer.train({
	gender: 'female',
	name: 'Martha'
})

schemaTrainer.train({
	gender: 'male',
	name: 'Bob'
})

schemaTrainer.train({
	gender: 'female',
	name: 'Cindy'
})

console.log(schemaTrainer.toJS())
```

Call toJS() to return a javascript object of the JSON Schema

```
{
    type: 'object',
    properties: {
        gender: {
            enum: ['male', 'female']
        },
        name: {
            type: 'string'
        }
    },
    required: ['gender', 'name']
}
```

Example schema generated from https://anapioficeandfire.com/api/characters/*

```javascript
{
    "type": "object",
    "properties": {
        "url": {
            "type": "string",
            "format": "uri"
        },
        "name": {
            "type": "string"
        },
        "gender": {
            "enum":[
                "Female",
                "Male"
            ]
        },
        "culture": {
            "type": "string"
        },
        "born": {
            "type": "string"
        },
        "died": {
            "type": "string"
        },
        "titles": {
            "type": "array",
            "item": {
                "type": "string"
            }
        },
        "aliases": {
            "type": "array",
            "item": {
                "type": "string"
            }
        },
        "father": {
            "type": "string"
        },
        "mother": {
            "type": "string"
        },
        "spouse": {
            "type": "string"
        },
        "allegiances": {
            "type": "array",
            "item": {
                "type": "string",
                "format": "uri"
            }
        },
        "books": {
            "type": "array",
            "item": {
                "type": "string",
                "format": "uri"
            }
        },
        "povBooks": {
            "type": "array",
            "item": {
                "type": "string",
                "format": "uri"
            }
        },
        "tvSeries": {
            "type": "array",
            "item": {
                "type": "string"
            }
        },
        "playedBy": {
            "type": "array",
            "item": {
                "type": "string"
            }
        }
    },
    "required":[
        "url",
        "name",
        "gender",
        "culture",
        "born",
        "died",
        "titles",
        "aliases",
        "father",
        "mother",
        "spouse",
        "allegiances",
        "books",
        "povBooks",
        "tvSeries",
        "playedBy"
    ]
}
```