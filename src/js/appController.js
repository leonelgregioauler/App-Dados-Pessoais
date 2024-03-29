/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 
        'ojs/ojmodule-element-utils', 
        'ojs/ojcorerouter', 
        'ojs/ojmodulerouter-adapter', 
        'ojs/ojknockoutrouteradapter', 
        'ojs/ojurlparamadapter', 
        'ojs/ojarraydataprovider', 
        'ojs/ojoffcanvas', 
        'ojs/ojknockouttemplateutils', 
        'ojs/ojknockout', 
        'ojs/ojmodule-element',
        'ojs/ojbutton'],
  function(ko, 
           moduleUtils, 
           CoreRouter, 
           ModuleRouterAdapter, 
           KnockoutRouterAdapter, 
           UrlParamAdapter, 
           ArrayDataProvider, 
           OffcanvasUtils, 
           KnockoutTemplateUtils) {
     function ControllerViewModel() {
      var self = this;

      self.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
      self.manner = ko.observable('polite');
      self.message = ko.observable();
      self.waitForAnnouncement = false;
      self.navDrawerOn = false;

      self.usuarioAutenticado = ko.observable(false);
      self.nomeUsuarioLogado = ko.observable();
      self.idTipoCadastro= ko.observable();
      self.nomeTipoCadastro = ko.observable();
      self.exibeNavigationList = ko.observable(true);
      self.exibeLoginUsuario = ko.observable(true);
      self.navData = ko.observableArray([]);

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

      /*
        @waitForAnnouncement - set to true when the announcement is happening.
        If the nav-drawer is ON, it is reset to false in 'ojclose' event handler of nav-drawer.
        If the nav-drawer is OFF, then the flag is reset here itself in the timeout callback.
      */
      function announcementHandler(event) {
        self.waitForAnnouncement = true;
        setTimeout(function() {
          self.message(event.detail.message);
          self.manner(event.detail.manner);
          if (!self.navDrawerOn) {
            self.waitForAnnouncement = false;
          }
        }, 200);
      };

      
      self.exibeUsuarioLogado = function(nomeUsuario) {
        self.nomeUsuarioLogado('Olá, ' + nomeUsuario.charAt(0) + nomeUsuario.toLowerCase().slice(1));
      }

      self.logout = function() {
        self.usuarioAutenticado(false);
        //self.exibeLoginUsuario(true);
        self.exibeNavigationList(false);
        self.atualizaNavigationList();
        //document.getElementById("navList").click();
        //document.getElementById("logoutButton").click();
        setTimeout(function() {
          document.getElementById("navList").querySelectorAll("li")[0].click();
        }, 1000);
      }

      self.navData([
        { path: '', redirect: 'login' },
        { path: 'login', detail: { label: 'Login', iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-home-icon-24' } },
        { path: 'tipoCadastro', id: 'menu-tipo-cadastro', detail: { label: 'Cadastros', iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-library-icon-24'} },
        { path: 'cadastro', id: 'menu-cadastro', detail: { label: 'Cadastro', iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-edit-icon-24' } }
      ]);
      // Router setup
      var router = new CoreRouter(self.navData(), {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      this.moduleAdapter = new ModuleRouterAdapter(router);

      this.selection = new KnockoutRouterAdapter(router);

      self.goToPage = function(page) {
        router.go({path: page}).then(function () {this.navigated = true;})
      }

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      self.menuLateral = function (e) {
        if (self.usuarioAutenticado() == false) {
          return e.path === 'login'
        } else {
          return e.path === 'tipoCadastro';
        }
      }

      self.voltarCadastro = function (e) {
        return e.path === 'tipoCadastro'
      }
      
      self.sairSistema = function (e) {
        return e.path === 'login'
      }
      
      self.atualizaNavigationList = function() {
        setTimeout(function() {
          self.navDataProvider = new ArrayDataProvider(self.navData().filter(self.menuLateral), {keyAttributes: "path"});
          self.exibeNavigationList(true);
        }, 500);
      }
      self.navDataProvider = new ArrayDataProvider(self.navData().filter(self.menuLateral), {keyAttributes: "path"});
      self.navTipoCadastroDataProvider = new ArrayDataProvider(self.navData().filter(self.voltarCadastro), {keyAttributes: "path"});
      self.navLoginDataProvider = new ArrayDataProvider(self.navData().filter(self.sairSistema), {keyAttributes: "path"});

      // Drawer setup
      self.toggleDrawer = function() {
        self.navDrawerOn = true;
        return OffcanvasUtils.toggle({selector: '#navDrawer', modality: 'modal', content: '#pageContent'});
      }
      // Add a close listener so we can move focus back to the toggle button when the drawer closes
      document.getElementById('navDrawer').addEventListener("ojclose", onNavDrawerClose);

      /*
        - If there is no aria-live announcement, bring focus to the nav-drawer button immediately.
        - If there is any aria-live announcement in progress, add timeout to bring focus to the nav-drawer button.
        - When the nav-drawer is ON and annoucement happens, then after nav-drawer closes reset 'waitForAnnouncement' property to false.
      */
      function onNavDrawerClose(event) {
        self.navDrawerOn = false;
        if(!self.waitForAnnouncement) {
          document.getElementById('drawerToggleButton').focus();
          return;
        }

        setTimeout(function() {
          document.getElementById('drawerToggleButton').focus();
          self.waitForAnnouncement = false;
        }, 2500);
      }

      // Used by modules to get the current page title and adjust padding
      self.getHeaderModel = function() {
        // Return an object containing the current page title
        // and callback handlers
        return {
          pageTitle: self.selection.state().detail.label,
          transitionCompleted: self.adjustContentPadding,
          toggleDrawer: self.toggleDrawer
        };
      };

      // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions.
      // This method should be called whenever your fixed region height may change.  The application
      // can also adjust content paddings with css classes if the fixed region height is not changing between
      // views.
      self.adjustContentPadding = function () {
        var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

        if (topElem) {
          contentElem.style.paddingTop = topElem.offsetHeight+'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.offsetHeight+'px';
        }
        // Add oj-complete marker class to signal that the content area can be unhidden.
        // See the override.css file to see when the content area is hidden.
        contentElem.classList.add('oj-complete');
      }

      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
      
    }

    return new ControllerViewModel();
  }
);
