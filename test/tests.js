
// NB: really, any PRNG needs testing against a collection of statistical tests like TestU01

'use strict';

// Math.pow(2, 32) === 4294967296
const TWO_TO_THIRTY_TWO = 4294967296;
const MAX_64_BIT_UINT = 0b1111111111111111111111111111111111111111111111111111111111111111n;

const expect = require('chai').expect;

const Pseudo = require('../pseudo.js');

// The following were generated by ./xorshift128.cpp
const XOR_SHIFT_REFERENCE_SEED = new Uint32Array([ 123456789, 362436069, 521288629, 88675123 ]);
const XOR_SHIFT_REFERENCE_OUTPUT = [
            3701687786, 458299110, 2500872618, 3633119408, 516391518, 2377269574, 2599949379, 717229868, 137866584, 395339113,
            1301295572, 1728310821, 3538670320, 1187274473, 2316753268, 4061953237, 2129415220, 448488982, 643481932, 934407046, 
            723553448, 3932869644, 449460396, 2728332712, 2381680799, 830734233, 2059906653, 544153312, 20906778, 795757459, 
            1755102565, 811349640, 3380790346, 2498575418, 420990039, 3358478731, 391216208, 3936394860, 1299350043, 4150927415, 
            1799713142, 2247676300, 1547958642, 4203610453, 3120566707, 4181181390, 3137093107, 821167952, 2328167796, 3450572369, 
            2531467698, 915111097, 2496082361, 93322358, 2330895300, 3891095700, 1242220329, 807202386, 3474168598, 1127670696, 
            1595496296, 2292206759, 3677928846, 803679970, 3134234209, 815741160, 777332664, 953388206, 114179651, 3479117322, 
            1219528894, 3970092026, 2615790603, 2893102642, 1615373946, 2588888210, 1326662212, 1790338362, 1340630368, 2938346451, 
            2063068433, 2746337472, 2944301747, 472945036, 3647629438, 4105194587, 2823232412, 811811817, 3133207555, 3429148052, 
            1550834815, 1983488016, 3420725816, 574977749, 15456966, 3144270827, 1366737756, 1485628537, 116340804, 4083996137, 
            350717179, 729220402, 1411724544, 3245564400, 3919308153, 2052469741, 128353426, 1568676215, 1795592083, 2684620869, 
            2478150339, 3466816099, 2441485875, 293646974, 781981959, 4223246021, 1517252615, 1315449462, 2163365533, 3079323632, 
            2521042510, 2574302570, 2334414439, 1773342156, 3744680138, 3283363243, 1787479252, 2611378468, 3734374274, 3161323654, 
            2164074427, 674890201, 1191098699, 2508509402, 4230872366, 81862587, 3076967053, 81256123, 2541787010, 2609929742, 
            438558035, 2696673962, 856970680, 711794170, 782275745, 1370576245, 3231282030, 2186880074, 2826349884, 1941397434, 
            2025738401, 864964744, 780928136, 3876570220, 1841216372, 754297947, 1645430025, 4222009731, 1666949272, 3796717532, 
            445539729, 3622376858, 1762144415, 3786645965, 2289627783, 396518359, 1057367412, 1137137296, 207911077, 148643365, 
            117422031, 2146767446, 1350298717, 3099524417, 1124361302, 2494867906, 455255565, 1413022941, 880803032, 95729964, 
            195585369, 2536216349, 1551441948, 4238643046, 3027156742, 2134263273, 3940217811, 853380689, 4085944707, 1046387478, 
            52933477, 3713407574, 2063044342, 2965056661, 2386107772, 3822068295, 630620405, 1277222742, 179632467, 1746149464, 
            4178875527, 3011788444, 509032414, 3616064172, 2321925238, 411532152, 3217643121, 784694918, 2317830492, 2841165787, 
            1557597791, 1508080141, 3913201092, 2247387487, 1639262792, 600049505, 1061684808, 433073775, 3523190903, 3523430950, 
            2902879336, 893226225, 434990649, 3514254680, 1334580786, 2517582134, 3839977832, 2413276457, 2697267047, 1278207160, 
            2741661308, 2447778269, 428929721, 715775767, 3661647280, 2047375340, 3834857262, 2158390732, 1481874853, 1641887316, 
            520726390, 2893177174, 1745387464, 3773795083, 2995761783, 2378698145, 2786448879, 977184245, 4125996239, 948243158 ];

