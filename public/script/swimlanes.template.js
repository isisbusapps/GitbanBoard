(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['swimlane'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"row swimlane\" data-assignee=\""
    + alias3(((helper = (helper = helpers.assignee || (depth0 != null ? depth0.assignee : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"assignee","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"swimlane-label\">"
    + alias3(((helper = (helper = helpers.assignee || (depth0 != null ? depth0.assignee : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"assignee","hash":{},"data":data}) : helper)))
    + "</div>\n    <div data-column=\"backlog-col\" class=\"col-sm-3 issue-col\" ondragover=\"return false;\">\n    </div>\n    <div data-column=\"todo-col\" class=\"col-sm-3 issue-col\" ondragover=\"return false;\">\n    </div>\n    <div data-column=\"inprogress-col\" class=\"col-sm-3 issue-col\" ondragover=\"return false;\">\n    </div>\n    <div data-column=\"done-col\" class=\"col-sm-3 issue-col\" ondragover=\"return false;\">\n    </div>\n</div>";
},"useData":true});
})();