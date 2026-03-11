export const BASES_COMPETICION = [
    { 
        numero: 1,
        titulo: 'Sistema de Puntuació',
        articulos:[
            {
                numero: 1.1,
                texto: 'Es juga al millor de dos sets guanyats. L’equip que guanyi dos sets primer, guanya el partit.',
            },
            {
                numero: 1.2,
                texto: 'Cada set es juga a 10 punts, sense diferència de dos punts.',
            },
            {
                numero: 1.3,
                texto: 'En cas d’empat a un set, el set decisiu es juga a 7 punts (sense diferència de dos punts).',
            },
            // {
            //     texto: 'En arribar als 20 minuts de durada del partit i si els equips estan empatats a 0 sets, es disputaran 5 minuts de desempat; si aquest no finalitza, guanyarà l’equip amb més punts totals acumulats.',
            // },
            {
                numero: 1.4,
                texto: `Si el temps de partit finalitza durant un set, aquest es donarà per finalitzat i el resultat serà el marcador existent en aquell moment.`
            },
            {
                numero: 1.5,
                texto: `Per motius d’organització i gestió del temps, el staff del torneig podrà decidir eliminar el set de desempat en alguns partits sense notificació prèvia. En aquest cas, el partit finalitzarà amb el resultat existent en aquell moment (podent ser 1-1).`
            }
        ]
    },
    { 
        numero: 2,
        titulo: 'Servei',
        articulos:[
            {
                numero: 2.1,
                texto: 'El servei es fa des de darrere de la línia de fons i pot ser amb salt o des del terra.',
            },
            {
                numero: 2.2,
                texto: 'La pilota ha de passar per damunt de la xarxa i caure al camp de l’oponent.',
            },
            {
                numero: 2.3,
                texto: 'Si la pilota toca la xarxa però passa al camp contrari, el servei és vàlid.',
            }
        ]
    },
    { 
        numero: 3,
        titulo: 'Rotació',
        articulos:[
            {
                numero: 3.1,
                texto: 'Cada vegada que l’equip que rep guanya la jugada, ha de rotar les seves posicions en sentit horari abans de realitzar el servei.',
            },
            {
                numero: 3.2,
                texto: 'Aquesta rotació garanteix que tots els jugadors passin per totes les posicions.',
            }
        ]
    },
    { 
        numero: 4,
        titulo: 'Tocs Permesos',
        articulos:[
            {
                numero: 4.1,
                texto: 'Cada equip té un màxim de tres tocs per tornar la pilota al camp contrari.',
            },
            {
                numero: 4.2,
                texto: 'Un jugador no pot tocar la pilota dues vegades consecutives (excepte en bloquejos).',
            },
            {
                numero: 4.3,
                texto: 'Efectuar el toc de "poqui" està permès.',
            },
            {
                numero: 4.4,
                texto: 'Executar el moviment de pales està permès.',
            }
        ]
    },
    { 
        numero: 5,
        titulo: 'Bloqueig',
        articulos:[
            {
                numero: 5.1,
                texto: 'Els jugadors de la línia davantera poden bloquejar un atac de l’equip contrari.',
            },
            {
                numero: 5.2,
                texto: 'Un bloqueig no compta com un dels tres tocs de l’equip.',
            }
        ]
    },
    { 
        numero: 6,
        titulo: 'Faltes',
        articulos:[
            {
                numero: 6.1,
                texto: 'Pilota fora: la pilota surt dels límits del camp.',
            },
            {
                numero: 6.2,
                texto: 'Quatre tocs: l’equip fa més de tres tocs abans de tornar la pilota.',
            },
            {
                numero: 6.3,
                texto: 'Retenció o doble toc: el jugador sosté o toca la pilota dues vegades consecutives.',
            },
            {
                numero: 6.4,
                texto: 'Invasió: un jugador toca la xarxa o creua la línia central.',
            },
            {
                numero: 6.5,
                texto: 'Contacte amb l’entorn: si la pilota toca el sostre, les parets, les cistelles, els cèrcols o qualsevol element del pavelló, serà punt per a l’equip rival.',
            }
        ]
    },
    { 
        numero: 7,
        titulo: 'Substitucions',
        articulos:[
            {
                numero: 7.1,
                texto: 'Cada equip té substitucions il·limitades per set.',
            },
            {
                numero: 7.2,
                texto: 'Les substitucions han de ser autoritzades per l’àrbitre i només es poden fer quan la pilota està fora de joc.',
            }
        ]
    },
    { 
        numero: 8,
        titulo: 'Arbitratge',
        articulos:[
            {
                numero: 8.1,
                texto: 'Cada partit comptarà amb un àrbitre principal i, si és possible, amb un àrbitre assistent o jutges de línia.',
            },
            {
                numero: 8.2,
                texto: 'L’àrbitre té autoritat per sancionar faltes, validar punts i aplicar penalitzacions si fos necessari.',
            },
            {
                numero: 8.3,
                texto: 'Les decisions de l’àrbitre són definitives i s’han de respectar.',
            },
            {
                numero: 8.4,
                texto: `L’organització podrà intervenir en qualsevol decisió arbitral en cas de situacions excepcionals que afectin el desenvolupament del torneig.`
            }
        ]
    },
    { 
        numero: 9,
        titulo: 'Protocol d’Inici de Partit',
        articulos:[
            {
                numero: 9.1,
                texto: 'Abans de cada partit, els capitans dels dos equips es reuniran amb l’àrbitre per fer un sorteig i decidir el primer servei.',
            },
            {
                numero: 9.2,
                texto: 'L’equip que guanyi el sorteig decidirà si vol servir o rebre.',
            }
        ]
    },
    { 
        numero: 10,
        titulo: 'Regles de Conducta',
        articulos:[
            {
                numero: 10.1,
                texto: 'Els jugadors, entrenadors i acompanyants han de respectar els àrbitres i els rivals en tot moment.',
            },
            {
                numero: 10.2,
                texto: 'Qualsevol actitud antiesportiva serà sancionada amb advertència i, en casos greus, amb l’expulsió del jugador o de l’equip del partit o del torneig.',
            }
        ]
    },
    { 
        numero: 11,
        titulo: 'Protocols de Seguretat',
        articulos:[
            {
                numero: 11.1,
                texto: 'Es recomana que tots els jugadors utilitzin calçat adequat i mantinguin l’àrea de joc lliure d’objectes perillosos.',
            },
            {
                numero: 11.2,
                texto: 'En cas de lesió, el joc es detindrà temporalment fins que el jugador sigui atès.',
            },
            {
                numero: 11.3,
                texto: 'Si un equip no pot continuar el partit per lesió, aquest es donarà per perdut.',
            }
        ]
    },
    { 
        numero: 12,
        titulo: 'Composició Mixta Obligatòria',
        articulos:[
            {
                numero: 12.1,
                texto: 'Durant tot el partit, cada equip ha de tenir com a mínim una persona de cada gènere en pista.',
            },
            {
                numero: 12.2,
                texto: 'Si un equip incompleix aquesta norma en qualsevol moment, el partit es donarà per perdut automàticament.',
            },
            {
                numero: 12.3,
                texto: 'Tot i això, el partit es continuarà jugant fins a completar els dos sets, independentment del resultat.',
            },
            {
                numero: 12.4,
                texto: 'A efectes de classificació, el partit es considerarà guanyat per l’altre equip.',
            }
        ]
    },
    { 
        numero: 13,
        titulo: 'Protocol d’Escalfament i Ús del Material',
        articulos:[
            {
                numero: 13.1,
                texto: 'Cada equip tindrà una pista d’escalfament assignada i no està permès canviar-la.',
            },
            {
                numero: 13.2,
                texto: 'Cada equip disposarà d’una pilota pròpia per a l’escalfament.',
            },
            {
                numero: 13.3,
                texto: 'Si una pilota sobrepassa la línia de banquetes d’una pista de joc, es farà un avís a l’equip responsable.',
            },
            {
                numero: 13.4,
                texto: 'El mal ús del material comportarà la prohibició d’utilitzar material d’escalfament durant la resta del torneig.',
            },
            {
                numero: 13.5,
                texto: `Si una pilota entra dins d’una pista on s’està disputant un partit, la sanció podrà ser immediata, sense avís previ, i la pilota serà retirada durant aquella ronda d’escalfament.`
            },
            {
                numero: 13.6,
                texto: `Qualsevol membre del staff o de l’equip de voluntariat del torneig està autoritzat a aplicar aquestes sancions.`
            },
            {
                numero: 13.7,
                texto: `En cas de reiteració o comportament negligent, l’organització podrà retirar la pilota d’escalfament durant més d’una ronda o durant la resta del torneig.`
            }
        ]
    },
    { 
        numero: 14,
        titulo: 'Sistema de Competició i Classificació',
        articulos:[
            {
                numero: 14.1,
                texto: 'El torneig compta amb 16 equips i es disputa mitjançant un quadre d’eliminació directa des dels vuitens de final fins a la final.',
            },
            {
                numero: 14.2,
                texto: 'No es disputa partit pel tercer i quart lloc.',
            },
            {
                numero: 14.3,
                texto: 'Tots els equips disputaran un mínim de tres partits.',
            },
            {
                numero: 14.4,
                texto: `Si algun equip no es presenta a un partit programat (incompareixença), l’organització es reserva el dret d’adaptar el calendari o el nombre mínim de partits garantits. En aquests casos, el mínim de partits establert a aquest article podrà no aplicar-se estrictament als equips afectats.`,
            },
            {
                numero: 14.5,
                texto: 'Els equips que perdin jugaran partits de reubicació segons el balanç de partits guanyats i perduts per igualar el nivell competitiu.',
            },
            {
                numero: 14.6,
                texto: 'Les victòries o derrotes administratives comptaran a tots els efectes per al balanç del torneig.',
            },
            {
                numero: 14.7,
                texto: `L’organització es reserva el dret de modificar horaris, pistes o partits si les circumstàncies del centre o del torneig ho requereixen.`,
            }
        ]
    },
    { 
        numero: 15,
        titulo: 'Gestió del Temps i Jornades de Joc',
        articulos:[
            {
                numero: 15.1,
                texto: 'El torneig es desenvolupa en 12 jornades de 20 minuts cadascuna.',
            },
            {
                numero: 15.2,
                texto: 'Els partits han de començar immediatament a l’inici de la jornada assignada.',
            },
            {
                numero: 15.3,
                texto: 'Si un partit no ha començat, l’organització podrà fer avisos acústics per indicar l’inici immediat.',
            },
            {
                numero: 15.4,
                texto: 'Un equip que no estigui preparat o no es presenti podrà perdre el partit per decisió de l’organització.',
            },
            {
                numero: 15.5,
                texto: `Si un partit finalitza abans del temps establert, el següent partit podrà començar immediatament si els equips estan preparats.`
            },
            {
                numero: 15.6,
                texto: `No es permet escalfar amb pilota dins de les pistes de joc entre partits, excepte si l’àrbitre ho autoritza.`
            }
        ]
    },
    { 
        numero: 16,
        titulo: 'Validació de Resultats',
        articulos:[
            {
                numero: 16.1,
                texto: 'El resultat validat per l’àrbitre i registrat a l’acta serà definitiu.',
            },
            {
                numero: 16.2,
                texto: 'Un cop validat el resultat, els encreuaments següents no es modificaran.',
            }
        ]
    },
    {
        numero: 17,
        titulo: `Autoritat de l’organització`,
        articulos:[
            {
                numero: 17.1,
                texto: 'L’organització del torneig té l’autoritat final per interpretar i aplicar aquestes bases en qualsevol situació que no estigui prevista o que requereixi una decisió discrecional.',
            },
            {
                numero: 17.2,
                texto: 'Les decisions de l’organització són definitives i s’han de respectar per tots els participants.',
            }
        ]
    }
];
