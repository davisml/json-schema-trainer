import _ from 'underscore'

const $schema = 'http://json-schema.org/draft-04/schema#'

const defaultOptions = {
	setMinItems: true,
	setMaxItems: false,
	setMinNumber: false,
	setMaxNumber: false,
	setRequired: true,
	detectEnum: true,
	enumMaxLength: 10,
	maxEnum: 4
}

// Find the Schema type for a JavaScript object
const getSchemaType = (object) => {
	if (_.isNull(object))
		return 'null'
	else if (_.isBoolean(object))
		return 'boolean'
	else if (_.isNumber(object))
		return 'number'
	else if (_.isString(object))
		return 'string'
	else if (_.isArray(object))
		return 'array'
	else if (_.isObject(object))
		return 'object'
	
	return null
}

// Regex for detecting string formats
const urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

// SchemaTrainerProperty represents a JSON Schema object that is being trained.
// It determines it's types, formats based on the object it's been trained with.

class SchemaTrainerProperty {
	constructor(options) {
		this.options = options
		this.schema = null

		this.types = {}
		this.values = []
		this.properties = {}
		this.formats = {
			uri: true,
			email: true
		}
		this.formatsValid = false
	}

	getProperty(key) {
		if (!this.properties[key]) {
			this.properties[key] = new SchemaTrainerProperty(this.options)
		}

		return this.properties[key]
	}

	train(object) {
		const type = getSchemaType(object)
		const {options} = this

		this.types[type] = true

		switch(type) {
			case 'string':
				if (this.formats.uri && !urlRegex.test(object)) {
					this.formats.uri = false
				}

				if (this.formats.email && !emailRegex.test(object)) {
					this.formats.email = false
				}

				this.formatsValid = true
				this.values = _.union(this.values, [object])

				return

			case 'number':
				this.values = _.union(this.values, [object])

				if (options.setMinNumber) {
					if (_.has(this, 'minNumber'))
						this.minNumber = Math.max(object, this.minNumber)
					else
						this.minNumber = object
				}

				if (options.setMaxNumber) {
					if (_.has(this, 'maxNumber'))
						this.maxNumber = Math.min(object, this.maxNumber)
					else
						this.maxNumber = object
				}

				return

			case 'object':
				_.forEach(object, (value, key) => {
					this.getProperty(key).train(value)
				})

				if (options.setRequired) {
					const required = _.keys(object)

					if (!this.requiredProperties)
						this.requiredProperties = required
					else
						this.requiredProperties = _.intersection(this.requiredProperties, required)
				}

				return

			case 'array':
				if (options.setMinItems) {
					if (_.has(this, 'minItems')) {
						this.minItems = Math.max(object.length, this.minItems)
					} else {
						this.minItems = object.length
					}
				}
				
				const itemsProp = this.getProperty('items')
				
				_.forEach(object, (item) => itemsProp.train(item))

				return

			default:
				return
		}
	}

	toJS() {
		const {options} = this
		
		let schema = {}
		let type = null

		// Check if we're defined as a boolean and a number
		if (this.types.number && this.types.boolean && types.length == 2) {
			schema.type = type = 'number'
		} else {
			const types = _.keys(this.types)
			
			if (types.length == 1) {
				schema.type = type = types[0]
			} else if (types.length > 0) {
				schema.type = types
			}
		}

		switch(type) {
			case 'array':
				schema.items = this.getProperty('items').toJS()
				return schema

			case 'object':
				schema.properties = {}

				_.forEach(this.properties, (schemaProp, key) => {
					schema.properties[key] = schemaProp.toJS()
				})

				// Add required properties if we have them set
				if (this.requiredProperties && this.requiredProperties.length > 0)
					schema.required = this.requiredProperties

				return schema

			case 'string':
				let formats = []

				if (this.formatsValid) {
					_.forEach(this.formats, (enabled, format) => {
						if (enabled) {
							formats.push(format)
						}
					})
				}

				if (formats.length > 0) {
					schema.format = formats[0]
				} else {
					if (this.options.detectEnum && this.values.length <= this.options.maxEnum) {
						let passedTest = true

						for (let i = 0; i < this.values.length; i++) {
							const value = this.values[i]

							if (value.length > this.options.enumMaxLength) {
								passedTest = false
								break
							}
						}
						
						if (passedTest) {
							delete schema.type
							schema.enum = this.values
						}
					}
				}

				return schema

			case 'number':
				if (options.setMinNumber)
					schema.minimum = this.minNumber

				if (options.setMaxNumber)
					schema.maximum = this.maxNumber

				return schema

			default:
				return schema
		}
	}
}

class SchemaTrainer extends SchemaTrainerProperty {
	constructor(options = {}) {
		super(_.defaults(options, defaultOptions))
	}

	toJS() {
		return _.extend({ $schema }, super.toJS())
	}
}

export default SchemaTrainer