const XOR_SHIFT_128_PLUS_REFERENCE_SEED_A = 743057230457n;
const XOR_SHIFT_128_PLUS_REFERENCE_SEED_B = 4055030262322907474n;
const XOR_SHIFT_128_PLUS_REFERENCE_OUTPUT = [
            12054742229467840381n, 9241388954586379376n, 13751416875519839872n, 11056489825981517580n, 4462997881697032177n, 
            3109445669288913345n, 8271081013071017179n, 17821403380850924551n, 3487506510965143441n, 4541012247278576452n, 
            4298871935696370941n, 4717974030540777721n, 16738587135291162972n, 16560261179062787469n, 1515594769294719387n, 
            10281677671246668266n, 12691039686801298958n, 14978502914704144770n, 5401339516814764373n, 17444345952797263352n, 
            15760173441658754657n, 14967116401151854165n, 1146533688903570781n, 14961726967898938868n, 17441032673708968491n, 
            7409771734448083630n, 4279305674738017663n, 14407561247547093975n, 8009561931395150108n, 4030440639148545980n, 
            2728729079798939623n, 12894697908830530688n, 6719972440587285051n, 8220207541790037981n, 7456706429103793855n, 
            10456810635368061619n, 12206890441743431595n, 2849896019322697465n, 12757243815430860023n, 3873223094038742566n, 
            15574831250690988768n, 15314430885137754340n, 4436315059137281827n, 337524097887864132n, 5371741827529098439n, 
            17914464584002861513n, 5536876820603228147n, 9361328357561058569n, 2731352370041826164n, 17183100410477091135n, 
            9600030506105347544n, 3605667541474681973n, 1997819609698093364n, 12049830428829727771n, 8366307778339799087n, 
            3954962488919892749n, 5872527460976879386n, 16699042600838571302n, 14451249821878700689n, 9421373259559446279n, 
            3957883812436989233n, 4200865598267612098n, 3058704714601588502n, 8446050784377892440n, 7751765407449788204n, 
            12772701025704566882n, 18149537938648446352n, 6468804199284452627n, 10505912378025817506n, 13883058084136971358n, 
            15756933297796805680n, 8568159173140036485n, 18438699744193188982n, 15395273505273213682n, 3672134776784975678n, 
            17435808807533413283n, 873519959127869446n, 17628471770710490113n, 1201645407270897139n, 2298650397364579732n, 
            4457263497258680823n, 8305793577980831636n, 16722806334806422443n, 1538660825044311744n, 10475070481513764189n, 
            16801955336733041964n, 14264224012631865102n, 12623448937951507226n, 5748938100747066961n, 12064594167283585794n, 
            3840951488585159240n, 5670043908214375770n, 10953527505557027058n, 15237858536415819208n, 6573726351972332689n, 
            12973174946886835808n, 13731328305859770249n, 10910111144985601036n, 21076431343464648n, 5248134799254221806n, 
            6464849506093440165n, 17899629290118542543n, 5608504092710359930n, 6509875836039016931n, 8444714078955510501n, 
            16977044314075213178n, 15726677500951485690n, 16077715781858310745n, 15214953265873707020n, 11209281699101700780n, 
            1809321570412603087n, 2214058275136673704n, 5951066365526076389n, 16208234418212580706n, 11389611966283114551n, 
            7717344942722896950n, 12548616775232322275n, 8964903455644378093n, 10763355032187000283n, 12824409286624298187n, 
            5330478812835292546n, 12957278193336657698n, 5095992353626119554n, 9139114195799243402n, 3372532686245338282n, 
            6258250263256711194n, 15303173443079992130n, 13363286061072852954n, 6001636296974148355n, 9927313408274684882n, 
            17216801572110622262n, 17178586438367410315n, 17880775312904250764n, 4171446680270881108n, 8667113237402975441n, 
            15531900980508759803n, 12253701106575765847n, 9238985867981746064n, 13365081506460095388n, 8113692060233187022n, 
            10373637893183896505n, 5257180124190143428n, 885840362299318877n, 293233355087118624n, 7368396046816953669n, 
            10961737488789285359n, 9784991340615326284n, 16545023511483933321n, 14144322182874119195n, 4348581064584562938n, 
            7480903733447050968n, 7025654768637224626n, 10734328487850883111n, 1670498698040551820n, 17194707985770470916n, 
            18191507372416983515n, 3054861631180455953n, 15750207695115095076n, 7939032701808413285n, 6513179078707058521n, 
            1657622531056730945n, 12264891756182181027n, 2512539600879394674n, 12795989028765763309n, 6111107235207331955n, 
            9194669241101155303n, 6422673295194958299n, 7955859183384343882n, 3436308989243243279n, 11699988284999826890n, 
            545130089040334690n, 13423540786760733574n, 3108637665684333265n, 3042328236637586708n, 6330892237331174571n, 
            16001326693105209752n, 1430243602802367626n, 2398848065407383881n, 10520766401447132021n, 9731216333972400852n, 
            5460492797513268842n, 2443306872188560915n, 8688632870906218974n, 12163868725420025104n, 18213926218417784970n, 
            7802074054935019958n, 467040451835307982n, 2439178397163034953n, 9465589740047751580n, 9883404612026464714n, 
            2239034641708603308n, 13489503237640855815n, 9532984487123924948n, 16493960369049290987n, 16983051582332849375n, 
            15843829604468563982n, 3881294154938549226n, 15731066861537213976n, 17076234991592488464n, 1868525820915011603n, 
            10091990902080701278n, 6686339147211286527n, 17252229203640340673n, 7884203821961169668n, 15431421599462447547n, 
            3560319932515504314n, 12220234844214211217n, 9298056066485600114n, 8475969676810519613n, 15358642082795927170n, 
            4079698242837310707n, 13143909447058862275n, 17575027076711206301n, 4161395928650378419n, 5029805795751909090n, 
            6014793164158626241n, 16713355325428547358n, 6345404583694175299n, 4925907187283752295n, 18105878977104975913n, 
            8637333467398587280n, 18001757738269577753n, 147893244081249898n, 7407228367835176776n, 10518605203640582905n, 
            12114109922781885890n, 17968729469743751640n, 16007767558189736988n, 165687849481676090n, 4361060072830360207n, 
            1987870753236326583n, 6252480855024225816n, 3660082154052196958n, 13714123954068831041n, 16304057446093000205n, 
            10067336783657766550n, 10844128384332234950n, 14301534695498749549n, 15498415593531060736n, 1449641185001499601n, 
            3036464105550001701n, 11056193922017487363n, 8384279700551332126n, 6018543112414854154n, 16035428739779228534n, 
            71284382342802388n, 15786449777715157983n, 3691460828855667779n, 698337612579845064n, 17210662180744798688n ];

