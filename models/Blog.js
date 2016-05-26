var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  description: String,
  comments: { email: String, name: String, comment:String },

}, { timestamps: true });

var Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;