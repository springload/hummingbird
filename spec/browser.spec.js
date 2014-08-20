describe('Browser', function () {
    var Browser  = Hummingbird.Browser;


    it('should exist', function () {
        expect(Browser).to.exist;
    });

    it('should be an object', function () {
        expect(Browser).be.an("object");
    });


    describe("#tablet()", function() {
        var size = 600;
        if (window.innerWidth > size) {
            it('should return true if the browser size is > 600px', function () {
                expect(Browser.tablet()).to.equal(true);
            });
        } else {
            it('should return false if the browser size is <= 600px', function () {
                expect(Browser.tablet()).to.equal(false);
            });
        }
    });


    describe("#isFileProtocol", function() {
        it('should return true if the browser is using the file:// protocol', function () {
            if (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
                expect(Browser.isFileProtocol()).to.equal(true);
            } else {
                expect(Browser.isFileProtocol()).to.equal(false);
            }
        });
    });

});