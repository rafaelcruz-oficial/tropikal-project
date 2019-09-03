var Prototype = function() {
    
    var prototypesDefault = [
        {
            objectTypeId: 'xbrLocalizacaoFisico',
            visibility: 'HIDDEN'
        },
        {
            objectTypeId: 'xbrDataDocumento',
            visibility: 'HIDDEN'
        },
        {
            objectTypeId: 'xbrPalavraChave',
            visibility: 'HIDDEN'
        },
        {
            objectTypeId: 'xbrPalavraChave',
            visibility: 'HIDDEN'
        },
        {
            objectTypeId: 'dDocAuthor',
            value: 'BPFQ'//value: tw.object.toolkit.SYSD.UserInfo().name
        }
    ];

    this.visibility = {
        REQUIRED: 'REQUIRED',
        EDITABLE: 'EDITABLE',
        READONLY: 'READONLY',
        NONE: 'NONE',
        DEFAULT: 'DEFAULT',
        HIDDEN: 'HIDDEN'
    };

    this.nivelProtecao = {
        NP_1: 'NP 1',
        NP_2: 'NP 2',
        NP_3: 'NP 3',
        NP_4: 'NP 4',
    };

    this.setParametrosObrigatorios = function(xbrTipoDocumento, cmis_name, xComments, dDocAccount, xbrNivelProtecao) {
        
        prototypesDefault.push({ objectTypeId: 'xbrTipoDocumento', visibility: 'HIDDEN', value: xbrTipoDocumento });
        prototypesDefault.push({ objectTypeId: 'dDocAccount', value: dDocAccount });
        prototypesDefault.push({ objectTypeId: 'xbrNivelProtecao', visibility: 'HIDDEN', value: xbrNivelProtecao ? xbrNivelProtecao : this.nivelProtecao.NP_1 });
        prototypesDefault.push({ objectTypeId: 'cmis:name', visibility: 'HIDDEN', value: cmis_name ? cmis_name : '' });
        prototypesDefault.push({ objectTypeId: 'xComments', visibility: 'HIDDEN', value: xComments ? xComments : '' });
    };

    this.montar = function(tipoDocumento, perfil, json) {
        
        //if(!prototypesDefault.find(function(element) { return element.objectTypeId == 'cmis:name'; }))
        //    return null;
        var prototiposDocumentais = new tw.object.listOf.toolkit.COMMONS.ECMPrototype();
        prototiposDocumentais[0] = new tw.object.toolkit.COMMONS.ECMPrototype();
        
        prototiposDocumentais[0] = {
            objectTypeId: tipoDocumento,
            displayName: perfil
        };

        prototiposDocumentais[0].properties = new tw.object.listOf.toolkit.COMMONS.ECMPrototypeProperty();
        prototypesDefault.forEach(function(element, i, array) { prototiposDocumentais[0].properties[i] = element; });


        for(var element in json) {
            prototiposDocumentais[0].properties[prototiposDocumentais[0].properties.listLength] = new tw.object.toolkit.COMMONS.ECMPrototypeProperty();
            prototiposDocumentais[0].properties[prototiposDocumentais[0].properties.listLength - 1] = {
                objectTypeId: element,
                value: json[element],
                visibility: 'HIDDEN'
            };
        }

        return prototiposDocumentais;
    };

    this.modificarValor = function(prototiposDocumentais, jsonOrObjectTypeId, value) {

        
        if(value) {

            for(var i = 0; i < prototiposDocumentais[0].properties.listLength; i++) {
                if(prototiposDocumentais[0].properties[i].objectTypeId == jsonOrObjectTypeId) {
                    prototiposDocumentais[0].properties[i].value = value;
                    break;
                }
            }

        }
        else {

            for(var element in jsonOrObjectTypeId) {
    
                for(var i = 0; i < prototiposDocumentais[0].properties.listLength; i++) {
                    
                    if(prototiposDocumentais[0].properties[i].objectTypeId == element) {
                        prototiposDocumentais[0].properties[i].value = jsonOrObjectTypeId[element];
                    }
                }
            }
        }
        
        return prototiposDocumentais;
    };

    this.modificarVisibilidade = function(prototiposDocumentais, jsonOrObjectTypeId, visibility) {
        var i = 0;

        if(visibility) {

            for(var i = 0; i < prototiposDocumentais[0].properties.listLength; i++) {
                if(prototiposDocumentais[0].properties[i].objectTypeId == jsonOrObjectTypeId) {
                    prototiposDocumentais[0].properties[i].visibility = visibility;
                    break;
                }
            }
        }
        else {

            for(var element in jsonOrObjectTypeId) {

                for(var i = 0; i < prototiposDocumentais[0].properties.listLength; i++) {
                    
                    if(prototiposDocumentais[0].properties[i].objectTypeId == element) {
                        prototiposDocumentais[0].properties[i].visibility = jsonOrObjectTypeId[element];
                    }
                }
            }
        }
        
        return prototiposDocumentais;

    };
};
////////////////////////////////////////
//////////   Exemplo de uso   //////////
////////////////////////////////////////


