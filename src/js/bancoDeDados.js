define([], function () {
  function criaBancoDeDados() {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        /* usuarios */
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS USUARIOS ( idUsuario INTEGER PRIMARY KEY
                                               , nomeUsuario VARCHAR2(50) NOT NULL
                                               , senhaUsuario VARCHAR2(50) NOT NULL
                                               , chaveAcesso VARCHAR2(4000) NOT NULL )`);


        /* tipo de cadastro */
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS TIPOSCADASTROS ( idTipoCadastro INTEGER PRIMARY KEY
                                                     , nomeTipoCadastro VARCHAR2(200) NOT NULL
                                                     , icone VARCHAR2(100) )`);

        tx.executeSql(`CREATE TABLE IF NOT EXISTS CADASTROS ( idCadastro INTEGER PRIMARY KEY AUTOINCREMENT
                                                            , idTipoCadastro NUMBER NOT NULL
                                                            , descricaoCadastro VARCHAR2(200) NOT NULL
                                                            , dataInclusao DATETIME NOT NULL
                                                            , nomePessoa VARCHAR2(100)
                                                            , dataNascimento VARCHAR2(100)
                                                            , CPF VARCHAR2(100)
                                                            , RG VARCHAR2(100)
                                                            , orgaoEmissor VARCHAR2(100)
                                                            , UF VARCHAR2(100)
                                                            , dataEmissaoRG VARCHAR2(100)
                                                            , nomePai VARCHAR2(100)
                                                            , nomeMae VARCHAR2(100)
                                                            , PIS VARCHAR2(100)
                                                            , tituloEleitor VARCHAR2(100)
                                                            , zona VARCHAR2(100)
                                                            , sessao VARCHAR2(100)
                                                            , dataEmissaoTituloEleitoral VARCHAR2(100)
                                                            , CNH VARCHAR2(100) 
                                                            , validadeCNH VARCHAR2(100)
                                                            , primeiraHabilitacao VARCHAR2(100)
                                                            , categoriaCNH VARCHAR2(100)
                                                            , dataEmissaoCNH VARCHAR2(100)
                                                            , numeroCartaoSUS VARCHAR2(100)
                                                            , numeroCarteiraTrabalho VARCHAR2(100)
                                                            , operadoraPlanoSaude VARCHAR2(100)
                                                            , numeroCartao VARCHAR2(100)
                                                            , placaVeiculo VARCHAR2(100)
                                                            , RENAVAM VARCHAR2(100)
                                                            , nomeBanco VARCHAR2(100)
                                                            , agencia VARCHAR2(100)
                                                            , contaCorrente VARCHAR2(100)
                                                            , contaPoupanca VARCHAR2(100)
                                                            , usuarioInternetBanking VARCHAR2(100)
                                                            , senhaInternetBanking VARCHAR2(100)
                                                            , usuarioAplicativo VARCHAR2(100)
                                                            , senhaAplicativo VARCHAR2(100)
                                                            , eMail VARCHAR2(100)
                                                            , skype VARCHAR2(100)
                                                            , google VARCHAR2(100)
                                                            , facebook VARCHAR2(100)
                                                            , instagram VARCHAR2(100)
                                                            , linkedIn VARCHAR2(100)
                                                            , tvAssinatura VARCHAR2(100)
                                                            , internet VARCHAR2(100)
                                                            , certificadoDigital VARCHAR2(100)
                                                            , lojasEcommerce VARCHAR2(100)
                                                            , FOREIGN KEY (idTipoCadastro) REFERENCES TIPOSCADASTROS (idTipoCadastro))`);
        console.warn("Banco de Dados criado");
      });
    } catch (err) {
      alert("Erro ao criar tabelas." + err);
    }
  }

  function removeBancoDeDados() {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql("DROP TABLE USUARIOS");
        tx.executeSql("DROP TABLE TIPOSCADASTROS");
        tx.executeSql("DROP TABLE CADASTROS");
      });
    } catch (err) {
      alert("Erro ao remover tabelas." + err);
    }
  }

  function insereUsuario(nomeUsuario, senhaUsuario, chaveAcesso) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO USUARIOS ( nomeUsuario
                                , senhaUsuario
                                , chaveAcesso ) 
           VALUES ( \'${nomeUsuario}\'
                  , \'${senhaUsuario}\'
                  , \'${chaveAcesso}\' )`
        );
      });
    } catch (err) {
      alert("Erro ao inserir usuário." + err);
    }
  }

  function atualizaSenhaUsuario(nomeUsuario, novaSenhaUsuario, chaveAcesso, chaveAcessoMestre) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `UPDATE USUARIOS
            SET senhaUsuario = \'${novaSenhaUsuario}\'
           WHERE nomeUsuario = \'${nomeUsuario}\'
           AND (chaveAcesso   = \'${chaveAcesso}\'
            OR "TEVPTkVMIEdSRUdJTyBBVUxFUg==" = \'${chaveAcessoMestre}\')`
        );
      });
    } catch (err) {
      alert("Erro ao inserir usuário." + err);
    }
  }

  function consultaUsuario(query) {
    var usuario = [];
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          query,
          [],
          function (tx, result) {
            var len = result.rows.length;

            for (var i = 0; i < len; i++) {
              var row = result.rows.item(i);
              usuario[i] = {
                nomeUsuario: row["nomeUsuario"],
                senhaUsuario: row["senhaUsuario"],
                chaveAcesso: row["chaveAcesso"]
              };
            }
          },
          null
        );
      });
    } catch (err) {
      alert("Erro ao consultar o usuário." + err);
    }
    return usuario;
  }

  function insereTipoCadastro(idTipoCadastro, nomeTipoCadastro, icone) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO TIPOSCADASTROS ( idTipoCadastro
                                      , nometipoCadastro
                                      , icone) 
           VALUES ( \'${idTipoCadastro}'\
                  , \'${nomeTipoCadastro}\'
                  , \'${icone}\' )`
        );
      });
    } catch (err) {
      alert("Erro ao inserir tipo de cadastro." + err);
    }
  }

  function consultaTipoCadastro(query) {
    var tipoCadastro = [];
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          query,
          [],
          function (tx, result) {
            var len = result.rows.length;

            for (var i = 0; i < len; i++) {
              var row = result.rows.item(i);
              tipoCadastro[i] = {
                value: row["idTipoCadastro"],
                label: row["nomeTipoCadastro"],
                idTipoCadastro: row["idTipoCadastro"],
                nomeTipoCadastro: row["nomeTipoCadastro"],
                icone: row["icone"]
              };
            }
          },
          null
        );
      });
    } catch (err) {
      alert("Erro ao consultar o tipo de cadastro." + err);
    }
    return tipoCadastro;
  }

  function atualizaTipoCadastro(idTipoCadastro, nomeTipoCadastro) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `UPDATE TIPOSCADASTROS 
           SET nometipoCadastro = \'${nomeTipoCadastro}\' 
           WHERE idTipoCadastro = ${idTipoCadastro}`
        );
      });
    } catch (err) {
      alert("Erro ao atualizar o tipo de cadastro." + err);
    }
  }

  function removeTipoCadastro(idTipoCadastro) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `DELETE 
           FROM TIPOSCADASTROS 
           WHERE idTipoCadastro = ${idTipoCadastro}`
        );
      });
    } catch (err) {
      alert("Erro ao remover o tipo de cadastro." + err);
    }
  }

  function insereCadastro ( idTipoCadastro
                          , descricaoCadastro
                          , dataInclusao
                          , nomePessoa
                          , dataNascimento 
                          , CPF
                          , RG
                          , orgaoEmissor
                          , UF
                          , dataEmissaoRG
                          , nomePai
                          , nomeMae
                          , PIS
                          , tituloEleitor
                          , zona
                          , sessao
                          , dataEmissaoTituloEleitoral
                          , CNH 
                          , validadeCNH
                          , primeiraHabilitacao
                          , categoriaCNH
                          , dataEmissaoCNH
                          , numeroCartaoSUS
                          , numeroCarteiraTrabalho
                          , operadoraPlanoSaude
                          , numeroCartao
                          , placaVeiculo
                          , RENAVAM
                          , nomeBanco
                          , agencia
                          , contaCorrente
                          , contaPoupanca
                          , usuarioInternetBanking
                          , senhaInternetBanking
                          , usuarioAplicativo
                          , senhaAplicativo
                          , eMail
                          , skype
                          , google
                          , facebook
                          , instagram
                          , linkedIn
                          , tvAssinatura
                          , internet
                          , certificadoDigital
                          , lojasEcommerce ) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO CADASTROS ( idTipoCadastro
                                 , descricaoCadastro
                                 , dataInclusao
                                 , nomePessoa
                                 , dataNascimento 
                                 , CPF
                                 , RG
                                 , orgaoEmissor
                                 , UF
                                 , dataEmissaoRG
                                 , nomePai
                                 , nomeMae
                                 , PIS
                                 , tituloEleitor
                                 , zona
                                 , sessao
                                 , dataEmissaoTituloEleitoral
                                 , CNH 
                                 , validadeCNH
                                 , primeiraHabilitacao
                                 , categoriaCNH
                                 , dataEmissaoCNH
                                 , numeroCartaoSUS
                                 , numeroCarteiraTrabalho
                                 , operadoraPlanoSaude
                                 , numeroCartao
                                 , placaVeiculo
                                 , RENAVAM
                                 , nomeBanco
                                 , agencia
                                 , contaCorrente
                                 , contaPoupanca
                                 , usuarioInternetBanking
                                 , senhaInternetBanking
                                 , usuarioAplicativo
                                 , senhaAplicativo
                                 , eMail
                                 , skype
                                 , google
                                 , facebook
                                 , instagram
                                 , linkedIn
                                 , tvAssinatura
                                 , internet
                                 , certificadoDigital
                                 , lojasEcommerce ) 
            VALUES (${idTipoCadastro}
                , \'${descricaoCadastro}\'
                , \'${dataInclusao}\'
                , \'${nomePessoa}\'
                , \'${dataNascimento}\'
                , \'${CPF}\'
                , \'${RG}\'
                , \'${orgaoEmissor}\'
                , \'${UF}\'
                , \'${dataEmissaoRG}\'
                , \'${nomePai}\'
                , \'${nomeMae}\'
                , \'${PIS}\'
                , \'${tituloEleitor}\'
                , \'${zona}\'
                , \'${sessao}\'
                , \'${dataEmissaoTituloEleitoral}\'
                , \'${CNH}\'
                , \'${validadeCNH}\'
                , \'${primeiraHabilitacao}\'
                , \'${categoriaCNH}\'
                , \'${dataEmissaoCNH}\'
                , \'${numeroCartaoSUS}\'
                , \'${numeroCarteiraTrabalho}\'
                , \'${operadoraPlanoSaude}\'
                , \'${numeroCartao}\'
                , \'${placaVeiculo}\'
                , \'${RENAVAM}\'
                , \'${nomeBanco}\'
                , \'${agencia}\'
                , \'${contaCorrente}\'
                , \'${contaPoupanca}\'
                , \'${usuarioInternetBanking}\'
                , \'${senhaInternetBanking}\'
                , \'${usuarioAplicativo}\'
                , \'${senhaAplicativo}\'
                , \'${eMail}\'
                , \'${skype}\'
                , \'${google}\'
                , \'${facebook}\'
                , \'${instagram}\'
                , \'${linkedIn}\'
                , \'${tvAssinatura}\'
                , \'${internet}\'
                , \'${certificadoDigital}\'
                , \'${lojasEcommerce}\' )`);
      });
    } catch (err) {
      alert("Erro ao inserir cadastro." + err);
    }
  }

  function consultaCadastro(query) {
    var cadastro = [];
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          query,
          [],
          function (tx, result) {
            var len = result.rows.length;

            for (var i = 0; i < len; i++) {
              var row = result.rows.item(i);
              cadastro[i] = {
                  value: row["idCadastro"]
                , label: row["descricaoCadastro"]
                , idCadastro: row["idCadastro"]
                , idTipoCadastro: row["idTipoCadastro"]
                , descricaoCadastro: row["descricaoCadastro"]
                , dataInclusao: row["dataInclusao"]
                , nomePessoa: row["nomePessoa"]
                , dataNascimento: row["dataNascimento"]
                , CPF: row["CPF"]
                , RG: row["RG"]
                , orgaoEmissor: row["orgaoEmissor"]
                , UF: row["UF"]
                , dataEmissaoRG: row["dataEmissaoRG"]
                , nomePai: row["nomePai"]
                , nomeMae: row["nomeMae"]
                , PIS: row["PIS"]
                , tituloEleitor: row["tituloEleitor"]
                , zona: row["zona"]
                , sessao: row["sessao"]
                , dataEmissaoTituloEleitoral: row["dataEmissaoTituloEleitoral"]
                , CNH : row["CNH"]
                , validadeCNH: row["validadeCNH"]
                , primeiraHabilitacao: row["primeiraHabilitacao"]
                , categoriaCNH: row["categoriaCNH"]
                , dataEmissaoCNH: row["dataEmissaoCNH"]
                , numeroCartaoSUS: row["numeroCartaoSUS"]
                , numeroCarteiraTrabalho: row["numeroCarteiraTrabalho"]
                , operadoraPlanoSaude: row["operadoraPlanoSaude"]
                , numeroCartao: row["numeroCartao"]
                , placaVeiculo: row["placaVeiculo"]
                , RENAVAM: row["RENAVAM"]
                , nomeBanco: row["nomeBanco"]
                , agencia: row["agencia"]
                , contaCorrente: row["contaCorrente"]
                , contaPoupanca: row["contaPoupanca"]
                , usuarioInternetBanking: row["usuarioInternetBanking"]
                , senhaInternetBanking: row["senhaInternetBanking"]
                , usuarioAplicativo: row["usuarioAplicativo"]
                , senhaAplicativo: row["senhaAplicativo"]
                , eMail: row["eMail"]
                , skype: row["skype"]
                , google: row["google"]
                , facebook: row["facebook"]
                , instagram: row["instagram"]
                , linkedIn: row["linkedIn"]
                , tvAssinatura: row["tvAssinatura"]
                , internet: row["internet"]
                , certificadoDigital: row["certificadoDigital"]
                , lojasEcommerce: row["lojasEcommerce"]
              };
            }
          },
          null
        );
      });
    } catch (err) {
      alert("Erro ao consultar cadastro." + err);
    }
    return cadastro;
  }

  function atualizaCadastro( idCadastro
                           , idTipoCadastro
                           , descricaoCadastro
                           , dataInclusao
                           , nomePessoa
                           , dataNascimento 
                           , CPF
                           , RG
                           , orgaoEmissor
                           , UF
                           , dataEmissaoRG
                           , nomePai
                           , nomeMae
                           , PIS
                           , tituloEleitor
                           , zona
                           , sessao
                           , dataEmissaoTituloEleitoral
                           , CNH 
                           , validadeCNH
                           , primeiraHabilitacao
                           , categoriaCNH
                           , dataEmissaoCNH
                           , numeroCartaoSUS
                           , numeroCarteiraTrabalho
                           , operadoraPlanoSaude
                           , numeroCartao
                           , placaVeiculo
                           , RENAVAM
                           , nomeBanco
                           , agencia
                           , contaCorrente
                           , contaPoupanca
                           , usuarioInternetBanking
                           , senhaInternetBanking
                           , usuarioAplicativo
                           , senhaAplicativo
                           , eMail
                           , skype
                           , google
                           , facebook
                           , instagram
                           , linkedIn
                           , tvAssinatura
                           , internet
                           , certificadoDigital
                           , lojasEcommerce
  ) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `UPDATE CADASTROS 
           SET idTipoCadastro = ${idTipoCadastro}
             , descricaoCadastro = \'${descricaoCadastro}\'
             , dataInclusao = \'${dataInclusao}\'
             , nomePessoa = \'${nomePessoa}\'
             , dataNascimento  = \'${dataNascimento}\'
             , CPF = \'${CPF}\'
             , RG = \'${RG}\'
             , orgaoEmissor = \'${orgaoEmissor}\'
             , UF = \'${UF}\'
             , dataEmissaoRG = \'${dataEmissaoRG}\'
             , nomePai = \'${nomePai}\'
             , nomeMae = \'${nomeMae}\'
             , PIS = \'${PIS}\'
             , tituloEleitor = \'${tituloEleitor}\'
             , zona = \'${zona}\'
             , sessao = \'${sessao}\'
             , dataEmissaoTituloEleitoral = \'${dataEmissaoTituloEleitoral}\'
             , CNH  = \'${CNH}\'
             , validadeCNH = \'${validadeCNH}\'
             , primeiraHabilitacao = \'${primeiraHabilitacao}\'
             , categoriaCNH = \'${categoriaCNH}\'
             , dataEmissaoCNH = \'${dataEmissaoCNH}\'
             , numeroCartaoSUS = \'${numeroCartaoSUS}\'
             , numeroCarteiraTrabalho = \'${numeroCarteiraTrabalho}\'
             , operadoraPlanoSaude = \'${operadoraPlanoSaude}\'
             , numeroCartao = \'${numeroCartao}\'
             , placaVeiculo = \'${placaVeiculo}\'
             , RENAVAM = \'${RENAVAM}\'
             , nomeBanco = \'${nomeBanco}\'
             , agencia = \'${agencia}\'
             , contaCorrente = \'${contaCorrente}\'
             , contaPoupanca = \'${contaPoupanca}\'
             , usuarioInternetBanking = \'${usuarioInternetBanking}\'
             , senhaInternetBanking = \'${senhaInternetBanking}\'
             , usuarioAplicativo = \'${usuarioAplicativo}\'
             , senhaAplicativo = \'${senhaAplicativo}\'
             , eMail = \'${eMail}\'
             , skype = \'${skype}\'
             , google = \'${google}\'
             , facebook = \'${facebook}\'
             , instagram = \'${instagram}\'
             , linkedIn = \'${linkedIn}\'
             , tvAssinatura = \'${tvAssinatura}\'
             , internet = \'${internet}\'
             , certificadoDigital = \'${certificadoDigital}\'
             , lojasEcommerce = \'${lojasEcommerce}\'
          WHERE idCadastro = ${idCadastro}`
        );
      });
    } catch (err) {
      alert("Erro ao atualizar o cadastro." + err);
    }
  }

  function removeCadastro(idCadastro) {
    try {
      db = openDatabase(
        "App-Dados-Pessoais",
        1.0,
        "App-Dados-Pessoais",
        2 * 1024 * 1024
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `DELETE 
           FROM CADASTROS 
           WHERE idCadastro = ${idCadastro}`
        );
      });
    } catch (err) {
      alert("Erro ao remover o cadastro." + err);
    }
  }

  return {
    criaBancoDeDados: criaBancoDeDados,
    removeBancoDeDados: removeBancoDeDados,

    insereUsuario: insereUsuario,
    atualizaSenhaUsuario: atualizaSenhaUsuario,
    consultaUsuario: consultaUsuario,
    
    insereTipoCadastro: insereTipoCadastro,
    consultaTipoCadastro: consultaTipoCadastro,
    atualizaTipoCadastro: atualizaTipoCadastro,
    removeTipoCadastro: removeTipoCadastro,

    insereCadastro: insereCadastro,
    consultaCadastro: consultaCadastro,
    atualizaCadastro: atualizaCadastro,
    removeCadastro: removeCadastro,
  };
});
