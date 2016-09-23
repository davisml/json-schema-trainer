import Request from 'request-promise-native'
import http from 'http'
import SchemaTrainer from './SchemaTrainer'
import AJV from 'ajv'
import _ from 'underscore'

const acronyms = ['SGML', 'OMG', 'LOL', 'LMAO', 'BMI', 'TMI', 'XML', 'WTF', 'a', 'bluh', '&']
const schemaTrainer = new SchemaTrainer
const ajv = new AJV

let responseItems = []

function testSchema(schema) {
	console.log(JSON.stringify(schema))
	
	console.log("Training complete")
	
	for (let i = 0; i < responseItems.length; i++) {
		if (!ajv.validate(schema, responseItems[i])) {
			console.error("Training item failed to validate")
			console.log(data)
			return
		}
	}

	console.log("All training items validated")
}

console.log("Fetch some JSON")

Request('https://anapioficeandfire.com/api/books/1').then((bookResponse) => {
	let {characters} = JSON.parse(bookResponse)

	if (characters.length > 100) {
		characters.length = 100
	}

	console.log(`Train with ${ characters.length } different characters`)
	
	_.forEach(characters, (url) => {
		Request(url).then((response) => {
			const body = JSON.parse(response)
			
			responseItems.push(body)
			schemaTrainer.train(body)
			
			if (responseItems.length === characters.length) {
				testSchema(schemaTrainer.toJS())
			}
		}).catch((error) => {
			console.log("Fetch error")
			console.error(error)
			console.log(error.stack)
			throw error
		})
	})
})

// http.get({
//     host: 'nactem.ac.uk',
//     path: '/software/acromine/dictionary.py?sf=BMI'
// }, function(response) {
//     // Continuously update stream with data
//     console.log(response)
//     // var body = '';
//     // response.on('data', function(d) {
//     //     body += d;
//     // });

//     // response.on('end', function() {
//     //     // Data reception is done, do whatever with it!
//     //     var parsed = JSON.parse(body);
//     //     callback({
//     //         email: parsed.email,
//     //         password: parsed.pass
//     //     })
//     // })
// })