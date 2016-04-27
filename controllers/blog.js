var Blog = require('../models/Blog');
// get details of blog

exports.getBlog = function(req, res) {
  Blog.find(function(err, blogList){
  	res.render('blog/index',{
  		title: 'Blog',
  		blogList: blogList
  	});
  });
};

exports.getNewBlog = function(req, res) {
  	res.render('blog/create',{
  		title: 'Create New Blog'
  	});
};

exports.saveNewBlog = function(req, res, next) {
  	req.assert('title', 'Title cannot be blank').notEmpty();
  	req.assert('description', 'Description cannot be blank').notEmpty();

  	var errors = req.validationErrors();

  	if (errors) {
    	req.flash('errors', errors);
    	return res.redirect('create');
  	}

  	var blog = new Blog ({
      title: req.body.title,
      description: req.body.description
    });

  	blog.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/blog');
    });
};

// GET BLOG BY ID

exports.getBlogDetails = function(req, res, next) {

  Blog.findOne({_id: req.params.id}, function(err, blogRecord){

    if (err) {
      req.flash('errors', {msg : 'No Record found'});
      return res.redirect('/blog');
    };
    
    res.render('blog/blog_details',{
      title : 'Blog details',
      blogRecord: blogRecord
    });
  });
};

// DELETE BLOG BY ID
exports.destroyBlogDetails = function(req, res, next) {
  Blog.remove({_id:req.params.id}, function(err){
    if (err) {
      return next(err);
    };
    req.flash('info', {msg:'Blog has been deleted.'});
    res.redirect('/blog');
  });
};

exports.getBlogDetailById = function(req, res, next) {
  Blog.findOne({_id: req.params.id}, function(err, data){
    if (err) {
      req.flash('errors', {msg:'No Record Found'});
      res.redirect('/blog');
    };
    res.render('blog/create',{
      title:'Update Details',
      data:data
    });
  });
};