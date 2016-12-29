const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
  slug: {type: String, default: ''}, // this is the slug
  title: {type: String, required: true}, // Display title
  author: {type: String, default: ''},
  url: {type: String, default: ''}, // an external link you can use to override where to go when clicking
  image: {type: String, default: 'http://i.imgur.com/2lHqtJ7.png'},
  description: {type: String, default: ''},
  content: {type: String, default: ''},
  date: {type: Date},
  published: {type: Boolean, default: false},
  unix: {type: Number, default: 0},
  sync: {
    jekyll: {type: String, default: ''},
    wordpress: {type: String, default: ''},
    medium: {type: String, default: ''}
  },
  tags: {type: Array, default: []}
})