describe('LinearCongruentialGenerator', function() {

    it('generates pseudo-random numbers in the interval [0, 1)', function() {

        const lcg = new Pseudo.LinearCongruentialGenerator(Date.now());

        for (let i = 0; i < 2000; i++) {
            const pseudoRndNum = lcg.next();
            expect(pseudoRndNum).to.be.a('number');
            expect(pseudoRndNum).to.be.at.least(0);
            expect(pseudoRndNum).to.be.below(1);
        }

    });

});

describe('XorShift128', function() {

    it('generates pseudo-random numbers in the interval [0, 1)', function() {

        const xorShift = new Pseudo.XorShift128(Date.now());

        for (let i = 0; i < 2000; i++) {
            const pseudoRndNum = xorShift.next();
            expect(pseudoRndNum).to.be.a('number');
            expect(pseudoRndNum).to.be.at.least(0);
            expect(pseudoRndNum).to.be.below(1);
        }

    });

    it('agrees with the reference implementation', function() {

        const xorShift = new Pseudo.XorShift128(XOR_SHIFT_REFERENCE_SEED);

        XOR_SHIFT_REFERENCE_OUTPUT.forEach((referenceValue) => {
            expect(xorShift.next()).to.equal(referenceValue/TWO_TO_THIRTY_TWO);
        });

    });

});

describe('XorShift128Plus', function() {

    it('generates pseudo-random numbers (of type BigInt) in the interval [0, MAX_64_BIT_UINT]', function() {

        const xorShift128Plus = new Pseudo.XorShift128Plus(BigInt(Date.now()), 1234567890n);

        for (let i = 0; i < 2000; i++) {
            const pseudoRndNum = xorShift128Plus.next();
            expect(pseudoRndNum).to.be.a('bigint');
            expect(pseudoRndNum).to.satisfy((value) => {
                return value >= 0n && value <= MAX_64_BIT_UINT;
            });
        }

    });

    it('agrees with the reference implementation', function() {

        const xorShift128Plus = new Pseudo.XorShift128Plus(XOR_SHIFT_128_PLUS_REFERENCE_SEED_A, XOR_SHIFT_128_PLUS_REFERENCE_SEED_B);

        XOR_SHIFT_128_PLUS_REFERENCE_OUTPUT.forEach((referenceValue) => {
            expect(xorShift128Plus.next()).to.equal(referenceValue);
        });

    });

});
