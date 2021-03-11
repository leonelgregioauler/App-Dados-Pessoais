define([
  "knockout",
  "appController",
  "ojs/ojmodule-element-utils",
  "accUtils",
  "ojs/ojcontext",
  "../bancoDeDados",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout-keyset",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojlabel",
  "ojs/ojbutton",
  "ojs/ojformlayout",
  "ojs/ojmessaging",
  "ojs/ojlistview",
  "ojs/ojavatar",
  "ojs/ojlistitemlayout",
  "ojs/ojnavigationlist"
], function (ko, app, moduleUtils, accUtils, Context, BancoDeDados, ArrayDataProvider, keySet) {
  function TipoCadastroViewModel() {
    var self = this;
    
    self.navCadastroDataProvider = app.navCadastroDataProvider;
    self.selection = app.selection;
    self.selectionChangedHandler = app.selectionChangedHandler;

    //self.KnockoutTemplateUtils = KnockoutTemplateUtils;
    self.tipoCadastroSelecionado = ko.observable();  
    
    // Wait until header show up to resolve
    var resolve = Context.getPageContext().getBusyContext().addBusyState({description: "wait for header"});
    // Header Config
    self.headerConfig = ko.observable({'view':[], 'viewModel':null});
    moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
      self.headerConfig({'view':view, 'viewModel': app.getHeaderModel()});
      resolve();
    })

    self.getIconContainerClass = function (type) {
      var styleClasses = 'oj-icon-circle oj-icon-circle-xs';
      switch(type) {
        case 'pdf':
          styleClasses = styleClasses + ' oj-icon-circle-red';
          break;
        case 'xls':
          styleClasses = styleClasses + ' oj-icon-circle-forest';
          break;
        case 'ppt':
          styleClasses = styleClasses + ' oj-icon-circle-mauve';
          break;
        case 'doc':
          styleClasses = styleClasses + ' oj-icon-circle-teal';
          break;
      }
      return styleClasses;
    };

    self.getIconClass = function (type) {
      switch(type) {
        case 'pdf':
          return 'oj-ux-ico-file-pdf';
        case 'xls':
          return 'oj-ux-ico-file-spreadsheet';
        case 'ppt':
          return 'oj-ux-ico-file-presentation';
        case 'doc':
          return 'oj-ux-ico-file-doc';
        default:
          return 'oj-ux-ico-folder';
      }
    };

    self.content = ko.observable('');
    self.disabled = ko.observable(true);
    self.previousElementKey = null;

    self.currentIndex;
    self.currentId = ko.observable('');
    self.currentItem = ko.observable('');
    self.nomeTipoDadoCadastral = ko.observable();
    self.dataTipoCadastro = ko.observableArray([]);
    self.exibe = ko.observable(false);

    self.consultaTipoCadastro = function () {
      self.dataTipoCadastro(BancoDeDados.consultaTipoCadastro('SELECT * FROM TIPOSCADASTROS'));
      setTimeout(function() {
        self.exibe(true);
        var items = self.dataTipoCadastro();
        var array = items.map(function(e) {
          return e.idTipoCadastro;
        });
        self.lastItemId = Math.max.apply(null, array);
        self.dataProviderTipoCadastro = new ArrayDataProvider(self.dataTipoCadastro, { keyAttributes: "idTipoCadastro" } );
      }, 500); 
    }
    self.dataProviderTipoCadastro = new ArrayDataProvider(self.dataTipoCadastro, { keyAttributes: "idTipoCadastro" } );
    
    self.selectedItems = new keySet.ObservableKeySet();
    
    self.isTextEmpty = ko.observable(true);
    /* self.isTextAndSelecionFilled = ko.computed(function(){
      return  ( !self.isTextEmpty() && !self.isSelectionEmpty() ) || self.isTextEmpty();
    }, self); */

    /* self.isSelectionEmpty = ko.computed(function () {
      return self.selectedItems().values().size === 0;
    }, self); */
    /* self.isTextOrSelectionEmpty = ko.computed(function () {
      return self.isTextEmpty() || self.isSelectionEmpty();
    }, self); */
  
    self.addItem = function () {
      var itemToAdd = self.currentItem();
      if ((itemToAdd !== '')) {
        BancoDeDados.insereTipoCadastro(itemToAdd);
        self.exibe(false);
        self.consultaTipoCadastro();
        self.currentItem('');
      }
    }.bind(self);
  
    self.updateSelected = function () {
      var itemToReplace = self.dataTipoCadastro()[self.currentIndex];
      self.dataTipoCadastro.splice(self.currentIndex, 1,
        { value: itemToReplace.value, label: self.currentItem(), idTipoCadastro: itemToReplace.idTipoCadastro, nometipoCadastro: self.currentItem() });
      BancoDeDados.atualizaTipoCadastro(itemToReplace.value, self.currentItem());
    }.bind(self);
  
    self.removeSelected = function () {
      const items = self.dataTipoCadastro();
      var itemToRemove = self.dataTipoCadastro()[self.currentIndex];
      tipoCadastroRestante = items.filter( (tipoCadastro) => {
        return tipoCadastro.label !== self.currentItem();
      })
      BancoDeDados.removeTipoCadastro(itemToRemove.idTipoCadastro);
      self.exibe(false);
      self.consultaTipoCadastro();
      self.currentItem('');
    }.bind(self);
 
    self.handleCurrentItemChanged = function (event) {
      var key = event.detail.value;
      var items = self.dataTipoCadastro();
      var indice = items.map(function(e) {
        return e.idTipoCadastro;
      }).indexOf(key);

      for (var i = 0; i < items.length; i++) { 
        if (i === indice) {
          self.currentIndex = i;
          self.currentItem(items[i].label);
          self.tipoCadastroSelecionado(self.currentId(items[i].value));
          break;
        }
      }
    }.bind(self);
  
    self.handleRawValueChanged = function (event) {
      var value = event.detail.value;
      self.isTextEmpty(value.trim().length === 0);
    }.bind(self);

    self.connected = function () {
      accUtils.announce("About page loaded.", "assertive");
      document.title = "About";
      BancoDeDados.insereTipoCadastro( 1, 'Dados Pessoais', 'pdf');
      BancoDeDados.insereTipoCadastro( 2, 'PIS', 'xls');
      BancoDeDados.insereTipoCadastro( 3, 'Título Eleitoral', 'ppt');
      BancoDeDados.insereTipoCadastro( 4, 'Carteira de Motorista', 'doc');
      BancoDeDados.insereTipoCadastro( 5, 'Cartão do SUS', 'folder');
      BancoDeDados.insereTipoCadastro( 6, 'Carteira de Trabalho', 'pdf');
      BancoDeDados.insereTipoCadastro( 7, 'Plano de Saúde', 'xls');
      BancoDeDados.insereTipoCadastro( 8, 'Veículos', 'ppt');
      BancoDeDados.insereTipoCadastro( 9, 'Dados Bancários', 'doc');
      BancoDeDados.insereTipoCadastro(10, 'Internet', 'folder');
      BancoDeDados.insereTipoCadastro(11, 'Redes Sociais', 'pdf');
      self.consultaTipoCadastro();
    };

    self.disconnected = function () {};

    self.transitionCompleted = function () {};
  }

  return TipoCadastroViewModel;
});
