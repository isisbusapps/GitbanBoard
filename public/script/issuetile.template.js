(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['issuetile'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.assignee : depth0)) != null ? stack1.login : stack1), depth0));
},"3":function(depth0,helpers,partials,data) {
    return "Unassigned";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + " ";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <span style=\"background-color:#"
    + alias3(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"9":function(depth0,helpers,partials,data) {
    return "            <span class=\"updated\">"
    + this.escapeExpression((helpers.formatDate || (depth0 && depth0.formatDate) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.updated_at : depth0),{"name":"formatDate","hash":{},"data":data}))
    + "</span>\n";
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            |\n            <span class=\"reponum\">\n                <a href=\""
    + alias3(((helper = (helper = helpers.html_url || (depth0 != null ? depth0.html_url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"html_url","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias3(((helper = (helper = helpers.reponame || (depth0 != null ? depth0.reponame : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"reponame","hash":{},"data":data}) : helper)))
    + "#"
    + alias3(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"number","hash":{},"data":data}) : helper)))
    + "</a>\n            </span>\n";
},"13":function(depth0,helpers,partials,data) {
    return "            | <span class=\"label label-danger\">&#10004; Closed</span>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"issue hide\" draggable=\"true\" id=\"issue"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"\n    data-username=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.assignee : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" data-label=\""
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.labels : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" data-repo=\""
    + alias3(((helper = (helper = helpers.reponame || (depth0 != null ? depth0.reponame : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"reponame","hash":{},"data":data}) : helper)))
    + "\"\n    data-state=\""
    + alias3(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"state","hash":{},"data":data}) : helper)))
    + "\" data-updated=\""
    + alias3(((helper = (helper = helpers.updated_at || (depth0 != null ? depth0.updated_at : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"updated_at","hash":{},"data":data}) : helper)))
    + "\"\n    >\n    <span class=\"title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\n    <img src=\""
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.assignee : depth0)) != null ? stack1.avatar_url : stack1), depth0))
    + "\" class=\"avatar\" />\n    <div class=\"description\">"
    + alias3(((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"body","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"labels\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.labels : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"baseline\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.updated_at : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.number : depth0),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.is || (depth0 && depth0.is) || alias1).call(depth0,(depth0 != null ? depth0.state : depth0),"closed",{"name":"is","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</div>";
},"useData":true});
})();