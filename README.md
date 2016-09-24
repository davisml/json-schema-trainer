# json-schema-trainer

Create JSON Schemas through training with objects.

## Features

* Detect property type(s)
* Set required properties
* Set minimum number value
* Set minimum array length
* Detect string format (uri, email, hostname, ipv4, ipv6, date)
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

Call toJS() to return an object with the JSON Schema

```javascript
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "gender": {
            "enum": ["male", "female"]
        },
        "name": {
            "type": "string"
        }
    },
    "required": ["gender", "name"]
}
```

Example schema generated from https://anapioficeandfire.com/api/characters/*

```javascript
{
    "$schema": "http://json-schema.org/draft-04/schema#",
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
            "items": {
                "type": "string"
            }
        },
        "aliases": {
            "type": "array",
            "items": {
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
            "items": {
                "type": "string",
                "format": "uri"
            }
        },
        "books": {
            "type": "array",
            "items": {
                "type": "string",
                "format": "uri"
            }
        },
        "povBooks": {
            "type": "array",
            "items": {
                "type": "string",
                "format": "uri"
            }
        },
        "tvSeries": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "playedBy": {
            "type": "array",
            "items": {
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