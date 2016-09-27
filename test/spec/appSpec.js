describe('Siskel', function() {

  var model, collection;
  var datum = [
    {
      title: 'Primer',
      year: 2004,
      rating: 9
    },
    {
      title: 'Back to the Future',
      year: 1985,
      rating: 10
    }
  ];

  beforeEach(function() {
    sinon.spy(Movies.prototype, 'sort');
    collection = new Movies(datum);
    // instantiating a collection invokes sort; reset state
    Movies.prototype.sort.reset();
    model = collection.first();
  });

  afterEach(function() {
    Movies.prototype.sort.restore();
  });

  describe('Movie model like property', function() {

    it('should start out true', function() {
      expect(model.get('like')).to.be.true;
    });

    it('should toggle its state', function() {
      model.toggleLike();
      expect(model.get('like')).to.be.false;
    });

  });

  describe('Movie collection', function() {

    it('should have a default comparator for title', function() {
      expect(collection.comparator).to.equal('title');
    });

    it('should update its comparator', function() {
      collection.sortByField('rating');
      expect(collection.comparator).to.equal('rating');
    });

    it('should trigger sort when the comparator is changed', function() {
      collection.sortByField('rating');
      expect(collection.sort).to.have.been.called;
    });

    it('should trigger sort when a model changes', function() {
      model.toggleLike();
      expect(collection.sort).to.have.been.called;
    });

  });

  describe('Movie View', function() {

    var modelView;

    beforeEach(function() {
      sinon.spy(Movie.prototype, 'toggleLike');
      sinon.spy(MovieView.prototype, 'render');
      modelView = new MovieView({model: model});
    });

    afterEach(function() {
      MovieView.prototype.render.restore();
      Movie.prototype.toggleLike.restore();
    });

    it('should re-render when the model changes', function() {
      model.toggleLike();
      expect(modelView.render).to.have.been.called;
    });

    it('should toggle like state of its model', function() {
      modelView.handleClick();
      expect(model.toggleLike).to.have.been.called;
    });

  });

  describe('Movies View', function() {

    var collectionView;

    beforeEach(function() {
      sinon.spy(MoviesView.prototype, 'render');
      collectionView = new MoviesView({collection: collection});
    });

    afterEach(function() {
      MoviesView.prototype.render.restore();
    });

    it('should re-render when the collection sorts', function() {
      collection.sort();
      expect(collectionView.render).to.have.been.called;
    });

  });

});