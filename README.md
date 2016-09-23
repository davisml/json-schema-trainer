# json-schema-trainer

Create JSON Schemas through training with objects.

## Features

* Detect property type(s)
* Set required properties
* Set minimum number value
* Set minimum array length
* Create enum properties based on the number of options

## Example schema generated from https://anapioficeandfire.com/api/characters/2

{"type":"object","required":["url","name","gender","culture","born","died","titles","aliases","father","mother","spouse","allegiances","books","povBooks","tvSeries","playedBy"],"properties":{"url":{"type":"string"},"name":{"type":"string"},"gender":{"enum":["Male","Female"]},"culture":{"type":"string"},"born":{"type":"string"},"died":{"type":"string"},"titles":{"type":"array","item":{"type":"string"}},"aliases":{"type":"array","item":{"type":"string"}},"father":{"type":"string"},"mother":{"type":"string"},"spouse":{"type":"string"},"allegiances":{"type":"array","item":{"type":"string"}},"books":{"type":"array","item":{"type":"string"}},"povBooks":{"type":"array","item":{"enum":["https://anapioficeandfire.com/api/books/5","https://anapioficeandfire.com/api/books/8"]}},"tvSeries":{"type":"array","item":{"type":"string"}},"playedBy":{"type":"array","item":{"type":"string"}}}}