//Json com os itens da regra
//var json = {
//    "brEspecieDocumento": "Desenho",
//    "xbrNumeroDocumento": "DE-BAGON-A-0010",
//    "xbrNumeroDocumento1": "A",
//    "xbrEspecieDocumento": "Desenho",
//    "xbrTipoDocumento": "Desenho (Arquivo Técnico Engenharia)",
//    "dDocType": "Document",
//    "dSecurityGroup": "CorporativoBR"
//};
//
//var prototype = new Prototype();
//
//Parmetros basicos para todo prototype
//Respeitar a ordem dos parâmetros, no entanto cmis:name, xComments e xbrNivelProtecao não são obrigatórios. No entanto, xbrNivelProtecao recebe NP 1 caso nulo
//prototype.setParametrosObrigatorios('Desenho (Arquivo Técnico Engenharia)' /*'xbrTipoDocumento'*/, 
//                                      'Teste de Prototipo Documental' /*'cmis:name'*/,
//                                      null /*'xComments'*/,
//                                      'HML/BR/PROCESSOS/GESMS/POI' /*dDocAccount*/,
//                                      null /*'xbrNivelProtecao'*/);
//
//Adiciona as demais regras os dois primeiros parâmetros são os campos do OpenCmis 
//profiles.add(create("Desenho (Arquivo Técnico Engenharia)", "Desenho (Arquivo Técnico Engenharia)", "Desenho", new String[] { "brGeralArquivoTecnicoEngenharia", "brMetadadosGlobais", "brMetadadosGlobaisOpcional" }));
//
//tw.local.prototiposDocumentais = prototype.montar("Desenho (Arquivo Técnico Engenharia)", "Desenho", json);
//
//Modificar valor de uma propriedade
//tw.local.prototiposDocumentais = prototype.modificarValor(tw.local.prototiposDocumentais, 'cmis:name', "Teste de Teste e Teste");
//
//var mudarValor = {
//    "xbrNumeroDocumento": "DE-BAGON-B-0010",
//    "xbrNumeroDocumento1": "B"
//};
//
//Modificar valores em bloco
//tw.local.prototiposDocumentais = prototype.modificarValor(tw.local.prototiposDocumentais, mudarValor);
//
//Modificar visibilidade de uma propriedade
//tw.local.prototiposDocumentais = prototype.modificarVisibilidade(tw.local.prototiposDocumentais, 'cmis:name', prototype.visibility.READONLY);
//
//var mudarVisibilidade = {
//    "xbrNumeroDocumento": prototype.visibility.READONLY,
//    "xbrNumeroDocumento1": prototype.visibility.READONLY
//};
//
//Mudar visibilidade em bloco
//tw.local.prototiposDocumentais = prototype.modificarVisibilidade(tw.local.prototiposDocumentais, mudarVisibilidade);