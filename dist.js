'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $schema = 'http://json-schema.org/draft-04/schema#';

var defaultOptions = {
	setMinItems: true,
	setMaxItems: false,
	setMinNumber: false,
	setMaxNumber: false,
	setRequired: true,
	detectEnum: true,
	enumMaxLength: 10,
	maxEnum: 4
};

// Find the Schema type for a JavaScript object
var getSchemaType = function getSchemaType(object) {
	if (_underscore2.default.isNull(object)) return 'null';else if (_underscore2.default.isBoolean(object)) return 'boolean';else if (_underscore2.default.isNumber(object)) return 'number';else if (_underscore2.default.isString(object)) return 'string';else if (_underscore2.default.isArray(object)) return 'array';else if (_underscore2.default.isObject(object)) return 'object';

	return null;
};

// Regex for detecting string formats
var formatRegex = {
	uri: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
	email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	// hostname: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
	ipv4: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
	ipv6: /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i,
	date: /^\d{4}-\d{1,2}-\d{1,2}$/
};

// SchemaTrainerProperty represents a JSON Schema object that is being trained.
// It determines it's types, formats based on the object it's been trained with.

var SchemaTrainerProperty = function () {
	function SchemaTrainerProperty(options) {
		_classCallCheck(this, SchemaTrainerProperty);

		this.options = options;
		this.schema = null;

		this.types = {};
		this.values = [];
		this.properties = {};
		this.formats = _underscore2.default.mapObject(formatRegex, function () {
			return true;
		});
		this.formatsValid = false;
	}

	_createClass(SchemaTrainerProperty, [{
		key: 'getProperty',
		value: function getProperty(key) {
			if (!this.properties[key]) {
				this.properties[key] = new SchemaTrainerProperty(this.options);
			}

			return this.properties[key];
		}
	}, {
		key: 'train',
		value: function train(object) {
			var _this = this;

			var type = getSchemaType(object);
			var options = this.options;


			this.types[type] = true;

			var _ret = function () {
				switch (type) {
					case 'string':
						// Loop through potential formats
						// and falsify those that aren't matches
						_underscore2.default.forEach(_this.formats, function (shouldTest, format) {
							// Test the string value against the regex for the format
							if (shouldTest && !formatRegex[format].test(object)) {
								_this.formats[format] = false;
							}
						});

						_this.formatsValid = true;
						_this.values = _underscore2.default.union(_this.values, [object]);

						return {
							v: void 0
						};

					case 'number':
						_this.values = _underscore2.default.union(_this.values, [object]);

						if (options.setMinNumber) {
							if (_underscore2.default.has(_this, 'minNumber')) _this.minNumber = Math.max(object, _this.minNumber);else _this.minNumber = object;
						}

						if (options.setMaxNumber) {
							if (_underscore2.default.has(_this, 'maxNumber')) _this.maxNumber = Math.min(object, _this.maxNumber);else _this.maxNumber = object;
						}

						return {
							v: void 0
						};

					case 'object':
						_underscore2.default.forEach(object, function (value, key) {
							_this.getProperty(key).train(value);
						});

						if (options.setRequired) {
							var required = _underscore2.default.keys(object);

							if (!_this.requiredProperties) _this.requiredProperties = required;else _this.requiredProperties = _underscore2.default.intersection(_this.requiredProperties, required);
						}

						return {
							v: void 0
						};

					case 'array':
						if (options.setMinItems) {
							if (_underscore2.default.has(_this, 'minItems')) {
								_this.minItems = Math.max(object.length, _this.minItems);
							} else {
								_this.minItems = object.length;
							}
						}

						var itemsProp = _this.getProperty('items');

						_underscore2.default.forEach(object, function (item) {
							return itemsProp.train(item);
						});

						return {
							v: void 0
						};

					default:
						return {
							v: void 0
						};
				}
			}();

			if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
		}
	}, {
		key: 'toJS',
		value: function toJS() {
			var _this2 = this;

			var options = this.options;


			var schema = {};
			var type = null;

			// Check if we're defined as a boolean and a number
			if (this.types.number && this.types.boolean && types.length == 2) {
				schema.type = type = 'number';
			} else {
				var _types = _underscore2.default.keys(this.types);

				if (_types.length == 1) {
					schema.type = type = _types[0];
				} else if (_types.length > 0) {
					schema.type = _types;
				}
			}

			var _ret2 = function () {
				switch (type) {
					case 'array':
						schema.items = _this2.getProperty('items').toJS();
						return {
							v: schema
						};

					case 'object':
						schema.properties = {};

						_underscore2.default.forEach(_this2.properties, function (schemaProp, key) {
							schema.properties[key] = schemaProp.toJS();
						});

						// Add required properties if we have them set
						if (_this2.requiredProperties && _this2.requiredProperties.length > 0) schema.required = _this2.requiredProperties;

						return {
							v: schema
						};

					case 'string':
						var formats = [];

						if (_this2.formatsValid) {
							_underscore2.default.forEach(_this2.formats, function (enabled, format) {
								if (enabled) {
									formats.push(format);
								}
							});
						}

						if (formats.length > 0) {
							schema.format = formats[0];
						} else {
							if (_this2.options.detectEnum && _this2.values.length > 1 && _this2.values.length <= _this2.options.maxEnum) {
								var passedTest = true;

								for (var i = 0; i < _this2.values.length; i++) {
									var value = _this2.values[i];

									if (value.length > _this2.options.enumMaxLength) {
										passedTest = false;
										break;
									}
								}

								if (passedTest) {
									delete schema.type;
									schema.enum = _this2.values;
								}
							}
						}

						return {
							v: schema
						};

					case 'number':
						if (options.setMinNumber) schema.minimum = _this2.minNumber;

						if (options.setMaxNumber) schema.maximum = _this2.maxNumber;

						return {
							v: schema
						};

					default:
						return {
							v: schema
						};
				}
			}();

			if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
		}
	}]);

	return SchemaTrainerProperty;
}();

var SchemaTrainer = function (_SchemaTrainerPropert) {
	_inherits(SchemaTrainer, _SchemaTrainerPropert);

	function SchemaTrainer() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SchemaTrainer);

		return _possibleConstructorReturn(this, (SchemaTrainer.__proto__ || Object.getPrototypeOf(SchemaTrainer)).call(this, _underscore2.default.defaults(options, defaultOptions)));
	}

	_createClass(SchemaTrainer, [{
		key: 'toJS',
		value: function toJS() {
			return _underscore2.default.extend({ $schema: $schema }, _get(SchemaTrainer.prototype.__proto__ || Object.getPrototypeOf(SchemaTrainer.prototype), 'toJS', this).call(this));
		}
	}]);

	return SchemaTrainer;
}(SchemaTrainerProperty);

exports.default = SchemaTrainer;
