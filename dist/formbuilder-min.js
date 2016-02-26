(function(){rivets.binders.input={publishes:!0,routine:rivets.binders.value.routine,bind:function(a){return $(a).bind("input.rivets",this.publish)},unbind:function(a){return $(a).unbind("input.rivets")}},rivets.configure({prefix:"rv",adapter:{subscribe:function(a,b,c){return c.wrapped=function(a,b){return c(b)},a.on("change:"+b,c.wrapped)},unsubscribe:function(a,b,c){return a.off("change:"+b,c.wrapped)},read:function(a,b){return"cid"===b?a.cid:a.get(b)},publish:function(a,b,c){return a.cid?a.set(b,c):a[b]=c}}})}).call(this),function(){var a,b,c,d,e,f,g,h,i,j,k,l={}.hasOwnProperty,m=function(a,b){function c(){this.constructor=a}for(var d in b)l.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};e=function(a){function b(){return g=b.__super__.constructor.apply(this,arguments)}return m(b,a),b.prototype.sync=function(){},b.prototype.indexInDOM=function(){var a,b=this;return a=$(".fb-field-wrapper").filter(function(a,c){return $(c).data("cid")===b.cid}),$(".fb-field-wrapper").index(a)},b.prototype.is_input=function(){return null!=c.inputFields[this.get(c.options.mappings.FIELD_TYPE)]},b}(Backbone.DeepModel),d=function(a){function b(){return h=b.__super__.constructor.apply(this,arguments)}return m(b,a),b.prototype.initialize=function(){return this.on("add",this.copyCidToModel)},b.prototype.model=e,b.prototype.comparator=function(a){return a.indexInDOM()},b.prototype.copyCidToModel=function(a){return a.attributes.cid=a.cid},b}(Backbone.Collection),f=function(a){function b(){return i=b.__super__.constructor.apply(this,arguments)}return m(b,a),b.prototype.className="fb-field-wrapper",b.prototype.events={"click .subtemplate-wrapper":"focusEditView","click .js-duplicate":"duplicate","click .js-clear":"clear"},b.prototype.initialize=function(a){return this.parentView=a.parentView,this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"destroy",this.remove)},b.prototype.render=function(){return this.$el.addClass("response-field-"+this.model.get(c.options.mappings.FIELD_TYPE)).data("cid",this.model.cid).html(c.templates["view/base"+(this.model.is_input()?"":"_non_input")]({rf:this.model})),this},b.prototype.focusEditView=function(){return this.parentView.createAndShowEditView(this.model)},b.prototype.clear=function(a){var b,d,e=this;switch(a.preventDefault(),a.stopPropagation(),b=function(){return e.parentView.handleFormUpdate(),e.model.destroy()},d=c.options.CLEAR_FIELD_CONFIRM,typeof d){case"string":if(confirm(d))return b();break;case"function":return d(b);default:return b()}},b.prototype.duplicate=function(){var a;return a=_.clone(this.model.attributes),delete a.id,a.label+=" Copy",this.parentView.createField(a,{position:this.model.indexInDOM()+1})},b}(Backbone.View),b=function(a){function b(){return j=b.__super__.constructor.apply(this,arguments)}return m(b,a),b.prototype.className="edit-response-field",b.prototype.events={"click .js-add-option":"addOption","click .js-remove-option":"removeOption","click .js-default-updated":"defaultUpdated","input .fb-option-label-input":"forceRender","input .fb-option-value-input":"forceRender","click .js-add-link":"addLink","click .js-remove-link":"removeLink","input .fb-link-label-input":"forceRender"},b.prototype.initialize=function(a){return this.parentView=a.parentView,this.listenTo(this.model,"destroy",this.remove)},b.prototype.render=function(){return this.$el.html(c.templates["edit/base"+(this.model.is_input()?"":"_non_input")]({rf:this.model})),rivets.bind(this.$el,{model:this.model}),this},b.prototype.remove=function(){return this.parentView.editView=void 0,this.parentView.$el.find('[data-target="#addField"]').click(),b.__super__.remove.apply(this,arguments)},b.prototype.addOption=function(a){var b,d,e,f;return b=$(a.currentTarget),d=this.$el.find(".fb-edit-option").index(b.closest(".fb-edit-option")),f=this.model.get(c.options.mappings.OPTIONS)||[],e={label:"",checked:!1,value:""},d>-1?f.splice(d+1,0,e):f.push(e),this.model.set(c.options.mappings.OPTIONS,f),this.model.trigger("change:"+c.options.mappings.OPTIONS),this.forceRender()},b.prototype.addLink=function(a){var b,d,e,f;return b=$(a.currentTarget),d=this.$el.find(".fb-edit-link").index(b.closest(".fb-edit-link")),e=this.model.get(c.options.mappings.LINKS)||[],f={label:""},d>-1?e.splice(d+1,0,f):e.push(f),this.model.set(c.options.mappings.LINKS,e),this.model.trigger("change:"+c.options.mappings.LINKS),this.forceRender()},b.prototype.removeOption=function(a){var b,d,e;return b=$(a.currentTarget),d=this.$el.find(".js-remove-option").index(b),e=this.model.get(c.options.mappings.OPTIONS),e.splice(d,1),this.model.set(c.options.mappings.OPTIONS,e),this.model.trigger("change:"+c.options.mappings.OPTIONS),this.forceRender()},b.prototype.removeLink=function(a){var b,d,e;return b=$(a.currentTarget),d=this.$el.find(".js-remove-link").index(b),e=this.model.get(c.options.mappings.LINKS),e.splice(d,1),this.model.set(c.options.mappings.LINKS,e),this.model.trigger("change:"+c.options.mappings.LINKS),this.forceRender()},b.prototype.defaultUpdated=function(a){var b;return b=$(a.currentTarget),"checkboxes"!==this.model.get(c.options.mappings.FIELD_TYPE)&&this.$el.find(".js-default-updated").not(b).attr("checked",!1).trigger("change"),this.forceRender()},b.prototype.forceRender=function(){return this.model.trigger("change")},b}(Backbone.View),a=function(a){function e(){return k=e.__super__.constructor.apply(this,arguments)}return m(e,a),e.prototype.SUBVIEWS=[],e.prototype.events={"click .js-save-form":"saveForm","click .fb-tabs a":"showTab","click .fb-add-field-types a":"addField","mouseover .fb-add-field-types":"lockLeftWrapper","mouseout .fb-add-field-types":"unlockLeftWrapper"},e.prototype.initialize=function(a){var b;return b=a.selector,this.formBuilder=a.formBuilder,this.bootstrapData=a.bootstrapData,null!=b&&this.setElement($(b)),this.collection=new d,this.collection.bind("add",this.addOne,this),this.collection.bind("reset",this.reset,this),this.collection.bind("change",this.handleFormUpdate,this),this.collection.bind("destroy add reset",this.hideShowNoResponseFields,this),this.collection.bind("destroy",this.ensureEditViewScrolled,this),this.render(),this.collection.reset(this.bootstrapData),this.bindSaveEvent()},e.prototype.bindSaveEvent=function(){var a=this;return this.formSaved=!0,this.saveFormButton=this.$el.find(".js-save-form"),this.saveFormButton.attr("disabled",!0).text(c.options.dict.ALL_CHANGES_SAVED),c.options.AUTOSAVE&&setInterval(function(){return a.saveForm.call(a)},5e3),$(window).bind("beforeunload",function(){return a.formSaved?void 0:c.options.dict.UNSAVED_CHANGES})},e.prototype.reset=function(){return this.$responseFields.html(""),this.addAll()},e.prototype.render=function(){var a,b,d,e;for(this.$el.html(c.templates.page()),this.$fbLeft=this.$el.find(".fb-menu"),this.$responseFields=this.$el.find(".fb-response-fields"),this.bindWindowScrollEvent(),this.hideShowNoResponseFields(),e=this.SUBVIEWS,b=0,d=e.length;d>b;b++)a=e[b],new a({parentView:this}).render();return this},e.prototype.bindWindowScrollEvent=function(){var a=this;return $(window).on("scroll",function(){var b,c;if(a.$fbLeft.data("locked")!==!0)return c=Math.max(0,$(window).scrollTop()-a.$el.offset().top),b=a.$responseFields.height(),a.$fbLeft.css({"margin-top":Math.min(b,c)})})},e.prototype.showTab=function(a){var b,c,d;return b=$(a.currentTarget),d=b.data("target"),b.closest("li").addClass("active").siblings("li").removeClass("active"),$(d).addClass("active").siblings(".fb-tab-pane").removeClass("active"),"#editField"!==d&&this.unlockLeftWrapper(),"#editField"===d&&!this.editView&&(c=this.collection.models[0])?this.createAndShowEditView(c):void 0},e.prototype.addOne=function(a,b,c){var d,e;return e=new f({model:a,parentView:this}),null!=c.$replaceEl?c.$replaceEl.replaceWith(e.render().el):null==c.position||-1===c.position?this.$responseFields.append(e.render().el):0===c.position?this.$responseFields.prepend(e.render().el):(d=this.$responseFields.find(".fb-field-wrapper").eq(c.position))[0]?d.before(e.render().el):this.$responseFields.append(e.render().el)},e.prototype.setSortable=function(){var a=this;return this.$responseFields.hasClass("ui-sortable")&&this.$responseFields.sortable("destroy"),this.$responseFields.sortable({forcePlaceholderSize:!0,placeholder:"sortable-placeholder",stop:function(b,d){var e;return d.item.data("field-type")&&(e=a.collection.create(c.helpers.defaultFieldAttrs(d.item.data("field-type")),{$replaceEl:d.item}),a.createAndShowEditView(e)),a.handleFormUpdate(),!0},update:function(b,c){return c.item.data("field-type")?void 0:a.ensureEditViewScrolled()}}),this.setDraggable()},e.prototype.setDraggable=function(){var a,b=this;return a=this.$el.find("[data-field-type]"),a.draggable({connectToSortable:this.$responseFields,helper:function(){var a;return a=$("<div class='response-field-draggable-helper' />"),a.css({width:b.$responseFields.width(),height:"80px"}),a}})},e.prototype.addAll=function(){return this.collection.each(this.addOne,this),this.setSortable()},e.prototype.hideShowNoResponseFields=function(){return this.$el.find(".fb-no-response-fields")[this.collection.length>0?"hide":"show"]()},e.prototype.addField=function(a){var b;return b=$(a.currentTarget).data("field-type"),this.createField(c.helpers.defaultFieldAttrs(b))},e.prototype.createField=function(a,b){var c;return c=this.collection.create(a,b),this.createAndShowEditView(c),this.handleFormUpdate()},e.prototype.createAndShowEditView=function(a){var c,d;if(d=this.$el.find(".fb-field-wrapper").filter(function(){return $(this).data("cid")===a.cid}),d.addClass("editing").siblings(".fb-field-wrapper").removeClass("editing"),this.editView){if(this.editView.model.cid===a.cid)return this.$el.find('.fb-tabs a[data-target="#editField"]').click(),void this.scrollLeftWrapper(d);this.editView.remove()}return this.editView=new b({model:a,parentView:this}),c=this.editView.render().$el,this.$el.find(".fb-edit-field-wrapper").html(c),this.$el.find('.fb-tabs a[data-target="#editField"]').click(),this.scrollLeftWrapper(d),this},e.prototype.ensureEditViewScrolled=function(){return this.editView?this.scrollLeftWrapper($(".fb-field-wrapper.editing")):void 0},e.prototype.scrollLeftWrapper=function(a){this.unlockLeftWrapper(),!a[0]},e.prototype.lockLeftWrapper=function(){return this.$fbLeft.data("locked",!0)},e.prototype.unlockLeftWrapper=function(){return this.$fbLeft.data("locked",!1)},e.prototype.handleFormUpdate=function(){return this.updatingBatch?void 0:(this.formSaved=!1,this.saveFormButton.removeAttr("disabled").text(c.options.dict.SAVE_FORM))},e.prototype.saveForm=function(a){var b;if(!this.formSaved)return this.formSaved=!0,this.saveFormButton.attr("disabled",!0).text(c.options.dict.ALL_CHANGES_SAVED),this.collection.sort(),b=JSON.stringify({fields:this.collection.toJSON()}),c.options.HTTP_ENDPOINT&&this.doAjaxSave(b),this.formBuilder.trigger("save",b)},e.prototype.doAjaxSave=function(a){var b=this;return $.ajax({url:c.options.HTTP_ENDPOINT,type:c.options.HTTP_METHOD,data:a,contentType:"application/json",success:function(a){var c,d,e,f;for(b.updatingBatch=!0,d=0,e=a.length;e>d;d++)c=a[d],null!=(f=b.collection.get(c.cid))&&f.set({id:c.id}),b.collection.trigger("sync");return b.updatingBatch=void 0}})},e}(Backbone.View),c=function(){function b(b){var c;null==b&&(b={}),_.extend(this,Backbone.Events),c=_.extend(b,{formBuilder:this}),this.mainView=new a(c)}return b.helpers={defaultFieldAttrs:function(a){var c,d;return c={},c[b.options.mappings.LABEL]="Untitled",c[b.options.mappings.FIELD_TYPE]=a,c[b.options.mappings.REQUIRED]=!0,c.field_options={},c.field_options.links=[],("function"==typeof(d=b.fields[a]).defaultAttributes?d.defaultAttributes(c):void 0)||c},simple_format:function(a){return null!=a?a.replace(/\n/g,"<br />"):void 0}},b.options={BUTTON_CLASS:"fb-button",HTTP_ENDPOINT:"",HTTP_METHOD:"POST",AUTOSAVE:!0,CLEAR_FIELD_CONFIRM:!1,mappings:{SIZE:"field_options.size",UNITS:"field_options.units",LABEL:"label",FIELD_TYPE:"field_type",REQUIRED:"required",ATTACHMENT:"attachment",ADMIN_ONLY:"admin_only",OPTIONS:"field_options.options",LINKS:"field_options.links",VALUE:"field_options.value",QID:"field_options.qid",DESCRIPTION:"field_options.description",INCLUDE_OTHER:"field_options.include_other_option",INCLUDE_BLANK:"field_options.include_blank_option",INTEGER_ONLY:"field_options.integer_only",MIN:"field_options.min",MAX:"field_options.max",MINLENGTH:"field_options.minlength",MAXLENGTH:"field_options.maxlength",LENGTH_UNITS:"field_options.min_max_length_units",OPTION_NUMBERING:"field_options.option_numbering"},dict:{ALL_CHANGES_SAVED:"All changes saved",SAVE_FORM:"Save form",UNSAVED_CHANGES:"You have unsaved changes. If you leave this page, you will lose those changes!"}},b.fields={},b.inputFields={},b.nonInputFields={},b.registerField=function(a,c){var d,e,f,g;for(g=["view","edit"],e=0,f=g.length;f>e;e++)d=g[e],c[d]=_.template(c[d]);return c.field_type=a,b.fields[a]=c,"non_input"===c.type?b.nonInputFields[a]=c:b.inputFields[a]=c},b}(),window.Formbuilder=c,"undefined"!=typeof module&&null!==module?module.exports=c:window.Formbuilder=c}.call(this),function(){Formbuilder.registerField("bullet_points",{order:30,view:"<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />\n<div>...</div>\n<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",edit:"<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",addButton:"<span class='symbol'><span class='fa fa-list'></span></span> Bullet Points",defaultAttributes:function(a){return a.field_options.size="small",a}})}.call(this),function(){Formbuilder.registerField("checkboxes",{order:50,view:"<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='checkbox' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",edit:"<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",addButton:"<span class='symbol'><span class='fa fa-square-o'></span></span> Checkboxes",defaultAttributes:function(a){return a.field_options.options=[{label:"",checked:!1,value:""},{label:"",checked:!1,value:""}],a.field_options.option_numbering="none",a}})}.call(this),function(){Formbuilder.registerField("date",{order:70,view:'<div class=\'fb-date\'>\n    <input type="text" />\n    <span class="symbol"><span class="fa fa-calendar"></span></span>\n</div>',edit:"",addButton:'<span class="symbol"><span class="fa fa-calendar"></span></span> Date'})}.call(this),function(){Formbuilder.registerField("dropdown",{order:60,view:"<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",edit:"<%= Formbuilder.templates['edit/options']({ includeBlank: true, excludeOptionNumbering: true }) %>",addButton:"<span class='symbol'><span class='fa fa-caret-down'></span></span> Dropdown",defaultAttributes:function(a){return a.field_options.options=[{label:"",checked:!1,value:""},{label:"",checked:!1,value:""}],a.field_options.include_blank_option=!1,a}})}.call(this),function(){}.call(this),function(){Formbuilder.registerField("number",{order:80,view:"<input type='text' />\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",edit:"<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",addButton:"<span class='symbol'><span class='fa fa-number'>123</span></span> Number"})}.call(this),function(){Formbuilder.registerField("paragraph",{order:20,view:"<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",edit:"<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",addButton:"<span class='symbol'>&#182;</span> Paragraph",defaultAttributes:function(a){return a.field_options.size="small",a}})}.call(this),function(){Formbuilder.registerField("radio",{order:40,view:"<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>    \n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",edit:"<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",addButton:"<span class='symbol'><span class='fa fa-circle-o'></span></span> Multiple Choice",defaultAttributes:function(a){return a.field_options.options=[{label:"",checked:!1,value:""},{label:"",checked:!1,value:""}],a.field_options.option_numbering="none",a}})}.call(this),function(){Formbuilder.registerField("scale",{order:90,view:"<i class='fa fa-chevron-left'></i><input type='text' /><i class='fa fa-chevron-right'></i>\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",edit:"<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",addButton:"<span class='symbol'><span class='fa fa-exchange'></span></span> Scale"})}.call(this),function(){Formbuilder.registerField("section_break",{order:100,type:"non_input",view:"<hr />\n<label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>\n<span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>\n<hr />",edit:"<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder='Title' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder='Add a longer description to this field'></textarea>",addButton:"<span class='symbol'><span class='fa fa-minus'></span></span> Section Break"})}.call(this),function(){Formbuilder.registerField("section_end",{order:101,type:"non_input",view:"<hr />",edit:"",addButton:"<span class='symbol'><span class='fa fa-arrow-left'></span></span> Section End"})}.call(this),function(){Formbuilder.registerField("section_start",{order:99,type:"non_input",view:"<label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>\n<span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>\n<hr />",edit:"<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder='Title' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder='Add a longer description to this field'></textarea>",addButton:"<span class='symbol'><span class='fa fa-arrow-right'></span></span> Section Start"})}.call(this),function(){Formbuilder.registerField("text",{order:10,view:"<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",edit:"<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",addButton:"<span class='symbol'><span class='fa fa-font'></span></span> Text",defaultAttributes:function(a){return a.field_options.size="small",a}})}.call(this),function(){Formbuilder.registerField("yes_no",{order:100,view:"<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",edit:"<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",addButton:"<span class='symbol'><span class='fa fa-circle-o'></span></span> Yes/No",defaultAttributes:function(a){return a.field_options.options=[{label:"Yes",checked:!1,value:""},{label:"No",checked:!1,value:""}],a.field_options.option_numbering="none",a}})}.call(this),this.Formbuilder=this.Formbuilder||{},this.Formbuilder.templates=this.Formbuilder.templates||{},this.Formbuilder.templates["edit/base"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+=(null==(__t=Formbuilder.templates["edit/common"]())?"":__t)+"\r\n"+(null==(__t=Formbuilder.templates["edit/links"]())?"":__t)+"\r\n"+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf:rf}))?"":__t)+"\r\n";return __p},this.Formbuilder.templates["edit/base_header"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-field-label'>\r\n  <span data-rv-text=\"model."+(null==(__t=Formbuilder.options.mappings.LABEL)?"":__t)+"\"></span>\r\n  <code class='field-type' data-rv-text='model."+(null==(__t=Formbuilder.options.mappings.FIELD_TYPE)?"":__t)+"'></code>\r\n  <span class='fa fa-arrow-right pull-right'></span>\r\n</div>";return __p},this.Formbuilder.templates["edit/base_non_input"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+=(null==(__t=Formbuilder.templates["edit/base_header"]())?"":__t)+"\r\n"+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf:rf}))?"":__t)+"\r\n";return __p},this.Formbuilder.templates["edit/checkboxes"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<label>\r\n    <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.REQUIRED)?"":__t)+"' />\r\n    Required\r\n</label>\r\n<label>\r\n    <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.ATTACHMENT)?"":__t)+"' />\r\n    Add attachment\r\n</label>";return __p},this.Formbuilder.templates["edit/common"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-edit-section-header'>Question</div>\r\n\r\n<div class='fb-common-wrapper'>\r\n    <div class='fb-label-description'>\r\n        "+(null==(__t=Formbuilder.templates["edit/label_description"]())?"":__t)+"\r\n    </div>\r\n    <div class='fb-label-qid'>\r\n        "+(null==(__t=Formbuilder.templates["edit/label_qid"]())?"":__t)+"\r\n    </div>\r\n    <div class='fb-label-label'>\r\n        "+(null==(__t=Formbuilder.templates["edit/label_value"]())?"":__t)+"\r\n    </div>\r\n    <div class='fb-common-checkboxes'>\r\n        "+(null==(__t=Formbuilder.templates["edit/checkboxes"]())?"":__t)+"\r\n    </div>\r\n    <div class='fb-clear'></div>\r\n</div>\r\n";return __p},this.Formbuilder.templates["edit/common_non_input"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-edit-section-header'>Label</div>\r\n\r\n<div class='fb-common-wrapper'>\r\n  <div class='fb-label-description'>\r\n    "+(null==(__t=Formbuilder.templates["edit/label_description"]())?"":__t)+"\r\n  </div>\r\n  <div class='fb-clear'></div>\r\n</div>\r\n";return __p},this.Formbuilder.templates["edit/integer_only"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-edit-section-header'>Integer only</div>\r\n<label>\r\n  <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.INTEGER_ONLY)?"":__t)+"' />\r\n  Only accept integers\r\n</label>\r\n";return __p},this.Formbuilder.templates["edit/label_description"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<input type='text' data-rv-input='model."+(null==(__t=Formbuilder.options.mappings.LABEL)?"":__t)+'\' class="fb-large-input" placeholder="Title" />\r\n<textarea data-rv-input=\'model.'+(null==(__t=Formbuilder.options.mappings.DESCRIPTION)?"":__t)+"' class=\"fb-large-input\" placeholder='Add a longer description to this field'></textarea>";return __p},this.Formbuilder.templates["edit/label_qid"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<input type='text' data-rv-input='model."+(null==(__t=Formbuilder.options.mappings.QID)?"":__t)+'\' placeholder="Question ID" class="fb-large-input" />\r\n';return __p},this.Formbuilder.templates["edit/label_value"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<input type='text' data-rv-input='model."+(null==(__t=Formbuilder.options.mappings.VALUE)?"":__t)+'\' class="fb-large-input" placeholder="Value" />\r\n';return __p},this.Formbuilder.templates["edit/links"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-edit-section-header'>References</div>\r\n\r\n<div class='fb-edit-link' data-rv-each-option='model."+(null==(__t=Formbuilder.options.mappings.LINKS)?"":__t)+'\'>\r\n    <input type="text" class="fb-link-label-input" data-rv-input="option:label" placeholder="Reference" \r\n    /><!--<input type="text" class="fb-link-url-input" data-rv-input="option:url" placeholder="Url"\r\n    />--><a class="js-add-link '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Add Link"><i class=\'fa fa-plus\'></i>\r\n    </a><a class="js-remove-link '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+"\" title=\"Remove Link\"><i class='fa fa-trash-o'></i></a>\r\n</div>\r\n\r\n<div class='fb-bottom-add'>\r\n    <a class=\"js-add-link "+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'">Add link</a>\r\n</div>\r\n';return __p},this.Formbuilder.templates["edit/min_max"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+='<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\r\n\r\nAbove\r\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MIN)?"":__t)+'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\nBelow\r\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MAX)?"":__t)+'" style="width: 30px" />\r\n';return __p},this.Formbuilder.templates["edit/min_max_length"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+='<div class=\'fb-edit-section-header\'>Length Limit</div>\r\n\r\nMin\r\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MINLENGTH)?"":__t)+'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\nMax\r\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MAXLENGTH)?"":__t)+'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\n<select data-rv-value="model.'+(null==(__t=Formbuilder.options.mappings.LENGTH_UNITS)?"":__t)+'" style="width: auto;">\r\n  <option value="characters">characters</option>\r\n  <option value="words">words</option>\r\n</select>\r\n';return __p},this.Formbuilder.templates["edit/options"]=function(obj){obj||(obj={});var __t,__p="";_.escape,Array.prototype.join;with(obj)__p+="<div class='fb-edit-section-header'>Options</div>\r\n\r\n","undefined"==typeof excludeOptionNumbering&&(__p+="\r\n<div>\r\n    Options numbering:\r\n    <select data-rv-value='model."+(null==(__t=Formbuilder.options.mappings.OPTION_NUMBERING)?"":__t)+'\'>\r\n        <option selected="selected" value="none">none</option>\r\n        <option value="decimal">decimal</option>\r\n        <option value="lower-latin">lower-latin</option>\r\n        <option value="upper-latin">upper-latin</option>\r\n    </select>\r\n</div>\r\n'),__p+="\r\n\r\n","undefined"!=typeof includeBlank&&(__p+="\r\n<label>\r\n    <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.INCLUDE_BLANK)?"":__t)+"' />\r\n    Include blank\r\n</label>\r\n"),__p+="\r\n\r\n<div class='fb-edit-option' data-rv-each-option='model."+(null==(__t=Formbuilder.options.mappings.OPTIONS)?"":__t)+'\'>\r\n    <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" \r\n    /><input type="text" class="fb-option-label-input" data-rv-input="option:label" placeholder="Label"\r\n    /><input type="text" class="fb-option-value-input" data-rv-input="option:value" placeholder="Value"\r\n    /><a class="js-add-option '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Add Option"><i class=\'fa fa-plus\'></i>\r\n    </a><a class="js-remove-option '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Remove Option"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>\r\n\r\n',"undefined"!=typeof includeOther&&(__p+="\r\n<label>\r\n    <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.INCLUDE_OTHER)?"":__t)+'\' />\r\n    Include "other"\r\n</label>\r\n'),__p+="\r\n\r\n<div class='fb-bottom-add'>\r\n    <a class=\"js-add-option "+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'">Add option</a>\r\n</div>\r\n';return __p},this.Formbuilder.templates["edit/size"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-edit-section-header'>Size</div>\r\n<select data-rv-value=\"model."+(null==(__t=Formbuilder.options.mappings.SIZE)?"":__t)+'">\r\n  <option value="small">Small</option>\r\n  <option value="medium">Medium</option>\r\n  <option value="large">Large</option>\r\n</select>\r\n';return __p},this.Formbuilder.templates["edit/units"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+='<div class=\'fb-edit-section-header\'>Units</div>\r\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.UNITS)?"":__t)+'" />\r\n';return __p},this.Formbuilder.templates.page=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+=(null==(__t=Formbuilder.templates["partials/save_button"]())?"":__t)+"\r\n"+(null==(__t=Formbuilder.templates["partials/menu_side"]())?"":__t)+"\r\n"+(null==(__t=Formbuilder.templates["partials/content_side"]())?"":__t)+"\r\n<div class='fb-clear'></div>";return __p},this.Formbuilder.templates["partials/add_field"]=function(obj){obj||(obj={});var __t,__p="";_.escape,Array.prototype.join;with(obj)__p+="<div class='fb-tab-pane active' id='addField'>\r\n  <div class='fb-add-field-types'>\r\n    <div class='section'>\r\n      ",_.each(_.sortBy(Formbuilder.inputFields,"order"),function(a){__p+='\r\n        <a data-field-type="'+(null==(__t=a.field_type)?"":__t)+'" class="'+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'">\r\n          '+(null==(__t=a.addButton)?"":__t)+"\r\n        </a>\r\n      "}),__p+="\r\n    </div>\r\n\r\n    <div class='section'>\r\n      ",_.each(_.sortBy(Formbuilder.nonInputFields,"order"),function(a){__p+='\r\n        <a data-field-type="'+(null==(__t=a.field_type)?"":__t)+'" class="'+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'">\r\n          '+(null==(__t=a.addButton)?"":__t)+"\r\n        </a>\r\n      ";
}),__p+="\r\n    </div>\r\n  </div>\r\n</div>\r\n";return __p},this.Formbuilder.templates["partials/content_side"]=function(obj){obj||(obj={});var __p="";_.escape;with(obj)__p+="<div class='fb-form'>\r\n  <div class='fb-no-response-fields'>No response fields</div>\r\n  <div class='fb-response-fields'></div>\r\n</div>\r\n";return __p},this.Formbuilder.templates["partials/edit_field"]=function(obj){obj||(obj={});var __p="";_.escape;with(obj)__p+="<div class='fb-tab-pane' id='editField'>\r\n  <div class='fb-edit-field-wrapper'></div>\r\n</div>\r\n";return __p},this.Formbuilder.templates["partials/menu_side"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-menu'>\r\n  <ul class='fb-tabs'>\r\n    <li class='active'><a data-target='#addField'>Add new field</a></li>\r\n    <li><a data-target='#editField'>Edit field</a></li>\r\n  </ul>\r\n\r\n  <div class='fb-tab-content'>\r\n    "+(null==(__t=Formbuilder.templates["partials/add_field"]())?"":__t)+"\r\n    "+(null==(__t=Formbuilder.templates["partials/edit_field"]())?"":__t)+"\r\n  </div>\r\n</div>";return __p},this.Formbuilder.templates["partials/save_button"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='fb-save-wrapper'>\r\n  <button class='js-save-form "+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+"'></button>\r\n</div>";return __p},this.Formbuilder.templates["view/base"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='subtemplate-wrapper'>\r\n    <div class='cover'></div>\r\n    "+(null==(__t=Formbuilder.templates["view/label"]({rf:rf}))?"":__t)+"\r\n    "+(null==(__t=Formbuilder.templates["view/description"]({rf:rf}))?"":__t)+"\r\n    "+(null==(__t=Formbuilder.templates["view/links"]({rf:rf}))?"":__t)+"\r\n\r\n    "+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf:rf}))?"":__t)+"\r\n\r\n    "+(null==(__t=Formbuilder.templates["view/duplicate_remove"]({rf:rf}))?"":__t)+"\r\n</div>\r\n";return __p},this.Formbuilder.templates["view/base_non_input"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='subtemplate-wrapper'>\r\n    <div class='cover'></div>\r\n    "+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf:rf}))?"":__t)+"\r\n    "+(null==(__t=Formbuilder.templates["view/duplicate_remove"]({rf:rf}))?"":__t)+"\r\n</div>\r\n";return __p},this.Formbuilder.templates["view/description"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<span class='help-block'>\r\n  "+(null==(__t=Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)))?"":__t)+"\r\n</span>\r\n";return __p},this.Formbuilder.templates["view/duplicate_remove"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<div class='actions-wrapper'>\r\n  <a class=\"js-duplicate "+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Duplicate Field"><i class=\'fa fa-plus\'></i></a>\r\n  <a class="js-clear '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Remove Field"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>';return __p},this.Formbuilder.templates["view/label"]=function(obj){obj||(obj={});var __t,__p="";_.escape,Array.prototype.join;with(obj)__p+="<label>\r\n  <span>"+(null==(__t=Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)))?"":__t)+"\r\n  ",rf.get(Formbuilder.options.mappings.REQUIRED)&&(__p+="\r\n    <abbr title='required'>*</abbr>\r\n  "),__p+="\r\n</label>\r\n";return __p},this.Formbuilder.templates["view/label_non_input"]=function(obj){obj||(obj={});var __t,__p="";_.escape;with(obj)__p+="<label>\r\n  <span>"+(null==(__t=Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)))?"":__t)+"\r\n</label>\r\n";return __p},this.Formbuilder.templates["view/links"]=function(obj){obj||(obj={});var __t,__p="";_.escape,Array.prototype.join;with(obj)if((rf.get(Formbuilder.options.mappings.LINKS)||[]).length>0){__p+='\r\n<div class="fb-links">\r\n    <div class="fb-links-title">Links:</div>\r\n    <ul>\r\n        ';for(i in rf.get(Formbuilder.options.mappings.LINKS)||[])__p+="\r\n        <li>\r\n            ",0===(rf.get(Formbuilder.options.mappings.LINKS)[i].label||"").trim().indexOf("http")&&(__p+='\r\n            <a href="'+(null==(__t=rf.get(Formbuilder.options.mappings.LINKS)[i].label)?"":__t)+'">\r\n            '),__p+="\r\n                "+(null==(__t=rf.get(Formbuilder.options.mappings.LINKS)[i].label)?"":__t)+"\r\n            ",0===(rf.get(Formbuilder.options.mappings.LINKS)[i].label||"").trim().indexOf("http")&&(__p+="\r\n            </a>\r\n            "),__p+="\r\n        </li>\r\n        ";__p+="\r\n    </ul>\r\n</div>\r\n"}return __p};