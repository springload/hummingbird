// Core renderer for Nunjucks templates

module.exports = function(template, data){
    if (typeof template === "string") {
        return nunjucks.render(template, data);
    } else {
        return template.render(data);
    }
};

