import _ from 'underscore'

const getSchemaType = (object) => {
	if (_.isNull(object)) {
		return 'null'
	} else if (_.isBoolean(object)) {
		return 'boolean'
	} else if (_.isNumber(object)) {
		return 'number'
	} else if (_.isString(object)) {
		return 'string'
	} else if (_.isArray(object)) {
		return 'array'
	} else if (_.isObject(object)) {
		return 'object'
	}
}

class SchemaTrainerProperty {
	constructor(options) {
		this.options = options
		this.schema = null

		this.types = {}
		this.values = []
		this.properties = {}
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
				this.values = _.union(this.values, [object])
				return

			case 'number':
				this.values = _.union(this.values, [object])

				if (options.setMinNumber) {
					if (_.has(this, 'minNumber')) {
						this.minNumber = Math.max(object, this.minNumber)
					} else {
						this.minNumber = object
					}
				}

				if (options.setMaxNumber) {
					if (_.has(this, 'maxNumber')) {
						this.maxNumber = Math.min(object, this.maxNumber)
					} else {
						this.maxNumber = object
					}
				}

				return

			case 'object':
				_.forEach(object, (value, key) => {
					this.getProperty(key).train(value)
				})

				if (options.setRequired) {
					const required = _.keys(object)

					if (!this.requiredProperties) {
						this.requiredProperties = required
					} else {
						this.requiredProperties = _.intersection(required)
					}
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
				
				_.forEach(object, (item) => {
					this.getProperty('item').train(item)
				})

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
			case 'array': {
				schema.item = this.getProperty('item').toJS()

				return schema
			}

			case 'object': {
				schema.properties = {}

				_.forEach(this.properties, (schemaProp, key) => {
					schema.properties[key] = schemaProp.toJS()
				})

				// Add required properties if we have them set
				if (this.requiredProperties && this.requiredProperties.length > 0) {
					schema.required = this.requiredProperties
				}

				return schema
			}

			case 'string': {
				if (this.options.detectEnum && this.values.length <= this.options.maxEnum) {
					delete schema.type
					schema.enum = this.values
				}

				return schema
			}

			case 'number': {
				if (options.setMinNumber) {
					schema.minimum = this.minNumber
				}

				if (options.setMaxNumber) {
					schema.maximum = this.maxNumber
				}

				return schema
			}

			default:
				return schema
		}
	}
}

class SchemaTrainer extends SchemaTrainerProperty {
	constructor(options = {}) {
		super(_.defaults(options, {
			setMinItems: true,
			setMaxItems: false,
			setMinNumber: false,
			setMaxNumber: false,
			setRequired: true,
			detectEnum: true,
			maxEnum: 2
		}))
	}
}

export default SchemaTrainer