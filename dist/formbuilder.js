(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return $(el).bind('input.rivets', this.publish);
    },
    unbind: function(el) {
      return $(el).unbind('input.rivets');
    }
  };

  rivets.configure({
    prefix: "rv",
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

}).call(this);

(function() {
  var BuilderView, EditFieldView, Formbuilder, FormbuilderCollection, FormbuilderModel, ViewFieldView, _ref, _ref1, _ref2, _ref3, _ref4,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FormbuilderModel = (function(_super) {
    __extends(FormbuilderModel, _super);

    function FormbuilderModel() {
      _ref = FormbuilderModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FormbuilderModel.prototype.sync = function() {};

    FormbuilderModel.prototype.indexInDOM = function() {
      var $wrapper,
        _this = this;
      $wrapper = $(".fb-field-wrapper").filter((function(_, el) {
        return $(el).data('cid') === _this.cid;
      }));
      return $(".fb-field-wrapper").index($wrapper);
    };

    FormbuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    return FormbuilderModel;

  })(Backbone.DeepModel);

  FormbuilderCollection = (function(_super) {
    __extends(FormbuilderCollection, _super);

    function FormbuilderCollection() {
      _ref1 = FormbuilderCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FormbuilderCollection.prototype.initialize = function() {
      return this.on('add', this.copyCidToModel);
    };

    FormbuilderCollection.prototype.model = FormbuilderModel;

    FormbuilderCollection.prototype.comparator = function(model) {
      return model.indexInDOM();
    };

    FormbuilderCollection.prototype.copyCidToModel = function(model) {
      return model.attributes.cid = model.cid;
    };

    return FormbuilderCollection;

  })(Backbone.Collection);

  ViewFieldView = (function(_super) {
    __extends(ViewFieldView, _super);

    function ViewFieldView() {
      _ref2 = ViewFieldView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ViewFieldView.prototype.className = "fb-field-wrapper";

    ViewFieldView.prototype.events = {
      'click .subtemplate-wrapper': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear'
    };

    ViewFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "destroy", this.remove);
    };

    ViewFieldView.prototype.render = function() {
      this.$el.addClass('response-field-' + this.model.get(Formbuilder.options.mappings.FIELD_TYPE)).data('cid', this.model.cid).html(Formbuilder.templates["view/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      return this;
    };

    ViewFieldView.prototype.focusEditView = function() {
      return this.parentView.createAndShowEditView(this.model);
    };

    ViewFieldView.prototype.clear = function(e) {
      var cb, x,
        _this = this;
      e.preventDefault();
      e.stopPropagation();
      cb = function() {
        _this.parentView.handleFormUpdate();
        return _this.model.destroy();
      };
      x = Formbuilder.options.CLEAR_FIELD_CONFIRM;
      switch (typeof x) {
        case 'string':
          if (confirm(x)) {
            return cb();
          }
          break;
        case 'function':
          return x(cb);
        default:
          return cb();
      }
    };

    ViewFieldView.prototype.duplicate = function() {
      var attrs;
      attrs = _.clone(this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' Copy';
      return this.parentView.createField(attrs, {
        position: this.model.indexInDOM() + 1
      });
    };

    return ViewFieldView;

  })(Backbone.View);

  EditFieldView = (function(_super) {
    __extends(EditFieldView, _super);

    function EditFieldView() {
      _ref3 = EditFieldView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    EditFieldView.prototype.className = "edit-response-field";

    EditFieldView.prototype.events = {
      'click .js-add-option': 'addOption',
      'click .js-remove-option': 'removeOption',
      'click .js-default-updated': 'defaultUpdated',
      'input .fb-option-label-input': 'forceRender',
      'input .fb-option-value-input': 'forceRender',
      'click .js-add-link': 'addLink',
      'click .js-remove-link': 'removeLink',
      'input .fb-link-label-input': 'forceRender'
    };

    EditFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      return this.listenTo(this.model, "destroy", this.remove);
    };

    EditFieldView.prototype.render = function() {
      this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      return this;
    };

    EditFieldView.prototype.remove = function() {
      this.parentView.editView = void 0;
      this.parentView.$el.find("[data-target=\"#addField\"]").click();
      return EditFieldView.__super__.remove.apply(this, arguments);
    };

    EditFieldView.prototype.addOption = function(e) {
      var $el, i, newOption, options;
      $el = $(e.currentTarget);
      i = this.$el.find('.fb-edit-option').index($el.closest('.fb-edit-option'));
      options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
      newOption = {
        label: '',
        checked: false,
        value: ''
      };
      if (i > -1) {
        options.splice(i + 1, 0, newOption);
      } else {
        options.push(newOption);
      }
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.addLink = function(e) {
      var $el, i, links, newLink;
      $el = $(e.currentTarget);
      i = this.$el.find('.fb-edit-link').index($el.closest('.fb-edit-link'));
      links = this.model.get(Formbuilder.options.mappings.LINKS) || [];
      newLink = {
        label: ''
      };
      if (i > -1) {
        links.splice(i + 1, 0, newLink);
      } else {
        links.push(newLink);
      }
      this.model.set(Formbuilder.options.mappings.LINKS, links);
      this.model.trigger("change:" + Formbuilder.options.mappings.LINKS);
      return this.forceRender();
    };

    EditFieldView.prototype.removeOption = function(e) {
      var $el, index, options;
      $el = $(e.currentTarget);
      index = this.$el.find(".js-remove-option").index($el);
      options = this.model.get(Formbuilder.options.mappings.OPTIONS);
      options.splice(index, 1);
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.removeLink = function(e) {
      var $el, index, links;
      $el = $(e.currentTarget);
      index = this.$el.find(".js-remove-link").index($el);
      links = this.model.get(Formbuilder.options.mappings.LINKS);
      links.splice(index, 1);
      this.model.set(Formbuilder.options.mappings.LINKS, links);
      this.model.trigger("change:" + Formbuilder.options.mappings.LINKS);
      return this.forceRender();
    };

    EditFieldView.prototype.defaultUpdated = function(e) {
      var $el;
      $el = $(e.currentTarget);
      if (this.model.get(Formbuilder.options.mappings.FIELD_TYPE) !== 'checkboxes') {
        this.$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change');
      }
      return this.forceRender();
    };

    EditFieldView.prototype.forceRender = function() {
      return this.model.trigger('change');
    };

    return EditFieldView;

  })(Backbone.View);

  BuilderView = (function(_super) {
    __extends(BuilderView, _super);

    function BuilderView() {
      _ref4 = BuilderView.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    BuilderView.prototype.SUBVIEWS = [];

    BuilderView.prototype.events = {
      'click .js-save-form': 'saveForm',
      'click .fb-tabs a': 'showTab',
      'click .fb-add-field-types a': 'addField',
      'mouseover .fb-add-field-types': 'lockLeftWrapper',
      'mouseout .fb-add-field-types': 'unlockLeftWrapper'
    };

    BuilderView.prototype.initialize = function(options) {
      var selector;
      selector = options.selector, this.formBuilder = options.formBuilder, this.bootstrapData = options.bootstrapData;
      if (selector != null) {
        this.setElement($(selector));
      }
      this.collection = new FormbuilderCollection;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('destroy add reset', this.hideShowNoResponseFields, this);
      this.collection.bind('destroy', this.ensureEditViewScrolled, this);
      this.render();
      this.collection.reset(this.bootstrapData);
      return this.bindSaveEvent();
    };

    BuilderView.prototype.bindSaveEvent = function() {
      var _this = this;
      this.formSaved = true;
      this.saveFormButton = this.$el.find(".js-save-form");
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      if (!!Formbuilder.options.AUTOSAVE) {
        setInterval(function() {
          return _this.saveForm.call(_this);
        }, 5000);
      }
      return $(window).bind('beforeunload', function() {
        if (_this.formSaved) {
          return void 0;
        } else {
          return Formbuilder.options.dict.UNSAVED_CHANGES;
        }
      });
    };

    BuilderView.prototype.reset = function() {
      this.$responseFields.html('');
      return this.addAll();
    };

    BuilderView.prototype.render = function() {
      var subview, _i, _len, _ref5;
      this.$el.html(Formbuilder.templates['page']());
      this.$fbLeft = this.$el.find('.fb-menu');
      this.$responseFields = this.$el.find('.fb-response-fields');
      this.bindWindowScrollEvent();
      this.hideShowNoResponseFields();
      _ref5 = this.SUBVIEWS;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        subview = _ref5[_i];
        new subview({
          parentView: this
        }).render();
      }
      return this;
    };

    BuilderView.prototype.bindWindowScrollEvent = function() {
      var _this = this;
      return $(window).on('scroll', function() {
        var maxMargin, newMargin;
        if (_this.$fbLeft.data('locked') === true) {
          return;
        }
        newMargin = Math.max(0, $(window).scrollTop() - _this.$el.offset().top);
        maxMargin = _this.$responseFields.height();
        return _this.$fbLeft.css({
          'margin-top': Math.min(maxMargin, newMargin)
        });
      });
    };

    BuilderView.prototype.showTab = function(e) {
      var $el, first_model, target;
      $el = $(e.currentTarget);
      target = $el.data('target');
      $el.closest('li').addClass('active').siblings('li').removeClass('active');
      $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active');
      if (target !== '#editField') {
        this.unlockLeftWrapper();
      }
      if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
        return this.createAndShowEditView(first_model);
      }
    };

    BuilderView.prototype.addOne = function(responseField, _, options) {
      var $replacePosition, view;
      view = new ViewFieldView({
        model: responseField,
        parentView: this
      });
      if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        return this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        return this.$responseFields.prepend(view.render().el);
      } else if (($replacePosition = this.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    };

    BuilderView.prototype.setSortable = function() {
      var _this = this;
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        placeholder: 'sortable-placeholder',
        stop: function(e, ui) {
          var rf;
          if (ui.item.data('field-type')) {
            rf = _this.collection.create(Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {
              $replaceEl: ui.item
            });
            _this.createAndShowEditView(rf);
          }
          _this.handleFormUpdate();
          return true;
        },
        update: function(e, ui) {
          if (!ui.item.data('field-type')) {
            return _this.ensureEditViewScrolled();
          }
        }
      });
      return this.setDraggable();
    };

    BuilderView.prototype.setDraggable = function() {
      var $addFieldButtons,
        _this = this;
      $addFieldButtons = this.$el.find("[data-field-type]");
      return $addFieldButtons.draggable({
        connectToSortable: this.$responseFields,
        helper: function() {
          var $helper;
          $helper = $("<div class='response-field-draggable-helper' />");
          $helper.css({
            width: _this.$responseFields.width(),
            height: '80px'
          });
          return $helper;
        }
      });
    };

    BuilderView.prototype.addAll = function() {
      this.collection.each(this.addOne, this);
      return this.setSortable();
    };

    BuilderView.prototype.hideShowNoResponseFields = function() {
      return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
    };

    BuilderView.prototype.addField = function(e) {
      var field_type;
      field_type = $(e.currentTarget).data('field-type');
      return this.createField(Formbuilder.helpers.defaultFieldAttrs(field_type));
    };

    BuilderView.prototype.createField = function(attrs, options) {
      var rf;
      rf = this.collection.create(attrs, options);
      this.createAndShowEditView(rf);
      return this.handleFormUpdate();
    };

    BuilderView.prototype.createAndShowEditView = function(model) {
      var $newEditEl, $responseFieldEl;
      $responseFieldEl = this.$el.find(".fb-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $responseFieldEl.addClass('editing').siblings('.fb-field-wrapper').removeClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl);
          return;
        }
        this.editView.remove();
      }
      this.editView = new EditFieldView({
        model: model,
        parentView: this
      });
      $newEditEl = this.editView.render().$el;
      this.$el.find(".fb-edit-field-wrapper").html($newEditEl);
      this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
      this.scrollLeftWrapper($responseFieldEl);
      return this;
    };

    BuilderView.prototype.ensureEditViewScrolled = function() {
      if (!this.editView) {
        return;
      }
      return this.scrollLeftWrapper($(".fb-field-wrapper.editing"));
    };

    BuilderView.prototype.scrollLeftWrapper = function($responseFieldEl) {
      this.unlockLeftWrapper();
      if (!$responseFieldEl[0]) {

      }
    };

    BuilderView.prototype.lockLeftWrapper = function() {
      return this.$fbLeft.data('locked', true);
    };

    BuilderView.prototype.unlockLeftWrapper = function() {
      return this.$fbLeft.data('locked', false);
    };

    BuilderView.prototype.handleFormUpdate = function() {
      if (this.updatingBatch) {
        return;
      }
      this.formSaved = false;
      return this.saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM);
    };

    BuilderView.prototype.saveForm = function(e) {
      var payload;
      if (this.formSaved) {
        return;
      }
      this.formSaved = true;
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      this.collection.sort();
      payload = JSON.stringify({
        fields: this.collection.toJSON()
      });
      if (Formbuilder.options.HTTP_ENDPOINT) {
        this.doAjaxSave(payload);
      }
      return this.formBuilder.trigger('save', payload);
    };

    BuilderView.prototype.doAjaxSave = function(payload) {
      var _this = this;
      return $.ajax({
        url: Formbuilder.options.HTTP_ENDPOINT,
        type: Formbuilder.options.HTTP_METHOD,
        data: payload,
        contentType: "application/json",
        success: function(data) {
          var datum, _i, _len, _ref5;
          _this.updatingBatch = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            if ((_ref5 = _this.collection.get(datum.cid)) != null) {
              _ref5.set({
                id: datum.id
              });
            }
            _this.collection.trigger('sync');
          }
          return _this.updatingBatch = void 0;
        }
      });
    };

    return BuilderView;

  })(Backbone.View);

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, _base;
        attrs = {};
        attrs[Formbuilder.options.mappings.LABEL] = 'Untitled';
        attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type;
        attrs[Formbuilder.options.mappings.REQUIRED] = true;
        attrs['field_options'] = {};
        attrs['field_options']['links'] = [];
        return (typeof (_base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? _base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.options = {
      BUTTON_CLASS: 'fb-button',
      HTTP_ENDPOINT: '',
      HTTP_METHOD: 'POST',
      AUTOSAVE: true,
      CLEAR_FIELD_CONFIRM: false,
      mappings: {
        SIZE: 'field_options.size',
        UNITS: 'field_options.units',
        LABEL: 'label',
        FIELD_TYPE: 'field_type',
        REQUIRED: 'required',
        ATTACHMENT: 'attachment',
        ADMIN_ONLY: 'admin_only',
        OPTIONS: 'field_options.options',
        LINKS: 'field_options.links',
        VALUE: 'field_options.value',
        QID: 'field_options.qid',
        DESCRIPTION: 'field_options.description',
        INCLUDE_OTHER: 'field_options.include_other_option',
        INCLUDE_BLANK: 'field_options.include_blank_option',
        INTEGER_ONLY: 'field_options.integer_only',
        MIN: 'field_options.min',
        MAX: 'field_options.max',
        MINLENGTH: 'field_options.minlength',
        MAXLENGTH: 'field_options.maxlength',
        LENGTH_UNITS: 'field_options.min_max_length_units',
        OPTION_NUMBERING: 'field_options.option_numbering'
      },
      dict: {
        ALL_CHANGES_SAVED: 'All changes saved',
        SAVE_FORM: 'Save form',
        UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'
      }
    };

    Formbuilder.fields = {};

    Formbuilder.inputFields = {};

    Formbuilder.nonInputFields = {};

    Formbuilder.registerField = function(name, opts) {
      var x, _i, _len, _ref5;
      _ref5 = ['view', 'edit'];
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        x = _ref5[_i];
        opts[x] = _.template(opts[x]);
      }
      opts.field_type = name;
      Formbuilder.fields[name] = opts;
      if (opts.type === 'non_input') {
        return Formbuilder.nonInputFields[name] = opts;
      } else {
        return Formbuilder.inputFields[name] = opts;
      }
    };

    function Formbuilder(opts) {
      var args;
      if (opts == null) {
        opts = {};
      }
      _.extend(this, Backbone.Events);
      args = _.extend(opts, {
        formBuilder: this
      });
      this.mainView = new BuilderView(args);
    }

    return Formbuilder;

  })();

  window.Formbuilder = Formbuilder;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Formbuilder;
  } else {
    window.Formbuilder = Formbuilder;
  }

}).call(this);

