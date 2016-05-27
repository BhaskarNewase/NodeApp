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


exports.add_comments = function(req, res, next) {
    req.assert('user_name', 'User name cannot be blank').notEmpty();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('comment', 'Comment cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/blog');
    }

    Blog.findById(req.body.id, function(err, user) {
      if (err) {
        return next(err);
      }

      user.comments.email = req.body.email;
      user.comments.name = req.body.user_name;
      user.comments.comment = req.body.comment;
      
      user.save(function(err) {
        if (err) {
          if (err.code === 11000) {
            req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
            return res.redirect('/blog');
          } else {
            return next(err);
          }
        }
        req.flash('success', { msg: 'Comment posted updated.' });
        res.redirect('/blog');
      });
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

// UPDATE BLOG
exports.updateBlogDetails = function(req, res, next) {
    req.assert('title', 'Title cannot be blank').notEmpty();
    req.assert('description', 'Description cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('create');
    }
    var id = req.params.id;
    var title = req.body.title;
    var description = req.body.description;
    Blog.update({ title: title, description: description}, function(id) {
        res.redirect('/blog-edit/'+id)
    });

};





