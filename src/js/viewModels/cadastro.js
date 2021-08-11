define([
  "knockout",
  "appController",
  "ojs/ojmodule-element-utils",
  "accUtils",
  "ojs/ojcontext",
  "../bancoDeDados",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout-keyset",
  "ojs/ojconverterutils-i18n",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojlabel",
  "ojs/ojbutton",
  "ojs/ojformlayout",
  "ojs/ojmessaging",
  "ojs/ojlistview",
  "ojs/ojlistitemlayout",
  "ojs/ojselectsingle",
  "ojs/ojdialog",
  "ojs/ojdatetimepicker",
  "ojs/ojnavigationlist"
], function (
  ko,
  app,
  moduleUtils,
  accUtils,
  Context,
  BancoDeDados,
  ArrayDataProvider,
  keySet
) {
  function CadastroViewModel() {
    var self = this;

    // Wait until header show up to resolve
    var resolve = Context.getPageContext().getBusyContext().addBusyState({description: "wait for header"});
    // Header Config
    self.headerConfig = ko.observable({'view':[], 'viewModel':null});
    moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
      self.headerConfig({'view':view, 'viewModel': app.getHeaderModel()});
      resolve();
    })

    self.navTipoCadastroDataProvider = app.navTipoCadastroDataProvider; 
    self.idTipoCadastro = app.idTipoCadastro;
    self.nomeTipoCadastro = app.nomeTipoCadastro;
    
    self.currentIndex;

    self.descricaoCadastro = ko.observable("");
    self.dataInclusao = ko.observable(new Date().toLocaleDateString());
    self.nomePessoa = ko.observable("");
    self.dataNascimento = ko.observable("");
    self.CPF = ko.observable("");
    self.RG = ko.observable("");
    self.orgaoEmissor = ko.observable("");
    self.UF = ko.observable("");
    self.dataEmissaoRG = ko.observable("");
    self.nomePai = ko.observable("");
    self.nomeMae = ko.observable("");
    self.PIS = ko.observable("");
    self.tituloEleitor = ko.observable("");
    self.zona = ko.observable("");
    self.sessao = ko.observable("");
    self.dataEmissaoTituloEleitoral = ko.observable("");
    self.CNH = ko.observable("");
    self.validadeCNH = ko.observable("");
    self.primeiraHabilitacao = ko.observable("");
    self.categoriaCNH = ko.observable("");
    self.dataEmissaoCNH = ko.observable("");
    self.numeroCartaoSUS = ko.observable("");
    self.numeroCarteiraTrabalho = ko.observable("");
    self.operadoraPlanoSaude = ko.observable("");
    self.numeroCartao = ko.observable("");
    self.validadeCarteira = ko.observable("");
    self.placaVeiculo = ko.observable("");
    self.RENAVAM = ko.observable("");
    self.nomeBanco = ko.observable("");
    self.agencia = ko.observable("");
    self.contaCorrente = ko.observable("");
    self.contaPoupanca = ko.observable("");
    self.usuarioInternetBanking = ko.observable("");
    self.senhaInternetBanking = ko.observable("");
    self.usuarioAplicativo = ko.observable("");
    self.senhaAplicativo = ko.observable("");
    self.email = ko.observable("");
    self.usuarioeMail = ko.observable("");
    self.senhaeMail = ko.observable("");
    self.skype = ko.observable("");
    self.senhaSkype = ko.observable("");
    self.google = ko.observable("");
    self.senhaGoogle = ko.observable("");
    self.facebook = ko.observable("");
    self.senhaFacebook = ko.observable("");
    self.instagram = ko.observable("");
    self.senhaInstagram = ko.observable("");
    self.linkedIn = ko.observable("");
    self.senhaLinkedIn = ko.observable("");
    self.tvAssinatura = ko.observable("");
    self.usuarioTvAssinatura = ko.observable("");
    self.senhaTvAssinatura = ko.observable("");
    self.internet = ko.observable("");
    self.senhaInternet = ko.observable("");
    self.lojaEcommerce = ko.observable("");
    self.usuarioLojaEcommerce = ko.observable("");
    self.senhaLojaEcommerce = ko.observable("");
    self.certificadoDigital = ko.observable("");
    self.PIN = ko.observable("");
    self.dataCadastro = ko.observableArray([]);
    self.dataTipoCadastro = ko.observableArray([]);
    self.exibe = ko.observable(false); 

    self.idTipoCadastro = self.idTipoCadastro();
    self.nomeTipoCadastro = self.nomeTipoCadastro();
    self.idTipoCadastroSelecionado = ko.observable(self.idTipoCadastro);
    self.nomeTipoCadastroSelecionado = ko.observable(self.nomeTipoCadastro);

    self.consultaCadastro = function () {
      self.dataCadastro(
        BancoDeDados.consultaCadastro(
          ` SELECT C.idCadastro
                 , C.idTipoCadastro
                 , C.descricaoCadastro
                 , C.dataInclusao
                 , C.nomePessoa
                 , C.dataNascimento
                 , C.CPF
                 , C.RG
                 , C.orgaoEmissor
                 , C.UF
                 , C.dataEmissaoRG
                 , C.nomePai
                 , C.nomeMae
                 , C.PIS
                 , C.tituloEleitor
                 , C.zona
                 , C.sessao
                 , C.dataEmissaoTituloEleitoral
                 , C.CNH 
                 , C.validadeCNH
                 , C.primeiraHabilitacao
                 , C.categoriaCNH
                 , C.dataEmissaoCNH
                 , C.numeroCartaoSUS
                 , C.numeroCarteiraTrabalho
                 , C.operadoraPlanoSaude
                 , C.numeroCartao
                 , C.validadeCarteira
                 , C.placaVeiculo
                 , C.RENAVAM
                 , C.nomeBanco
                 , C.agencia
                 , C.contaCorrente
                 , C.contaPoupanca
                 , C.usuarioInternetBanking
                 , C.senhaInternetBanking
                 , C.usuarioAplicativo
                 , C.senhaAplicativo
                 , C.eMail
                 , C.usuarioeMail
                 , C.senhaeMail
                 , C.skype
                 , C.senhaSkype
                 , C.google
                 , C.senhaGoogle
                 , C.facebook
                 , C.senhaFacebook
                 , C.instagram
                 , C.senhaInstagram
                 , C.linkedIn
                 , C.senhaLinkedIn
                 , C.tvAssinatura
                 , C.usuarioTvAssinatura
                 , C.senhaTvAssinatura
                 , C.internet
                 , C.senhaInternet
                 , C.lojaEcommerce
                 , C.usuarioLojaEcommerce
                 , C.senhaLojaEcommerce
                 , C.certificadoDigital
                 , C.PIN
            FROM CADASTROS C
               , TIPOSCADASTROS T
            WHERE C.idTipoCadastro = T.idTipoCadastro
            AND T.idTipoCadastro = ${self.idTipoCadastro}`
        )
      );
      setTimeout(function () {
        var items = self.dataCadastro();
        var array = items.map(function (e) {
          return e.idCadastro;
        });
        self.lastItemId = Math.max.apply(null, array);
        self.dataProviderCadastro = new ArrayDataProvider(self.dataCadastro, { keyAttributes: "idCadastro" });
        self.exibe(true);
      }, 1500);
    };
    self.dataProviderCadastro = new ArrayDataProvider(self.dataCadastro, { keyAttributes: "idCadastro" });

    self.selectedItems = new keySet.ObservableKeySet();

    self.isTextEmpty = ko.observable(true);
    self.isTextAndSelecionFilled = ko.computed(function () {
      return (
        (!self.isTextEmpty() && !self.isSelectionEmpty()) || self.isTextEmpty()
      );
    }, self);

    self.isSelectionEmpty = ko.computed(function () {
      return self.selectedItems().values().size === 0;
    }, self);
    self.isTextOrSelectionEmpty = ko.computed(function () {
      return self.isTextEmpty() || self.isSelectionEmpty();
    }, self);

    self.addItem = function () {
      BancoDeDados.insereCadastro(self.idTipoCadastro
                                , self.descricaoCadastro()
                                , self.dataInclusao()
                                , self.nomePessoa()
                                , self.dataNascimento()
                                , self.CPF()
                                , self.RG()
                                , self.orgaoEmissor()
                                , self.UF()
                                , self.dataEmissaoRG()
                                , self.nomePai()
                                , self.nomeMae()
                                , self.PIS()
                                , self.tituloEleitor()
                                , self.zona()
                                , self.sessao()
                                , self.dataEmissaoTituloEleitoral()
                                , self.CNH()
                                , self.validadeCNH()
                                , self.primeiraHabilitacao()
                                , self.categoriaCNH()
                                , self.dataEmissaoCNH()
                                , self.numeroCartaoSUS()
                                , self.numeroCarteiraTrabalho()
                                , self.operadoraPlanoSaude()
                                , self.numeroCartao()
                                , self.validadeCarteira()
                                , self.placaVeiculo()
                                , self.RENAVAM()
                                , self.nomeBanco()
                                , self.agencia()
                                , self.contaCorrente()
                                , self.contaPoupanca()
                                , self.usuarioInternetBanking()
                                , self.senhaInternetBanking()
                                , self.usuarioAplicativo()
                                , self.senhaAplicativo()
                                , self.email()
                                , self.usuarioeMail()
                                , self.senhaeMail()
                                , self.skype()
                                , self.senhaSkype()
                                , self.google()
                                , self.senhaGoogle()
                                , self.facebook()
                                , self.senhaFacebook()
                                , self.instagram()
                                , self.senhaInstagram()
                                , self.linkedIn()
                                , self.senhaLinkedIn()
                                , self.tvAssinatura()
                                , self.usuarioTvAssinatura()
                                , self.senhaTvAssinatura()
                                , self.internet()
                                , self.senhaInternet()
                                , self.lojaEcommerce()
                                , self.usuarioLojaEcommerce()
                                , self.senhaLojaEcommerce()
                                , self.certificadoDigital()
                                , self.PIN() );
      self.exibe(false);
      self.consultaCadastro();
      self.descricaoCadastro("");
      self.dataInclusao("");
      self.nomePessoa("");
      self.dataNascimento("");
      self.CPF("");
      self.RG("");
      self.orgaoEmissor("");
      self.UF("");
      self.dataEmissaoRG("");
      self.nomePai("");
      self.nomeMae("");
      self.PIS("");
      self.tituloEleitor("");
      self.zona("");
      self.sessao("");
      self.dataEmissaoTituloEleitoral("");
      self.CNH("");
      self.validadeCNH("");
      self.primeiraHabilitacao("");
      self.categoriaCNH("");
      self.dataEmissaoCNH("");
      self.numeroCartaoSUS("");
      self.numeroCarteiraTrabalho("");
      self.operadoraPlanoSaude("");
      self.numeroCartao("");
      self.validadeCarteira("");
      self.placaVeiculo("");
      self.RENAVAM("");
      self.nomeBanco("");
      self.agencia("");
      self.contaCorrente("");
      self.contaPoupanca("");
      self.usuarioInternetBanking("");
      self.senhaInternetBanking("");
      self.usuarioAplicativo("");
      self.senhaAplicativo("");
      self.email("");
      self.usuarioeMail("");
      self.senhaeMail("");
      self.skype("");
      self.senhaSkype("");
      self.google("");
      self.senhaGoogle("");
      self.facebook("");
      self.senhaFacebook("");
      self.instagram("");
      self.senhaInstagram("");
      self.linkedIn("");
      self.senhaLinkedIn("");
      self.tvAssinatura("");
      self.usuarioTvAssinatura("");
      self.senhaTvAssinatura("");
      self.internet("");
      self.senhaInternet("");
      self.lojaEcommerce("");
      self.usuarioLojaEcommerce("");
      self.senhaLojaEcommerce("");
      self.certificadoDigital("");
      self.PIN("");
    }.bind(self);

    self.updateSelected = function () {
      var itemToReplace = self.dataCadastro()[self.currentIndex];
      self.dataCadastro.splice(self.currentIndex, 1, {
        value: itemToReplace.idCadastro,
        label: self.descricaoCadastro(),
        idTipoCadastro: itemToReplace.idTipoCadastro, 
        descricaoCadastro: self.descricaoCadastro(), 
        dataInclusao: self.dataInclusao()
      });
      BancoDeDados.atualizaCadastro( itemToReplace.idCadastro
                                   , self.idTipoCadastro
                                   , self.descricaoCadastro()
                                   , self.dataInclusao()
                                   , self.nomePessoa()
                                   , self.dataNascimento()
                                   , self.CPF()
                                   , self.RG()
                                   , self.orgaoEmissor()
                                   , self.UF()
                                   , self.dataEmissaoRG()
                                   , self.nomePai()
                                   , self.nomeMae()
                                   , self.PIS()
                                   , self.tituloEleitor()
                                   , self.zona()
                                   , self.sessao()
                                   , self.dataEmissaoTituloEleitoral()
                                   , self.CNH()
                                   , self.validadeCNH()
                                   , self.primeiraHabilitacao()
                                   , self.categoriaCNH()
                                   , self.dataEmissaoCNH()
                                   , self.numeroCartaoSUS() 
                                   , self.numeroCarteiraTrabalho()
                                   , self.operadoraPlanoSaude()
                                   , self.numeroCartao()
                                   , self.validadeCarteira()
                                   , self.placaVeiculo()
                                   , self.RENAVAM()
                                   , self.nomeBanco()
                                   , self.agencia()
                                   , self.contaCorrente()
                                   , self.contaPoupanca()
                                   , self.usuarioInternetBanking()
                                   , self.senhaInternetBanking()
                                   , self.usuarioAplicativo()
                                   , self.senhaAplicativo() 
                                   , self.email()
                                   , self.usuarioeMail()
                                   , self.senhaeMail()
                                   , self.skype()
                                   , self.senhaSkype()
                                   , self.google()
                                   , self.senhaGoogle()
                                   , self.facebook()
                                   , self.senhaFacebook()
                                   , self.instagram()
                                   , self.senhaInstagram()
                                   , self.linkedIn()
                                   , self.senhaLinkedIn()
                                   , self.tvAssinatura()
                                   , self.usuarioTvAssinatura()
                                   , self.senhaTvAssinatura()
                                   , self.internet()
                                   , self.senhaInternet()
                                   , self.lojaEcommerce()
                                   , self.usuarioLojaEcommerce()
                                   , self.senhaLojaEcommerce() 
                                   , self.certificadoDigital()
                                   , self.PIN() );
      self.exibe(false);
      self.consultaCadastro();                                   
    }.bind(self);

    self.close = function(event) {
      document.getElementById("modalDialogExcluirCadastro").close();
    }
    self.open = function(event) {
      document.getElementById("modalDialogExcluirCadastro").open();
    }

    self.removeSelected = function () {
      const items = self.dataCadastro();
      var itemToRemove = self.dataCadastro()[self.currentIndex];
      cadastroRestante = items.filter((cadastro) => {
        return cadastro.label !== self.descricaoCadastro();
      });
      BancoDeDados.removeCadastro(itemToRemove.idCadastro);
      self.exibe(false);
      self.consultaCadastro();
      
      self.descricaoCadastro("");
      //self.dataInclusao("");
      self.nomePessoa("");
      self.dataNascimento("");
      self.CPF("");
      self.RG("");
      self.orgaoEmissor("");
      self.UF("");
      self.dataEmissaoRG("");
      self.nomePai("");
      self.nomeMae("");
      self.PIS("");
      self.tituloEleitor("");
      self.zona("");
      self.sessao("");
      self.dataEmissaoTituloEleitoral("");
      self.CNH("");
      self.validadeCNH("");
      self.primeiraHabilitacao("");
      self.categoriaCNH("");
      self.dataEmissaoCNH("");
      self.numeroCartaoSUS("");
      self.numeroCarteiraTrabalho("");
      self.operadoraPlanoSaude("");
      self.numeroCartao("");
      self.validadeCarteira("");
      self.placaVeiculo("");
      self.RENAVAM("");
      self.nomeBanco("");
      self.agencia("");
      self.contaCorrente("");
      self.contaPoupanca("");
      self.usuarioInternetBanking("");
      self.senhaInternetBanking("");
      self.usuarioAplicativo("");
      self.senhaAplicativo("");
      self.email("");
      self.usuarioeMail("");
      self.senhaeMail("");
      self.skype("");
      self.senhaSkype("");
      self.google("");
      self.senhaGoogle("");
      self.facebook("");
      self.senhaFacebook("");
      self.instagram("");
      self.senhaInstagram("");
      self.linkedIn("");
      self.senhaLinkedIn("");
      self.tvAssinatura("");
      self.usuarioTvAssinatura("");
      self.senhaTvAssinatura("");
      self.internet("");
      self.senhaInternet("");
      self.lojaEcommerce("");
      self.usuarioLojaEcommerce("");
      self.senhaLojaEcommerce("");
      self.certificadoDigital("");
      self.PIN("");

      self.close();
      //self.dataCadastro(cadastroRestante);
      //self.dataProviderCadastro = new ArrayDataProvider(self.dataCadastro, { keyAttributes: "idTipoCompra" } );
      //self.exibe(true);
    }.bind(self);

    self.handleCurrentItemChanged = function (event) {
      var key = event.detail.value;
      var items = self.dataCadastro();
      var indice = items
        .map(function (e) {
          return e.idCadastro;
        })
        .indexOf(key);

      for (var i = 0; i < items.length; i++) {
        if (i === indice) {
          self.currentIndex = i;
          self.descricaoCadastro(items[i].descricaoCadastro);
          self.dataInclusao(items[i].dataInclusao);
          self.nomePessoa(items[i].nomePessoa);
          self.dataNascimento(items[i].dataNascimento);
          self.CPF(items[i].CPF);
          self.RG(items[i].RG);
          self.orgaoEmissor(items[i].orgaoEmissor);
          self.UF(items[i].UF);
          self.dataEmissaoRG(items[i].dataEmissaoRG);
          self.nomePai(items[i].nomePai);
          self.nomeMae(items[i].nomeMae);
          self.PIS(items[i].PIS);
          self.tituloEleitor(items[i].tituloEleitor);
          self.zona(items[i].zona);
          self.sessao(items[i].sessao);
          self.dataEmissaoTituloEleitoral(items[i].dataEmissaoTituloEleitoral);
          self.CNH(items[i].CNH);
          self.validadeCNH(items[i].validadeCNH);
          self.primeiraHabilitacao(items[i].primeiraHabilitacao);
          self.categoriaCNH(items[i].categoriaCNH);
          self.dataEmissaoCNH(items[i].dataEmissaoCNH);
          self.numeroCartaoSUS(items[i].numeroCartaoSUS);
          self.numeroCarteiraTrabalho(items[i].numeroCarteiraTrabalho);
          self.operadoraPlanoSaude(items[i].operadoraPlanoSaude);
          self.numeroCartao(items[i].numeroCartao);
          self.validadeCarteira(items[i].validadeCarteira);
          self.placaVeiculo(items[i].placaVeiculo);
          self.RENAVAM(items[i].RENAVAM);
          self.nomeBanco(items[i].nomeBanco);
          self.agencia(items[i].agencia);
          self.contaCorrente(items[i].contaCorrente);
          self.contaPoupanca(items[i].contaPoupanca);
          self.usuarioInternetBanking(items[i].usuarioInternetBanking);
          self.senhaInternetBanking(items[i].senhaInternetBanking);
          self.usuarioAplicativo(items[i].usuarioAplicativo);
          self.senhaAplicativo(items[i].senhaAplicativo);
          self.email(items[i].eMail);
          self.usuarioeMail(items[i].usuarioeMail);
          self.senhaeMail(items[i].senhaeMail);
          self.skype(items[i].skype);
          self.senhaSkype(items[i].senhaSkype);
          self.google(items[i].google);
          self.senhaGoogle(items[i].senhaGoogle);
          self.facebook(items[i].facebook);
          self.senhaFacebook(items[i].senhaFacebook);
          self.instagram(items[i].instagram);
          self.senhaInstagram(items[i].senhaInstagram);
          self.linkedIn(items[i].linkedIn);
          self.senhaLinkedIn(items[i].senhaLinkedIn);
          self.tvAssinatura(items[i].tvAssinatura);
          self.usuarioTvAssinatura(items[i].usuarioTvAssinatura);
          self.senhaTvAssinatura(items[i].senhaTvAssinatura);
          self.internet(items[i].internet);
          self.senhaInternet(items[i].senhaInternet);
          self.lojaEcommerce(items[i].lojaEcommerce);
          self.usuarioLojaEcommerce(items[i].usuarioLojaEcommerce);
          self.senhaLojaEcommerce(items[i].senhaLojaEcommerce);
          self.certificadoDigital(items[i].certificadoDigital);
          self.PIN(items[i].PIN);
          break;
        }
      }
    }.bind(self);

    self.handleRawValueChanged = function (event) {
      var value = event.detail.value;
      self.isTextEmpty(value.trim().length === 0);
    }.bind(self);

    self.voltar = function() { 
      app.goToPage("tipoCadastro");
    }

    self.connected = function () {
      accUtils.announce("About page loaded.", "assertive");
      document.title = "About";
      self.consultaCadastro();
      //self.consultaTipoCadastro();
      //BancoDeDados.removeBancoDeDados();
    };

    self.disconnected = function () {};

    self.transitionCompleted = function () {};
  }

  return CadastroViewModel;
});
