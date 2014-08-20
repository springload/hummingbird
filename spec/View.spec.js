describe('View', function () {
    it('should exist', function () {
        expect(Hummingbird.View).to.exist;
    });

    it('should extend ItemView', function () {
        expect(view).be.an.instanceof(Marionette.ItemView);
    });


    var view = new Hummingbird.View();

    describe("#onShow()", function() {
        it('should exist', function () {
            expect(view.onShow).to.be.a('function');
        });
    });
});