(function() {
  Formbuilder.registerField('bullet_points', {
    order: 30,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />\n<div>...</div>\n<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'><span class='fa fa-list'></span></span> Bullet Points",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('checkboxes', {
    order: 50,
    view: "<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='checkbox' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-square-o'></span></span> Checkboxes",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          value: ""
        }, {
          label: "",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.option_numbering = 'none';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('date', {
    order: 70,
    view: "<div class='fb-date'>\n    <input type=\"text\" />\n    <span class=\"symbol\"><span class=\"fa fa-calendar\"></span></span>\n</div>",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-calendar\"></span></span> Date"
  });

}).call(this);

(function() {
  Formbuilder.registerField('dropdown', {
    order: 60,
    view: "<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeBlank: true, excludeOptionNumbering: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-caret-down'></span></span> Dropdown",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          value: ""
        }, {
          label: "",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.include_blank_option = false;
      return attrs;
    }
  });

}).call(this);

(function() {


}).call(this);

(function() {
  Formbuilder.registerField('number', {
    order: 80,
    view: "<input type='text' />\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",
    addButton: "<span class='symbol'><span class='fa fa-number'>123</span></span> Number"
  });

}).call(this);

(function() {
  Formbuilder.registerField('paragraph', {
    order: 20,
    view: "<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'>&#182;</span> Paragraph",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('radio', {
    order: 40,
    view: "<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>    \n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-circle-o'></span></span> Multiple Choice",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          value: ""
        }, {
          label: "",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.option_numbering = 'none';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('scale', {
    order: 90,
    view: "<i class='fa fa-chevron-left'></i><input type='text' /><i class='fa fa-chevron-right'></i>\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",
    addButton: "<span class='symbol'><span class='fa fa-exchange'></span></span> Scale"
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_break', {
    order: 100,
    type: 'non_input',
    view: "<hr />\n<label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>\n<span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>\n<hr />",
    edit: "<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder='Title' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder='Add a longer description to this field'></textarea>",
    addButton: "<span class='symbol'><span class='fa fa-minus'></span></span> Section Break"
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_end', {
    order: 101,
    type: 'non_input',
    view: "<hr />",
    edit: "",
    addButton: "<span class='symbol'><span class='fa fa-arrow-left'></span></span> Section End"
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_start', {
    order: 99,
    type: 'non_input',
    view: "<label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>\n<span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>\n<hr />",
    edit: "<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder='Title' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder='Add a longer description to this field'></textarea>",
    addButton: "<span class='symbol'><span class='fa fa-arrow-right'></span></span> Section Start"
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    order: 10,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'><span class='fa fa-font'></span></span> Text",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('yes_no', {
    order: 100,
    view: "<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-circle-o'></span></span> Yes/No",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "Yes",
          checked: false,
          value: ""
        }, {
          label: "No",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.option_numbering = 'none';
      return attrs;
    }
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\r\n  <span data-rv-text="model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'"></span>\r\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
'\'></code>\r\n  <span class=\'fa fa-arrow-right pull-right\'></span>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\r\n    Required\r\n</label>\r\n<label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.ATTACHMENT )) == null ? '' : __t) +
'\' />\r\n    Add attachment\r\n</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Question</div>\r\n\r\n<div class=\'fb-common-wrapper\'>\r\n    <div class=\'fb-label-description\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-label-qid\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/label_qid']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-label-label\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/label_value']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-common-checkboxes\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-clear\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Label</div>\r\n\r\n<div class=\'fb-common-wrapper\'>\r\n  <div class=\'fb-label-description\'>\r\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\r\n  </div>\r\n  <div class=\'fb-clear\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\r\n<label>\r\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\r\n  Only accept integers\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' class="fb-large-input" placeholder="Title" />\r\n<textarea data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\' class="fb-large-input" placeholder=\'Add a longer description to this field\'></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_qid"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.QID )) == null ? '' : __t) +
'\' placeholder="Question ID" class="fb-large-input" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.VALUE )) == null ? '' : __t) +
'\' class="fb-large-input" placeholder="Num. value" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/links"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>References</div>\r\n\r\n<div class=\'fb-edit-link\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.LINKS )) == null ? '' : __t) +
'\'>\r\n    <input type="text" class="fb-link-label-input" data-rv-input="option:label" placeholder="Reference" \r\n    /><!--<input type="text" class="fb-link-url-input" data-rv-input="option:url" placeholder="Url"\r\n    />--><a class="js-add-link ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Link"><i class=\'fa fa-plus\'></i>\r\n    </a><a class="js-remove-link ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Link"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>\r\n\r\n<div class=\'fb-bottom-add\'>\r\n    <a class="js-add-link ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add link</a>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\r\n\r\nAbove\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\nBelow\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Length Limit</div>\r\n\r\nMin\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\nMax\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.LENGTH_UNITS )) == null ? '' : __t) +
'" style="width: auto;">\r\n  <option value="characters">characters</option>\r\n  <option value="words">words</option>\r\n</select>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\r\n\r\n';
 if (typeof excludeOptionNumbering === 'undefined') { ;
__p += '\r\n<div>\r\n    Options numbering:\r\n    <select data-rv-value=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTION_NUMBERING )) == null ? '' : __t) +
'\'>\r\n        <option selected="selected" value="none">none</option>\r\n        <option value="decimal">decimal</option>\r\n        <option value="lower-latin">lower-latin</option>\r\n        <option value="upper-latin">upper-latin</option>\r\n    </select>\r\n</div>\r\n';
 } ;
__p += '\r\n\r\n';
 if (typeof includeBlank !== 'undefined') { ;
__p += '\r\n<label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\r\n    Include blank\r\n</label>\r\n';
 } ;
__p += '\r\n\r\n<div class=\'fb-edit-option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\r\n    <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" \r\n    /><input type="text" class="fb-option-label-input" data-rv-input="option:label" placeholder="Label"\r\n    /><input type="text" class="fb-option-value-input" data-rv-input="option:value" placeholder="Num. value"\r\n    /><a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Option"><i class=\'fa fa-plus\'></i>\r\n    </a><a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>\r\n\r\n';
 if (typeof includeOther !== 'undefined') { ;
__p += '\r\n<div class="fb-other">\r\n    <label><input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' /><span \r\n    class="fb-other-option">Include "other"\r\n    </span></label><input type="text" class="fb-other-value-input" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.VALUE )) == null ? '' : __t) +
'" placeholder="Num. value" />\r\n</div>\r\n';
 } ;
__p += '\r\n\r\n<div class=\'fb-bottom-add\'>\r\n    <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\r\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\r\n  <option value="small">Small</option>\r\n  <option value="medium">Medium</option>\r\n  <option value="large">Large</option>\r\n</select>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['partials/save_button']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.templates['partials/menu_side']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.templates['partials/content_side']() )) == null ? '' : __t) +
'\r\n<div class=\'fb-clear\'></div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\r\n  <div class=\'fb-add-field-types\'>\r\n    <div class=\'section\'>\r\n      ';
 _.each(_.sortBy(Formbuilder.inputFields, 'order'), function(f){ ;
__p += '\r\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\r\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\r\n        </a>\r\n      ';
 }); ;
__p += '\r\n    </div>\r\n\r\n    <div class=\'section\'>\r\n      ';
 _.each(_.sortBy(Formbuilder.nonInputFields, 'order'), function(f){ ;
__p += '\r\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\r\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\r\n        </a>\r\n      ';
 }); ;
__p += '\r\n    </div>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/content_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-form\'>\r\n  <div class=\'fb-no-response-fields\'>No response fields</div>\r\n  <div class=\'fb-response-fields\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'editField\'>\r\n  <div class=\'fb-edit-field-wrapper\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/menu_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-menu\'>\r\n  <ul class=\'fb-tabs\'>\r\n    <li class=\'active\'><a data-target=\'#addField\'>Add new field</a></li>\r\n    <li><a data-target=\'#editField\'>Edit field</a></li>\r\n  </ul>\r\n\r\n  <div class=\'fb-tab-content\'>\r\n    ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\r\n  </div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/save_button"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-save-wrapper\'>\r\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\r\n    <div class=\'cover\'></div>\r\n    ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\r\n\r\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\r\n\r\n    ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\r\n    <div class=\'cover\'></div>\r\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\r\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\r\n</span>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\r\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Duplicate Field"><i class=\'fa fa-plus\'></i></a>\r\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Field"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\r\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\r\n  ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\r\n    <abbr title=\'required\'>*</abbr>\r\n  ';
 } ;
__p += '\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/label_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\r\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/links"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if ((rf.get(Formbuilder.options.mappings.LINKS) || []).length > 0) { ;
__p += '\r\n<div class="fb-links">\r\n    <div class="fb-links-title">Links:</div>\r\n    <ul>\r\n        ';
 for (i in (rf.get(Formbuilder.options.mappings.LINKS) || [])) { ;
__p += '\r\n        <li>\r\n            ';
 if((rf.get(Formbuilder.options.mappings.LINKS)[i].label || '').trim().indexOf('http') === 0) { ;
__p += '\r\n            <a href="' +
((__t = ( rf.get(Formbuilder.options.mappings.LINKS)[i].label )) == null ? '' : __t) +
'">\r\n            ';
 } ;
__p += '\r\n                ' +
((__t = ( rf.get(Formbuilder.options.mappings.LINKS)[i].label )) == null ? '' : __t) +
'\r\n            ';
 if((rf.get(Formbuilder.options.mappings.LINKS)[i].label || '').trim().indexOf('http') === 0) { ;
__p += '\r\n            </a>\r\n            ';
 } ;
__p += '\r\n        </li>\r\n        ';
 } ;
__p += '\r\n    </ul>\r\n</div>\r\n';
 } ;


}
return __p
};