import { DataSectorModel } from "./sector_model";

// Define the type for individual stock data
export type StockData = {
    stock_name: string;
    full_stock_name: string;
}

// Define the type for the total stocks object
export type TotalStocks = Record<string, StockData>;


// Total stocks
export const totalstocks: TotalStocks = {
    "NSE:21STCENMGM-EQ": {
        "stock_name": "NSE:21STCENMGM-EQ",
        "full_stock_name": "21ST CENTURY MGMT SERVICE"
    },
    "NSE:360ONE-EQ": {
        "stock_name": "NSE:360ONE-EQ",
        "full_stock_name": "360 ONE WAM LIMITED"
    },
    "NSE:3IINFOLTD-EQ": {
        "stock_name": "NSE:3IINFOLTD-EQ",
        "full_stock_name": "3I INFOTECH LIMITED"
    },
    "NSE:3MINDIA-EQ": {
        "stock_name": "NSE:3MINDIA-EQ",
        "full_stock_name": "3M INDIA LIMITED"
    },
    "NSE:3PLAND-EQ": {
        "stock_name": "NSE:3PLAND-EQ",
        "full_stock_name": "3P LAND HOLDINGS LIMITED"
    },
    "NSE:5PAISA-EQ": {
        "stock_name": "NSE:5PAISA-EQ",
        "full_stock_name": "5PAISA CAPITAL LIMITED"
    },
    "NSE:63MOONS-EQ": {
        "stock_name": "NSE:63MOONS-EQ",
        "full_stock_name": "63 MOONS TECHNOLOGIES LTD"
    },
    "NSE:A2ZINFRA-EQ": {
        "stock_name": "NSE:A2ZINFRA-EQ",
        "full_stock_name": "A2Z INFRA ENGINEERING LTD"
    },
    "NSE:AAATECH-BE": {
        "stock_name": "NSE:AAATECH-BE",
        "full_stock_name": "AAA TECHNOLOGIES LIMITED"
    },
    "NSE:AADHARHFC-EQ": {
        "stock_name": "NSE:AADHARHFC-EQ",
        "full_stock_name": "AADHAR HOUSING FINANCE L"
    },
    "NSE:AAKASH-EQ": {
        "stock_name": "NSE:AAKASH-EQ",
        "full_stock_name": "AAKASH EXPLORATION SER L"
    },
    "NSE:AAREYDRUGS-EQ": {
        "stock_name": "NSE:AAREYDRUGS-EQ",
        "full_stock_name": "AAREY DRUGS & PHARM LTD"
    },
    "NSE:AARON-EQ": {
        "stock_name": "NSE:AARON-EQ",
        "full_stock_name": "AARON INDUSTRIES LIMITED"
    },
    "NSE:AARTECH-EQ": {
        "stock_name": "NSE:AARTECH-EQ",
        "full_stock_name": "AARTECH SOLONICS LIMITED"
    },
    "NSE:AARTIDRUGS-EQ": {
        "stock_name": "NSE:AARTIDRUGS-EQ",
        "full_stock_name": "AARTI DRUGS LTD."
    },
    "NSE:AARTIIND-EQ": {
        "stock_name": "NSE:AARTIIND-EQ",
        "full_stock_name": "AARTI INDUSTRIES LTD"
    },
    "NSE:AARTIPHARM-EQ": {
        "stock_name": "NSE:AARTIPHARM-EQ",
        "full_stock_name": "AARTI PHARMALABS LIMITED"
    },
    "NSE:AARTISURF-EQ": {
        "stock_name": "NSE:AARTISURF-EQ",
        "full_stock_name": "AARTI SURFACTANTS LIMITED"
    },
    "NSE:AARVI-EQ": {
        "stock_name": "NSE:AARVI-EQ",
        "full_stock_name": "AARVI ENCON LIMITED"
    },
    "NSE:AAVAS-EQ": {
        "stock_name": "NSE:AAVAS-EQ",
        "full_stock_name": "AAVAS FINANCIERS LIMITED"
    },
    "NSE:ABAN-BE": {
        "stock_name": "NSE:ABAN-BE",
        "full_stock_name": "ABAN OFFSHORE LTD."
    },
    "NSE:ABB-EQ": {
        "stock_name": "NSE:ABB-EQ",
        "full_stock_name": "ABB INDIA LIMITED"
    },
    "NSE:ABBOTINDIA-EQ": {
        "stock_name": "NSE:ABBOTINDIA-EQ",
        "full_stock_name": "ABBOTT INDIA LIMITED"
    },
    "NSE:ABCAPITAL-EQ": {
        "stock_name": "NSE:ABCAPITAL-EQ",
        "full_stock_name": "ADITYA BIRLA CAPITAL LTD."
    },
    "NSE:ABCOTS-EQ": {
        "stock_name": "NSE:ABCOTS-EQ",
        "full_stock_name": "A B COTSPIN INDIA LIMITED"
    },
    "NSE:ABDL-EQ": {
        "stock_name": "NSE:ABDL-EQ",
        "full_stock_name": "ALLIED BLEND N DISTILS L"
    },
    "NSE:ABFRL-EQ": {
        "stock_name": "NSE:ABFRL-EQ",
        "full_stock_name": "ADITYA BIRLA FASHION & RT"
    },
    "NSE:ABGSEC-EQ": {
        "stock_name": "NSE:ABGSEC-EQ",
        "full_stock_name": "BIRLASLAMC - ABGSEC"
    },
    "NSE:ABINFRA-EQ": {
        "stock_name": "NSE:ABINFRA-EQ",
        "full_stock_name": "A B INFRABUILD LIMITED"
    },
    "NSE:ABLBL-EQ": {
        "stock_name": "NSE:ABLBL-EQ",
        "full_stock_name": "ADITYA BIRLA LIFES BRAN L"
    },
    "NSE:ABMINTLLTD-EQ": {
        "stock_name": "NSE:ABMINTLLTD-EQ",
        "full_stock_name": "ABM INTERNATIONAL LTD"
    },
    "NSE:ABREL-EQ": {
        "stock_name": "NSE:ABREL-EQ",
        "full_stock_name": "ADITYA BIRLA REAL EST LTD"
    },
    "NSE:ABSLAMC-EQ": {
        "stock_name": "NSE:ABSLAMC-EQ",
        "full_stock_name": "ADIT BIRL SUN LIF AMC LTD"
    },
    "NSE:ABSLLIQUID-EQ": {
        "stock_name": "NSE:ABSLLIQUID-EQ",
        "full_stock_name": "BIRLASLAMC - ABSLLIQUID"
    },
    "NSE:ABSLNN50ET-EQ": {
        "stock_name": "NSE:ABSLNN50ET-EQ",
        "full_stock_name": "BIRLASLAMC - ABSLNN50ET"
    },
    "NSE:ABSLPSE-EQ": {
        "stock_name": "NSE:ABSLPSE-EQ",
        "full_stock_name": "BIRLASLAMC-ABSLPSE"
    },
    "NSE:ACC-EQ": {
        "stock_name": "NSE:ACC-EQ",
        "full_stock_name": "ACC LIMITED"
    },
    "NSE:ACCELYA-EQ": {
        "stock_name": "NSE:ACCELYA-EQ",
        "full_stock_name": "ACCELYA SOLN INDIA LTD"
    },
    "NSE:ACCURACY-EQ": {
        "stock_name": "NSE:ACCURACY-EQ",
        "full_stock_name": "ACCURACY SHIPPING LIMITED"
    },
    "NSE:ACE-EQ": {
        "stock_name": "NSE:ACE-EQ",
        "full_stock_name": "ACTION CONST EQUIP LTD"
    },
    "NSE:ACEINTEG-EQ": {
        "stock_name": "NSE:ACEINTEG-EQ",
        "full_stock_name": "ACE INTEGRATED SOLU. LTD."
    },
    "NSE:ACI-EQ": {
        "stock_name": "NSE:ACI-EQ",
        "full_stock_name": "ARCHEAN CHEMICAL IND LTD"
    },
    "NSE:ACL-EQ": {
        "stock_name": "NSE:ACL-EQ",
        "full_stock_name": "ANDHRA CEMENTS LIMITED"
    },
    "NSE:ACMESOLAR-EQ": {
        "stock_name": "NSE:ACMESOLAR-EQ",
        "full_stock_name": "ACME SOLAR HOLDINGS LTD"
    },
    "NSE:ACUTAAS-EQ": {
        "stock_name": "NSE:ACUTAAS-EQ",
        "full_stock_name": "ACUTAAS CHEMICALS LIMITED"
    },
    "NSE:ADANIENSOL-EQ": {
        "stock_name": "NSE:ADANIENSOL-EQ",
        "full_stock_name": "ADANI ENERGY SOLUTION LTD"
    },
    "NSE:ADANIENT-EQ": {
        "stock_name": "NSE:ADANIENT-EQ",
        "full_stock_name": "ADANI ENTERPRISES LIMITED"
    },
    "NSE:ADANIGREEN-EQ": {
        "stock_name": "NSE:ADANIGREEN-EQ",
        "full_stock_name": "ADANI GREEN ENERGY LTD"
    },
    "NSE:ADANIPORTS-EQ": {
        "stock_name": "NSE:ADANIPORTS-EQ",
        "full_stock_name": "ADANI PORT & SEZ LTD"
    },
    "NSE:ADANIPOWER-EQ": {
        "stock_name": "NSE:ADANIPOWER-EQ",
        "full_stock_name": "ADANI POWER LTD"
    },
    "NSE:ADFFOODS-EQ": {
        "stock_name": "NSE:ADFFOODS-EQ",
        "full_stock_name": "ADF FOODS LIMITED"
    },
    "NSE:ADL-EQ": {
        "stock_name": "NSE:ADL-EQ",
        "full_stock_name": "ARCHIDPLY DECOR LIMITED"
    },
    "NSE:ADOR-EQ": {
        "stock_name": "NSE:ADOR-EQ",
        "full_stock_name": "ADOR WELDING LTD"
    },
    "NSE:ADROITINFO-EQ": {
        "stock_name": "NSE:ADROITINFO-EQ",
        "full_stock_name": "ADROIT INFOTECH LIMITED"
    },
    "NSE:ADSL-EQ": {
        "stock_name": "NSE:ADSL-EQ",
        "full_stock_name": "ALLIED DIGITAL SERV. LTD"
    },
    "NSE:ADVAIT-EQ": {
        "stock_name": "NSE:ADVAIT-EQ",
        "full_stock_name": "ADVAIT ENRGY TRANSITION L"
    },
    "NSE:ADVANCE-EQ": {
        "stock_name": "NSE:ADVANCE-EQ",
        "full_stock_name": "ADVANCE AGROLIFE LIMITED"
    },
    "NSE:ADVANIHOTR-EQ": {
        "stock_name": "NSE:ADVANIHOTR-EQ",
        "full_stock_name": "ADVANI HOT.& RES.(I) LTD"
    },
    "NSE:ADVENTHTL-EQ": {
        "stock_name": "NSE:ADVENTHTL-EQ",
        "full_stock_name": "ADVENT HOTELS INTERNATI L"
    },
    "NSE:ADVENZYMES-EQ": {
        "stock_name": "NSE:ADVENZYMES-EQ",
        "full_stock_name": "ADVANCED ENZYME TECH LTD"
    },
    "NSE:AEGISLOG-EQ": {
        "stock_name": "NSE:AEGISLOG-EQ",
        "full_stock_name": "AEGIS LOGISTICS LIMITED"
    },
    "NSE:AEGISVOPAK-EQ": {
        "stock_name": "NSE:AEGISVOPAK-EQ",
        "full_stock_name": "AEGIS VOPAK TERMINALS LTD"
    },
    "NSE:AEQUS-EQ": {
        "stock_name": "NSE:AEQUS-EQ",
        "full_stock_name": "AEQUS LIMITED"
    },
    "NSE:AEROENTER-EQ": {
        "stock_name": "NSE:AEROENTER-EQ",
        "full_stock_name": "AEROFLEX ENTERPRISES LTD"
    },
    "NSE:AEROFLEX-EQ": {
        "stock_name": "NSE:AEROFLEX-EQ",
        "full_stock_name": "AEROFLEX INDUSTRIES LTD"
    },
    "NSE:AERONEU-EQ": {
        "stock_name": "NSE:AERONEU-EQ",
        "full_stock_name": "AEROFLEX NEU LIMITED"
    },
    "NSE:AETHER-EQ": {
        "stock_name": "NSE:AETHER-EQ",
        "full_stock_name": "AETHER INDUSTRIES LIMITED"
    },
    "NSE:AFCONS-EQ": {
        "stock_name": "NSE:AFCONS-EQ",
        "full_stock_name": "AFCONS INFRASTRUCTURE LTD"
    },
    "NSE:AFFLE-EQ": {
        "stock_name": "NSE:AFFLE-EQ",
        "full_stock_name": "AFFLE 3I LIMITED"
    },
    "NSE:AFFORDABLE-EQ": {
        "stock_name": "NSE:AFFORDABLE-EQ",
        "full_stock_name": "AFFORD ROBO & AUTO LTD"
    },
    "NSE:AFIL-EQ": {
        "stock_name": "NSE:AFIL-EQ",
        "full_stock_name": "AKME FINTRADE (INDIA) LTD"
    },
    "NSE:AFSL-EQ": {
        "stock_name": "NSE:AFSL-EQ",
        "full_stock_name": "ABANS FINANCIAL SRVCS LTD"
    },
    "NSE:AGARIND-EQ": {
        "stock_name": "NSE:AGARIND-EQ",
        "full_stock_name": "AGARWAL INDS CORP LTD."
    },
    "NSE:AGARWALEYE-EQ": {
        "stock_name": "NSE:AGARWALEYE-EQ",
        "full_stock_name": "DR AGARWALS HEALTH CARE L"
    },
    "NSE:AGI-EQ": {
        "stock_name": "NSE:AGI-EQ",
        "full_stock_name": "AGI GREENPAC LIMITED"
    },
    "NSE:AGIIL-EQ": {
        "stock_name": "NSE:AGIIL-EQ",
        "full_stock_name": "AGI INFRA LIMITED"
    },
    "NSE:AGRITECH-BE": {
        "stock_name": "NSE:AGRITECH-BE",
        "full_stock_name": "AGRI-TECH (INDIA) LIMITED"
    },
    "NSE:AGROPHOS-EQ": {
        "stock_name": "NSE:AGROPHOS-EQ",
        "full_stock_name": "AGRO PHOS INDIA LIMITED"
    },
    "NSE:AGSTRA-BZ": {
        "stock_name": "NSE:AGSTRA-BZ",
        "full_stock_name": "AGS TRANSACT TECH LTD"
    },
    "NSE:AHCL-EQ": {
        "stock_name": "NSE:AHCL-EQ",
        "full_stock_name": "ANLON HEALTHCARE LIMITED"
    },
    "NSE:AHLADA-EQ": {
        "stock_name": "NSE:AHLADA-EQ",
        "full_stock_name": "AHLADA ENGINEERS LIMITED"
    },
    "NSE:AHLEAST-EQ": {
        "stock_name": "NSE:AHLEAST-EQ",
        "full_stock_name": "ASIAN HOTELS (EAST) LTD"
    },
    "NSE:AHLUCONT-EQ": {
        "stock_name": "NSE:AHLUCONT-EQ",
        "full_stock_name": "AHLUWALIA CONT IND LTD"
    },
    "NSE:AIAENG-EQ": {
        "stock_name": "NSE:AIAENG-EQ",
        "full_stock_name": "AIA ENGINEERING LIMITED"
    },
    "NSE:AIIL-EQ": {
        "stock_name": "NSE:AIIL-EQ",
        "full_stock_name": "AUTHUM INVEST & INFRA LTD"
    },
    "NSE:AIRAN-EQ": {
        "stock_name": "NSE:AIRAN-EQ",
        "full_stock_name": "AIRAN LIMITED"
    },
    "NSE:AIROLAM-EQ": {
        "stock_name": "NSE:AIROLAM-EQ",
        "full_stock_name": "AIRO LAM LIMITED"
    },
    "NSE:AJANTPHARM-EQ": {
        "stock_name": "NSE:AJANTPHARM-EQ",
        "full_stock_name": "AJANTA PHARMA LIMITED"
    },
    "NSE:AJAXENGG-EQ": {
        "stock_name": "NSE:AJAXENGG-EQ",
        "full_stock_name": "AJAX ENGINEERING LIMITED"
    },
    "NSE:AJMERA-EQ": {
        "stock_name": "NSE:AJMERA-EQ",
        "full_stock_name": "AJMERA REALTY & INF I LTD"
    },
    "NSE:AJOONI-EQ": {
        "stock_name": "NSE:AJOONI-EQ",
        "full_stock_name": "AJOONI BIOTECH LIMITED"
    },
    "NSE:AKASH-EQ": {
        "stock_name": "NSE:AKASH-EQ",
        "full_stock_name": "AKASH INFRA-PROJECTS LTD"
    },
    "NSE:AKG-EQ": {
        "stock_name": "NSE:AKG-EQ",
        "full_stock_name": "AKG EXIM LIMITED"
    },
    "NSE:AKI-EQ": {
        "stock_name": "NSE:AKI-EQ",
        "full_stock_name": "AKI INDIA LIMITED"
    },
    "NSE:AKSHAR-EQ": {
        "stock_name": "NSE:AKSHAR-EQ",
        "full_stock_name": "AKSHAR SPINTEX LIMITED"
    },
    "NSE:AKSHARCHEM-EQ": {
        "stock_name": "NSE:AKSHARCHEM-EQ",
        "full_stock_name": "AKSHARCHEM INDIA LIMITED"
    },
    "NSE:AKSHOPTFBR-EQ": {
        "stock_name": "NSE:AKSHOPTFBR-EQ",
        "full_stock_name": "AKSH OPTIFIBRE LIMITED"
    },
    "NSE:AKUMS-EQ": {
        "stock_name": "NSE:AKUMS-EQ",
        "full_stock_name": "AKUMS DRUGS AND PHARMA L"
    },
    "NSE:AKZOINDIA-EQ": {
        "stock_name": "NSE:AKZOINDIA-EQ",
        "full_stock_name": "AKZO NOBEL INDIA LIMITED"
    },
    "NSE:ALANKIT-EQ": {
        "stock_name": "NSE:ALANKIT-EQ",
        "full_stock_name": "ALANKIT LIMITED"
    },
    "NSE:ALBERTDAVD-EQ": {
        "stock_name": "NSE:ALBERTDAVD-EQ",
        "full_stock_name": "ALBERT DAVID LIMITED"
    },
    "NSE:ALEMBICLTD-EQ": {
        "stock_name": "NSE:ALEMBICLTD-EQ",
        "full_stock_name": "ALEMBIC LIMITED"
    },
    "NSE:ALGOQUANT-EQ": {
        "stock_name": "NSE:ALGOQUANT-EQ",
        "full_stock_name": "ALGOQUANT FINTECH LIMITED"
    },
    "NSE:ALICON-EQ": {
        "stock_name": "NSE:ALICON-EQ",
        "full_stock_name": "ALICON CASTALLOY LIMITED"
    },
    "NSE:ALIVUS-EQ": {
        "stock_name": "NSE:ALIVUS-EQ",
        "full_stock_name": "ALIVUS LIFE SCIENCES LTD"
    },
    "NSE:ALKALI-EQ": {
        "stock_name": "NSE:ALKALI-EQ",
        "full_stock_name": "ALKALI METALS LTD"
    },
    "NSE:ALKEM-EQ": {
        "stock_name": "NSE:ALKEM-EQ",
        "full_stock_name": "ALKEM LABORATORIES LTD."
    },
    "NSE:ALKYLAMINE-EQ": {
        "stock_name": "NSE:ALKYLAMINE-EQ",
        "full_stock_name": "ALKYL AMINES CHEM. LTD"
    },
    "NSE:ALLCARGO-EQ": {
        "stock_name": "NSE:ALLCARGO-EQ",
        "full_stock_name": "ALLCARGO LOGISTICS LTD"
    },
    "NSE:ALLDIGI-EQ": {
        "stock_name": "NSE:ALLDIGI-EQ",
        "full_stock_name": "ALLDIGI TECH LIMITED"
    },
    "NSE:ALLTIME-EQ": {
        "stock_name": "NSE:ALLTIME-EQ",
        "full_stock_name": "ALL TIME PLASTICS LIMITED"
    },
    "NSE:ALMONDZ-EQ": {
        "stock_name": "NSE:ALMONDZ-EQ",
        "full_stock_name": "ALMONDZ GLOBAL SEC LTD"
    },
    "NSE:ALOKINDS-EQ": {
        "stock_name": "NSE:ALOKINDS-EQ",
        "full_stock_name": "ALOK INDUSTRIES LIMITED"
    },
    "NSE:ALPA-EQ": {
        "stock_name": "NSE:ALPA-EQ",
        "full_stock_name": "ALPA LABORATORIES LTD"
    },
    "NSE:ALPHA-EQ": {
        "stock_name": "NSE:ALPHA-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKALPHA"
    },
    "NSE:ALPHAGEO-EQ": {
        "stock_name": "NSE:ALPHAGEO-EQ",
        "full_stock_name": "ALPHAGEO (INDIA) LIMITED"
    },
    "NSE:AMAGI-EQ": {
        "stock_name": "NSE:AMAGI-EQ",
        "full_stock_name": "AMAGI MEDIA LABS LIMITED"
    },
    "NSE:AMANTA-EQ": {
        "stock_name": "NSE:AMANTA-EQ",
        "full_stock_name": "AMANTA HEALTHCARE LIMITED"
    },
    "NSE:AMBER-EQ": {
        "stock_name": "NSE:AMBER-EQ",
        "full_stock_name": "AMBER ENTERPRISES (I) LTD"
    },
    "NSE:AMBICAAGAR-EQ": {
        "stock_name": "NSE:AMBICAAGAR-EQ",
        "full_stock_name": "AMBICA AGAR & AROMAINDLTD"
    },
    "NSE:AMBIKCO-EQ": {
        "stock_name": "NSE:AMBIKCO-EQ",
        "full_stock_name": "AMBIKA COTTON MILL LTD."
    },
    "NSE:AMBUJACEM-EQ": {
        "stock_name": "NSE:AMBUJACEM-EQ",
        "full_stock_name": "AMBUJA CEMENTS LTD"
    },
    "NSE:AMDIND-EQ": {
        "stock_name": "NSE:AMDIND-EQ",
        "full_stock_name": "AMD INDUSTRIES LIMITED"
    },
    "NSE:AMJLAND-EQ": {
        "stock_name": "NSE:AMJLAND-EQ",
        "full_stock_name": "AMJ LAND HOLDINGS LIMITED"
    },
    "NSE:AMNPLST-EQ": {
        "stock_name": "NSE:AMNPLST-EQ",
        "full_stock_name": "AMINES & PLASTICIZERS LTD"
    },
    "NSE:AMRUTANJAN-EQ": {
        "stock_name": "NSE:AMRUTANJAN-EQ",
        "full_stock_name": "AMRUTAJAN HEALTH LTD"
    },
    "NSE:ANANDRATHI-EQ": {
        "stock_name": "NSE:ANANDRATHI-EQ",
        "full_stock_name": "ANAND RATHI WEALTH LTD"
    },
    "NSE:ANANTRAJ-EQ": {
        "stock_name": "NSE:ANANTRAJ-EQ",
        "full_stock_name": "ANANT RAJ LIMITED"
    },
    "NSE:ANDHRAPAP-EQ": {
        "stock_name": "NSE:ANDHRAPAP-EQ",
        "full_stock_name": "ANDHRA PAPER LIMITED"
    },
    "NSE:ANDHRSUGAR-EQ": {
        "stock_name": "NSE:ANDHRSUGAR-EQ",
        "full_stock_name": "ANDHRA SUGARS LTD"
    },
    "NSE:ANGELONE-EQ": {
        "stock_name": "NSE:ANGELONE-EQ",
        "full_stock_name": "ANGEL ONE LIMITED"
    },
    "NSE:ANIKINDS-EQ": {
        "stock_name": "NSE:ANIKINDS-EQ",
        "full_stock_name": "ANIK INDUSTRIES LTD"
    },
    "NSE:ANKITMETAL-BZ": {
        "stock_name": "NSE:ANKITMETAL-BZ",
        "full_stock_name": "ANKIT MET & POW LTD"
    },
    "NSE:ANMOL-EQ": {
        "stock_name": "NSE:ANMOL-EQ",
        "full_stock_name": "ANMOL INDIA LIMITED"
    },
    "NSE:ANSALAPI-BZ": {
        "stock_name": "NSE:ANSALAPI-BZ",
        "full_stock_name": "ANSAL PROP & INFRA LTD"
    },
    "NSE:ANTELOPUS-EQ": {
        "stock_name": "NSE:ANTELOPUS-EQ",
        "full_stock_name": "ANTELOPUS SELAN ENRGY LTD"
    },
    "NSE:ANTGRAPHIC-EQ": {
        "stock_name": "NSE:ANTGRAPHIC-EQ",
        "full_stock_name": "ANTARCTICA LTD"
    },
    "NSE:ANTHEM-EQ": {
        "stock_name": "NSE:ANTHEM-EQ",
        "full_stock_name": "ANTHEM BIOSCIENCES LTD"
    },
    "NSE:ANUHPHR-EQ": {
        "stock_name": "NSE:ANUHPHR-EQ",
        "full_stock_name": "ANUH PHARMA LIMITED"
    },
    "NSE:ANUP-EQ": {
        "stock_name": "NSE:ANUP-EQ",
        "full_stock_name": "THE ANUP ENGINEERING LTD"
    },
    "NSE:ANURAS-EQ": {
        "stock_name": "NSE:ANURAS-EQ",
        "full_stock_name": "ANUPAM RASAYAN INDIA LTD"
    },
    "NSE:AONEGOLD-EQ": {
        "stock_name": "NSE:AONEGOLD-EQ",
        "full_stock_name": "AONEAMC - AONEGOLD"
    },
    "NSE:AONELIQUID-EQ": {
        "stock_name": "NSE:AONELIQUID-EQ",
        "full_stock_name": "AONEAMC - AONELIQUID"
    },
    "NSE:AONETMMQ50-EQ": {
        "stock_name": "NSE:AONETMMQ50-EQ",
        "full_stock_name": "AONEAMC - AONETMMQ50"
    },
    "NSE:AONETOTAL-EQ": {
        "stock_name": "NSE:AONETOTAL-EQ",
        "full_stock_name": "AONEAMC - AONETOTAL"
    },
    "NSE:APARINDS-EQ": {
        "stock_name": "NSE:APARINDS-EQ",
        "full_stock_name": "APAR INDUSTRIES LTD."
    },
    "NSE:APCL-EQ": {
        "stock_name": "NSE:APCL-EQ",
        "full_stock_name": "ANJANI PORTLAND CEM LTD"
    },
    "NSE:APCOTEXIND-EQ": {
        "stock_name": "NSE:APCOTEXIND-EQ",
        "full_stock_name": "APCOTEX INDUSTRIES LIMITE"
    },
    "NSE:APEX-EQ": {
        "stock_name": "NSE:APEX-EQ",
        "full_stock_name": "APEX FROZEN FOODS LIMITED"
    },
    "NSE:APLAPOLLO-EQ": {
        "stock_name": "NSE:APLAPOLLO-EQ",
        "full_stock_name": "APL APOLLO TUBES LTD"
    },
    "NSE:APLLTD-EQ": {
        "stock_name": "NSE:APLLTD-EQ",
        "full_stock_name": "ALEMBIC PHARMA LTD"
    },
    "NSE:APOLLO-EQ": {
        "stock_name": "NSE:APOLLO-EQ",
        "full_stock_name": "APOLLO MICRO SYSTEMS LTD"
    },
    "NSE:APOLLOHOSP-EQ": {
        "stock_name": "NSE:APOLLOHOSP-EQ",
        "full_stock_name": "APOLLO HOSPITALS ENTER. L"
    },
    "NSE:APOLLOPIPE-EQ": {
        "stock_name": "NSE:APOLLOPIPE-EQ",
        "full_stock_name": "APOLLO PIPES LIMITED"
    },
    "NSE:APOLLOTYRE-EQ": {
        "stock_name": "NSE:APOLLOTYRE-EQ",
        "full_stock_name": "APOLLO TYRES LTD"
    },
    "NSE:APOLSINHOT-EQ": {
        "stock_name": "NSE:APOLSINHOT-EQ",
        "full_stock_name": "APOLLO SINDOORI HOTEL LTD"
    },
    "NSE:APTECHT-EQ": {
        "stock_name": "NSE:APTECHT-EQ",
        "full_stock_name": "APTECH LIMITED"
    },
    "NSE:APTUS-EQ": {
        "stock_name": "NSE:APTUS-EQ",
        "full_stock_name": "APTUS VALUE HSG FIN I LTD"
    },
    "NSE:ARCHIDPLY-EQ": {
        "stock_name": "NSE:ARCHIDPLY-EQ",
        "full_stock_name": "ARCHIDPLY IND. LTD"
    },
    "NSE:ARCHIES-EQ": {
        "stock_name": "NSE:ARCHIES-EQ",
        "full_stock_name": "ARCHIES LTD"
    },
    "NSE:ARE&M-EQ": {
        "stock_name": "NSE:ARE&M-EQ",
        "full_stock_name": "AMARA RAJA ENERGY MOB LTD"
    },
    "NSE:ARENTERP-EQ": {
        "stock_name": "NSE:ARENTERP-EQ",
        "full_stock_name": "RAJDARSHAN INDUSTRIES LTD"
    },
    "NSE:ARFIN-EQ": {
        "stock_name": "NSE:ARFIN-EQ",
        "full_stock_name": "ARFIN INDIA LIMITED"
    },
    "NSE:ARIES-EQ": {
        "stock_name": "NSE:ARIES-EQ",
        "full_stock_name": "ARIES AGRO LTD."
    },
    "NSE:ARIHANTCAP-EQ": {
        "stock_name": "NSE:ARIHANTCAP-EQ",
        "full_stock_name": "ARIHANT CAPITAL MKTS LTD"
    },
    "NSE:ARIHANTSUP-EQ": {
        "stock_name": "NSE:ARIHANTSUP-EQ",
        "full_stock_name": "ARIHANT SUPERSTRUCT LTD"
    },
    "NSE:ARISINFRA-EQ": {
        "stock_name": "NSE:ARISINFRA-EQ",
        "full_stock_name": "ARISINFRA SOLUTIONS LTD"
    },
    "NSE:ARKADE-EQ": {
        "stock_name": "NSE:ARKADE-EQ",
        "full_stock_name": "ARKADE DEVELOPERS LIMITED"
    },
    "NSE:ARMANFIN-EQ": {
        "stock_name": "NSE:ARMANFIN-EQ",
        "full_stock_name": "ARMAN FIN SERV LTD"
    },
    "NSE:AROGRANITE-EQ": {
        "stock_name": "NSE:AROGRANITE-EQ",
        "full_stock_name": "ARO GRANITE IND. LTD."
    },
    "NSE:ARROWGREEN-EQ": {
        "stock_name": "NSE:ARROWGREEN-EQ",
        "full_stock_name": "ARROW GREENTECH LIMITED"
    },
    "NSE:ARSHIYA-BZ": {
        "stock_name": "NSE:ARSHIYA-BZ",
        "full_stock_name": "ARSHIYA LIMITED"
    },
    "NSE:ARSSBL-EQ": {
        "stock_name": "NSE:ARSSBL-EQ",
        "full_stock_name": "ANAND RATHI SH N STK BR L"
    },
    "NSE:ARTEMISMED-EQ": {
        "stock_name": "NSE:ARTEMISMED-EQ",
        "full_stock_name": "ARTEMIS MED SERVICE LTD"
    },
    "NSE:ARTNIRMAN-EQ": {
        "stock_name": "NSE:ARTNIRMAN-EQ",
        "full_stock_name": "ART NIRMAN LIMITED"
    },
    "NSE:ARVEE-BE": {
        "stock_name": "NSE:ARVEE-BE",
        "full_stock_name": "ARVEE LABORATORIES I LTD"
    },
    "NSE:ARVIND-EQ": {
        "stock_name": "NSE:ARVIND-EQ",
        "full_stock_name": "ARVIND LIMITED"
    },
    "NSE:ARVINDFASN-EQ": {
        "stock_name": "NSE:ARVINDFASN-EQ",
        "full_stock_name": "ARVIND FASHIONS LIMITED"
    },
    "NSE:ARVSMART-EQ": {
        "stock_name": "NSE:ARVSMART-EQ",
        "full_stock_name": "ARVIND SMARTSPACES LTD"
    },
    "NSE:ASAHIINDIA-EQ": {
        "stock_name": "NSE:ASAHIINDIA-EQ",
        "full_stock_name": "ASAHI INDIA GLASS LIMITED"
    },
    "NSE:ASAHISONG-EQ": {
        "stock_name": "NSE:ASAHISONG-EQ",
        "full_stock_name": "ASAHI SONGWON COLOR LTD"
    },
    "NSE:ASAL-EQ": {
        "stock_name": "NSE:ASAL-EQ",
        "full_stock_name": "AUTOMOTIVE STAMPINGS & AS"
    },
    "NSE:ASALCBR-EQ": {
        "stock_name": "NSE:ASALCBR-EQ",
        "full_stock_name": "ASSO ALCOHOLS & BREW LTD"
    },
    "NSE:ASHAPURMIN-EQ": {
        "stock_name": "NSE:ASHAPURMIN-EQ",
        "full_stock_name": "ASHAPURA MINECHEM LTD"
    },
    "NSE:ASHIANA-EQ": {
        "stock_name": "NSE:ASHIANA-EQ",
        "full_stock_name": "ASHIANA HOUSING LTD"
    },
    "NSE:ASHIMASYN-EQ": {
        "stock_name": "NSE:ASHIMASYN-EQ",
        "full_stock_name": "ASHIMA LTD"
    },
    "NSE:ASHOKA-EQ": {
        "stock_name": "NSE:ASHOKA-EQ",
        "full_stock_name": "ASHOKA BUILDCON LTD"
    },
    "NSE:ASHOKAMET-EQ": {
        "stock_name": "NSE:ASHOKAMET-EQ",
        "full_stock_name": "ASHOKA METCAST LIMITED"
    },
    "NSE:ASHOKLEY-EQ": {
        "stock_name": "NSE:ASHOKLEY-EQ",
        "full_stock_name": "ASHOK LEYLAND LTD"
    },
    "NSE:ASIANENE-EQ": {
        "stock_name": "NSE:ASIANENE-EQ",
        "full_stock_name": "ASIAN ENERGY SERVICES LTD"
    },
    "NSE:ASIANHOTNR-EQ": {
        "stock_name": "NSE:ASIANHOTNR-EQ",
        "full_stock_name": "ASIAN HOTELS (NORTH) LTD"
    },
    "NSE:ASIANPAINT-EQ": {
        "stock_name": "NSE:ASIANPAINT-EQ",
        "full_stock_name": "ASIAN PAINTS LIMITED"
    },
    "NSE:ASIANTILES-EQ": {
        "stock_name": "NSE:ASIANTILES-EQ",
        "full_stock_name": "ASIAN GRANITO IND. LTD."
    },
    "NSE:ASKAUTOLTD-EQ": {
        "stock_name": "NSE:ASKAUTOLTD-EQ",
        "full_stock_name": "ASK AUTOMOTIVE LIMITED"
    },
    "NSE:ASMS-EQ": {
        "stock_name": "NSE:ASMS-EQ",
        "full_stock_name": "BARTRONICS INDIA LIMITED"
    },
    "NSE:ASPINWALL-EQ": {
        "stock_name": "NSE:ASPINWALL-EQ",
        "full_stock_name": "ASPINWALL & CO LTD"
    },
    "NSE:ASTEC-EQ": {
        "stock_name": "NSE:ASTEC-EQ",
        "full_stock_name": "ASTEC LIFESCIENCES LTD"
    },
    "NSE:ASTERDM-EQ": {
        "stock_name": "NSE:ASTERDM-EQ",
        "full_stock_name": "ASTER DM HEALTHCARE LTD."
    },
    "NSE:ASTRAL-EQ": {
        "stock_name": "NSE:ASTRAL-EQ",
        "full_stock_name": "ASTRAL LIMITED"
    },
    "NSE:ASTRAMICRO-EQ": {
        "stock_name": "NSE:ASTRAMICRO-EQ",
        "full_stock_name": "ASTRA MICROWAVE LTD"
    },
    "NSE:ASTRAZEN-EQ": {
        "stock_name": "NSE:ASTRAZEN-EQ",
        "full_stock_name": "ASTRAZENECA PHARMA IND LT"
    },
    "NSE:ASTRON-EQ": {
        "stock_name": "NSE:ASTRON-EQ",
        "full_stock_name": "ASTRON PAPER BORD MIL LTD"
    },
    "NSE:ATALREAL-EQ": {
        "stock_name": "NSE:ATALREAL-EQ",
        "full_stock_name": "ATAL REALTECH LIMITED"
    },
    "NSE:ATAM-EQ": {
        "stock_name": "NSE:ATAM-EQ",
        "full_stock_name": "ATAM VALVES LIMITED"
    },
    "NSE:ATGL-EQ": {
        "stock_name": "NSE:ATGL-EQ",
        "full_stock_name": "ADANI TOTAL GAS LIMITED"
    },
    "NSE:ATHERENERG-EQ": {
        "stock_name": "NSE:ATHERENERG-EQ",
        "full_stock_name": "ATHER ENERGY LIMITED"
    },
    "NSE:ATL-EQ": {
        "stock_name": "NSE:ATL-EQ",
        "full_stock_name": "ALLCARGO TERMINALS LTD"
    },
    "NSE:ATLANTAA-EQ": {
        "stock_name": "NSE:ATLANTAA-EQ",
        "full_stock_name": "ATLANTAA LIMITED"
    },
    "NSE:ATLANTAELE-EQ": {
        "stock_name": "NSE:ATLANTAELE-EQ",
        "full_stock_name": "ATLANTA ELECTRICALS LTD"
    },
    "NSE:ATLASCYCLE-EQ": {
        "stock_name": "NSE:ATLASCYCLE-EQ",
        "full_stock_name": "ATLAS CYCLE (HARYANA) LTD"
    },
    "NSE:ATUL-EQ": {
        "stock_name": "NSE:ATUL-EQ",
        "full_stock_name": "ATUL LTD"
    },
    "NSE:ATULAUTO-EQ": {
        "stock_name": "NSE:ATULAUTO-EQ",
        "full_stock_name": "ATUL AUTO LIMITED"
    },
    "NSE:AUBANK-EQ": {
        "stock_name": "NSE:AUBANK-EQ",
        "full_stock_name": "AU SMALL FINANCE BANK LTD"
    },
    "NSE:AURIGROW-BE": {
        "stock_name": "NSE:AURIGROW-BE",
        "full_stock_name": "AURI GROW INDIA LIMITED"
    },
    "NSE:AURIONPRO-EQ": {
        "stock_name": "NSE:AURIONPRO-EQ",
        "full_stock_name": "AURIONPRO SOLN LTD"
    },
    "NSE:AUROPHARMA-EQ": {
        "stock_name": "NSE:AUROPHARMA-EQ",
        "full_stock_name": "AUROBINDO PHARMA LTD"
    },
    "NSE:AURUM-EQ": {
        "stock_name": "NSE:AURUM-EQ",
        "full_stock_name": "AURUM PROPTECH LIMITED"
    },
    "NSE:AUSOMENT-BE": {
        "stock_name": "NSE:AUSOMENT-BE",
        "full_stock_name": "AUSOM ENTERPRISE LIMITED"
    },
    "NSE:AUTOAXLES-EQ": {
        "stock_name": "NSE:AUTOAXLES-EQ",
        "full_stock_name": "AUTOMOTIVE AXLES LIMITED"
    },
    "NSE:AUTOBEES-EQ": {
        "stock_name": "NSE:AUTOBEES-EQ",
        "full_stock_name": "NIPPONAMC - NETFAUTO"
    },
    "NSE:AUTOIND-EQ": {
        "stock_name": "NSE:AUTOIND-EQ",
        "full_stock_name": "AUTOLINE INDUSTRIES LTD"
    },
    "NSE:AVADHSUGAR-EQ": {
        "stock_name": "NSE:AVADHSUGAR-EQ",
        "full_stock_name": "AVADH SUG & ENERGY LTD"
    },
    "NSE:AVALON-EQ": {
        "stock_name": "NSE:AVALON-EQ",
        "full_stock_name": "AVALON TECHNOLOGIES LTD"
    },
    "NSE:AVANTEL-EQ": {
        "stock_name": "NSE:AVANTEL-EQ",
        "full_stock_name": "AVANTEL LIMITED"
    },
    "NSE:AVANTIFEED-EQ": {
        "stock_name": "NSE:AVANTIFEED-EQ",
        "full_stock_name": "AVANTI FEEDS LIMITED"
    },
    "NSE:AVG-EQ": {
        "stock_name": "NSE:AVG-EQ",
        "full_stock_name": "AVG LOGISTICS LIMITED"
    },
    "NSE:AVL-EQ": {
        "stock_name": "NSE:AVL-EQ",
        "full_stock_name": "ADITYA VISION LIMITED"
    },
    "NSE:AVONMORE-EQ": {
        "stock_name": "NSE:AVONMORE-EQ",
        "full_stock_name": "AVONMORE CAP&MGT SERV LTD"
    },
    "NSE:AVROIND-BE": {
        "stock_name": "NSE:AVROIND-BE",
        "full_stock_name": "AVRO INDIA LIMITED"
    },
    "NSE:AVTNPL-EQ": {
        "stock_name": "NSE:AVTNPL-EQ",
        "full_stock_name": "AVT NATURAL PRODUCTS LTD"
    },
    "NSE:AWFIS-EQ": {
        "stock_name": "NSE:AWFIS-EQ",
        "full_stock_name": "AWFIS SPACE SOLUTIONS LTD"
    },
    "NSE:AWHCL-EQ": {
        "stock_name": "NSE:AWHCL-EQ",
        "full_stock_name": "ANTONY WASTE HDG CELL LTD"
    },
    "NSE:AWL-EQ": {
        "stock_name": "NSE:AWL-EQ",
        "full_stock_name": "AWL AGRI BUSINESS LIMITED"
    },
    "NSE:AXISBANK-EQ": {
        "stock_name": "NSE:AXISBANK-EQ",
        "full_stock_name": "AXIS BANK LIMITED"
    },
    "NSE:AXISCADES-EQ": {
        "stock_name": "NSE:AXISCADES-EQ",
        "full_stock_name": "AXISCADES TECH LTD"
    },
    "NSE:AXISGOLD-EQ": {
        "stock_name": "NSE:AXISGOLD-EQ",
        "full_stock_name": "AXIS MF - AXIS GOLD ETF"
    },
    "NSE:AXISILVER-EQ": {
        "stock_name": "NSE:AXISILVER-EQ",
        "full_stock_name": "AXISAMC - AXISILVER"
    },
    "NSE:AXISVALUE-EQ": {
        "stock_name": "NSE:AXISVALUE-EQ",
        "full_stock_name": "AXISAMC - AXISVALUE"
    },
    "NSE:AXITA-BE": {
        "stock_name": "NSE:AXITA-BE",
        "full_stock_name": "AXITA COTTON LIMITED"
    },
    "NSE:AXSENSEX-EQ": {
        "stock_name": "NSE:AXSENSEX-EQ",
        "full_stock_name": "AXISAMC - AXSENSEX"
    },
    "NSE:AYMSYNTEX-EQ": {
        "stock_name": "NSE:AYMSYNTEX-EQ",
        "full_stock_name": "AYM SYNTEX LIMITED"
    },
    "NSE:AZAD-EQ": {
        "stock_name": "NSE:AZAD-EQ",
        "full_stock_name": "AZAD ENGINEERING LIMITED"
    },
    "NSE:BAFNAPH-BE": {
        "stock_name": "NSE:BAFNAPH-BE",
        "full_stock_name": "BAFNA PHARMACEUTICALS LTD"
    },
    "NSE:BAGFILMS-EQ": {
        "stock_name": "NSE:BAGFILMS-EQ",
        "full_stock_name": "B.A.G FILMS AND MEDIA LTD"
    },
    "NSE:BAIDFIN-EQ": {
        "stock_name": "NSE:BAIDFIN-EQ",
        "full_stock_name": "BAID FINSERV LIMITED"
    },
    "NSE:BAJAJCON-EQ": {
        "stock_name": "NSE:BAJAJCON-EQ",
        "full_stock_name": "BAJAJ CONSUMER CARE LTD"
    },
    "NSE:BAJAJELEC-EQ": {
        "stock_name": "NSE:BAJAJELEC-EQ",
        "full_stock_name": "BAJAJ ELECT.LTD"
    },
    "NSE:BAJAJFINSV-EQ": {
        "stock_name": "NSE:BAJAJFINSV-EQ",
        "full_stock_name": "BAJAJ FINSERV LTD."
    },
    "NSE:BAJAJHCARE-EQ": {
        "stock_name": "NSE:BAJAJHCARE-EQ",
        "full_stock_name": "BAJAJ HEALTHCARE LIMITED"
    },
    "NSE:BAJAJHFL-EQ": {
        "stock_name": "NSE:BAJAJHFL-EQ",
        "full_stock_name": "BAJAJ HOUSING FINANCE LTD"
    },
    "NSE:BAJAJHIND-EQ": {
        "stock_name": "NSE:BAJAJHIND-EQ",
        "full_stock_name": "BAJAJ HINDUSTHAN SUGAR LT"
    },
    "NSE:BAJAJHLDNG-EQ": {
        "stock_name": "NSE:BAJAJHLDNG-EQ",
        "full_stock_name": "BAJAJ HOLDINGS & INVS LTD"
    },
    "NSE:BAJAJINDEF-EQ": {
        "stock_name": "NSE:BAJAJINDEF-EQ",
        "full_stock_name": "INDEF MANUFACTURING LTD"
    },
    "NSE:BAJEL-EQ": {
        "stock_name": "NSE:BAJEL-EQ",
        "full_stock_name": "BAJEL PROJECTS LIMITED"
    },
    "NSE:BAJFINANCE-EQ": {
        "stock_name": "NSE:BAJFINANCE-EQ",
        "full_stock_name": "BAJAJ FINANCE LIMITED"
    },
    "NSE:BALAJEE-EQ": {
        "stock_name": "NSE:BALAJEE-EQ",
        "full_stock_name": "SHREE TIRUPATI BALAJEE L"
    },
    "NSE:BALAJITELE-EQ": {
        "stock_name": "NSE:BALAJITELE-EQ",
        "full_stock_name": "BALAJI TELEFILMS LIMITED."
    },
    "NSE:BALAMINES-EQ": {
        "stock_name": "NSE:BALAMINES-EQ",
        "full_stock_name": "BALAJI AMINES LIMITED"
    },
    "NSE:BALAXI-EQ": {
        "stock_name": "NSE:BALAXI-EQ",
        "full_stock_name": "BALAXI PHARMA LTD"
    },
    "NSE:BALKRISHNA-EQ": {
        "stock_name": "NSE:BALKRISHNA-EQ",
        "full_stock_name": "BALKRISHNA PAPER MILLS L"
    },
    "NSE:BALKRISIND-EQ": {
        "stock_name": "NSE:BALKRISIND-EQ",
        "full_stock_name": "BALKRISHNA IND. LTD"
    },
    "NSE:BALMLAWRIE-EQ": {
        "stock_name": "NSE:BALMLAWRIE-EQ",
        "full_stock_name": "BALMER LAWRIE & CO LTD"
    },
    "NSE:BALPHARMA-EQ": {
        "stock_name": "NSE:BALPHARMA-EQ",
        "full_stock_name": "BAL PHARMA LTD."
    },
    "NSE:BALRAMCHIN-EQ": {
        "stock_name": "NSE:BALRAMCHIN-EQ",
        "full_stock_name": "BALRAMPUR CHINI MILLS LTD"
    },
    "NSE:BALUFORGE-EQ": {
        "stock_name": "NSE:BALUFORGE-EQ",
        "full_stock_name": "BALU FORGE INDUSTRIES LTD"
    },
    "NSE:BANARBEADS-EQ": {
        "stock_name": "NSE:BANARBEADS-EQ",
        "full_stock_name": "BANARAS BEADS LTD"
    },
    "NSE:BANARISUG-EQ": {
        "stock_name": "NSE:BANARISUG-EQ",
        "full_stock_name": "BANNARI AMMAN SUGARS LTD"
    },
    "NSE:BANCOINDIA-EQ": {
        "stock_name": "NSE:BANCOINDIA-EQ",
        "full_stock_name": "BANCO PRODUCTS (I) LTD"
    },
    "NSE:BANDHANBNK-EQ": {
        "stock_name": "NSE:BANDHANBNK-EQ",
        "full_stock_name": "BANDHAN BANK LIMITED"
    },
    "NSE:BANG-EQ": {
        "stock_name": "NSE:BANG-EQ",
        "full_stock_name": "BANG OVERSEAS LTD."
    },
    "NSE:BANKA-EQ": {
        "stock_name": "NSE:BANKA-EQ",
        "full_stock_name": "BANKA BIOLOO LIMITED"
    },
    "NSE:BANKADD-EQ": {
        "stock_name": "NSE:BANKADD-EQ",
        "full_stock_name": "DSPAMC - DSPBANK"
    },
    "NSE:BANKBARODA-EQ": {
        "stock_name": "NSE:BANKBARODA-EQ",
        "full_stock_name": "BANK OF BARODA"
    },
    "NSE:BANKBEES-EQ": {
        "stock_name": "NSE:BANKBEES-EQ",
        "full_stock_name": "NIP IND ETF BANK BEES"
    },
    "NSE:BANKBETA-EQ": {
        "stock_name": "NSE:BANKBETA-EQ",
        "full_stock_name": "UTIAMC-BANKBETA"
    },
    "NSE:BANKINDIA-EQ": {
        "stock_name": "NSE:BANKINDIA-EQ",
        "full_stock_name": "BANK OF INDIA"
    },
    "NSE:BANKPSU-EQ": {
        "stock_name": "NSE:BANKPSU-EQ",
        "full_stock_name": "MIRAEAMC - BANKPSU"
    },
    "NSE:BANSALWIRE-EQ": {
        "stock_name": "NSE:BANSALWIRE-EQ",
        "full_stock_name": "BANSAL WIRE INDUSTRIES L"
    },
    "NSE:BANSWRAS-EQ": {
        "stock_name": "NSE:BANSWRAS-EQ",
        "full_stock_name": "BANSWARA SYNTEX LIMITED"
    },
    "NSE:BASF-EQ": {
        "stock_name": "NSE:BASF-EQ",
        "full_stock_name": "BASF INDIA LTD"
    },
    "NSE:BASML-EQ": {
        "stock_name": "NSE:BASML-EQ",
        "full_stock_name": "BANNARI AM SPIN MILL LTD."
    },
    "NSE:BATAINDIA-EQ": {
        "stock_name": "NSE:BATAINDIA-EQ",
        "full_stock_name": "BATA INDIA LTD"
    },
    "NSE:BAYERCROP-EQ": {
        "stock_name": "NSE:BAYERCROP-EQ",
        "full_stock_name": "BAYER CROPSCIENCE LTD"
    },
    "NSE:BBL-EQ": {
        "stock_name": "NSE:BBL-EQ",
        "full_stock_name": "BHARAT BIJLEE LTD"
    },
    "NSE:BBNPPGOLD-EQ": {
        "stock_name": "NSE:BBNPPGOLD-EQ",
        "full_stock_name": "BARODABNP - BBNPPGOLD"
    },
    "NSE:BBOX-EQ": {
        "stock_name": "NSE:BBOX-EQ",
        "full_stock_name": "BLACK BOX LIMITED"
    },
    "NSE:BBTC-EQ": {
        "stock_name": "NSE:BBTC-EQ",
        "full_stock_name": "BOMBAY BURMAH TRADING COR"
    },
    "NSE:BBTCL-EQ": {
        "stock_name": "NSE:BBTCL-EQ",
        "full_stock_name": "B&B TRIPLEWALL CONT LTD"
    },
    "NSE:BCG-EQ": {
        "stock_name": "NSE:BCG-EQ",
        "full_stock_name": "BRIGHTCOM GROUP LIMITED"
    },
    "NSE:BCLIND-EQ": {
        "stock_name": "NSE:BCLIND-EQ",
        "full_stock_name": "BCL INDUSTRIES LIMITED"
    },
    "NSE:BCONCEPTS-EQ": {
        "stock_name": "NSE:BCONCEPTS-EQ",
        "full_stock_name": "BRAND CONCEPTS LIMITED"
    },
    "NSE:BDL-EQ": {
        "stock_name": "NSE:BDL-EQ",
        "full_stock_name": "BHARAT DYNAMICS LIMITED"
    },
    "NSE:BEARDSELL-EQ": {
        "stock_name": "NSE:BEARDSELL-EQ",
        "full_stock_name": "BEARDSELL LIMITED"
    },
    "NSE:BECTORFOOD-EQ": {
        "stock_name": "NSE:BECTORFOOD-EQ",
        "full_stock_name": "MRS BECTORS FOOD SPE LTD"
    },
    "NSE:BEDMUTHA-EQ": {
        "stock_name": "NSE:BEDMUTHA-EQ",
        "full_stock_name": "BEDMUTHA INDUST LTD"
    },
    "NSE:BEL-EQ": {
        "stock_name": "NSE:BEL-EQ",
        "full_stock_name": "BHARAT ELECTRONICS LTD"
    },
    "NSE:BELLACASA-EQ": {
        "stock_name": "NSE:BELLACASA-EQ",
        "full_stock_name": "BELLA CASA FASH AND RET L"
    },
    "NSE:BELRISE-EQ": {
        "stock_name": "NSE:BELRISE-EQ",
        "full_stock_name": "BELRISE INDUSTRIES LTD"
    },
    "NSE:BEML-EQ": {
        "stock_name": "NSE:BEML-EQ",
        "full_stock_name": "BEML LIMITED"
    },
    "NSE:BEPL-EQ": {
        "stock_name": "NSE:BEPL-EQ",
        "full_stock_name": "BHANSALI ENG. POLYMERS LT"
    },
    "NSE:BERGEPAINT-EQ": {
        "stock_name": "NSE:BERGEPAINT-EQ",
        "full_stock_name": "BERGER PAINTS (I) LTD"
    },
    "NSE:BESTAGRO-BE": {
        "stock_name": "NSE:BESTAGRO-BE",
        "full_stock_name": "BEST AGROLIFE LIMITED"
    },
    "NSE:BETA-EQ": {
        "stock_name": "NSE:BETA-EQ",
        "full_stock_name": "BETA DRUGS LIMITED"
    },
    "NSE:BFINVEST-EQ": {
        "stock_name": "NSE:BFINVEST-EQ",
        "full_stock_name": "BF INVESTMENT LIMITED"
    },
    "NSE:BFSI-EQ": {
        "stock_name": "NSE:BFSI-EQ",
        "full_stock_name": "MIRAEAMC - MAFSETF"
    },
    "NSE:BFUTILITIE-BZ": {
        "stock_name": "NSE:BFUTILITIE-BZ",
        "full_stock_name": "BF UTILITIES LIMITED"
    },
    "NSE:BGRENERGY-EQ": {
        "stock_name": "NSE:BGRENERGY-EQ",
        "full_stock_name": "BGR ENERGY SYSTEMS LTD"
    },
    "NSE:BHAGCHEM-EQ": {
        "stock_name": "NSE:BHAGCHEM-EQ",
        "full_stock_name": "BHAGIRADHA CHEM & INDS L"
    },
    "NSE:BHAGERIA-EQ": {
        "stock_name": "NSE:BHAGERIA-EQ",
        "full_stock_name": "BHAGERIA INDUSTRIES LTD"
    },
    "NSE:BHAGYANGR-BE": {
        "stock_name": "NSE:BHAGYANGR-BE",
        "full_stock_name": "BHAGYANAGAR INDIA LIMITED"
    },
    "NSE:BHANDARI-EQ": {
        "stock_name": "NSE:BHANDARI-EQ",
        "full_stock_name": "BHANDARI HOSIERY EXP LTD"
    },
    "NSE:BHARATCOAL-EQ": {
        "stock_name": "NSE:BHARATCOAL-EQ",
        "full_stock_name": "BHARAT COKING COAL LTD"
    },
    "NSE:BHARATFORG-EQ": {
        "stock_name": "NSE:BHARATFORG-EQ",
        "full_stock_name": "BHARAT FORGE LTD"
    },
    "NSE:BHARATGEAR-EQ": {
        "stock_name": "NSE:BHARATGEAR-EQ",
        "full_stock_name": "BHARAT GEARS LTD."
    },
    "NSE:BHARATRAS-EQ": {
        "stock_name": "NSE:BHARATRAS-EQ",
        "full_stock_name": "BHARAT RASAYAN LTD"
    },
    "NSE:BHARATSE-EQ": {
        "stock_name": "NSE:BHARATSE-EQ",
        "full_stock_name": "BHARAT SEATS LIMITED"
    },
    "NSE:BHARATWIRE-EQ": {
        "stock_name": "NSE:BHARATWIRE-EQ",
        "full_stock_name": "BHARAT WIRE ROPES LTD."
    },
    "NSE:BHARTIARTL-EQ": {
        "stock_name": "NSE:BHARTIARTL-EQ",
        "full_stock_name": "BHARTI AIRTEL LIMITED"
    },
    "NSE:BHARTIHEXA-EQ": {
        "stock_name": "NSE:BHARTIHEXA-EQ",
        "full_stock_name": "BHARTI HEXACOM LIMITED"
    },
    "NSE:BHEL-EQ": {
        "stock_name": "NSE:BHEL-EQ",
        "full_stock_name": "BHEL"
    },
    "NSE:BIGBLOC-EQ": {
        "stock_name": "NSE:BIGBLOC-EQ",
        "full_stock_name": "BIGBLOC CONSTRUCTION LTD"
    },
    "NSE:BIKAJI-EQ": {
        "stock_name": "NSE:BIKAJI-EQ",
        "full_stock_name": "BIKAJI FOODS INTERN LTD"
    },
    "NSE:BIL-EQ": {
        "stock_name": "NSE:BIL-EQ",
        "full_stock_name": "BHARTIYA INTERNATIONAL"
    },
    "NSE:BILVYAPAR-BE": {
        "stock_name": "NSE:BILVYAPAR-BE",
        "full_stock_name": "BIL VYAPAR LIMITED"
    },
    "NSE:BIOCON-EQ": {
        "stock_name": "NSE:BIOCON-EQ",
        "full_stock_name": "BIOCON LIMITED."
    },
    "NSE:BIOFILCHEM-EQ": {
        "stock_name": "NSE:BIOFILCHEM-EQ",
        "full_stock_name": "BIOFIL CHEM & PHARMA LTD"
    },
    "NSE:BIRLACABLE-EQ": {
        "stock_name": "NSE:BIRLACABLE-EQ",
        "full_stock_name": "BIRLA CABLE LIMITED"
    },
    "NSE:BIRLACORPN-EQ": {
        "stock_name": "NSE:BIRLACORPN-EQ",
        "full_stock_name": "BIRLA CORPORATION LTD"
    },
    "NSE:BIRLAMONEY-EQ": {
        "stock_name": "NSE:BIRLAMONEY-EQ",
        "full_stock_name": "ADITYA BIRLA MONEY LTD"
    },
    "NSE:BIRLANU-EQ": {
        "stock_name": "NSE:BIRLANU-EQ",
        "full_stock_name": "BIRLANU LIMITED"
    },
    "NSE:BLACKBUCK-EQ": {
        "stock_name": "NSE:BLACKBUCK-EQ",
        "full_stock_name": "BLACKBUCK LIMITED"
    },
    "NSE:BLAL-EQ": {
        "stock_name": "NSE:BLAL-EQ",
        "full_stock_name": "BEML LAND ASSETS LIMITED"
    },
    "NSE:BLBLIMITED-EQ": {
        "stock_name": "NSE:BLBLIMITED-EQ",
        "full_stock_name": "BLB LIMITED"
    },
    "NSE:BLISSGVS-EQ": {
        "stock_name": "NSE:BLISSGVS-EQ",
        "full_stock_name": "BLISS GVS PHARMA LTD"
    },
    "NSE:BLKASHYAP-EQ": {
        "stock_name": "NSE:BLKASHYAP-EQ",
        "full_stock_name": "B.L.KASHYAP & SON LTD"
    },
    "NSE:BLS-EQ": {
        "stock_name": "NSE:BLS-EQ",
        "full_stock_name": "BLS INTL SERVS LTD"
    },
    "NSE:BLSE-EQ": {
        "stock_name": "NSE:BLSE-EQ",
        "full_stock_name": "BLS E-SERVICES LIMITED"
    },
    "NSE:BLUECHIP-BE": {
        "stock_name": "NSE:BLUECHIP-BE",
        "full_stock_name": "BLUE CHIP INDIA LIMITED"
    },
    "NSE:BLUECOAST-EQ": {
        "stock_name": "NSE:BLUECOAST-EQ",
        "full_stock_name": "BLUE COAST HOTELS LIMITED"
    },
    "NSE:BLUEDART-EQ": {
        "stock_name": "NSE:BLUEDART-EQ",
        "full_stock_name": "BLUE DART EXPRESS LTD"
    },
    "NSE:BLUEJET-EQ": {
        "stock_name": "NSE:BLUEJET-EQ",
        "full_stock_name": "BLUE JET HEALTHCARE LTD"
    },
    "NSE:BLUESTARCO-EQ": {
        "stock_name": "NSE:BLUESTARCO-EQ",
        "full_stock_name": "BLUE STAR LIMITED"
    },
    "NSE:BLUESTONE-EQ": {
        "stock_name": "NSE:BLUESTONE-EQ",
        "full_stock_name": "BLUESTONE JEWEL LFSTL LTD"
    },
    "NSE:BLUSPRING-EQ": {
        "stock_name": "NSE:BLUSPRING-EQ",
        "full_stock_name": "BLUSPRING ENTERPRISES LTD"
    },
    "NSE:BMWVENTLTD-EQ": {
        "stock_name": "NSE:BMWVENTLTD-EQ",
        "full_stock_name": "BMW VENTURES LIMITED"
    },
    "NSE:BODALCHEM-EQ": {
        "stock_name": "NSE:BODALCHEM-EQ",
        "full_stock_name": "BODAL CHEMICALS LTD"
    },
    "NSE:BOHRAIND-EQ": {
        "stock_name": "NSE:BOHRAIND-EQ",
        "full_stock_name": "BOHRA INDUSTRIES LIMITED"
    },
    "NSE:BOMDYEING-EQ": {
        "stock_name": "NSE:BOMDYEING-EQ",
        "full_stock_name": "BOMBAY DYEING & MFG. CO L"
    },
    "NSE:BORANA-BE": {
        "stock_name": "NSE:BORANA-BE",
        "full_stock_name": "BORANA WEAVES LIMITED"
    },
    "NSE:BOROLTD-EQ": {
        "stock_name": "NSE:BOROLTD-EQ",
        "full_stock_name": "BOROSIL LIMITED"
    },
    "NSE:BORORENEW-EQ": {
        "stock_name": "NSE:BORORENEW-EQ",
        "full_stock_name": "BOROSIL RENEWABLES LTD"
    },
    "NSE:BOROSCI-EQ": {
        "stock_name": "NSE:BOROSCI-EQ",
        "full_stock_name": "BOROSIL SCIENTIFIC LTD"
    },
    "NSE:BOSCHLTD-EQ": {
        "stock_name": "NSE:BOSCHLTD-EQ",
        "full_stock_name": "BOSCH LIMITED"
    },
    "NSE:BPCL-EQ": {
        "stock_name": "NSE:BPCL-EQ",
        "full_stock_name": "BHARAT PETROLEUM CORP  LT"
    },
    "NSE:BPL-EQ": {
        "stock_name": "NSE:BPL-EQ",
        "full_stock_name": "BPL LTD"
    },
    "NSE:BRIGADE-EQ": {
        "stock_name": "NSE:BRIGADE-EQ",
        "full_stock_name": "BRIGADE ENTER. LTD"
    },
    "NSE:BRIGHOTEL-EQ": {
        "stock_name": "NSE:BRIGHOTEL-EQ",
        "full_stock_name": "BRIGADE HOTEL VENTURE LTD"
    },
    "NSE:BRITANNIA-EQ": {
        "stock_name": "NSE:BRITANNIA-EQ",
        "full_stock_name": "BRITANNIA INDUSTRIES LTD"
    },
    "NSE:BRNL-EQ": {
        "stock_name": "NSE:BRNL-EQ",
        "full_stock_name": "BHARAT ROAD NETWORK LTD"
    },
    "NSE:BROOKS-EQ": {
        "stock_name": "NSE:BROOKS-EQ",
        "full_stock_name": "BROOKS LAB LIMITED"
    },
    "NSE:BSE-EQ": {
        "stock_name": "NSE:BSE-EQ",
        "full_stock_name": "BSE LIMITED"
    },
    "NSE:BSHSL-EQ": {
        "stock_name": "NSE:BSHSL-EQ",
        "full_stock_name": "BOMBAY SUPER HYBRID SEEDS"
    },
    "NSE:BSL-EQ": {
        "stock_name": "NSE:BSL-EQ",
        "full_stock_name": "BSL LTD"
    },
    "NSE:BSOFT-EQ": {
        "stock_name": "NSE:BSOFT-EQ",
        "full_stock_name": "BIRLASOFT LIMITED"
    },
    "NSE:BTML-EQ": {
        "stock_name": "NSE:BTML-EQ",
        "full_stock_name": "BODHI TREE MULTIMEDIA LTD"
    },
    "NSE:BUILDPRO-EQ": {
        "stock_name": "NSE:BUILDPRO-EQ",
        "full_stock_name": "SHANKARA BUILDPRO LIMITED"
    },
    "NSE:BUTTERFLY-EQ": {
        "stock_name": "NSE:BUTTERFLY-EQ",
        "full_stock_name": "BTRFLY GANDHI APPL LTD"
    },
    "NSE:BVCL-EQ": {
        "stock_name": "NSE:BVCL-EQ",
        "full_stock_name": "BARAK VALLEY CEM. LTD."
    },
    "NSE:BYKE-EQ": {
        "stock_name": "NSE:BYKE-EQ",
        "full_stock_name": "THE BYKE HOSPITALITY LTD"
    },
    "NSE:CALSOFT-EQ": {
        "stock_name": "NSE:CALSOFT-EQ",
        "full_stock_name": "CALIFORNIA SOFTWARE CO LT"
    },
    "NSE:CAMLINFINE-EQ": {
        "stock_name": "NSE:CAMLINFINE-EQ",
        "full_stock_name": "CAMLIN FINE SCIENCES LTD"
    },
    "NSE:CAMPUS-EQ": {
        "stock_name": "NSE:CAMPUS-EQ",
        "full_stock_name": "CAMPUS ACTIVEWEAR LIMITED"
    },
    "NSE:CAMS-EQ": {
        "stock_name": "NSE:CAMS-EQ",
        "full_stock_name": "COMPUTER AGE MNGT SER LTD"
    },
    "NSE:CANBK-EQ": {
        "stock_name": "NSE:CANBK-EQ",
        "full_stock_name": "CANARA BANK"
    },
    "NSE:CANFINHOME-EQ": {
        "stock_name": "NSE:CANFINHOME-EQ",
        "full_stock_name": "CAN FIN HOMES LTD"
    },
    "NSE:CANHLIFE-EQ": {
        "stock_name": "NSE:CANHLIFE-EQ",
        "full_stock_name": "CANARA HSBC LIFE INS CO L"
    },
    "NSE:CANTABIL-EQ": {
        "stock_name": "NSE:CANTABIL-EQ",
        "full_stock_name": "CANTABIL RETAIL LTD"
    },
    "NSE:CAPACITE-EQ": {
        "stock_name": "NSE:CAPACITE-EQ",
        "full_stock_name": "CAPACITE INFRAPROJECT LTD"
    },
    "NSE:CAPILLARY-EQ": {
        "stock_name": "NSE:CAPILLARY-EQ",
        "full_stock_name": "CAPILLARY TECHNO INDIA L"
    },
    "NSE:CAPITALSFB-EQ": {
        "stock_name": "NSE:CAPITALSFB-EQ",
        "full_stock_name": "CAPITAL SMALL FIN BANK L"
    },
    "NSE:CAPLIPOINT-EQ": {
        "stock_name": "NSE:CAPLIPOINT-EQ",
        "full_stock_name": "CAPLIN POINT LAB LTD."
    },
    "NSE:CAPTRUST-EQ": {
        "stock_name": "NSE:CAPTRUST-EQ",
        "full_stock_name": "CAPITAL TRUST LIMITED"
    },
    "NSE:CARBORUNIV-EQ": {
        "stock_name": "NSE:CARBORUNIV-EQ",
        "full_stock_name": "CARBORUNDUM UNIVERSAL LTD"
    },
    "NSE:CARERATING-EQ": {
        "stock_name": "NSE:CARERATING-EQ",
        "full_stock_name": "CARE RATINGS LIMITED"
    },
    "NSE:CARRARO-EQ": {
        "stock_name": "NSE:CARRARO-EQ",
        "full_stock_name": "CARRARO INDIA LIMITED"
    },
    "NSE:CARTRADE-EQ": {
        "stock_name": "NSE:CARTRADE-EQ",
        "full_stock_name": "CARTRADE TECH LIMITED"
    },
    "NSE:CARYSIL-EQ": {
        "stock_name": "NSE:CARYSIL-EQ",
        "full_stock_name": "CARYSIL LIMITED"
    },
    "NSE:CASTROLIND-EQ": {
        "stock_name": "NSE:CASTROLIND-EQ",
        "full_stock_name": "CASTROL INDIA LIMITED"
    },
    "NSE:CCCL-BE": {
        "stock_name": "NSE:CCCL-BE",
        "full_stock_name": "CONS. CONST. CONSORT LTD"
    },
    "NSE:CCHHL-EQ": {
        "stock_name": "NSE:CCHHL-EQ",
        "full_stock_name": "COUNTRY CLUB HOSP HOL LTD"
    },
    "NSE:CCL-EQ": {
        "stock_name": "NSE:CCL-EQ",
        "full_stock_name": "CCL PRODUCTS (I) LTD"
    },
    "NSE:CDSL-EQ": {
        "stock_name": "NSE:CDSL-EQ",
        "full_stock_name": "CENTRAL DEPO SER (I) LTD"
    },
    "NSE:CEATLTD-EQ": {
        "stock_name": "NSE:CEATLTD-EQ",
        "full_stock_name": "CEAT LIMITED"
    },
    "NSE:CEIGALL-EQ": {
        "stock_name": "NSE:CEIGALL-EQ",
        "full_stock_name": "CEIGALL INDIA LIMITED"
    },
    "NSE:CELEBRITY-EQ": {
        "stock_name": "NSE:CELEBRITY-EQ",
        "full_stock_name": "CELEBRITY FASHIONS LTD"
    },
    "NSE:CELLO-EQ": {
        "stock_name": "NSE:CELLO-EQ",
        "full_stock_name": "CELLO WORLD LIMITED"
    },
    "NSE:CEMPRO-EQ": {
        "stock_name": "NSE:CEMPRO-EQ",
        "full_stock_name": "CEMINDIA PROJECTS LIMITED"
    },
    "NSE:CENTENKA-EQ": {
        "stock_name": "NSE:CENTENKA-EQ",
        "full_stock_name": "CENTURY ENKA LTD"
    },
    "NSE:CENTEXT-EQ": {
        "stock_name": "NSE:CENTEXT-EQ",
        "full_stock_name": "CENTURY EXTRUSIONS LTD"
    },
    "NSE:CENTRALBK-EQ": {
        "stock_name": "NSE:CENTRALBK-EQ",
        "full_stock_name": "CENTRAL BANK OF INDIA"
    },
    "NSE:CENTRUM-EQ": {
        "stock_name": "NSE:CENTRUM-EQ",
        "full_stock_name": "CENTRUM CAPITAL LIMITED"
    },
    "NSE:CENTUM-EQ": {
        "stock_name": "NSE:CENTUM-EQ",
        "full_stock_name": "CENTUM ELECTRONICS LTD"
    },
    "NSE:CENTURYPLY-EQ": {
        "stock_name": "NSE:CENTURYPLY-EQ",
        "full_stock_name": "CENTURY PLYBOARDS (I) LTD"
    },
    "NSE:CERA-EQ": {
        "stock_name": "NSE:CERA-EQ",
        "full_stock_name": "CERA SANITARYWARE LTD"
    },
    "NSE:CEREBRAINT-BZ": {
        "stock_name": "NSE:CEREBRAINT-BZ",
        "full_stock_name": "CEREBRA INT TECH LTD"
    },
    "NSE:CESC-EQ": {
        "stock_name": "NSE:CESC-EQ",
        "full_stock_name": "CESC LTD"
    },
    "NSE:CEWATER-EQ": {
        "stock_name": "NSE:CEWATER-EQ",
        "full_stock_name": "CONCORD ENVIRO SYSTEMS L"
    },
    "NSE:CGCL-EQ": {
        "stock_name": "NSE:CGCL-EQ",
        "full_stock_name": "CAPRI GLOBAL CAPITAL LTD"
    },
    "NSE:CGPOWER-EQ": {
        "stock_name": "NSE:CGPOWER-EQ",
        "full_stock_name": "CG POWER AND IND SOL LTD"
    },
    "NSE:CHALET-EQ": {
        "stock_name": "NSE:CHALET-EQ",
        "full_stock_name": "CHALET HOTELS LIMITED"
    },
    "NSE:CHAMBLFERT-EQ": {
        "stock_name": "NSE:CHAMBLFERT-EQ",
        "full_stock_name": "CHAMBAL FERTILIZERS LTD"
    },
    "NSE:CHEMBOND-EQ": {
        "stock_name": "NSE:CHEMBOND-EQ",
        "full_stock_name": "CHEMBOND MATERIALTECH LTD"
    },
    "NSE:CHEMBONDCH-EQ": {
        "stock_name": "NSE:CHEMBONDCH-EQ",
        "full_stock_name": "CHEMBOND CHEMICAL LIMITED"
    },
    "NSE:CHEMCON-EQ": {
        "stock_name": "NSE:CHEMCON-EQ",
        "full_stock_name": "CHEMCON SPECIAL CHEM LTD"
    },
    "NSE:CHEMFAB-EQ": {
        "stock_name": "NSE:CHEMFAB-EQ",
        "full_stock_name": "CHEMFAB ALKALIS LIMITED"
    },
    "NSE:CHEMICAL-EQ": {
        "stock_name": "NSE:CHEMICAL-EQ",
        "full_stock_name": "KOTAKMAMC - CHEMICAL"
    },
    "NSE:CHEMPLASTS-EQ": {
        "stock_name": "NSE:CHEMPLASTS-EQ",
        "full_stock_name": "CHEMPLAST SANMAR LIMITED"
    },
    "NSE:CHENNPETRO-EQ": {
        "stock_name": "NSE:CHENNPETRO-EQ",
        "full_stock_name": "CHENNAI PETROLEUM CORP LT"
    },
    "NSE:CHEVIOT-EQ": {
        "stock_name": "NSE:CHEVIOT-EQ",
        "full_stock_name": "CHEVIOT COMPANY LIMITED"
    },
    "NSE:CHOICEGOLD-EQ": {
        "stock_name": "NSE:CHOICEGOLD-EQ",
        "full_stock_name": "CHOICEAMC - CHOICEGOLD"
    },
    "NSE:CHOICEIN-EQ": {
        "stock_name": "NSE:CHOICEIN-EQ",
        "full_stock_name": "CHOICE INTERNATIONAL LTD"
    },
    "NSE:CHOLAFIN-EQ": {
        "stock_name": "NSE:CHOLAFIN-EQ",
        "full_stock_name": "CHOLAMANDALAM IN & FIN CO"
    },
    "NSE:CHOLAHLDNG-EQ": {
        "stock_name": "NSE:CHOLAHLDNG-EQ",
        "full_stock_name": "CHOLAMANDALAM FIN HOL LTD"
    },
    "NSE:CIEINDIA-EQ": {
        "stock_name": "NSE:CIEINDIA-EQ",
        "full_stock_name": "CIE AUTOMOTIVE INDIA LTD"
    },
    "NSE:CIFL-EQ": {
        "stock_name": "NSE:CIFL-EQ",
        "full_stock_name": "CAPITAL INDIA FINANCE LTD"
    },
    "NSE:CIGNITITEC-EQ": {
        "stock_name": "NSE:CIGNITITEC-EQ",
        "full_stock_name": "CIGNITI TECHNOLOGIES LTD"
    },
    "NSE:CINELINE-EQ": {
        "stock_name": "NSE:CINELINE-EQ",
        "full_stock_name": "CINELINE INDIA LIMITED"
    },
    "NSE:CINEVISTA-EQ": {
        "stock_name": "NSE:CINEVISTA-EQ",
        "full_stock_name": "CINEVISTA LIMITED"
    },
    "NSE:CIPLA-EQ": {
        "stock_name": "NSE:CIPLA-EQ",
        "full_stock_name": "CIPLA LTD"
    },
    "NSE:CLEAN-EQ": {
        "stock_name": "NSE:CLEAN-EQ",
        "full_stock_name": "CLEAN SCIENCE & TECH LTD"
    },
    "NSE:CLEDUCATE-EQ": {
        "stock_name": "NSE:CLEDUCATE-EQ",
        "full_stock_name": "CL EDUCATE LIMITED"
    },
    "NSE:CLSEL-EQ": {
        "stock_name": "NSE:CLSEL-EQ",
        "full_stock_name": "CHAMAN LAL SETIA EXP LTD"
    },
    "NSE:CMSINFO-EQ": {
        "stock_name": "NSE:CMSINFO-EQ",
        "full_stock_name": "CMS INFO SYSTEMS LIMITED"
    },
    "NSE:CNL-EQ": {
        "stock_name": "NSE:CNL-EQ",
        "full_stock_name": "CREATIVE NEWTECH LIMITED"
    },
    "NSE:COALINDIA-EQ": {
        "stock_name": "NSE:COALINDIA-EQ",
        "full_stock_name": "COAL INDIA LTD"
    },
    "NSE:COASTCORP-BE": {
        "stock_name": "NSE:COASTCORP-BE",
        "full_stock_name": "COASTAL CORPORATION LTD"
    },
    "NSE:COCHINSHIP-EQ": {
        "stock_name": "NSE:COCHINSHIP-EQ",
        "full_stock_name": "COCHIN SHIPYARD LIMITED"
    },
    "NSE:COFFEEDAY-EQ": {
        "stock_name": "NSE:COFFEEDAY-EQ",
        "full_stock_name": "COFFEE DAY ENTERPRISE LTD"
    },
    "NSE:COFORGE-EQ": {
        "stock_name": "NSE:COFORGE-EQ",
        "full_stock_name": "COFORGE LIMITED"
    },
    "NSE:COHANCE-EQ": {
        "stock_name": "NSE:COHANCE-EQ",
        "full_stock_name": "COHANCE LIFESCIENCES LTD"
    },
    "NSE:COLPAL-EQ": {
        "stock_name": "NSE:COLPAL-EQ",
        "full_stock_name": "COLGATE PALMOLIVE LTD."
    },
    "NSE:COMPINFO-BZ": {
        "stock_name": "NSE:COMPINFO-BZ",
        "full_stock_name": "COMPUAGE INFOCOM LTD"
    },
    "NSE:COMPUSOFT-EQ": {
        "stock_name": "NSE:COMPUSOFT-EQ",
        "full_stock_name": "COMPUCOM SOFTWARE LTD"
    },
    "NSE:COMSYN-BE": {
        "stock_name": "NSE:COMSYN-BE",
        "full_stock_name": "COMMERCIAL SYN BAGS LTD"
    },
    "NSE:CONCOR-EQ": {
        "stock_name": "NSE:CONCOR-EQ",
        "full_stock_name": "CONTAINER CORP OF IND LTD"
    },
    "NSE:CONCORDBIO-EQ": {
        "stock_name": "NSE:CONCORDBIO-EQ",
        "full_stock_name": "CONCORD BIOTECH LIMITED"
    },
    "NSE:CONFIPET-EQ": {
        "stock_name": "NSE:CONFIPET-EQ",
        "full_stock_name": "CONFIDENCE PETRO IND LTD."
    },
    "NSE:CONS-EQ": {
        "stock_name": "NSE:CONS-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKCONS"
    },
    "NSE:CONSOFINVT-EQ": {
        "stock_name": "NSE:CONSOFINVT-EQ",
        "full_stock_name": "CONSO. FIN. & HOLD. LTD."
    },
    "NSE:CONSUMBEES-EQ": {
        "stock_name": "NSE:CONSUMBEES-EQ",
        "full_stock_name": "NIP IND ETF CONSUMPTION"
    },
    "NSE:CONSUMER-EQ": {
        "stock_name": "NSE:CONSUMER-EQ",
        "full_stock_name": "MIRAEAMC - CONSUMER"
    },
    "NSE:CONTROLPR-EQ": {
        "stock_name": "NSE:CONTROLPR-EQ",
        "full_stock_name": "CONTROL PRINT LIMITED"
    },
    "NSE:CORALFINAC-EQ": {
        "stock_name": "NSE:CORALFINAC-EQ",
        "full_stock_name": "CORAL INDIA FIN & HOUS LT"
    },
    "NSE:CORDSCABLE-EQ": {
        "stock_name": "NSE:CORDSCABLE-EQ",
        "full_stock_name": "CORDS CABLE INDUS LTD."
    },
    "NSE:COROMANDEL-EQ": {
        "stock_name": "NSE:COROMANDEL-EQ",
        "full_stock_name": "COROMANDEL INTERNTL. LTD"
    },
    "NSE:CORONA-EQ": {
        "stock_name": "NSE:CORONA-EQ",
        "full_stock_name": "CORONA REMEDIES LIMITED"
    },
    "NSE:COSMOFIRST-EQ": {
        "stock_name": "NSE:COSMOFIRST-EQ",
        "full_stock_name": "COSMO FIRST LIMITED"
    },
    "NSE:COUNCODOS-EQ": {
        "stock_name": "NSE:COUNCODOS-EQ",
        "full_stock_name": "COUNTRY CONDO S LIMITED"
    },
    "NSE:CPCAP-EQ": {
        "stock_name": "NSE:CPCAP-EQ",
        "full_stock_name": "CP CAPITAL LIMITED"
    },
    "NSE:CPEDU-EQ": {
        "stock_name": "NSE:CPEDU-EQ",
        "full_stock_name": "CAREER POINT EDUTECH LTD"
    },
    "NSE:CPPLUS-EQ": {
        "stock_name": "NSE:CPPLUS-EQ",
        "full_stock_name": "ADITYA INFOTECH LIMITED"
    },
    "NSE:CRAFTSMAN-EQ": {
        "stock_name": "NSE:CRAFTSMAN-EQ",
        "full_stock_name": "CRAFTSMAN AUTOMATION LTD"
    },
    "NSE:CRAMC-EQ": {
        "stock_name": "NSE:CRAMC-EQ",
        "full_stock_name": "CANARA ROBECO AMC LIMITED"
    },
    "NSE:CREATIVEYE-EQ": {
        "stock_name": "NSE:CREATIVEYE-EQ",
        "full_stock_name": "CREATIVE EYE LIMITED"
    },
    "NSE:CREDITACC-EQ": {
        "stock_name": "NSE:CREDITACC-EQ",
        "full_stock_name": "CREDITACCESS GRAMEEN LTD"
    },
    "NSE:CREST-EQ": {
        "stock_name": "NSE:CREST-EQ",
        "full_stock_name": "CREST VENTURES LIMITED"
    },
    "NSE:CRISIL-EQ": {
        "stock_name": "NSE:CRISIL-EQ",
        "full_stock_name": "CRISIL LTD"
    },
    "NSE:CRIZAC-EQ": {
        "stock_name": "NSE:CRIZAC-EQ",
        "full_stock_name": "CRIZAC LIMITED"
    },
    "NSE:CROMPTON-EQ": {
        "stock_name": "NSE:CROMPTON-EQ",
        "full_stock_name": "CROMPT GREA CON ELEC LTD"
    },
    "NSE:CROWN-EQ": {
        "stock_name": "NSE:CROWN-EQ",
        "full_stock_name": "CROWN LIFTERS LIMITED"
    },
    "NSE:CSBBANK-EQ": {
        "stock_name": "NSE:CSBBANK-EQ",
        "full_stock_name": "CSB BANK LIMITED"
    },
    "NSE:CSLFINANCE-EQ": {
        "stock_name": "NSE:CSLFINANCE-EQ",
        "full_stock_name": "CSL FINANCE LIMITED"
    },
    "NSE:CTE-EQ": {
        "stock_name": "NSE:CTE-EQ",
        "full_stock_name": "CAMBRIDGE TECH ENTER LTD"
    },
    "NSE:CUB-EQ": {
        "stock_name": "NSE:CUB-EQ",
        "full_stock_name": "CITY UNION BANK LTD"
    },
    "NSE:CUBEXTUB-EQ": {
        "stock_name": "NSE:CUBEXTUB-EQ",
        "full_stock_name": "CUBEX TUBINGS LTD"
    },
    "NSE:CUMMINSIND-EQ": {
        "stock_name": "NSE:CUMMINSIND-EQ",
        "full_stock_name": "CUMMINS INDIA LTD"
    },
    "NSE:CUPID-EQ": {
        "stock_name": "NSE:CUPID-EQ",
        "full_stock_name": "CUPID LIMITED"
    },
    "NSE:CURAA-BE": {
        "stock_name": "NSE:CURAA-BE",
        "full_stock_name": "CURA TECHNOLOGIES LIMITED"
    },
    "NSE:CYBERMEDIA-EQ": {
        "stock_name": "NSE:CYBERMEDIA-EQ",
        "full_stock_name": "CYBER MEDIA (INDIA) LTD."
    },
    "NSE:CYBERTECH-EQ": {
        "stock_name": "NSE:CYBERTECH-EQ",
        "full_stock_name": "CYBERTECH SYSTEMS & SOFTW"
    },
    "NSE:CYIENT-EQ": {
        "stock_name": "NSE:CYIENT-EQ",
        "full_stock_name": "CYIENT LIMITED"
    },
    "NSE:CYIENTDLM-EQ": {
        "stock_name": "NSE:CYIENTDLM-EQ",
        "full_stock_name": "CYIENT DLM LIMITED"
    },
    "NSE:DABUR-EQ": {
        "stock_name": "NSE:DABUR-EQ",
        "full_stock_name": "DABUR INDIA LTD"
    },
    "NSE:DALBHARAT-EQ": {
        "stock_name": "NSE:DALBHARAT-EQ",
        "full_stock_name": "DALMIA BHARAT LIMITED"
    },
    "NSE:DALMIASUG-EQ": {
        "stock_name": "NSE:DALMIASUG-EQ",
        "full_stock_name": "DALMIA BHARAT SUG IN LTD"
    },
    "NSE:DAMCAPITAL-EQ": {
        "stock_name": "NSE:DAMCAPITAL-EQ",
        "full_stock_name": "DAM CAPITAL ADVISORS LTD"
    },
    "NSE:DAMODARIND-EQ": {
        "stock_name": "NSE:DAMODARIND-EQ",
        "full_stock_name": "DAMODAR INDUSTRIES LTD"
    },
    "NSE:DANGEE-EQ": {
        "stock_name": "NSE:DANGEE-EQ",
        "full_stock_name": "DANGEE DUMS LIMITED"
    },
    "NSE:DATAMATICS-EQ": {
        "stock_name": "NSE:DATAMATICS-EQ",
        "full_stock_name": "DATAMATICS GLOBAL SER LTD"
    },
    "NSE:DATAPATTNS-EQ": {
        "stock_name": "NSE:DATAPATTNS-EQ",
        "full_stock_name": "DATA PATTERNS INDIA LTD"
    },
    "NSE:DAVANGERE-EQ": {
        "stock_name": "NSE:DAVANGERE-EQ",
        "full_stock_name": "DAVANGERE SUGAR COMPANY L"
    },
    "NSE:DBCORP-EQ": {
        "stock_name": "NSE:DBCORP-EQ",
        "full_stock_name": "D.B.CORP LTD"
    },
    "NSE:DBEIL-EQ": {
        "stock_name": "NSE:DBEIL-EQ",
        "full_stock_name": "DEEPAK BUILDERS & ENG I L"
    },
    "NSE:DBL-EQ": {
        "stock_name": "NSE:DBL-EQ",
        "full_stock_name": "DILIP BUILDCON LIMITED"
    },
    "NSE:DBOL-EQ": {
        "stock_name": "NSE:DBOL-EQ",
        "full_stock_name": "DHAMPUR BIO ORGANICS LTD"
    },
    "NSE:DBREALTY-EQ": {
        "stock_name": "NSE:DBREALTY-EQ",
        "full_stock_name": "VALOR ESTATE LIMITED"
    },
    "NSE:DBSTOCKBRO-EQ": {
        "stock_name": "NSE:DBSTOCKBRO-EQ",
        "full_stock_name": "DB (INT) STOCK BROKERS"
    },
    "NSE:DCAL-EQ": {
        "stock_name": "NSE:DCAL-EQ",
        "full_stock_name": "DISHMAN CARBO AMCIS LTD"
    },
    "NSE:DCBBANK-EQ": {
        "stock_name": "NSE:DCBBANK-EQ",
        "full_stock_name": "DCB BANK LIMITED"
    },
    "NSE:DCI-EQ": {
        "stock_name": "NSE:DCI-EQ",
        "full_stock_name": "DC INFOTECH AND COMUN LTD"
    },
    "NSE:DCM-EQ": {
        "stock_name": "NSE:DCM-EQ",
        "full_stock_name": "DCM LTD"
    },
    "NSE:DCMFINSERV-EQ": {
        "stock_name": "NSE:DCMFINSERV-EQ",
        "full_stock_name": "DCM FINANCIAL SERVICES LT"
    },
    "NSE:DCMNVL-EQ": {
        "stock_name": "NSE:DCMNVL-EQ",
        "full_stock_name": "DCM NOUVELLE LIMITED"
    },
    "NSE:DCMSHRIRAM-EQ": {
        "stock_name": "NSE:DCMSHRIRAM-EQ",
        "full_stock_name": "DCM SHRIRAM LIMITED"
    },
    "NSE:DCMSRIND-EQ": {
        "stock_name": "NSE:DCMSRIND-EQ",
        "full_stock_name": "DCM SHRIRAM IND LTD"
    },
    "NSE:DCW-EQ": {
        "stock_name": "NSE:DCW-EQ",
        "full_stock_name": "DCW LTD"
    },
    "NSE:DCXINDIA-EQ": {
        "stock_name": "NSE:DCXINDIA-EQ",
        "full_stock_name": "DCX SYSTEMS LIMITED"
    },
    "NSE:DDEVPLSTIK-EQ": {
        "stock_name": "NSE:DDEVPLSTIK-EQ",
        "full_stock_name": "DDEV PLASTIKS IND LTD"
    },
    "NSE:DECCANCE-EQ": {
        "stock_name": "NSE:DECCANCE-EQ",
        "full_stock_name": "DECCAN CEMENTS LIMITED"
    },
    "NSE:DEEDEV-EQ": {
        "stock_name": "NSE:DEEDEV-EQ",
        "full_stock_name": "DEE DEVELOPMENT ENG LTD"
    },
    "NSE:DEEPAKFERT-EQ": {
        "stock_name": "NSE:DEEPAKFERT-EQ",
        "full_stock_name": "DEEPAK FERTILIZERS & PETR"
    },
    "NSE:DEEPAKNTR-EQ": {
        "stock_name": "NSE:DEEPAKNTR-EQ",
        "full_stock_name": "DEEPAK NITRITE LTD"
    },
    "NSE:DEEPINDS-EQ": {
        "stock_name": "NSE:DEEPINDS-EQ",
        "full_stock_name": "DEEP INDUSTRIES LIMITED"
    },
    "NSE:DELHIVERY-EQ": {
        "stock_name": "NSE:DELHIVERY-EQ",
        "full_stock_name": "DELHIVERY LIMITED"
    },
    "NSE:DELPHIFX-EQ": {
        "stock_name": "NSE:DELPHIFX-EQ",
        "full_stock_name": "DELPHI WORLD MONEY LTD"
    },
    "NSE:DELTACORP-EQ": {
        "stock_name": "NSE:DELTACORP-EQ",
        "full_stock_name": "DELTA CORP LIMITED"
    },
    "NSE:DELTAMAGNT-EQ": {
        "stock_name": "NSE:DELTAMAGNT-EQ",
        "full_stock_name": "DELTA MANUFACTURING LTD"
    },
    "NSE:DEN-EQ": {
        "stock_name": "NSE:DEN-EQ",
        "full_stock_name": "DEN NETWORKS LTD"
    },
    "NSE:DENORA-EQ": {
        "stock_name": "NSE:DENORA-EQ",
        "full_stock_name": "DE NORA INDIA LIMITED"
    },
    "NSE:DENTA-EQ": {
        "stock_name": "NSE:DENTA-EQ",
        "full_stock_name": "DENTA WATER N INFRA SOL L"
    },
    "NSE:DEVIT-EQ": {
        "stock_name": "NSE:DEVIT-EQ",
        "full_stock_name": "DEV INFO TECHNOLOGY LTD"
    },
    "NSE:DEVX-EQ": {
        "stock_name": "NSE:DEVX-EQ",
        "full_stock_name": "DEV ACCELERATOR LIMITED"
    },
    "NSE:DEVYANI-EQ": {
        "stock_name": "NSE:DEVYANI-EQ",
        "full_stock_name": "DEVYANI INTERNATIONAL LTD"
    },
    "NSE:DGCONTENT-EQ": {
        "stock_name": "NSE:DGCONTENT-EQ",
        "full_stock_name": "DIGICONTENT LIMITED"
    },
    "NSE:DHAMPURSUG-EQ": {
        "stock_name": "NSE:DHAMPURSUG-EQ",
        "full_stock_name": "DHAMPUR SUGAR MILLS LTD."
    },
    "NSE:DHANBANK-EQ": {
        "stock_name": "NSE:DHANBANK-EQ",
        "full_stock_name": "DHANLAXMI BANK LIMITED"
    },
    "NSE:DHANUKA-EQ": {
        "stock_name": "NSE:DHANUKA-EQ",
        "full_stock_name": "DHANUKA AGRITECH LTD"
    },
    "NSE:DHARAN-BZ": {
        "stock_name": "NSE:DHARAN-BZ",
        "full_stock_name": "DHARAN INFRA-EPC LIMITED"
    },
    "NSE:DHARMAJ-EQ": {
        "stock_name": "NSE:DHARMAJ-EQ",
        "full_stock_name": "DHARMAJ CROP GUARD LTD"
    },
    "NSE:DHRUV-EQ": {
        "stock_name": "NSE:DHRUV-EQ",
        "full_stock_name": "DHRUV CONSULTANCY SER LTD"
    },
    "NSE:DHUNINV-EQ": {
        "stock_name": "NSE:DHUNINV-EQ",
        "full_stock_name": "DHUNSERI INVESTMENTS LTD"
    },
    "NSE:DIACABS-EQ": {
        "stock_name": "NSE:DIACABS-EQ",
        "full_stock_name": "DIAMOND POWER INFRA LTD"
    },
    "NSE:DIAMINESQ-EQ": {
        "stock_name": "NSE:DIAMINESQ-EQ",
        "full_stock_name": "DIAMINES & CHEMICALS LTD"
    },
    "NSE:DIAMONDYD-EQ": {
        "stock_name": "NSE:DIAMONDYD-EQ",
        "full_stock_name": "PRATAAP SNACKS LIMITED"
    },
    "NSE:DICIND-EQ": {
        "stock_name": "NSE:DICIND-EQ",
        "full_stock_name": "DIC INDIA LIMITED"
    },
    "NSE:DIFFNKG-EQ": {
        "stock_name": "NSE:DIFFNKG-EQ",
        "full_stock_name": "DIFFUSION ENGINEERS LTD"
    },
    "NSE:DIGIDRIVE-EQ": {
        "stock_name": "NSE:DIGIDRIVE-EQ",
        "full_stock_name": "DIGIDRIVE DISTRIBUTORS L"
    },
    "NSE:DIGISPICE-EQ": {
        "stock_name": "NSE:DIGISPICE-EQ",
        "full_stock_name": "DIGISPICE TECHNOLOGIES LT"
    },
    "NSE:DIGITIDE-EQ": {
        "stock_name": "NSE:DIGITIDE-EQ",
        "full_stock_name": "DIGITIDE SOLUTIONS LTD"
    },
    "NSE:DIGJAMLMTD-EQ": {
        "stock_name": "NSE:DIGJAMLMTD-EQ",
        "full_stock_name": "DIGJAM LTD"
    },
    "NSE:DIL-BZ": {
        "stock_name": "NSE:DIL-BZ",
        "full_stock_name": "DEBOCK INDUSTRIES LIMITED"
    },
    "NSE:DISHTV-EQ": {
        "stock_name": "NSE:DISHTV-EQ",
        "full_stock_name": "DISH TV INDIA LTD."
    },
    "NSE:DIVGIITTS-EQ": {
        "stock_name": "NSE:DIVGIITTS-EQ",
        "full_stock_name": "DIVGI TORQTRANSFER SYST L"
    },
    "NSE:DIVIDEND-EQ": {
        "stock_name": "NSE:DIVIDEND-EQ",
        "full_stock_name": "MIRAEAMC - DIVIDEND"
    },
    "NSE:DIVISLAB-EQ": {
        "stock_name": "NSE:DIVISLAB-EQ",
        "full_stock_name": "DIVI S LABORATORIES LTD"
    },
    "NSE:DIVOPPBEES-EQ": {
        "stock_name": "NSE:DIVOPPBEES-EQ",
        "full_stock_name": "NIP IND ETF DIV OPP"
    },
    "NSE:DIXON-EQ": {
        "stock_name": "NSE:DIXON-EQ",
        "full_stock_name": "DIXON TECHNO (INDIA) LTD"
    },
    "NSE:DJML-EQ": {
        "stock_name": "NSE:DJML-EQ",
        "full_stock_name": "DJ MEDIAPRINT & LOG LTD"
    },
    "NSE:DLF-EQ": {
        "stock_name": "NSE:DLF-EQ",
        "full_stock_name": "DLF LIMITED"
    },
    "NSE:DLINKINDIA-EQ": {
        "stock_name": "NSE:DLINKINDIA-EQ",
        "full_stock_name": "D-LINK INDIA LTD"
    },
    "NSE:DMART-EQ": {
        "stock_name": "NSE:DMART-EQ",
        "full_stock_name": "AVENUE SUPERMARTS LIMITED"
    },
    "NSE:DMCC-EQ": {
        "stock_name": "NSE:DMCC-EQ",
        "full_stock_name": "DMCC SPECIALITY CHEMICALS"
    },
    "NSE:DNAMEDIA-EQ": {
        "stock_name": "NSE:DNAMEDIA-EQ",
        "full_stock_name": "DILIGENT MEDIA CORP LTD."
    },
    "NSE:DODLA-EQ": {
        "stock_name": "NSE:DODLA-EQ",
        "full_stock_name": "DODLA DAIRY LIMITED"
    },
    "NSE:DOLATALGO-EQ": {
        "stock_name": "NSE:DOLATALGO-EQ",
        "full_stock_name": "DOLAT ALGOTECH LIMITED"
    },
    "NSE:DOLLAR-EQ": {
        "stock_name": "NSE:DOLLAR-EQ",
        "full_stock_name": "DOLLAR INDUSTRIES LIMITED"
    },
    "NSE:DOLPHIN-EQ": {
        "stock_name": "NSE:DOLPHIN-EQ",
        "full_stock_name": "DOLPHIN OFF ENT (IND) L"
    },
    "NSE:DOMS-EQ": {
        "stock_name": "NSE:DOMS-EQ",
        "full_stock_name": "DOMS INDUSTRIES LIMITED"
    },
    "NSE:DONEAR-EQ": {
        "stock_name": "NSE:DONEAR-EQ",
        "full_stock_name": "DONEAR IND. LIMITED"
    },
    "NSE:DPABHUSHAN-EQ": {
        "stock_name": "NSE:DPABHUSHAN-EQ",
        "full_stock_name": "D. P. ABHUSHAN LIMITED"
    },
    "NSE:DPSCLTD-EQ": {
        "stock_name": "NSE:DPSCLTD-EQ",
        "full_stock_name": "DPSC LIMITED"
    },
    "NSE:DPWIRES-EQ": {
        "stock_name": "NSE:DPWIRES-EQ",
        "full_stock_name": "D P WIRES LIMITED"
    },
    "NSE:DRCSYSTEMS-EQ": {
        "stock_name": "NSE:DRCSYSTEMS-EQ",
        "full_stock_name": "DRC SYSTEMS INDIA LIMITED"
    },
    "NSE:DREAMFOLKS-EQ": {
        "stock_name": "NSE:DREAMFOLKS-EQ",
        "full_stock_name": "DREAMFOLKS SERVICES LTD"
    },
    "NSE:DREDGECORP-EQ": {
        "stock_name": "NSE:DREDGECORP-EQ",
        "full_stock_name": "DREDGING CORP OF INDIA"
    },
    "NSE:DRREDDY-EQ": {
        "stock_name": "NSE:DRREDDY-EQ",
        "full_stock_name": "DR. REDDY S LABORATORIES"
    },
    "NSE:DSSL-EQ": {
        "stock_name": "NSE:DSSL-EQ",
        "full_stock_name": "DYNACONS SYS & SOLN LTD"
    },
    "NSE:DTIL-EQ": {
        "stock_name": "NSE:DTIL-EQ",
        "full_stock_name": "DHUNSERI TEA & IND. LTD."
    },
    "NSE:DUCON-EQ": {
        "stock_name": "NSE:DUCON-EQ",
        "full_stock_name": "DUCON INFRATECHNOLOGIES L"
    },
    "NSE:DVL-EQ": {
        "stock_name": "NSE:DVL-EQ",
        "full_stock_name": "DHUNSERI VENTURES LIMITED"
    },
    "NSE:DWARKESH-EQ": {
        "stock_name": "NSE:DWARKESH-EQ",
        "full_stock_name": "DWARIKESH SUGAR IND LTD"
    },
    "NSE:DYCL-EQ": {
        "stock_name": "NSE:DYCL-EQ",
        "full_stock_name": "DYNAMIC CABLES LIMITED"
    },
    "NSE:DYNAMATECH-EQ": {
        "stock_name": "NSE:DYNAMATECH-EQ",
        "full_stock_name": "DYNAMATIC TECHNOLOGIES"
    },
    "NSE:DYNPRO-EQ": {
        "stock_name": "NSE:DYNPRO-EQ",
        "full_stock_name": "DYNEMIC PRODUCTS LIMITED"
    },
    "NSE:E2E-EQ": {
        "stock_name": "NSE:E2E-EQ",
        "full_stock_name": "E2E NETWORKS LIMITED"
    },
    "NSE:EASEMYTRIP-EQ": {
        "stock_name": "NSE:EASEMYTRIP-EQ",
        "full_stock_name": "EASY TRIP PLANNERS LTD"
    },
    "NSE:EBGNG-EQ": {
        "stock_name": "NSE:EBGNG-EQ",
        "full_stock_name": "GNG ELECTRONICS LIMITED"
    },
    "NSE:ECAPINSURE-EQ": {
        "stock_name": "NSE:ECAPINSURE-EQ",
        "full_stock_name": "EDELAMC - ECAPINSURE"
    },
    "NSE:ECLERX-EQ": {
        "stock_name": "NSE:ECLERX-EQ",
        "full_stock_name": "ECLERX SERVICES LTD"
    },
    "NSE:ECOSMOBLTY-EQ": {
        "stock_name": "NSE:ECOSMOBLTY-EQ",
        "full_stock_name": "ECOS (INDIA) MOB & HOSP L"
    },
    "NSE:EDELWEISS-EQ": {
        "stock_name": "NSE:EDELWEISS-EQ",
        "full_stock_name": "EDELWEISS FIN SERV LTD"
    },
    "NSE:EFCIL-EQ": {
        "stock_name": "NSE:EFCIL-EQ",
        "full_stock_name": "EFC (I) LIMITED"
    },
    "NSE:EGOLD-EQ": {
        "stock_name": "NSE:EGOLD-EQ",
        "full_stock_name": "EDELAMC - EGOLD"
    },
    "NSE:EICHERMOT-EQ": {
        "stock_name": "NSE:EICHERMOT-EQ",
        "full_stock_name": "EICHER MOTORS LTD"
    },
    "NSE:EIDPARRY-EQ": {
        "stock_name": "NSE:EIDPARRY-EQ",
        "full_stock_name": "EID PARRY INDIA LTD"
    },
    "NSE:EIEL-EQ": {
        "stock_name": "NSE:EIEL-EQ",
        "full_stock_name": "ENVIRO INFRA ENGINEERS L"
    },
    "NSE:EIFFL-EQ": {
        "stock_name": "NSE:EIFFL-EQ",
        "full_stock_name": "EURO (I) FRESH FOODS LTD"
    },
    "NSE:EIHAHOTELS-EQ": {
        "stock_name": "NSE:EIHAHOTELS-EQ",
        "full_stock_name": "EIH ASSOCIATED HOTELS LTD"
    },
    "NSE:EIHOTEL-EQ": {
        "stock_name": "NSE:EIHOTEL-EQ",
        "full_stock_name": "EIH LIMITED"
    },
    "NSE:EIMCOELECO-EQ": {
        "stock_name": "NSE:EIMCOELECO-EQ",
        "full_stock_name": "EIMCO ELECON (INDIA) LTD"
    },
    "NSE:EKC-EQ": {
        "stock_name": "NSE:EKC-EQ",
        "full_stock_name": "EVEREST KANTO CYLINDERLTD"
    },
    "NSE:ELDEHSG-EQ": {
        "stock_name": "NSE:ELDEHSG-EQ",
        "full_stock_name": "ELDECO HSG & IND LTD."
    },
    "NSE:ELECON-EQ": {
        "stock_name": "NSE:ELECON-EQ",
        "full_stock_name": "ELECON ENG. CO. LTD"
    },
    "NSE:ELECTCAST-EQ": {
        "stock_name": "NSE:ELECTCAST-EQ",
        "full_stock_name": "ELECTROSTEEL CASTINGS LTD"
    },
    "NSE:ELECTHERM-EQ": {
        "stock_name": "NSE:ELECTHERM-EQ",
        "full_stock_name": "ELECTROTHERM (I) LTD."
    },
    "NSE:ELGIEQUIP-EQ": {
        "stock_name": "NSE:ELGIEQUIP-EQ",
        "full_stock_name": "ELGI EQUIPMENTS LTD"
    },
    "NSE:ELGIRUBCO-EQ": {
        "stock_name": "NSE:ELGIRUBCO-EQ",
        "full_stock_name": "ELGI RUBBER CO. LTD"
    },
    "NSE:ELIN-EQ": {
        "stock_name": "NSE:ELIN-EQ",
        "full_stock_name": "ELIN ELECTRONICS LIMITED"
    },
    "NSE:ELIQUID-EQ": {
        "stock_name": "NSE:ELIQUID-EQ",
        "full_stock_name": "EDELAMC - ELIQUID"
    },
    "NSE:ELLEN-EQ": {
        "stock_name": "NSE:ELLEN-EQ",
        "full_stock_name": "ELLENBARRIE INDUS GASES L"
    },
    "NSE:ELM250-EQ": {
        "stock_name": "NSE:ELM250-EQ",
        "full_stock_name": "EDELAMC - ELM250"
    },
    "NSE:EMAMILTD-EQ": {
        "stock_name": "NSE:EMAMILTD-EQ",
        "full_stock_name": "EMAMI LIMITED"
    },
    "NSE:EMAMIPAP-EQ": {
        "stock_name": "NSE:EMAMIPAP-EQ",
        "full_stock_name": "EMAMI PAPER MILLS LIMITED"
    },
    "NSE:EMAMIREAL-EQ": {
        "stock_name": "NSE:EMAMIREAL-EQ",
        "full_stock_name": "EMAMI REALTY LIMITED"
    },
    "NSE:EMBDL-BE": {
        "stock_name": "NSE:EMBDL-BE",
        "full_stock_name": "EMBASSY DEVELOPMENTS LTD"
    },
    "NSE:EMCURE-EQ": {
        "stock_name": "NSE:EMCURE-EQ",
        "full_stock_name": "EMCURE PHARMACEUTICALS L"
    },
    "NSE:EMIL-EQ": {
        "stock_name": "NSE:EMIL-EQ",
        "full_stock_name": "ELECTRONICS MART IND LTD"
    },
    "NSE:EMKAY-EQ": {
        "stock_name": "NSE:EMKAY-EQ",
        "full_stock_name": "EMKAY GLOBAL FIN SERV LTD"
    },
    "NSE:EMMBI-EQ": {
        "stock_name": "NSE:EMMBI-EQ",
        "full_stock_name": "EMMBI INDUSTRIES LIMITED"
    },
    "NSE:EMMVEE-EQ": {
        "stock_name": "NSE:EMMVEE-EQ",
        "full_stock_name": "EMMVEE PHOTOVOLTAIC PWR L"
    },
    "NSE:EMSLIMITED-EQ": {
        "stock_name": "NSE:EMSLIMITED-EQ",
        "full_stock_name": "EMS LIMITED"
    },
    "NSE:EMUDHRA-EQ": {
        "stock_name": "NSE:EMUDHRA-EQ",
        "full_stock_name": "EMUDHRA LIMITED"
    },
    "NSE:EMULTIMQ-EQ": {
        "stock_name": "NSE:EMULTIMQ-EQ",
        "full_stock_name": "EDELAMC - EMULTIMQ"
    },
    "NSE:ENDURANCE-EQ": {
        "stock_name": "NSE:ENDURANCE-EQ",
        "full_stock_name": "ENDURANCE TECHNO. LTD."
    },
    "NSE:ENERGY-EQ": {
        "stock_name": "NSE:ENERGY-EQ",
        "full_stock_name": "MIRAEAMC - ENERGY"
    },
    "NSE:ENERGYDEV-BE": {
        "stock_name": "NSE:ENERGYDEV-BE",
        "full_stock_name": "ENERGY DEVE. CO.LTD"
    },
    "NSE:ENGINERSIN-EQ": {
        "stock_name": "NSE:ENGINERSIN-EQ",
        "full_stock_name": "ENGINEERS INDIA LTD"
    },
    "NSE:ENIL-EQ": {
        "stock_name": "NSE:ENIL-EQ",
        "full_stock_name": "ENTERTAIN NET. IND. LTD."
    },
    "NSE:ENRIN-EQ": {
        "stock_name": "NSE:ENRIN-EQ",
        "full_stock_name": "SIEMENS ENERGY INDIA LTD"
    },
    "NSE:ENTERO-EQ": {
        "stock_name": "NSE:ENTERO-EQ",
        "full_stock_name": "ENTERO HEALTHCARE SOLU L"
    },
    "NSE:EPACK-EQ": {
        "stock_name": "NSE:EPACK-EQ",
        "full_stock_name": "EPACK DURABLE LIMITED"
    },
    "NSE:EPACKPEB-EQ": {
        "stock_name": "NSE:EPACKPEB-EQ",
        "full_stock_name": "EPACK PREFAB TECHN LTD"
    },
    "NSE:EPIGRAL-EQ": {
        "stock_name": "NSE:EPIGRAL-EQ",
        "full_stock_name": "EPIGRAL LIMITED"
    },
    "NSE:EPL-EQ": {
        "stock_name": "NSE:EPL-EQ",
        "full_stock_name": "EPL LIMITED"
    },
    "NSE:EQUAL200-EQ": {
        "stock_name": "NSE:EQUAL200-EQ",
        "full_stock_name": "MIRAEAMC - EQUAL200"
    },
    "NSE:EQUAL50-EQ": {
        "stock_name": "NSE:EQUAL50-EQ",
        "full_stock_name": "MIRAEAMC - EQUAL50"
    },
    "NSE:EQUAL50ADD-EQ": {
        "stock_name": "NSE:EQUAL50ADD-EQ",
        "full_stock_name": "DSPAMC - DSPNEWETF"
    },
    "NSE:EQUIPPP-BE": {
        "stock_name": "NSE:EQUIPPP-BE",
        "full_stock_name": "EQUIPPP SOC IMP TECH LTD"
    },
    "NSE:EQUITASBNK-EQ": {
        "stock_name": "NSE:EQUITASBNK-EQ",
        "full_stock_name": "EQUITAS SMALL FIN BNK LTD"
    },
    "NSE:ERIS-EQ": {
        "stock_name": "NSE:ERIS-EQ",
        "full_stock_name": "ERIS LIFESCIENCES LIMITED"
    },
    "NSE:ESABINDIA-EQ": {
        "stock_name": "NSE:ESABINDIA-EQ",
        "full_stock_name": "ESAB INDIA LTD"
    },
    "NSE:ESAFSFB-EQ": {
        "stock_name": "NSE:ESAFSFB-EQ",
        "full_stock_name": "ESAF SMALL FINANCE BANK L"
    },
    "NSE:ESCORTS-EQ": {
        "stock_name": "NSE:ESCORTS-EQ",
        "full_stock_name": "ESCORTS KUBOTA LIMITED"
    },
    "NSE:ESENSEX-EQ": {
        "stock_name": "NSE:ESENSEX-EQ",
        "full_stock_name": "EDELAMC - ESENSEX"
    },
    "NSE:ESG-EQ": {
        "stock_name": "NSE:ESG-EQ",
        "full_stock_name": "MIRAEAMC - MAESGETF"
    },
    "NSE:ESILVER-EQ": {
        "stock_name": "NSE:ESILVER-EQ",
        "full_stock_name": "EDELAMC - ESILVER"
    },
    "NSE:ESSARSHPNG-BE": {
        "stock_name": "NSE:ESSARSHPNG-BE",
        "full_stock_name": "ESSAR SHIPPING LTD"
    },
    "NSE:ESSENTIA-EQ": {
        "stock_name": "NSE:ESSENTIA-EQ",
        "full_stock_name": "INTEGRA ESSENTIA LIMITED"
    },
    "NSE:ESTER-EQ": {
        "stock_name": "NSE:ESTER-EQ",
        "full_stock_name": "ESTER INDUSTRIES LTD"
    },
    "NSE:ETERNAL-EQ": {
        "stock_name": "NSE:ETERNAL-EQ",
        "full_stock_name": "ETERNAL LIMITED"
    },
    "NSE:ETHOSLTD-EQ": {
        "stock_name": "NSE:ETHOSLTD-EQ",
        "full_stock_name": "ETHOS LIMITED"
    },
    "NSE:EUREKAFORB-EQ": {
        "stock_name": "NSE:EUREKAFORB-EQ",
        "full_stock_name": "EUREKA FORBES LIMITED"
    },
    "NSE:EUROBOND-EQ": {
        "stock_name": "NSE:EUROBOND-EQ",
        "full_stock_name": "EURO PANEL PRODUCTS LTD"
    },
    "NSE:EUROPRATIK-EQ": {
        "stock_name": "NSE:EUROPRATIK-EQ",
        "full_stock_name": "EURO PRATIK SALES LIMITED"
    },
    "NSE:EUROTEXIND-BE": {
        "stock_name": "NSE:EUROTEXIND-BE",
        "full_stock_name": "EUROTEX IND & EXPORTS LTD"
    },
    "NSE:EVEREADY-EQ": {
        "stock_name": "NSE:EVEREADY-EQ",
        "full_stock_name": "EVEREADY INDS. IND.  LTD."
    },
    "NSE:EVERESTIND-EQ": {
        "stock_name": "NSE:EVERESTIND-EQ",
        "full_stock_name": "EVEREST INDUSTRIES LTD"
    },
    "NSE:EVINDIA-EQ": {
        "stock_name": "NSE:EVINDIA-EQ",
        "full_stock_name": "MIRAEAMC - EVINDIA"
    },
    "NSE:EXCEL-EQ": {
        "stock_name": "NSE:EXCEL-EQ",
        "full_stock_name": "EXCEL REALTY N INFRA LTD"
    },
    "NSE:EXCELINDUS-EQ": {
        "stock_name": "NSE:EXCELINDUS-EQ",
        "full_stock_name": "EXCEL INDUSTRIES LTD"
    },
    "NSE:EXCELSOFT-EQ": {
        "stock_name": "NSE:EXCELSOFT-EQ",
        "full_stock_name": "EXCELSOFT TECHNOLOGIES L"
    },
    "NSE:EXICOM-EQ": {
        "stock_name": "NSE:EXICOM-EQ",
        "full_stock_name": "EXICOM TELE SYSTEMS LTD"
    },
    "NSE:EXIDEIND-EQ": {
        "stock_name": "NSE:EXIDEIND-EQ",
        "full_stock_name": "EXIDE INDUSTRIES LTD"
    },
    "NSE:EXPLEOSOL-EQ": {
        "stock_name": "NSE:EXPLEOSOL-EQ",
        "full_stock_name": "EXPLEO SOLUTIONS LIMITED"
    },
    "NSE:EXXARO-BE": {
        "stock_name": "NSE:EXXARO-BE",
        "full_stock_name": "EXXARO TILES LIMITED"
    },
    "NSE:FABTECH-EQ": {
        "stock_name": "NSE:FABTECH-EQ",
        "full_stock_name": "FABTECH TECHNOLOGIES LTD"
    },
    "NSE:FACT-EQ": {
        "stock_name": "NSE:FACT-EQ",
        "full_stock_name": "FACT LTD"
    },
    "NSE:FAIRCHEMOR-EQ": {
        "stock_name": "NSE:FAIRCHEMOR-EQ",
        "full_stock_name": "FAIRCHEM ORGANICS LIMITED"
    },
    "NSE:FAZE3Q-EQ": {
        "stock_name": "NSE:FAZE3Q-EQ",
        "full_stock_name": "FAZE THREE LIMITED"
    },
    "NSE:FCL-EQ": {
        "stock_name": "NSE:FCL-EQ",
        "full_stock_name": "FINEOTEX CHEMICAL LIMITED"
    },
    "NSE:FCSSOFT-EQ": {
        "stock_name": "NSE:FCSSOFT-EQ",
        "full_stock_name": "FCS SOFTWARE SOLN. LTD."
    },
    "NSE:FDC-EQ": {
        "stock_name": "NSE:FDC-EQ",
        "full_stock_name": "FDC LIMITED"
    },
    "NSE:FEDERALBNK-EQ": {
        "stock_name": "NSE:FEDERALBNK-EQ",
        "full_stock_name": "FEDERAL BANK LTD"
    },
    "NSE:FEDFINA-EQ": {
        "stock_name": "NSE:FEDFINA-EQ",
        "full_stock_name": "FEDBANK FINANCIAL SER L"
    },
    "NSE:FEL-BZ": {
        "stock_name": "NSE:FEL-BZ",
        "full_stock_name": "FUTURE ENTERPRISES LTD"
    },
    "NSE:FELDVR-BZ": {
        "stock_name": "NSE:FELDVR-BZ",
        "full_stock_name": "FUTURE ENTERPRISES LTD"
    },
    "NSE:FIBERWEB-EQ": {
        "stock_name": "NSE:FIBERWEB-EQ",
        "full_stock_name": "FIBERWEB INDIA LIMITED"
    },
    "NSE:FIEMIND-EQ": {
        "stock_name": "NSE:FIEMIND-EQ",
        "full_stock_name": "FIEM INDUSTRIES LIMITED"
    },
    "NSE:FILATEX-EQ": {
        "stock_name": "NSE:FILATEX-EQ",
        "full_stock_name": "FILATEX INDIA LTD"
    },
    "NSE:FILATFASH-EQ": {
        "stock_name": "NSE:FILATFASH-EQ",
        "full_stock_name": "FILATEX FASHIONS LIMITED"
    },
    "NSE:FINCABLES-EQ": {
        "stock_name": "NSE:FINCABLES-EQ",
        "full_stock_name": "FINOLEX CABLES LTD"
    },
    "NSE:FINEORG-EQ": {
        "stock_name": "NSE:FINEORG-EQ",
        "full_stock_name": "FINE ORGANIC IND. LTD."
    },
    "NSE:FINKURVE-EQ": {
        "stock_name": "NSE:FINKURVE-EQ",
        "full_stock_name": "FINKURVE FINANCIAL SERV L"
    },
    "NSE:FINOPB-EQ": {
        "stock_name": "NSE:FINOPB-EQ",
        "full_stock_name": "FINO PAYMENTS BANK LTD"
    },
    "NSE:FINPIPE-EQ": {
        "stock_name": "NSE:FINPIPE-EQ",
        "full_stock_name": "FINOLEX INDUSTRIES LTD"
    },
    "NSE:FIRSTCRY-EQ": {
        "stock_name": "NSE:FIRSTCRY-EQ",
        "full_stock_name": "BRAINBEES SOLUTIONS LTD"
    },
    "NSE:FISCHER-EQ": {
        "stock_name": "NSE:FISCHER-EQ",
        "full_stock_name": "FISCHER MEDICAL VENTURE L"
    },
    "NSE:FIVESTAR-EQ": {
        "stock_name": "NSE:FIVESTAR-EQ",
        "full_stock_name": "FIVE-STAR BUS FIN LTD"
    },
    "NSE:FLAIR-EQ": {
        "stock_name": "NSE:FLAIR-EQ",
        "full_stock_name": "FLAIR WRITING INDUST LTD"
    },
    "NSE:FLEXIADD-EQ": {
        "stock_name": "NSE:FLEXIADD-EQ",
        "full_stock_name": "DSPAMC - FLEXIADD"
    },
    "NSE:FLEXITUFF-EQ": {
        "stock_name": "NSE:FLEXITUFF-EQ",
        "full_stock_name": "FLEXITUFF VENTURES INT L"
    },
    "NSE:FLFL-BZ": {
        "stock_name": "NSE:FLFL-BZ",
        "full_stock_name": "FUT LIFESTYLE FASH LTD"
    },
    "NSE:FLUOROCHEM-EQ": {
        "stock_name": "NSE:FLUOROCHEM-EQ",
        "full_stock_name": "GUJARAT FLUOROCHEM LTD"
    },
    "NSE:FMGOETZE-EQ": {
        "stock_name": "NSE:FMGOETZE-EQ",
        "full_stock_name": "FEDERAL-MOGUL GOETZE (IND"
    },
    "NSE:FMNL-EQ": {
        "stock_name": "NSE:FMNL-EQ",
        "full_stock_name": "FUTURE MKT NETWORKS LTD"
    },
    "NSE:FOCUS-EQ": {
        "stock_name": "NSE:FOCUS-EQ",
        "full_stock_name": "FOCUS LIGHTG & FIXTRS LTD"
    },
    "NSE:FOODSIN-EQ": {
        "stock_name": "NSE:FOODSIN-EQ",
        "full_stock_name": "FOODS & INNS LIMITED"
    },
    "NSE:FORCEMOT-EQ": {
        "stock_name": "NSE:FORCEMOT-EQ",
        "full_stock_name": "FORCE MOTORS LIMITED"
    },
    "NSE:FORTIS-EQ": {
        "stock_name": "NSE:FORTIS-EQ",
        "full_stock_name": "FORTIS HEALTHCARE LTD"
    },
    "NSE:FOSECOIND-EQ": {
        "stock_name": "NSE:FOSECOIND-EQ",
        "full_stock_name": "FOSECO INDIA LTD"
    },
    "NSE:FSL-EQ": {
        "stock_name": "NSE:FSL-EQ",
        "full_stock_name": "FIRSTSOURCE SOLU. LTD."
    },
    "NSE:FUSION-EQ": {
        "stock_name": "NSE:FUSION-EQ",
        "full_stock_name": "FUSION FINANCE LIMITED"
    },
    "NSE:GABRIEL-EQ": {
        "stock_name": "NSE:GABRIEL-EQ",
        "full_stock_name": "GABRIEL INDIA LTD"
    },
    "NSE:GAEL-EQ": {
        "stock_name": "NSE:GAEL-EQ",
        "full_stock_name": "GUJARAT AMBUJA EXPORTS LT"
    },
    "NSE:GAIL-EQ": {
        "stock_name": "NSE:GAIL-EQ",
        "full_stock_name": "GAIL (INDIA) LTD"
    },
    "NSE:GALAPREC-EQ": {
        "stock_name": "NSE:GALAPREC-EQ",
        "full_stock_name": "GALA PRECISION ENG LTD"
    },
    "NSE:GALAXYSURF-EQ": {
        "stock_name": "NSE:GALAXYSURF-EQ",
        "full_stock_name": "GALAXY SURFACTANTS LTD"
    },
    "NSE:GALLANTT-EQ": {
        "stock_name": "NSE:GALLANTT-EQ",
        "full_stock_name": "GALLANTT ISPAT LIMITED"
    },
    "NSE:GANDHAR-EQ": {
        "stock_name": "NSE:GANDHAR-EQ",
        "full_stock_name": "GANDHAR OIL REFINE IND L"
    },
    "NSE:GANDHITUBE-EQ": {
        "stock_name": "NSE:GANDHITUBE-EQ",
        "full_stock_name": "GANDHI SPL. TUBES LTD"
    },
    "NSE:GANECOS-EQ": {
        "stock_name": "NSE:GANECOS-EQ",
        "full_stock_name": "GANESHA ECOSPHERE LIMITED"
    },
    "NSE:GANESHBE-EQ": {
        "stock_name": "NSE:GANESHBE-EQ",
        "full_stock_name": "GANESH BENZOPLAST LIMITED"
    },
    "NSE:GANESHCP-EQ": {
        "stock_name": "NSE:GANESHCP-EQ",
        "full_stock_name": "GANESH CONSUMER PRODUCT L"
    },
    "NSE:GANESHHOU-EQ": {
        "stock_name": "NSE:GANESHHOU-EQ",
        "full_stock_name": "GANESH HOUSING LIMITED"
    },
    "NSE:GANGAFORGE-EQ": {
        "stock_name": "NSE:GANGAFORGE-EQ",
        "full_stock_name": "GANGA FORGING LIMITED"
    },
    "NSE:GANGESSECU-EQ": {
        "stock_name": "NSE:GANGESSECU-EQ",
        "full_stock_name": "GANGES SECURITIES LIMITED"
    },
    "NSE:GARFIBRES-EQ": {
        "stock_name": "NSE:GARFIBRES-EQ",
        "full_stock_name": "GARWARE TECH FIBRES LTD"
    },
    "NSE:GARUDA-EQ": {
        "stock_name": "NSE:GARUDA-EQ",
        "full_stock_name": "GARUDA CONSTRUCT N ENG L"
    },
    "NSE:GATECH-EQ": {
        "stock_name": "NSE:GATECH-EQ",
        "full_stock_name": "GACM TECHNOLOGIES LIMITED"
    },
    "NSE:GATECHDVR-EQ": {
        "stock_name": "NSE:GATECHDVR-EQ",
        "full_stock_name": "GACM TECHNOLOGIES LIMITED"
    },
    "NSE:GATEWAY-EQ": {
        "stock_name": "NSE:GATEWAY-EQ",
        "full_stock_name": "GATEWAY DISTRIPARKS LTD"
    },
    "NSE:GAYAHWS-EQ": {
        "stock_name": "NSE:GAYAHWS-EQ",
        "full_stock_name": "GAYATRI HIGHWAYS LIMITED"
    },
    "NSE:GCSL-BE": {
        "stock_name": "NSE:GCSL-BE",
        "full_stock_name": "GRETEX CORPORATE SERVICES"
    },
    "NSE:GEECEE-EQ": {
        "stock_name": "NSE:GEECEE-EQ",
        "full_stock_name": "GEECEE VENTURES LIMITED"
    },
    "NSE:GEEKAYWIRE-EQ": {
        "stock_name": "NSE:GEEKAYWIRE-EQ",
        "full_stock_name": "GEEKAY WIRES LIMITED"
    },
    "NSE:GEMAROMA-EQ": {
        "stock_name": "NSE:GEMAROMA-EQ",
        "full_stock_name": "GEM AROMATICS LIMITED"
    },
    "NSE:GENCON-EQ": {
        "stock_name": "NSE:GENCON-EQ",
        "full_stock_name": "GENERIC ENG CONS PROJ LTD"
    },
    "NSE:GENESYS-EQ": {
        "stock_name": "NSE:GENESYS-EQ",
        "full_stock_name": "GENESYS INTL CORPN LTD"
    },
    "NSE:GENSOL-BZ": {
        "stock_name": "NSE:GENSOL-BZ",
        "full_stock_name": "GENSOL ENGINEERING LTD"
    },
    "NSE:GENUSPAPER-EQ": {
        "stock_name": "NSE:GENUSPAPER-EQ",
        "full_stock_name": "GENUS P&B LIMITED"
    },
    "NSE:GENUSPOWER-EQ": {
        "stock_name": "NSE:GENUSPOWER-EQ",
        "full_stock_name": "GENUS POWER INFRASTRU LTD"
    },
    "NSE:GEOJITFSL-EQ": {
        "stock_name": "NSE:GEOJITFSL-EQ",
        "full_stock_name": "GEOJIT FINANCIAL SER L"
    },
    "NSE:GESHIP-EQ": {
        "stock_name": "NSE:GESHIP-EQ",
        "full_stock_name": "THE GE SHPG.LTD"
    },
    "NSE:GFLLIMITED-EQ": {
        "stock_name": "NSE:GFLLIMITED-EQ",
        "full_stock_name": "GFL LIMITED"
    },
    "NSE:GHCL-EQ": {
        "stock_name": "NSE:GHCL-EQ",
        "full_stock_name": "GHCL LIMITED"
    },
    "NSE:GHCLTEXTIL-EQ": {
        "stock_name": "NSE:GHCLTEXTIL-EQ",
        "full_stock_name": "GHCL TEXTILES LIMITED"
    },
    "NSE:GICHSGFIN-EQ": {
        "stock_name": "NSE:GICHSGFIN-EQ",
        "full_stock_name": "GIC HOUSING FINANCE LTD"
    },
    "NSE:GICRE-EQ": {
        "stock_name": "NSE:GICRE-EQ",
        "full_stock_name": "GENERAL INS CORP OF INDIA"
    },
    "NSE:GILLANDERS-EQ": {
        "stock_name": "NSE:GILLANDERS-EQ",
        "full_stock_name": "GILLANDERS ARBUTHNOT LTD"
    },
    "NSE:GILLETTE-EQ": {
        "stock_name": "NSE:GILLETTE-EQ",
        "full_stock_name": "GILLETTE INDIA LTD"
    },
    "NSE:GILT10BETA-EQ": {
        "stock_name": "NSE:GILT10BETA-EQ",
        "full_stock_name": "UTIAMC-GILT10BETA"
    },
    "NSE:GILT5BETA-EQ": {
        "stock_name": "NSE:GILT5BETA-EQ",
        "full_stock_name": "UTIAMC-GILT5BETA"
    },
    "NSE:GILT5YBEES-EQ": {
        "stock_name": "NSE:GILT5YBEES-EQ",
        "full_stock_name": "RELCAPAMC - NETFGILT5Y"
    },
    "NSE:GINNIFILA-EQ": {
        "stock_name": "NSE:GINNIFILA-EQ",
        "full_stock_name": "GINNI FILAMENTS LTD"
    },
    "NSE:GIPCL-EQ": {
        "stock_name": "NSE:GIPCL-EQ",
        "full_stock_name": "GUJ IND POW CO. LTD"
    },
    "NSE:GKENERGY-EQ": {
        "stock_name": "NSE:GKENERGY-EQ",
        "full_stock_name": "GK ENERGY LIMITED"
    },
    "NSE:GKSL-EQ": {
        "stock_name": "NSE:GKSL-EQ",
        "full_stock_name": "GUJARAT KIDNEY N SUP SP L"
    },
    "NSE:GKWLIMITED-EQ": {
        "stock_name": "NSE:GKWLIMITED-EQ",
        "full_stock_name": "GKW LIMITED"
    },
    "NSE:GLAND-EQ": {
        "stock_name": "NSE:GLAND-EQ",
        "full_stock_name": "GLAND PHARMA LIMITED"
    },
    "NSE:GLAXO-EQ": {
        "stock_name": "NSE:GLAXO-EQ",
        "full_stock_name": "GLAXOSMITHKLINE PHARMA LT"
    },
    "NSE:GLENMARK-EQ": {
        "stock_name": "NSE:GLENMARK-EQ",
        "full_stock_name": "GLENMARK PHARMACEUTICALS"
    },
    "NSE:GLFL-BE": {
        "stock_name": "NSE:GLFL-BE",
        "full_stock_name": "GUJARAT LEASE FINANCING L"
    },
    "NSE:GLOBAL-BE": {
        "stock_name": "NSE:GLOBAL-BE",
        "full_stock_name": "GLOBAL EDUCATION LIMITED"
    },
    "NSE:GLOBALE-EQ": {
        "stock_name": "NSE:GLOBALE-EQ",
        "full_stock_name": "GLOBALE TESSILE LIMITED"
    },
    "NSE:GLOBALVECT-EQ": {
        "stock_name": "NSE:GLOBALVECT-EQ",
        "full_stock_name": "GLOBAL VEC HELICORP LTD"
    },
    "NSE:GLOBE-EQ": {
        "stock_name": "NSE:GLOBE-EQ",
        "full_stock_name": "GLOBE ENTERPRISE (I) LTD"
    },
    "NSE:GLOBECIVIL-EQ": {
        "stock_name": "NSE:GLOBECIVIL-EQ",
        "full_stock_name": "GLOBE CIVIL PROJECTS LTD"
    },
    "NSE:GLOBUSSPR-EQ": {
        "stock_name": "NSE:GLOBUSSPR-EQ",
        "full_stock_name": "GLOBUS SPIRITS LTD"
    },
    "NSE:GLOSTERLTD-EQ": {
        "stock_name": "NSE:GLOSTERLTD-EQ",
        "full_stock_name": "GLOSTER LIMITED"
    },
    "NSE:GLOTTIS-EQ": {
        "stock_name": "NSE:GLOTTIS-EQ",
        "full_stock_name": "GLOTTIS LIMITED"
    },
    "NSE:GMBREW-EQ": {
        "stock_name": "NSE:GMBREW-EQ",
        "full_stock_name": "G M BREWERIES LTD"
    },
    "NSE:GMDCLTD-EQ": {
        "stock_name": "NSE:GMDCLTD-EQ",
        "full_stock_name": "GUJARAT MINERAL DEV CORP"
    },
    "NSE:GMMPFAUDLR-EQ": {
        "stock_name": "NSE:GMMPFAUDLR-EQ",
        "full_stock_name": "GMM PFAUDLER LIMITED"
    },
    "NSE:GMRAIRPORT-EQ": {
        "stock_name": "NSE:GMRAIRPORT-EQ",
        "full_stock_name": "GMR AIRPORTS LIMITED"
    },
    "NSE:GMRP&UI-EQ": {
        "stock_name": "NSE:GMRP&UI-EQ",
        "full_stock_name": "GMR POW AND URBAN INFRA L"
    },
    "NSE:GNA-EQ": {
        "stock_name": "NSE:GNA-EQ",
        "full_stock_name": "GNA AXLES LIMITED"
    },
    "NSE:GNFC-EQ": {
        "stock_name": "NSE:GNFC-EQ",
        "full_stock_name": "GUJ NAR VAL FER & CHEM L"
    },
    "NSE:GOACARBON-EQ": {
        "stock_name": "NSE:GOACARBON-EQ",
        "full_stock_name": "GOA CARBON LIMITED"
    },
    "NSE:GOCLCORP-EQ": {
        "stock_name": "NSE:GOCLCORP-EQ",
        "full_stock_name": "GOCL CORPORATION LIMITED"
    },
    "NSE:GOCOLORS-EQ": {
        "stock_name": "NSE:GOCOLORS-EQ",
        "full_stock_name": "GO FASHION INDIA LTD"
    },
    "NSE:GODAVARIB-EQ": {
        "stock_name": "NSE:GODAVARIB-EQ",
        "full_stock_name": "GODAVARI BIOREFINERIES L"
    },
    "NSE:GODFRYPHLP-EQ": {
        "stock_name": "NSE:GODFRYPHLP-EQ",
        "full_stock_name": "GODFREY PHILLIPS INDIA LT"
    },
    "NSE:GODIGIT-EQ": {
        "stock_name": "NSE:GODIGIT-EQ",
        "full_stock_name": "GO DIGIT GENERAL INS LTD"
    },
    "NSE:GODREJAGRO-EQ": {
        "stock_name": "NSE:GODREJAGRO-EQ",
        "full_stock_name": "GODREJ AGROVET LIMITED"
    },
    "NSE:GODREJCP-EQ": {
        "stock_name": "NSE:GODREJCP-EQ",
        "full_stock_name": "GODREJ CONSUMER PRODUCTS"
    },
    "NSE:GODREJIND-EQ": {
        "stock_name": "NSE:GODREJIND-EQ",
        "full_stock_name": "GODREJ INDUSTRIES LTD"
    },
    "NSE:GODREJPROP-EQ": {
        "stock_name": "NSE:GODREJPROP-EQ",
        "full_stock_name": "GODREJ PROPERTIES LTD"
    },
    "NSE:GOKEX-EQ": {
        "stock_name": "NSE:GOKEX-EQ",
        "full_stock_name": "GOKALDAS EXPORTS LTD."
    },
    "NSE:GOKUL-EQ": {
        "stock_name": "NSE:GOKUL-EQ",
        "full_stock_name": "GOKUL REFOILS & SOLV LTD"
    },
    "NSE:GOKULAGRO-EQ": {
        "stock_name": "NSE:GOKULAGRO-EQ",
        "full_stock_name": "GOKUL AGRO RESOURCES LTD"
    },
    "NSE:GOLD1-EQ": {
        "stock_name": "NSE:GOLD1-EQ",
        "full_stock_name": "KOTAK GOLD ETF"
    },
    "NSE:GOLD360-EQ": {
        "stock_name": "NSE:GOLD360-EQ",
        "full_stock_name": "360ONEAMC - GOLD360"
    },
    "NSE:GOLDADD-EQ": {
        "stock_name": "NSE:GOLDADD-EQ",
        "full_stock_name": "DSPAMC - DSPGOLD"
    },
    "NSE:GOLDBEES-EQ": {
        "stock_name": "NSE:GOLDBEES-EQ",
        "full_stock_name": "NIP IND ETF GOLD BEES"
    },
    "NSE:GOLDBETA-EQ": {
        "stock_name": "NSE:GOLDBETA-EQ",
        "full_stock_name": "UTIAMC-UTIGOLDBETA"
    },
    "NSE:GOLDBND-EQ": {
        "stock_name": "NSE:GOLDBND-EQ",
        "full_stock_name": "BANDHANAMC - GOLDBND"
    },
    "NSE:GOLDCASE-EQ": {
        "stock_name": "NSE:GOLDCASE-EQ",
        "full_stock_name": "ZERODHAAMC - GOLDCASE"
    },
    "NSE:GOLDENTOBC-BZ": {
        "stock_name": "NSE:GOLDENTOBC-BZ",
        "full_stock_name": "GOLDEN TOBACCO LIMITED"
    },
    "NSE:GOLDIAM-EQ": {
        "stock_name": "NSE:GOLDIAM-EQ",
        "full_stock_name": "GOLDIAM INTERNATIONAL LTD"
    },
    "NSE:GOLDTECH-EQ": {
        "stock_name": "NSE:GOLDTECH-EQ",
        "full_stock_name": "AION-TECH SOLUTIONS LTD"
    },
    "NSE:GOODLUCK-EQ": {
        "stock_name": "NSE:GOODLUCK-EQ",
        "full_stock_name": "GOODLUCK INDIA LIMITED"
    },
    "NSE:GOPAL-EQ": {
        "stock_name": "NSE:GOPAL-EQ",
        "full_stock_name": "GOPAL SNACKS LIMITED"
    },
    "NSE:GOYALALUM-BE": {
        "stock_name": "NSE:GOYALALUM-BE",
        "full_stock_name": "GOYAL ALUMINIUMS LIMITED"
    },
    "NSE:GPIL-EQ": {
        "stock_name": "NSE:GPIL-EQ",
        "full_stock_name": "GODAWARI POW & ISP LTD"
    },
    "NSE:GPPL-EQ": {
        "stock_name": "NSE:GPPL-EQ",
        "full_stock_name": "GUJARAT PIPAVAV PORT LTD"
    },
    "NSE:GPTHEALTH-EQ": {
        "stock_name": "NSE:GPTHEALTH-EQ",
        "full_stock_name": "GPT HEALTHCARE LIMITED"
    },
    "NSE:GPTINFRA-EQ": {
        "stock_name": "NSE:GPTINFRA-EQ",
        "full_stock_name": "GPT INFRAPROJECTS LTD"
    },
    "NSE:GRANULES-EQ": {
        "stock_name": "NSE:GRANULES-EQ",
        "full_stock_name": "GRANULES INDIA LIMITED"
    },
    "NSE:GRAPHITE-EQ": {
        "stock_name": "NSE:GRAPHITE-EQ",
        "full_stock_name": "GRAPHITE INDIA LTD"
    },
    "NSE:GRASIM-EQ": {
        "stock_name": "NSE:GRASIM-EQ",
        "full_stock_name": "GRASIM INDUSTRIES LTD"
    },
    "NSE:GRAVITA-EQ": {
        "stock_name": "NSE:GRAVITA-EQ",
        "full_stock_name": "GRAVITA INDIA LIMITED"
    },
    "NSE:GREAVESCOT-EQ": {
        "stock_name": "NSE:GREAVESCOT-EQ",
        "full_stock_name": "GREAVES COTTON LTD."
    },
    "NSE:GREENLAM-EQ": {
        "stock_name": "NSE:GREENLAM-EQ",
        "full_stock_name": "GREENLAM INDUSTRIES LTD."
    },
    "NSE:GREENPANEL-EQ": {
        "stock_name": "NSE:GREENPANEL-EQ",
        "full_stock_name": "GREENPANEL INDUSTRIES LTD"
    },
    "NSE:GREENPLY-EQ": {
        "stock_name": "NSE:GREENPLY-EQ",
        "full_stock_name": "GREENPLY INDUSTRIES LTD"
    },
    "NSE:GREENPOWER-EQ": {
        "stock_name": "NSE:GREENPOWER-EQ",
        "full_stock_name": "ORIENT GREEN POWER CO LTD"
    },
    "NSE:GRINDWELL-EQ": {
        "stock_name": "NSE:GRINDWELL-EQ",
        "full_stock_name": "GRINDWELL NORTON LIMITED"
    },
    "NSE:GRINFRA-EQ": {
        "stock_name": "NSE:GRINFRA-EQ",
        "full_stock_name": "G R INFRAPROJECTS LIMITED"
    },
    "NSE:GRMOVER-EQ": {
        "stock_name": "NSE:GRMOVER-EQ",
        "full_stock_name": "GRM OVERSEAS LIMITED"
    },
    "NSE:GROBTEA-EQ": {
        "stock_name": "NSE:GROBTEA-EQ",
        "full_stock_name": "THE GROB TEA COMPANY LTD"
    },
    "NSE:GROWW-EQ": {
        "stock_name": "NSE:GROWW-EQ",
        "full_stock_name": "BILLIONBRAINS GARAGE VN L"
    },
    "NSE:GROWWCAPM-EQ": {
        "stock_name": "NSE:GROWWCAPM-EQ",
        "full_stock_name": "GROWWAMC - GROWWCAPM"
    },
    "NSE:GROWWCHEM-EQ": {
        "stock_name": "NSE:GROWWCHEM-EQ",
        "full_stock_name": "GROWWAMC - GROWWCHEM"
    },
    "NSE:GROWWDEFNC-EQ": {
        "stock_name": "NSE:GROWWDEFNC-EQ",
        "full_stock_name": "GROWWAMC - GROWWDEFNC"
    },
    "NSE:GROWWEV-EQ": {
        "stock_name": "NSE:GROWWEV-EQ",
        "full_stock_name": "GROWWAMC - GROWWEV"
    },
    "NSE:GROWWGOLD-EQ": {
        "stock_name": "NSE:GROWWGOLD-EQ",
        "full_stock_name": "GROWWAMC - GROWWGOLD"
    },
    "NSE:GROWWLIQID-EQ": {
        "stock_name": "NSE:GROWWLIQID-EQ",
        "full_stock_name": "GROWWAMC - GROWWLIQID"
    },
    "NSE:GROWWLOVOL-EQ": {
        "stock_name": "NSE:GROWWLOVOL-EQ",
        "full_stock_name": "GROWWAMC - GROWWLOVOL"
    },
    "NSE:GROWWMC150-EQ": {
        "stock_name": "NSE:GROWWMC150-EQ",
        "full_stock_name": "GROWWAMC - GROWWMC150"
    },
    "NSE:GROWWMETAL-EQ": {
        "stock_name": "NSE:GROWWMETAL-EQ",
        "full_stock_name": "GROWWAMC - GROWWMETAL"
    },
    "NSE:GROWWMOM50-EQ": {
        "stock_name": "NSE:GROWWMOM50-EQ",
        "full_stock_name": "GROWWAMC - GROWWMOM50"
    },
    "NSE:GROWWN200-EQ": {
        "stock_name": "NSE:GROWWN200-EQ",
        "full_stock_name": "GROWWAMC - GROWWN200"
    },
    "NSE:GROWWNET-EQ": {
        "stock_name": "NSE:GROWWNET-EQ",
        "full_stock_name": "GROWWAMC - GROWWNET"
    },
    "NSE:GROWWNXT50-EQ": {
        "stock_name": "NSE:GROWWNXT50-EQ",
        "full_stock_name": "GROWWAMC - GROWWNXT50"
    },
    "NSE:GROWWPOWER-EQ": {
        "stock_name": "NSE:GROWWPOWER-EQ",
        "full_stock_name": "GROWWAMC - GROWWPOWER"
    },
    "NSE:GROWWRAIL-EQ": {
        "stock_name": "NSE:GROWWRAIL-EQ",
        "full_stock_name": "GROWWAMC - GROWWRAIL"
    },
    "NSE:GROWWRLTY-EQ": {
        "stock_name": "NSE:GROWWRLTY-EQ",
        "full_stock_name": "GROWWAMC - GROWWRLTY"
    },
    "NSE:GROWWSC250-EQ": {
        "stock_name": "NSE:GROWWSC250-EQ",
        "full_stock_name": "GROWWAMC - GROWWSC250"
    },
    "NSE:GROWWSLVR-EQ": {
        "stock_name": "NSE:GROWWSLVR-EQ",
        "full_stock_name": "GROWWAMC - GROWWSLVR"
    },
    "NSE:GRPLTD-EQ": {
        "stock_name": "NSE:GRPLTD-EQ",
        "full_stock_name": "GRP LIMITED"
    },
    "NSE:GRSE-EQ": {
        "stock_name": "NSE:GRSE-EQ",
        "full_stock_name": "GARDEN REACH SHIP&ENG LTD"
    },
    "NSE:GRWRHITECH-EQ": {
        "stock_name": "NSE:GRWRHITECH-EQ",
        "full_stock_name": "GARWARE HI-TECH FILMS LTD"
    },
    "NSE:GSEC10ABSL-EQ": {
        "stock_name": "NSE:GSEC10ABSL-EQ",
        "full_stock_name": "BIRLASLAMC - GSEC10ABSL"
    },
    "NSE:GSEC10YEAR-EQ": {
        "stock_name": "NSE:GSEC10YEAR-EQ",
        "full_stock_name": "MIRAEAMC - MAGS813ETF"
    },
    "NSE:GSFC-EQ": {
        "stock_name": "NSE:GSFC-EQ",
        "full_stock_name": "GUJ STATE FERT & CHEM LTD"
    },
    "NSE:GSLSU-BE": {
        "stock_name": "NSE:GSLSU-BE",
        "full_stock_name": "GLOBAL SURFACES LIMITED"
    },
    "NSE:GSPL-EQ": {
        "stock_name": "NSE:GSPL-EQ",
        "full_stock_name": "GUJARAT STATE PETRO LTD"
    },
    "NSE:GSS-EQ": {
        "stock_name": "NSE:GSS-EQ",
        "full_stock_name": "GSS INFOTECH LIMITED"
    },
    "NSE:GTECJAINX-EQ": {
        "stock_name": "NSE:GTECJAINX-EQ",
        "full_stock_name": "G-TEC JAINX EDUCATION LTD"
    },
    "NSE:GTL-EQ": {
        "stock_name": "NSE:GTL-EQ",
        "full_stock_name": "GTL LTD"
    },
    "NSE:GTLINFRA-EQ": {
        "stock_name": "NSE:GTLINFRA-EQ",
        "full_stock_name": "GTL INFRA.LTD"
    },
    "NSE:GTPL-EQ": {
        "stock_name": "NSE:GTPL-EQ",
        "full_stock_name": "GTPL HATHWAY LIMITED"
    },
    "NSE:GUFICBIO-EQ": {
        "stock_name": "NSE:GUFICBIO-EQ",
        "full_stock_name": "GUFIC BIOSCIENCES LTD."
    },
    "NSE:GUJALKALI-EQ": {
        "stock_name": "NSE:GUJALKALI-EQ",
        "full_stock_name": "GUJARAT ALKALIES & CHEM"
    },
    "NSE:GUJAPOLLO-EQ": {
        "stock_name": "NSE:GUJAPOLLO-EQ",
        "full_stock_name": "GUJ. APOLLO IND. LTD."
    },
    "NSE:GUJGASLTD-EQ": {
        "stock_name": "NSE:GUJGASLTD-EQ",
        "full_stock_name": "GUJARAT GAS LIMITED"
    },
    "NSE:GUJRAFFIA-BE": {
        "stock_name": "NSE:GUJRAFFIA-BE",
        "full_stock_name": "GUJARAT RAFFIA INDUST LTD"
    },
    "NSE:GUJTHEM-EQ": {
        "stock_name": "NSE:GUJTHEM-EQ",
        "full_stock_name": "GUJARAT THEMIS BIOSYN LTD"
    },
    "NSE:GULFOILLUB-EQ": {
        "stock_name": "NSE:GULFOILLUB-EQ",
        "full_stock_name": "GULF OIL LUB. IND. LTD."
    },
    "NSE:GULFPETRO-EQ": {
        "stock_name": "NSE:GULFPETRO-EQ",
        "full_stock_name": "GP PETROLEUMS LIMITED"
    },
    "NSE:GULPOLY-EQ": {
        "stock_name": "NSE:GULPOLY-EQ",
        "full_stock_name": "GULSHAN POLYOLS LIMITED"
    },
    "NSE:GVKPIL-BE": {
        "stock_name": "NSE:GVKPIL-BE",
        "full_stock_name": "GVK POW. & INFRA LTD."
    },
    "NSE:GVPIL-EQ": {
        "stock_name": "NSE:GVPIL-EQ",
        "full_stock_name": "GE POWER INDIA LIMITED"
    },
    "NSE:GVPTECH-EQ": {
        "stock_name": "NSE:GVPTECH-EQ",
        "full_stock_name": "GVP INFOTECH LIMITED"
    },
    "NSE:GVT&D-EQ": {
        "stock_name": "NSE:GVT&D-EQ",
        "full_stock_name": "GE VERNOVA T&D INDIA LTD"
    },
    "NSE:HAL-EQ": {
        "stock_name": "NSE:HAL-EQ",
        "full_stock_name": "HINDUSTAN AERONAUTICS LTD"
    },
    "NSE:HALDER-BE": {
        "stock_name": "NSE:HALDER-BE",
        "full_stock_name": "HALDER VENTURE LIMITED"
    },
    "NSE:HALEOSLABS-BE": {
        "stock_name": "NSE:HALEOSLABS-BE",
        "full_stock_name": "HALEOS LABS LIMITED"
    },
    "NSE:HAPPSTMNDS-EQ": {
        "stock_name": "NSE:HAPPSTMNDS-EQ",
        "full_stock_name": "HAPPIEST MINDS TECHNO LTD"
    },
    "NSE:HAPPYFORGE-EQ": {
        "stock_name": "NSE:HAPPYFORGE-EQ",
        "full_stock_name": "HAPPY FORGINGS LIMITED"
    },
    "NSE:HARDWYN-BE": {
        "stock_name": "NSE:HARDWYN-BE",
        "full_stock_name": "HARDWYN INDIA LIMITED"
    },
    "NSE:HARIOMPIPE-EQ": {
        "stock_name": "NSE:HARIOMPIPE-EQ",
        "full_stock_name": "HARIOM PIPE INDUSTRIES L"
    },
    "NSE:HARRMALAYA-EQ": {
        "stock_name": "NSE:HARRMALAYA-EQ",
        "full_stock_name": "HARRISON MALAYALAM LTD"
    },
    "NSE:HARSHA-EQ": {
        "stock_name": "NSE:HARSHA-EQ",
        "full_stock_name": "HARSHA ENGINEERS INT LTD"
    },
    "NSE:HATHWAY-EQ": {
        "stock_name": "NSE:HATHWAY-EQ",
        "full_stock_name": "HATHWAY CABLE & DATACOM"
    },
    "NSE:HATSUN-EQ": {
        "stock_name": "NSE:HATSUN-EQ",
        "full_stock_name": "HATSUN AGRO PRODUCT LTD."
    },
    "NSE:HAVELLS-EQ": {
        "stock_name": "NSE:HAVELLS-EQ",
        "full_stock_name": "HAVELLS INDIA LIMITED"
    },
    "NSE:HAVISHA-EQ": {
        "stock_name": "NSE:HAVISHA-EQ",
        "full_stock_name": "SRI HAVISHA HOSP & INFR L"
    },
    "NSE:HBLENGINE-EQ": {
        "stock_name": "NSE:HBLENGINE-EQ",
        "full_stock_name": "HBL ENGINEERING LTD"
    },
    "NSE:HBSL-BE": {
        "stock_name": "NSE:HBSL-BE",
        "full_stock_name": "HB STOCKHOLDINGS LIMITED"
    },
    "NSE:HCC-EQ": {
        "stock_name": "NSE:HCC-EQ",
        "full_stock_name": "HINDUSTAN CONSTRUCTION CO"
    },
    "NSE:HCG-EQ": {
        "stock_name": "NSE:HCG-EQ",
        "full_stock_name": "HEALTHCARE GLOB. ENT. LTD"
    },
    "NSE:HCLTECH-EQ": {
        "stock_name": "NSE:HCLTECH-EQ",
        "full_stock_name": "HCL TECHNOLOGIES LTD"
    },
    "NSE:HDBFS-EQ": {
        "stock_name": "NSE:HDBFS-EQ",
        "full_stock_name": "HDB FINANCIAL SERVICES L"
    },
    "NSE:HDFCAMC-EQ": {
        "stock_name": "NSE:HDFCAMC-EQ",
        "full_stock_name": "HDFC AMC LIMITED"
    },
    "NSE:HDFCBANK-EQ": {
        "stock_name": "NSE:HDFCBANK-EQ",
        "full_stock_name": "HDFC BANK LTD"
    },
    "NSE:HDFCBSE500-EQ": {
        "stock_name": "NSE:HDFCBSE500-EQ",
        "full_stock_name": "HDFCAMC - HDFCBSE500"
    },
    "NSE:HDFCGOLD-EQ": {
        "stock_name": "NSE:HDFCGOLD-EQ",
        "full_stock_name": "HDFC GOLD ETF"
    },
    "NSE:HDFCGROWTH-EQ": {
        "stock_name": "NSE:HDFCGROWTH-EQ",
        "full_stock_name": "HDFCAMC - HDFCGROWTH"
    },
    "NSE:HDFCLIFE-EQ": {
        "stock_name": "NSE:HDFCLIFE-EQ",
        "full_stock_name": "HDFC LIFE INS CO LTD"
    },
    "NSE:HDFCLIQUID-EQ": {
        "stock_name": "NSE:HDFCLIQUID-EQ",
        "full_stock_name": "HDFCAMC - HDFCLIQUID"
    },
    "NSE:HDFCLOWVOL-EQ": {
        "stock_name": "NSE:HDFCLOWVOL-EQ",
        "full_stock_name": "HDFCAMC - HDFCLOWVOL"
    },
    "NSE:HDFCMID150-EQ": {
        "stock_name": "NSE:HDFCMID150-EQ",
        "full_stock_name": "HDFCAMC - HDFCMID150"
    },
    "NSE:HDFCMOMENT-EQ": {
        "stock_name": "NSE:HDFCMOMENT-EQ",
        "full_stock_name": "HDFCAMC - HDFCMOMENT"
    },
    "NSE:HDFCNEXT50-EQ": {
        "stock_name": "NSE:HDFCNEXT50-EQ",
        "full_stock_name": "HDFCAMC - HDFCNEXT50"
    },
    "NSE:HDFCNIF100-EQ": {
        "stock_name": "NSE:HDFCNIF100-EQ",
        "full_stock_name": "HDFCAMC - HDFCNIF100"
    },
    "NSE:HDFCNIFBAN-EQ": {
        "stock_name": "NSE:HDFCNIFBAN-EQ",
        "full_stock_name": "HDFCAMC - HDFCNIFBAN"
    },
    "NSE:HDFCNIFIT-EQ": {
        "stock_name": "NSE:HDFCNIFIT-EQ",
        "full_stock_name": "HDFCAMC - HDFCNIFIT"
    },
    "NSE:HDFCPSUBK-EQ": {
        "stock_name": "NSE:HDFCPSUBK-EQ",
        "full_stock_name": "HDFCAMC HDFCPSUBK"
    },
    "NSE:HDFCPVTBAN-EQ": {
        "stock_name": "NSE:HDFCPVTBAN-EQ",
        "full_stock_name": "HDFCAMC - HDFCPVTBAN"
    },
    "NSE:HDFCQUAL-EQ": {
        "stock_name": "NSE:HDFCQUAL-EQ",
        "full_stock_name": "HDFCAMC - HDFCQUAL"
    },
    "NSE:HDFCSENSEX-EQ": {
        "stock_name": "NSE:HDFCSENSEX-EQ",
        "full_stock_name": "HDFCAMC - HDFCSENSEX"
    },
    "NSE:HDFCSILVER-EQ": {
        "stock_name": "NSE:HDFCSILVER-EQ",
        "full_stock_name": "HDFCAMC - HDFCSILVER"
    },
    "NSE:HDFCSML250-EQ": {
        "stock_name": "NSE:HDFCSML250-EQ",
        "full_stock_name": "HDFCAMC - HDFCSML250"
    },
    "NSE:HDFCVALUE-EQ": {
        "stock_name": "NSE:HDFCVALUE-EQ",
        "full_stock_name": "HDFCAMC - HDFCVALUE"
    },
    "NSE:HDIL-BZ": {
        "stock_name": "NSE:HDIL-BZ",
        "full_stock_name": "HOUSING DEV & INFRA LTD"
    },
    "NSE:HEADSUP-EQ": {
        "stock_name": "NSE:HEADSUP-EQ",
        "full_stock_name": "HEADS UP VENTURES LIMITED"
    },
    "NSE:HEALTHADD-EQ": {
        "stock_name": "NSE:HEALTHADD-EQ",
        "full_stock_name": "DSPAMC - HEALTHADD"
    },
    "NSE:HEALTHY-EQ": {
        "stock_name": "NSE:HEALTHY-EQ",
        "full_stock_name": "BIRLASLAMC - HEALTHY"
    },
    "NSE:HECPROJECT-EQ": {
        "stock_name": "NSE:HECPROJECT-EQ",
        "full_stock_name": "HEC INFRA PROJECTS LTD"
    },
    "NSE:HEG-EQ": {
        "stock_name": "NSE:HEG-EQ",
        "full_stock_name": "HEG LTD"
    },
    "NSE:HEIDELBERG-EQ": {
        "stock_name": "NSE:HEIDELBERG-EQ",
        "full_stock_name": "HEIDELBERGCEMENT (I) LTD"
    },
    "NSE:HEMIPROP-EQ": {
        "stock_name": "NSE:HEMIPROP-EQ",
        "full_stock_name": "HEMISPHERE PROP IND LTD"
    },
    "NSE:HERANBA-EQ": {
        "stock_name": "NSE:HERANBA-EQ",
        "full_stock_name": "HERANBA INDUSTRIES LTD"
    },
    "NSE:HERITGFOOD-EQ": {
        "stock_name": "NSE:HERITGFOOD-EQ",
        "full_stock_name": "HERITAGE FOODS LTD"
    },
    "NSE:HEROMOTOCO-EQ": {
        "stock_name": "NSE:HEROMOTOCO-EQ",
        "full_stock_name": "HERO MOTOCORP LIMITED"
    },
    "NSE:HESTERBIO-EQ": {
        "stock_name": "NSE:HESTERBIO-EQ",
        "full_stock_name": "HESTER BIOSCIENCES LTD"
    },
    "NSE:HEXATRADEX-EQ": {
        "stock_name": "NSE:HEXATRADEX-EQ",
        "full_stock_name": "HEXA TRADEX LIMITED"
    },
    "NSE:HEXT-EQ": {
        "stock_name": "NSE:HEXT-EQ",
        "full_stock_name": "HEXAWARE TECHNOLOGIES LTD"
    },
    "NSE:HFCL-EQ": {
        "stock_name": "NSE:HFCL-EQ",
        "full_stock_name": "HFCL LIMITED"
    },
    "NSE:HGINFRA-EQ": {
        "stock_name": "NSE:HGINFRA-EQ",
        "full_stock_name": "H.G.INFRA ENGINEERING LTD"
    },
    "NSE:HGM-EQ": {
        "stock_name": "NSE:HGM-EQ",
        "full_stock_name": "HANDSON GBL MNGMNT LTD"
    },
    "NSE:HGS-EQ": {
        "stock_name": "NSE:HGS-EQ",
        "full_stock_name": "HINDUJA GLOBAL SOLS. LTD."
    },
    "NSE:HIKAL-EQ": {
        "stock_name": "NSE:HIKAL-EQ",
        "full_stock_name": "HIKAL LIMITED"
    },
    "NSE:HILINFRA-EQ": {
        "stock_name": "NSE:HILINFRA-EQ",
        "full_stock_name": "HIGHWAY INFRASTRUCTURE L"
    },
    "NSE:HILTON-EQ": {
        "stock_name": "NSE:HILTON-EQ",
        "full_stock_name": "HILTON METAL FORGING LTD"
    },
    "NSE:HIMATSEIDE-EQ": {
        "stock_name": "NSE:HIMATSEIDE-EQ",
        "full_stock_name": "HIMATSINGKA SEIDE LTD"
    },
    "NSE:HINDALCO-EQ": {
        "stock_name": "NSE:HINDALCO-EQ",
        "full_stock_name": "HINDALCO  INDUSTRIES  LTD"
    },
    "NSE:HINDCOMPOS-EQ": {
        "stock_name": "NSE:HINDCOMPOS-EQ",
        "full_stock_name": "HINDUSTAN COMPOSITES LTD."
    },
    "NSE:HINDCON-EQ": {
        "stock_name": "NSE:HINDCON-EQ",
        "full_stock_name": "HINDCON CHEMICALS LIMITED"
    },
    "NSE:HINDCOPPER-EQ": {
        "stock_name": "NSE:HINDCOPPER-EQ",
        "full_stock_name": "HINDUSTAN COPPER LTD"
    },
    "NSE:HINDOILEXP-EQ": {
        "stock_name": "NSE:HINDOILEXP-EQ",
        "full_stock_name": "HINDUSTAN OIL EXPLORATION"
    },
    "NSE:HINDPETRO-EQ": {
        "stock_name": "NSE:HINDPETRO-EQ",
        "full_stock_name": "HINDUSTAN PETROLEUM CORP"
    },
    "NSE:HINDUNILVR-EQ": {
        "stock_name": "NSE:HINDUNILVR-EQ",
        "full_stock_name": "HINDUSTAN UNILEVER LTD."
    },
    "NSE:HINDWAREAP-EQ": {
        "stock_name": "NSE:HINDWAREAP-EQ",
        "full_stock_name": "HINDWARE HME INOVATON LTD"
    },
    "NSE:HINDZINC-EQ": {
        "stock_name": "NSE:HINDZINC-EQ",
        "full_stock_name": "HINDUSTAN ZINC LIMITED"
    },
    "NSE:HIRECT-EQ": {
        "stock_name": "NSE:HIRECT-EQ",
        "full_stock_name": "HIND RECTIFIER LIMITED"
    },
    "NSE:HISARMETAL-EQ": {
        "stock_name": "NSE:HISARMETAL-EQ",
        "full_stock_name": "HISAR METAL IND. LIMITED"
    },
    "NSE:HITECH-EQ": {
        "stock_name": "NSE:HITECH-EQ",
        "full_stock_name": "HI-TECH PIPES LIMITED"
    },
    "NSE:HITECHCORP-EQ": {
        "stock_name": "NSE:HITECHCORP-EQ",
        "full_stock_name": "HITECH CORPORATION LTD"
    },
    "NSE:HITECHGEAR-BE": {
        "stock_name": "NSE:HITECHGEAR-BE",
        "full_stock_name": "THE HI-TECH GEARS LIMITED"
    },
    "NSE:HLEGLAS-EQ": {
        "stock_name": "NSE:HLEGLAS-EQ",
        "full_stock_name": "HLE GLASCOAT LIMITED"
    },
    "NSE:HLVLTD-EQ": {
        "stock_name": "NSE:HLVLTD-EQ",
        "full_stock_name": "HLV LIMITED"
    },
    "NSE:HMAAGRO-EQ": {
        "stock_name": "NSE:HMAAGRO-EQ",
        "full_stock_name": "HMA AGRO INDUSTRIES LTD"
    },
    "NSE:HMT-BZ": {
        "stock_name": "NSE:HMT-BZ",
        "full_stock_name": "HMT LTD -"
    },
    "NSE:HMVL-EQ": {
        "stock_name": "NSE:HMVL-EQ",
        "full_stock_name": "HINDUSTAN MEDIA VENT LTD"
    },
    "NSE:HNDFDS-EQ": {
        "stock_name": "NSE:HNDFDS-EQ",
        "full_stock_name": "HINDUSTAN FOODS LIMITED"
    },
    "NSE:HNGSNGBEES-EQ": {
        "stock_name": "NSE:HNGSNGBEES-EQ",
        "full_stock_name": "NIP IND ETF HANGSENG BEES"
    },
    "NSE:HOMEFIRST-EQ": {
        "stock_name": "NSE:HOMEFIRST-EQ",
        "full_stock_name": "HOME FIRST FIN CO IND LTD"
    },
    "NSE:HONASA-EQ": {
        "stock_name": "NSE:HONASA-EQ",
        "full_stock_name": "HONASA CONSUMER LIMITED"
    },
    "NSE:HONAUT-EQ": {
        "stock_name": "NSE:HONAUT-EQ",
        "full_stock_name": "HONEYWELL AUTOMATION IND"
    },
    "NSE:HONDAPOWER-EQ": {
        "stock_name": "NSE:HONDAPOWER-EQ",
        "full_stock_name": "HONDA I POWER PRODUCT LTD"
    },
    "NSE:HPAL-EQ": {
        "stock_name": "NSE:HPAL-EQ",
        "full_stock_name": "HP ADHESIVES LIMITED"
    },
    "NSE:HPIL-EQ": {
        "stock_name": "NSE:HPIL-EQ",
        "full_stock_name": "HINDPRAKASH INDUSTRY LTD"
    },
    "NSE:HPL-EQ": {
        "stock_name": "NSE:HPL-EQ",
        "full_stock_name": "HPL ELECTRIC & POWER LTD"
    },
    "NSE:HSCL-EQ": {
        "stock_name": "NSE:HSCL-EQ",
        "full_stock_name": "HIMADRI SPECIALITY CHEM L"
    },
    "NSE:HTMEDIA-EQ": {
        "stock_name": "NSE:HTMEDIA-EQ",
        "full_stock_name": "HT MEDIA LIMITED"
    },
    "NSE:HUBTOWN-EQ": {
        "stock_name": "NSE:HUBTOWN-EQ",
        "full_stock_name": "HUBTOWN LIMITED"
    },
    "NSE:HUDCO-EQ": {
        "stock_name": "NSE:HUDCO-EQ",
        "full_stock_name": "HSG & URBAN DEV CORPN LTD"
    },
    "NSE:HUHTAMAKI-EQ": {
        "stock_name": "NSE:HUHTAMAKI-EQ",
        "full_stock_name": "HUHTAMAKI INDIA LIMITED"
    },
    "NSE:HYBRIDFIN-EQ": {
        "stock_name": "NSE:HYBRIDFIN-EQ",
        "full_stock_name": "HYBRID FINANCIAL SERVICE"
    },
    "NSE:HYUNDAI-EQ": {
        "stock_name": "NSE:HYUNDAI-EQ",
        "full_stock_name": "HYUNDAI MOTOR INDIA LTD"
    },
    "NSE:IBULLSLTD-EQ": {
        "stock_name": "NSE:IBULLSLTD-EQ",
        "full_stock_name": "INDIABULLS LIMITED"
    },
    "NSE:ICDSLTD-EQ": {
        "stock_name": "NSE:ICDSLTD-EQ",
        "full_stock_name": "ICDS LTD"
    },
    "NSE:ICEMAKE-EQ": {
        "stock_name": "NSE:ICEMAKE-EQ",
        "full_stock_name": "ICE MAKE REFRIGERAT LTD"
    },
    "NSE:ICICIAMC-EQ": {
        "stock_name": "NSE:ICICIAMC-EQ",
        "full_stock_name": "ICICI PRUDENTIAL AMC LTD"
    },
    "NSE:ICICIB22-EQ": {
        "stock_name": "NSE:ICICIB22-EQ",
        "full_stock_name": "ICICIPRAMC - BHARATIWIN"
    },
    "NSE:ICICIBANK-EQ": {
        "stock_name": "NSE:ICICIBANK-EQ",
        "full_stock_name": "ICICI BANK LTD."
    },
    "NSE:ICICIGI-EQ": {
        "stock_name": "NSE:ICICIGI-EQ",
        "full_stock_name": "ICICI LOMBARD GIC LIMITED"
    },
    "NSE:ICICIPRULI-EQ": {
        "stock_name": "NSE:ICICIPRULI-EQ",
        "full_stock_name": "ICICI PRU LIFE INS CO LTD"
    },
    "NSE:ICIL-EQ": {
        "stock_name": "NSE:ICIL-EQ",
        "full_stock_name": "INDO COUNT INDUSTRIES LTD"
    },
    "NSE:ICRA-EQ": {
        "stock_name": "NSE:ICRA-EQ",
        "full_stock_name": "ICRA LIMITED"
    },
    "NSE:IDBI-EQ": {
        "stock_name": "NSE:IDBI-EQ",
        "full_stock_name": "IDBI BANK LIMITED"
    },
    "NSE:IDEA-EQ": {
        "stock_name": "NSE:IDEA-EQ",
        "full_stock_name": "VODAFONE IDEA LIMITED"
    },
    "NSE:IDEAFORGE-EQ": {
        "stock_name": "NSE:IDEAFORGE-EQ",
        "full_stock_name": "IDEAFORGE TECHNO LTD"
    },
    "NSE:IDFCFIRSTB-EQ": {
        "stock_name": "NSE:IDFCFIRSTB-EQ",
        "full_stock_name": "IDFC FIRST BANK LIMITED"
    },
    "NSE:IEX-EQ": {
        "stock_name": "NSE:IEX-EQ",
        "full_stock_name": "INDIAN ENERGY EXC LTD"
    },
    "NSE:IFBAGRO-EQ": {
        "stock_name": "NSE:IFBAGRO-EQ",
        "full_stock_name": "IFB AGRO INDUSTRIES LTD"
    },
    "NSE:IFBIND-EQ": {
        "stock_name": "NSE:IFBIND-EQ",
        "full_stock_name": "IFB INDUSTRIES LTD"
    },
    "NSE:IFCI-EQ": {
        "stock_name": "NSE:IFCI-EQ",
        "full_stock_name": "IFCI LTD"
    },
    "NSE:IFGLEXPOR-EQ": {
        "stock_name": "NSE:IFGLEXPOR-EQ",
        "full_stock_name": "IFGL REFRACTORIES LIMITED"
    },
    "NSE:IGARASHI-EQ": {
        "stock_name": "NSE:IGARASHI-EQ",
        "full_stock_name": "IGARASHI MOTORS INDIA LTD"
    },
    "NSE:IGCL-EQ": {
        "stock_name": "NSE:IGCL-EQ",
        "full_stock_name": "INDOGULF CROPSCIENCES LTD"
    },
    "NSE:IGIL-EQ": {
        "stock_name": "NSE:IGIL-EQ",
        "full_stock_name": "INTERNATIO GEMM INS (I) L"
    },
    "NSE:IGL-EQ": {
        "stock_name": "NSE:IGL-EQ",
        "full_stock_name": "INDRAPRASTHA GAS LTD"
    },
    "NSE:IGPL-EQ": {
        "stock_name": "NSE:IGPL-EQ",
        "full_stock_name": "I G PETROCHEMICALS LTD"
    },
    "NSE:IIFL-EQ": {
        "stock_name": "NSE:IIFL-EQ",
        "full_stock_name": "IIFL FINANCE LIMITED"
    },
    "NSE:IIFLCAPS-EQ": {
        "stock_name": "NSE:IIFLCAPS-EQ",
        "full_stock_name": "IIFL CAPITAL SERVICES LTD"
    },
    "NSE:IITL-EQ": {
        "stock_name": "NSE:IITL-EQ",
        "full_stock_name": "INDUSTRIAL INV TRUST LTD"
    },
    "NSE:IKIO-EQ": {
        "stock_name": "NSE:IKIO-EQ",
        "full_stock_name": "IKIO TECHNOLOGIES LIMITED"
    },
    "NSE:IKS-EQ": {
        "stock_name": "NSE:IKS-EQ",
        "full_stock_name": "INVENTURUS KNOWLEDGE SO L"
    },
    "NSE:IL&FSENGG-BZ": {
        "stock_name": "NSE:IL&FSENGG-BZ",
        "full_stock_name": "IL&FS ENG AND CONS CO LTD"
    },
    "NSE:IL&FSTRANS-BZ": {
        "stock_name": "NSE:IL&FSTRANS-BZ",
        "full_stock_name": "IL&FS TRANS NET LTD"
    },
    "NSE:IMAGICAA-EQ": {
        "stock_name": "NSE:IMAGICAA-EQ",
        "full_stock_name": "IMAGICAAWORLD ENT LTD"
    },
    "NSE:IMFA-EQ": {
        "stock_name": "NSE:IMFA-EQ",
        "full_stock_name": "INDIAN METALS & FERRO"
    },
    "NSE:IMPAL-EQ": {
        "stock_name": "NSE:IMPAL-EQ",
        "full_stock_name": "IND MOTOR PART & ACC LTD"
    },
    "NSE:IMPEXFERRO-BZ": {
        "stock_name": "NSE:IMPEXFERRO-BZ",
        "full_stock_name": "IMPEX FERRO TECH LIMITED"
    },
    "NSE:INCREDIBLE-EQ": {
        "stock_name": "NSE:INCREDIBLE-EQ",
        "full_stock_name": "INCREDIBLE INDUSTRIES LTD"
    },
    "NSE:INDBANK-EQ": {
        "stock_name": "NSE:INDBANK-EQ",
        "full_stock_name": "INDBANK MERCH BANK"
    },
    "NSE:INDGN-EQ": {
        "stock_name": "NSE:INDGN-EQ",
        "full_stock_name": "INDEGENE LIMITED"
    },
    "NSE:INDHOTEL-EQ": {
        "stock_name": "NSE:INDHOTEL-EQ",
        "full_stock_name": "THE INDIAN HOTELS CO. LTD"
    },
    "NSE:INDIACEM-EQ": {
        "stock_name": "NSE:INDIACEM-EQ",
        "full_stock_name": "THE INDIA CEMENTS LIMITED"
    },
    "NSE:INDIAGLYCO-EQ": {
        "stock_name": "NSE:INDIAGLYCO-EQ",
        "full_stock_name": "INDIA GLYCOLS LTD"
    },
    "NSE:INDIAMART-EQ": {
        "stock_name": "NSE:INDIAMART-EQ",
        "full_stock_name": "INDIAMART INTERMESH LTD"
    },
    "NSE:INDIANB-EQ": {
        "stock_name": "NSE:INDIANB-EQ",
        "full_stock_name": "INDIAN BANK"
    },
    "NSE:INDIANCARD-EQ": {
        "stock_name": "NSE:INDIANCARD-EQ",
        "full_stock_name": "INDIAN CARD CLOTHING CO."
    },
    "NSE:INDIANHUME-EQ": {
        "stock_name": "NSE:INDIANHUME-EQ",
        "full_stock_name": "INDIAN HUME PIPE CO. LTD."
    },
    "NSE:INDIASHLTR-EQ": {
        "stock_name": "NSE:INDIASHLTR-EQ",
        "full_stock_name": "INDIA SHELTER FIN CORP L"
    },
    "NSE:INDIGO-EQ": {
        "stock_name": "NSE:INDIGO-EQ",
        "full_stock_name": "INTERGLOBE AVIATION LTD"
    },
    "NSE:INDIGOPNTS-EQ": {
        "stock_name": "NSE:INDIGOPNTS-EQ",
        "full_stock_name": "INDIGO PAINTS LIMITED"
    },
    "NSE:INDIQUBE-EQ": {
        "stock_name": "NSE:INDIQUBE-EQ",
        "full_stock_name": "INDIQUBE SPACES LIMITED"
    },
    "NSE:INDNIPPON-EQ": {
        "stock_name": "NSE:INDNIPPON-EQ",
        "full_stock_name": "INDIA NIPPON ELECT  LTD"
    },
    "NSE:INDOAMIN-EQ": {
        "stock_name": "NSE:INDOAMIN-EQ",
        "full_stock_name": "INDO AMINES LIMITED"
    },
    "NSE:INDOBORAX-EQ": {
        "stock_name": "NSE:INDOBORAX-EQ",
        "full_stock_name": "INDO BORAX & CHEMICAL LTD"
    },
    "NSE:INDOCO-EQ": {
        "stock_name": "NSE:INDOCO-EQ",
        "full_stock_name": "INDOCO REMEDIES LTD."
    },
    "NSE:INDOFARM-EQ": {
        "stock_name": "NSE:INDOFARM-EQ",
        "full_stock_name": "INDO FARM EQUIPMENT LTD"
    },
    "NSE:INDORAMA-EQ": {
        "stock_name": "NSE:INDORAMA-EQ",
        "full_stock_name": "INDO RAMA SYNTHETICS LTD"
    },
    "NSE:INDOSTAR-EQ": {
        "stock_name": "NSE:INDOSTAR-EQ",
        "full_stock_name": "INDOSTAR CAPITAL FIN LTD"
    },
    "NSE:INDOTECH-EQ": {
        "stock_name": "NSE:INDOTECH-EQ",
        "full_stock_name": "INDO TECH TRANSFORM LTD."
    },
    "NSE:INDOTHAI-EQ": {
        "stock_name": "NSE:INDOTHAI-EQ",
        "full_stock_name": "INDO THAI SEC LTD"
    },
    "NSE:INDOUS-EQ": {
        "stock_name": "NSE:INDOUS-EQ",
        "full_stock_name": "INDO US BIOTECH LTD"
    },
    "NSE:INDOWIND-EQ": {
        "stock_name": "NSE:INDOWIND-EQ",
        "full_stock_name": "INDOWIND ENERGY LTD"
    },
    "NSE:INDRAMEDCO-EQ": {
        "stock_name": "NSE:INDRAMEDCO-EQ",
        "full_stock_name": "INDRAPRASTHA MEDICAL CORP"
    },
    "NSE:INDSWFTLAB-EQ": {
        "stock_name": "NSE:INDSWFTLAB-EQ",
        "full_stock_name": "IND SWIFT LABORATORIES LT"
    },
    "NSE:INDTERRAIN-EQ": {
        "stock_name": "NSE:INDTERRAIN-EQ",
        "full_stock_name": "IND TERRAIN FASHIONS LTD"
    },
    "NSE:INDUSINDBK-EQ": {
        "stock_name": "NSE:INDUSINDBK-EQ",
        "full_stock_name": "INDUSIND BANK LIMITED"
    },
    "NSE:INDUSTOWER-EQ": {
        "stock_name": "NSE:INDUSTOWER-EQ",
        "full_stock_name": "INDUS TOWERS LIMITED"
    },
    "NSE:INFIBEAM-EQ": {
        "stock_name": "NSE:INFIBEAM-EQ",
        "full_stock_name": "INFIBEAM AVENUES LIMITED"
    },
    "NSE:INFOBEAN-EQ": {
        "stock_name": "NSE:INFOBEAN-EQ",
        "full_stock_name": "INFOBEANS TECHNO. LTD."
    },
    "NSE:INFOMEDIA-EQ": {
        "stock_name": "NSE:INFOMEDIA-EQ",
        "full_stock_name": "INFOMEDIA PRESS LIMITED"
    },
    "NSE:INFRABEES-EQ": {
        "stock_name": "NSE:INFRABEES-EQ",
        "full_stock_name": "NIP IND ETF INFRA BEES"
    },
    "NSE:INFY-EQ": {
        "stock_name": "NSE:INFY-EQ",
        "full_stock_name": "INFOSYS LIMITED"
    },
    "NSE:INGERRAND-EQ": {
        "stock_name": "NSE:INGERRAND-EQ",
        "full_stock_name": "INGERSOLL-RAND INDIA LTD"
    },
    "NSE:INNOVACAP-EQ": {
        "stock_name": "NSE:INNOVACAP-EQ",
        "full_stock_name": "INNOVA CAPTAB LIMITED"
    },
    "NSE:INNOVANA-EQ": {
        "stock_name": "NSE:INNOVANA-EQ",
        "full_stock_name": "INNOVANA THINKLABS LTD"
    },
    "NSE:INOXGREEN-EQ": {
        "stock_name": "NSE:INOXGREEN-EQ",
        "full_stock_name": "INOX GREEN ENERGY SER LTD"
    },
    "NSE:INOXINDIA-EQ": {
        "stock_name": "NSE:INOXINDIA-EQ",
        "full_stock_name": "INOX INDIA LIMITED"
    },
    "NSE:INOXWIND-EQ": {
        "stock_name": "NSE:INOXWIND-EQ",
        "full_stock_name": "INOX WIND LIMITED"
    },
    "NSE:INSECTICID-EQ": {
        "stock_name": "NSE:INSECTICID-EQ",
        "full_stock_name": "INSECTICIDES (I) LTD"
    },
    "NSE:INSPIRISYS-EQ": {
        "stock_name": "NSE:INSPIRISYS-EQ",
        "full_stock_name": "INSPIRISYS SOLUTIONS LTD"
    },
    "NSE:INTELLECT-EQ": {
        "stock_name": "NSE:INTELLECT-EQ",
        "full_stock_name": "INTELLECT DESIGN ARENA"
    },
    "NSE:INTENTECH-EQ": {
        "stock_name": "NSE:INTENTECH-EQ",
        "full_stock_name": "INTENSE TECHNOLOGIES LTD"
    },
    "NSE:INTERARCH-EQ": {
        "stock_name": "NSE:INTERARCH-EQ",
        "full_stock_name": "INTERARCH BLDNG SOLTN LTD"
    },
    "NSE:INTERNET-EQ": {
        "stock_name": "NSE:INTERNET-EQ",
        "full_stock_name": "MIRAEAMC - INTERNET"
    },
    "NSE:INTLCONV-EQ": {
        "stock_name": "NSE:INTLCONV-EQ",
        "full_stock_name": "INTL CONVEYORS LIMITED"
    },
    "NSE:INVENTURE-EQ": {
        "stock_name": "NSE:INVENTURE-EQ",
        "full_stock_name": "INVENTURE GRO & SEC LTD"
    },
    "NSE:IOB-EQ": {
        "stock_name": "NSE:IOB-EQ",
        "full_stock_name": "INDIAN OVERSEAS BANK"
    },
    "NSE:IOC-EQ": {
        "stock_name": "NSE:IOC-EQ",
        "full_stock_name": "INDIAN OIL CORP LTD"
    },
    "NSE:IOLCP-EQ": {
        "stock_name": "NSE:IOLCP-EQ",
        "full_stock_name": "IOL CHEM AND PHARMA LTD"
    },
    "NSE:IONEXCHANG-EQ": {
        "stock_name": "NSE:IONEXCHANG-EQ",
        "full_stock_name": "ION EXCHANGE (INDIA) LTD"
    },
    "NSE:IPCALAB-EQ": {
        "stock_name": "NSE:IPCALAB-EQ",
        "full_stock_name": "IPCA LABORATORIES LTD"
    },
    "NSE:IPL-EQ": {
        "stock_name": "NSE:IPL-EQ",
        "full_stock_name": "INDIA PESTICIDES LIMITED"
    },
    "NSE:IRB-EQ": {
        "stock_name": "NSE:IRB-EQ",
        "full_stock_name": "IRB INFRA DEV LTD."
    },
    "NSE:IRCON-EQ": {
        "stock_name": "NSE:IRCON-EQ",
        "full_stock_name": "IRCON INTERNATIONAL LTD"
    },
    "NSE:IRCTC-EQ": {
        "stock_name": "NSE:IRCTC-EQ",
        "full_stock_name": "INDIAN RAIL TOUR CORP LTD"
    },
    "NSE:IREDA-EQ": {
        "stock_name": "NSE:IREDA-EQ",
        "full_stock_name": "INDIAN RENEWABLE ENERGY"
    },
    "NSE:IRFC-EQ": {
        "stock_name": "NSE:IRFC-EQ",
        "full_stock_name": "INDIAN RAILWAY FIN CORP L"
    },
    "NSE:IRIS-EQ": {
        "stock_name": "NSE:IRIS-EQ",
        "full_stock_name": "IRIS REGTECH SOLUTION LTD"
    },
    "NSE:IRISDOREME-EQ": {
        "stock_name": "NSE:IRISDOREME-EQ",
        "full_stock_name": "IRIS CLOTHINGS LIMITED"
    },
    "NSE:IRMENERGY-EQ": {
        "stock_name": "NSE:IRMENERGY-EQ",
        "full_stock_name": "IRM ENERGY LIMITED"
    },
    "NSE:ISFT-EQ": {
        "stock_name": "NSE:ISFT-EQ",
        "full_stock_name": "INTRASOFT TECH. LTD"
    },
    "NSE:ISGEC-EQ": {
        "stock_name": "NSE:ISGEC-EQ",
        "full_stock_name": "ISGEC HEAVY ENG LTD"
    },
    "NSE:ISHANCH-EQ": {
        "stock_name": "NSE:ISHANCH-EQ",
        "full_stock_name": "ISHAN DYES N CHEMICALS L"
    },
    "NSE:IT-EQ": {
        "stock_name": "NSE:IT-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKIT"
    },
    "NSE:ITADD-EQ": {
        "stock_name": "NSE:ITADD-EQ",
        "full_stock_name": "DSPAMC - DSPIT"
    },
    "NSE:ITBEES-EQ": {
        "stock_name": "NSE:ITBEES-EQ",
        "full_stock_name": "NIP IND ETF IT"
    },
    "NSE:ITBETA-EQ": {
        "stock_name": "NSE:ITBETA-EQ",
        "full_stock_name": "UTIAMC-ITBETA"
    },
    "NSE:ITC-EQ": {
        "stock_name": "NSE:ITC-EQ",
        "full_stock_name": "ITC LTD"
    },
    "NSE:ITCHOTELS-EQ": {
        "stock_name": "NSE:ITCHOTELS-EQ",
        "full_stock_name": "ITC HOTELS LIMITED"
    },
    "NSE:ITDC-EQ": {
        "stock_name": "NSE:ITDC-EQ",
        "full_stock_name": "INDIA TOUR. DEV. CO. LTD."
    },
    "NSE:ITI-EQ": {
        "stock_name": "NSE:ITI-EQ",
        "full_stock_name": "ITI LTD"
    },
    "NSE:IVALUE-EQ": {
        "stock_name": "NSE:IVALUE-EQ",
        "full_stock_name": "IVALUE INFOSOLUTIONS LTD"
    },
    "NSE:IVC-EQ": {
        "stock_name": "NSE:IVC-EQ",
        "full_stock_name": "IL&FS INVESTMENT MANAGERS"
    },
    "NSE:IVP-EQ": {
        "stock_name": "NSE:IVP-EQ",
        "full_stock_name": "IVP LTD"
    },
    "NSE:IVZINGOLD-EQ": {
        "stock_name": "NSE:IVZINGOLD-EQ",
        "full_stock_name": "INVESCO INDIA GOLD ETF"
    },
    "NSE:IXIGO-EQ": {
        "stock_name": "NSE:IXIGO-EQ",
        "full_stock_name": "LE TRAVENUES TECHNOLOGY L"
    },
    "NSE:IZMO-EQ": {
        "stock_name": "NSE:IZMO-EQ",
        "full_stock_name": "IZMO LIMITED"
    },
    "NSE:J&KBANK-EQ": {
        "stock_name": "NSE:J&KBANK-EQ",
        "full_stock_name": "J & K BANK LTD."
    },
    "NSE:JAGRAN-EQ": {
        "stock_name": "NSE:JAGRAN-EQ",
        "full_stock_name": "JAGRAN PRAKASHAN LIMITED"
    },
    "NSE:JAGSNPHARM-EQ": {
        "stock_name": "NSE:JAGSNPHARM-EQ",
        "full_stock_name": "JAGSONPAL PHARMACEUTICALS"
    },
    "NSE:JAIBALAJI-EQ": {
        "stock_name": "NSE:JAIBALAJI-EQ",
        "full_stock_name": "JAI BALAJI INDUSTRIES LTD"
    },
    "NSE:JAICORPLTD-EQ": {
        "stock_name": "NSE:JAICORPLTD-EQ",
        "full_stock_name": "JAI CORP LIMITED"
    },
    "NSE:JAINREC-EQ": {
        "stock_name": "NSE:JAINREC-EQ",
        "full_stock_name": "JAIN RESOURCE RECYCLING L"
    },
    "NSE:JAIPURKURT-EQ": {
        "stock_name": "NSE:JAIPURKURT-EQ",
        "full_stock_name": "NANDANI CREATION LIMITED"
    },
    "NSE:JAMNAAUTO-EQ": {
        "stock_name": "NSE:JAMNAAUTO-EQ",
        "full_stock_name": "JAMNA AUTO IND LTD"
    },
    "NSE:JARO-EQ": {
        "stock_name": "NSE:JARO-EQ",
        "full_stock_name": "JARO INS OF TEC MG N RE L"
    },
    "NSE:JASH-EQ": {
        "stock_name": "NSE:JASH-EQ",
        "full_stock_name": "JASH ENGINEERING LIMITED"
    },
    "NSE:JAYAGROGN-EQ": {
        "stock_name": "NSE:JAYAGROGN-EQ",
        "full_stock_name": "JAYANT AGRO ORGANICS LTD"
    },
    "NSE:JAYBARMARU-EQ": {
        "stock_name": "NSE:JAYBARMARU-EQ",
        "full_stock_name": "JAY BHARAT MARUTI LTD"
    },
    "NSE:JAYKAY-EQ": {
        "stock_name": "NSE:JAYKAY-EQ",
        "full_stock_name": "JAYKAY ENTERPRISES LTD"
    },
    "NSE:JAYNECOIND-EQ": {
        "stock_name": "NSE:JAYNECOIND-EQ",
        "full_stock_name": "JAYASWAL NECO INDUSTR LTD"
    },
    "NSE:JAYSREETEA-EQ": {
        "stock_name": "NSE:JAYSREETEA-EQ",
        "full_stock_name": "JAYSHREE TEA & INDUSTRIES"
    },
    "NSE:JBCHEPHARM-EQ": {
        "stock_name": "NSE:JBCHEPHARM-EQ",
        "full_stock_name": "J B CHEMICALS AND PHARMA"
    },
    "NSE:JBMA-EQ": {
        "stock_name": "NSE:JBMA-EQ",
        "full_stock_name": "JBM AUTO LIMITED"
    },
    "NSE:JGCHEM-EQ": {
        "stock_name": "NSE:JGCHEM-EQ",
        "full_stock_name": "J.G.CHEMICALS LIMITED"
    },
    "NSE:JHS-EQ": {
        "stock_name": "NSE:JHS-EQ",
        "full_stock_name": "JHS SVEND. LAB. LTD"
    },
    "NSE:JINDALPHOT-EQ": {
        "stock_name": "NSE:JINDALPHOT-EQ",
        "full_stock_name": "JINDAL PHOTO LIMITED"
    },
    "NSE:JINDALPOLY-EQ": {
        "stock_name": "NSE:JINDALPOLY-EQ",
        "full_stock_name": "JINDAL POLY FILMS LIMITED"
    },
    "NSE:JINDALSAW-EQ": {
        "stock_name": "NSE:JINDALSAW-EQ",
        "full_stock_name": "JINDAL SAW LIMITED"
    },
    "NSE:JINDALSTEL-EQ": {
        "stock_name": "NSE:JINDALSTEL-EQ",
        "full_stock_name": "JINDAL STEEL LIMITED"
    },
    "NSE:JINDRILL-EQ": {
        "stock_name": "NSE:JINDRILL-EQ",
        "full_stock_name": "JINDAL DRILLING IND. LTD"
    },
    "NSE:JINDWORLD-EQ": {
        "stock_name": "NSE:JINDWORLD-EQ",
        "full_stock_name": "JINDAL WORLDWIDE LTD"
    },
    "NSE:JIOFIN-EQ": {
        "stock_name": "NSE:JIOFIN-EQ",
        "full_stock_name": "JIO FIN SERVICES LTD"
    },
    "NSE:JISLDVREQS-EQ": {
        "stock_name": "NSE:JISLDVREQS-EQ",
        "full_stock_name": "JAIN DVR EQUITY SHARES"
    },
    "NSE:JISLJALEQS-EQ": {
        "stock_name": "NSE:JISLJALEQS-EQ",
        "full_stock_name": "JAIN IRRIGATION SYSTEMS"
    },
    "NSE:JITFINFRA-EQ": {
        "stock_name": "NSE:JITFINFRA-EQ",
        "full_stock_name": "JITF INFRALOGISTICS LTD"
    },
    "NSE:JKCEMENT-EQ": {
        "stock_name": "NSE:JKCEMENT-EQ",
        "full_stock_name": "JK CEMENT LIMITED"
    },
    "NSE:JKIL-EQ": {
        "stock_name": "NSE:JKIL-EQ",
        "full_stock_name": "JKUMAR INFR.LTD."
    },
    "NSE:JKIPL-EQ": {
        "stock_name": "NSE:JKIPL-EQ",
        "full_stock_name": "JINKUSHAL INDUSTRIES LTD"
    },
    "NSE:JKLAKSHMI-EQ": {
        "stock_name": "NSE:JKLAKSHMI-EQ",
        "full_stock_name": "JK LAKSHMI CEMENT LTD"
    },
    "NSE:JKPAPER-EQ": {
        "stock_name": "NSE:JKPAPER-EQ",
        "full_stock_name": "JK PAPER LIMITED"
    },
    "NSE:JKTYRE-EQ": {
        "stock_name": "NSE:JKTYRE-EQ",
        "full_stock_name": "JK TYRE & INDUSTRIES LTD"
    },
    "NSE:JLHL-EQ": {
        "stock_name": "NSE:JLHL-EQ",
        "full_stock_name": "JUPITER LIFE LINE HOSP L"
    },
    "NSE:JMA-EQ": {
        "stock_name": "NSE:JMA-EQ",
        "full_stock_name": "JULLUNDUR MOT AGENCY LTD"
    },
    "NSE:JMFINANCIL-EQ": {
        "stock_name": "NSE:JMFINANCIL-EQ",
        "full_stock_name": "JM FINANCIAL LIMITED"
    },
    "NSE:JNKINDIA-EQ": {
        "stock_name": "NSE:JNKINDIA-EQ",
        "full_stock_name": "JNK INDIA LIMITED"
    },
    "NSE:JOCIL-EQ": {
        "stock_name": "NSE:JOCIL-EQ",
        "full_stock_name": "JOCIL LIMITED"
    },
    "NSE:JPOLYINVST-EQ": {
        "stock_name": "NSE:JPOLYINVST-EQ",
        "full_stock_name": "JIND POL INV & FIN CO LTD"
    },
    "NSE:JPPOWER-EQ": {
        "stock_name": "NSE:JPPOWER-EQ",
        "full_stock_name": "JAIPRAKASH POWER VEN. LTD"
    },
    "NSE:JSFB-EQ": {
        "stock_name": "NSE:JSFB-EQ",
        "full_stock_name": "JANA SMALL FIN BANK LTD"
    },
    "NSE:JSL-EQ": {
        "stock_name": "NSE:JSL-EQ",
        "full_stock_name": "JINDAL STAINLESS LIMITED"
    },
    "NSE:JSLL-EQ": {
        "stock_name": "NSE:JSLL-EQ",
        "full_stock_name": "JEENA SIKHO LIFECARE LTD"
    },
    "NSE:JSWCEMENT-EQ": {
        "stock_name": "NSE:JSWCEMENT-EQ",
        "full_stock_name": "JSW CEMENT LIMITED"
    },
    "NSE:JSWENERGY-EQ": {
        "stock_name": "NSE:JSWENERGY-EQ",
        "full_stock_name": "JSW ENERGY LIMITED"
    },
    "NSE:JSWHL-EQ": {
        "stock_name": "NSE:JSWHL-EQ",
        "full_stock_name": "JSW HOLDINGS LIMITED"
    },
    "NSE:JSWINFRA-EQ": {
        "stock_name": "NSE:JSWINFRA-EQ",
        "full_stock_name": "JSW INFRASTRUCTURE LTD"
    },
    "NSE:JSWSTEEL-EQ": {
        "stock_name": "NSE:JSWSTEEL-EQ",
        "full_stock_name": "JSW STEEL LIMITED"
    },
    "NSE:JTEKTINDIA-EQ": {
        "stock_name": "NSE:JTEKTINDIA-EQ",
        "full_stock_name": "JTEKT INDIA LIMITED"
    },
    "NSE:JTLIND-EQ": {
        "stock_name": "NSE:JTLIND-EQ",
        "full_stock_name": "JTL INDUSTRIES LIMITED"
    },
    "NSE:JUBLCPL-EQ": {
        "stock_name": "NSE:JUBLCPL-EQ",
        "full_stock_name": "JUBILANT AGRI N CON PRO L"
    },
    "NSE:JUBLFOOD-EQ": {
        "stock_name": "NSE:JUBLFOOD-EQ",
        "full_stock_name": "JUBILANT FOODWORKS LTD"
    },
    "NSE:JUBLINGREA-EQ": {
        "stock_name": "NSE:JUBLINGREA-EQ",
        "full_stock_name": "JUBILANT INGREVIA LIMITED"
    },
    "NSE:JUBLPHARMA-EQ": {
        "stock_name": "NSE:JUBLPHARMA-EQ",
        "full_stock_name": "JUBILANT PHARMOVA LTD"
    },
    "NSE:JUNIORBEES-EQ": {
        "stock_name": "NSE:JUNIORBEES-EQ",
        "full_stock_name": "NIP IND ETF JUNIOR BEES"
    },
    "NSE:JUNIPER-EQ": {
        "stock_name": "NSE:JUNIPER-EQ",
        "full_stock_name": "JUNIPER HOTELS LIMITED"
    },
    "NSE:JUSTDIAL-EQ": {
        "stock_name": "NSE:JUSTDIAL-EQ",
        "full_stock_name": "JUSTDIAL LTD."
    },
    "NSE:JWL-EQ": {
        "stock_name": "NSE:JWL-EQ",
        "full_stock_name": "JUPITER WAGONS LIMITED"
    },
    "NSE:JYOTHYLAB-EQ": {
        "stock_name": "NSE:JYOTHYLAB-EQ",
        "full_stock_name": "JYOTHY LABS LIMITED"
    },
    "NSE:JYOTICNC-EQ": {
        "stock_name": "NSE:JYOTICNC-EQ",
        "full_stock_name": "JYOTI CNC AUTOMATION LTD"
    },
    "NSE:JYOTISTRUC-EQ": {
        "stock_name": "NSE:JYOTISTRUC-EQ",
        "full_stock_name": "JYOTI STRUCTURES LTD"
    },
    "NSE:KABRAEXTRU-EQ": {
        "stock_name": "NSE:KABRAEXTRU-EQ",
        "full_stock_name": "KABRA EXTRUSION TECHNIK L"
    },
    "NSE:KAJARIACER-EQ": {
        "stock_name": "NSE:KAJARIACER-EQ",
        "full_stock_name": "KAJARIA CERAMICS LTD"
    },
    "NSE:KAKATCEM-EQ": {
        "stock_name": "NSE:KAKATCEM-EQ",
        "full_stock_name": "KAKATIYA CEM SUGAR &IND L"
    },
    "NSE:KALAMANDIR-EQ": {
        "stock_name": "NSE:KALAMANDIR-EQ",
        "full_stock_name": "SAI SILKS (KALAMANDIR) L"
    },
    "NSE:KALPATARU-EQ": {
        "stock_name": "NSE:KALPATARU-EQ",
        "full_stock_name": "KALPATARU LIMITED"
    },
    "NSE:KALYANI-BE": {
        "stock_name": "NSE:KALYANI-BE",
        "full_stock_name": "KALYANI COMMERCIALS LTD"
    },
    "NSE:KALYANIFRG-EQ": {
        "stock_name": "NSE:KALYANIFRG-EQ",
        "full_stock_name": "KALYANI FORGE LIMITED"
    },
    "NSE:KALYANKJIL-EQ": {
        "stock_name": "NSE:KALYANKJIL-EQ",
        "full_stock_name": "KALYAN JEWELLERS IND LTD"
    },
    "NSE:KAMATHOTEL-EQ": {
        "stock_name": "NSE:KAMATHOTEL-EQ",
        "full_stock_name": "KAMAT HOTELS (I) LTD"
    },
    "NSE:KAMDHENU-EQ": {
        "stock_name": "NSE:KAMDHENU-EQ",
        "full_stock_name": "KAMDHENU LIMITED"
    },
    "NSE:KAMOPAINTS-EQ": {
        "stock_name": "NSE:KAMOPAINTS-EQ",
        "full_stock_name": "KAMDHENU VENTURES LIMITED"
    },
    "NSE:KANANIIND-EQ": {
        "stock_name": "NSE:KANANIIND-EQ",
        "full_stock_name": "KANANI INDUSTRIES LTD"
    },
    "NSE:KANORICHEM-EQ": {
        "stock_name": "NSE:KANORICHEM-EQ",
        "full_stock_name": "KANORIA CHEMICALS & INDUS"
    },
    "NSE:KANPRPLA-EQ": {
        "stock_name": "NSE:KANPRPLA-EQ",
        "full_stock_name": "KANPUR PLASTIPACK LIMITED"
    },
    "NSE:KANSAINER-EQ": {
        "stock_name": "NSE:KANSAINER-EQ",
        "full_stock_name": "KANSAI NEROLAC PAINTS LTD"
    },
    "NSE:KAPSTON-BE": {
        "stock_name": "NSE:KAPSTON-BE",
        "full_stock_name": "KAPSTON SERVICES LIMITED"
    },
    "NSE:KARMAENG-EQ": {
        "stock_name": "NSE:KARMAENG-EQ",
        "full_stock_name": "KARMA ENERGY LIMITED"
    },
    "NSE:KARURVYSYA-EQ": {
        "stock_name": "NSE:KARURVYSYA-EQ",
        "full_stock_name": "KARUR VYSYA BANK LTD"
    },
    "NSE:KAUSHALYA-EQ": {
        "stock_name": "NSE:KAUSHALYA-EQ",
        "full_stock_name": "KAUSHALYA INFRA DEV LTD."
    },
    "NSE:KAVDEFENCE-EQ": {
        "stock_name": "NSE:KAVDEFENCE-EQ",
        "full_stock_name": "KAVVERI DFS & WIR TEC LTD"
    },
    "NSE:KAYA-EQ": {
        "stock_name": "NSE:KAYA-EQ",
        "full_stock_name": "KAYA LIMITED"
    },
    "NSE:KAYNES-EQ": {
        "stock_name": "NSE:KAYNES-EQ",
        "full_stock_name": "KAYNES TECHNOLOGY IND LTD"
    },
    "NSE:KCP-EQ": {
        "stock_name": "NSE:KCP-EQ",
        "full_stock_name": "KCP LTD"
    },
    "NSE:KCPSUGIND-EQ": {
        "stock_name": "NSE:KCPSUGIND-EQ",
        "full_stock_name": "KCP SUGAR IND CORP LTD."
    },
    "NSE:KDDL-EQ": {
        "stock_name": "NSE:KDDL-EQ",
        "full_stock_name": "KDDL LIMITED"
    },
    "NSE:KEC-EQ": {
        "stock_name": "NSE:KEC-EQ",
        "full_stock_name": "KEC INTL. LIMITED"
    },
    "NSE:KECL-EQ": {
        "stock_name": "NSE:KECL-EQ",
        "full_stock_name": "KIRLOSKAR ELECTRIC CO LTD"
    },
    "NSE:KEEPLEARN-EQ": {
        "stock_name": "NSE:KEEPLEARN-EQ",
        "full_stock_name": "DSJ KEEP LEARNING LTD"
    },
    "NSE:KEI-EQ": {
        "stock_name": "NSE:KEI-EQ",
        "full_stock_name": "KEI INDUSTRIES LTD."
    },
    "NSE:KELLTONTEC-EQ": {
        "stock_name": "NSE:KELLTONTEC-EQ",
        "full_stock_name": "KELLTON TECH SOL LTD"
    },
    "NSE:KERNEX-EQ": {
        "stock_name": "NSE:KERNEX-EQ",
        "full_stock_name": "KERNEX MICROSYS(I) LTD"
    },
    "NSE:KESORAMIND-BE": {
        "stock_name": "NSE:KESORAMIND-BE",
        "full_stock_name": "KESORAM INDUSTRIES LTD"
    },
    "NSE:KEYFINSERV-EQ": {
        "stock_name": "NSE:KEYFINSERV-EQ",
        "full_stock_name": "KEYNOTE FIN SERV LTD."
    },
    "NSE:KFINTECH-EQ": {
        "stock_name": "NSE:KFINTECH-EQ",
        "full_stock_name": "KFIN TECHNOLOGIES LIMITED"
    },
    "NSE:KHADIM-EQ": {
        "stock_name": "NSE:KHADIM-EQ",
        "full_stock_name": "KHADIM INDIA LIMITED"
    },
    "NSE:KHAICHEM-EQ": {
        "stock_name": "NSE:KHAICHEM-EQ",
        "full_stock_name": "KHAITAN CHEM & FERT LTD"
    },
    "NSE:KHAITANLTD-EQ": {
        "stock_name": "NSE:KHAITANLTD-EQ",
        "full_stock_name": "KHAITAN (INDIA)LTD."
    },
    "NSE:KHANDSE-EQ": {
        "stock_name": "NSE:KHANDSE-EQ",
        "full_stock_name": "KHANDWALA SECURITIES LTD"
    },
    "NSE:KICL-EQ": {
        "stock_name": "NSE:KICL-EQ",
        "full_stock_name": "KALYANI INVEST CO LTD"
    },
    "NSE:KILITCH-EQ": {
        "stock_name": "NSE:KILITCH-EQ",
        "full_stock_name": "KILITCH DRUGS INDIA LTD"
    },
    "NSE:KIMS-EQ": {
        "stock_name": "NSE:KIMS-EQ",
        "full_stock_name": "KRISHNA INST OF MED SCI L"
    },
    "NSE:KINGFA-EQ": {
        "stock_name": "NSE:KINGFA-EQ",
        "full_stock_name": "KINGFA SCI & TEC IND LTD."
    },
    "NSE:KIOCL-EQ": {
        "stock_name": "NSE:KIOCL-EQ",
        "full_stock_name": "KIOCL LIMITED"
    },
    "NSE:KIRIINDUS-EQ": {
        "stock_name": "NSE:KIRIINDUS-EQ",
        "full_stock_name": "KIRI INDUSTRIES LIMITED"
    },
    "NSE:KIRLOSBROS-EQ": {
        "stock_name": "NSE:KIRLOSBROS-EQ",
        "full_stock_name": "KIRLOSKAR BROTHERS LTD"
    },
    "NSE:KIRLOSENG-EQ": {
        "stock_name": "NSE:KIRLOSENG-EQ",
        "full_stock_name": "KIRLOSKAR OIL ENG LTD"
    },
    "NSE:KIRLOSIND-EQ": {
        "stock_name": "NSE:KIRLOSIND-EQ",
        "full_stock_name": "KIRLOSKAR INDUSTRIES LTD"
    },
    "NSE:KIRLPNU-EQ": {
        "stock_name": "NSE:KIRLPNU-EQ",
        "full_stock_name": "KIRLOSKAR PNEUMATIC COM L"
    },
    "NSE:KITEX-EQ": {
        "stock_name": "NSE:KITEX-EQ",
        "full_stock_name": "KITEX GARMENTS LTD"
    },
    "NSE:KKCL-EQ": {
        "stock_name": "NSE:KKCL-EQ",
        "full_stock_name": "KEWAL KIRAN CLOTHING LTD"
    },
    "NSE:KMEW-EQ": {
        "stock_name": "NSE:KMEW-EQ",
        "full_stock_name": "KNOWLEDGE MARINE & EN W L"
    },
    "NSE:KMSUGAR-EQ": {
        "stock_name": "NSE:KMSUGAR-EQ",
        "full_stock_name": "K M SUGAR MILLS LTD"
    },
    "NSE:KNAGRI-EQ": {
        "stock_name": "NSE:KNAGRI-EQ",
        "full_stock_name": "KN AGRI RESOURCES LIMITED"
    },
    "NSE:KNRCON-EQ": {
        "stock_name": "NSE:KNRCON-EQ",
        "full_stock_name": "KNR CONSTRU LTD."
    },
    "NSE:KOHINOOR-EQ": {
        "stock_name": "NSE:KOHINOOR-EQ",
        "full_stock_name": "KOHINOOR FOODS LIMITED"
    },
    "NSE:KOKUYOCMLN-EQ": {
        "stock_name": "NSE:KOKUYOCMLN-EQ",
        "full_stock_name": "KOKUYO CAMLIN LIMITED"
    },
    "NSE:KOLTEPATIL-EQ": {
        "stock_name": "NSE:KOLTEPATIL-EQ",
        "full_stock_name": "KOLTE PATIL DEV. LTD."
    },
    "NSE:KOPRAN-EQ": {
        "stock_name": "NSE:KOPRAN-EQ",
        "full_stock_name": "KOPRAN LTD"
    },
    "NSE:KOTAKBANK-EQ": {
        "stock_name": "NSE:KOTAKBANK-EQ",
        "full_stock_name": "KOTAK MAHINDRA BANK LTD"
    },
    "NSE:KOTARISUG-EQ": {
        "stock_name": "NSE:KOTARISUG-EQ",
        "full_stock_name": "KOTHARI SUG & CHEM LTD."
    },
    "NSE:KOTHARIPET-EQ": {
        "stock_name": "NSE:KOTHARIPET-EQ",
        "full_stock_name": "KOTHARI PETROCHEM LTD"
    },
    "NSE:KOTHARIPRO-EQ": {
        "stock_name": "NSE:KOTHARIPRO-EQ",
        "full_stock_name": "KOTHARI PRODUCTS LTD"
    },
    "NSE:KPEL-EQ": {
        "stock_name": "NSE:KPEL-EQ",
        "full_stock_name": "K.P. ENERGY LIMITED"
    },
    "NSE:KPIGREEN-EQ": {
        "stock_name": "NSE:KPIGREEN-EQ",
        "full_stock_name": "KPI GREEN ENERGY LIMITED"
    },
    "NSE:KPIL-EQ": {
        "stock_name": "NSE:KPIL-EQ",
        "full_stock_name": "KALPATARU PROJECT INT LTD"
    },
    "NSE:KPITTECH-EQ": {
        "stock_name": "NSE:KPITTECH-EQ",
        "full_stock_name": "KPIT TECHNOLOGIES LIMITED"
    },
    "NSE:KPRMILL-EQ": {
        "stock_name": "NSE:KPRMILL-EQ",
        "full_stock_name": "KPR MILL LTD."
    },
    "NSE:KRBL-EQ": {
        "stock_name": "NSE:KRBL-EQ",
        "full_stock_name": "KRBL LIMITED"
    },
    "NSE:KREBSBIO-EQ": {
        "stock_name": "NSE:KREBSBIO-EQ",
        "full_stock_name": "KREBS BIOCHEMICALS & IND"
    },
    "NSE:KRIDHANINF-EQ": {
        "stock_name": "NSE:KRIDHANINF-EQ",
        "full_stock_name": "KRIDHAN INFRA LIMITED"
    },
    "NSE:KRISHANA-EQ": {
        "stock_name": "NSE:KRISHANA-EQ",
        "full_stock_name": "KRISHANA PHOSCHEM LIMITED"
    },
    "NSE:KRISHIVAL-EQ": {
        "stock_name": "NSE:KRISHIVAL-EQ",
        "full_stock_name": "KRISHIVAL FOODS LIMITED"
    },
    "NSE:KRISHNADEF-EQ": {
        "stock_name": "NSE:KRISHNADEF-EQ",
        "full_stock_name": "KRISHNA DEF AND ALD IND L"
    },
    "NSE:KRITI-EQ": {
        "stock_name": "NSE:KRITI-EQ",
        "full_stock_name": "KRITI INDUSTRIES IND LTD"
    },
    "NSE:KRITIKA-EQ": {
        "stock_name": "NSE:KRITIKA-EQ",
        "full_stock_name": "KRITIKA WIRES LIMITED"
    },
    "NSE:KRITINUT-EQ": {
        "stock_name": "NSE:KRITINUT-EQ",
        "full_stock_name": "KRITI NUTRIENTS LIMITED"
    },
    "NSE:KRN-EQ": {
        "stock_name": "NSE:KRN-EQ",
        "full_stock_name": "KRN HEAT EXCHANGE N REF L"
    },
    "NSE:KRONOX-EQ": {
        "stock_name": "NSE:KRONOX-EQ",
        "full_stock_name": "KRONOX LAB SCIENCES LTD"
    },
    "NSE:KROSS-EQ": {
        "stock_name": "NSE:KROSS-EQ",
        "full_stock_name": "KROSS LIMITED"
    },
    "NSE:KRSNAA-EQ": {
        "stock_name": "NSE:KRSNAA-EQ",
        "full_stock_name": "KRSNAA DIAGNOSTICS LTD"
    },
    "NSE:KRYSTAL-EQ": {
        "stock_name": "NSE:KRYSTAL-EQ",
        "full_stock_name": "KRYSTAL INTEGRATED SER L"
    },
    "NSE:KSB-EQ": {
        "stock_name": "NSE:KSB-EQ",
        "full_stock_name": "KSB LIMITED"
    },
    "NSE:KSCL-EQ": {
        "stock_name": "NSE:KSCL-EQ",
        "full_stock_name": "KAVERI SEED CO. LTD."
    },
    "NSE:KSHINTL-EQ": {
        "stock_name": "NSE:KSHINTL-EQ",
        "full_stock_name": "KSH INTERNATIONAL LIMITED"
    },
    "NSE:KSHITIJPOL-EQ": {
        "stock_name": "NSE:KSHITIJPOL-EQ",
        "full_stock_name": "KSHITIJ POLYLINE LIMITED"
    },
    "NSE:KSL-EQ": {
        "stock_name": "NSE:KSL-EQ",
        "full_stock_name": "KALYANI STEELS LIMITED"
    },
    "NSE:KSOLVES-EQ": {
        "stock_name": "NSE:KSOLVES-EQ",
        "full_stock_name": "KSOLVES INDIA LIMITED"
    },
    "NSE:KSR-BE": {
        "stock_name": "NSE:KSR-BE",
        "full_stock_name": "KSR FOOTWEAR LIMITED"
    },
    "NSE:KTKBANK-EQ": {
        "stock_name": "NSE:KTKBANK-EQ",
        "full_stock_name": "KARNATAKA BANK LIMITED"
    },
    "NSE:KUANTUM-EQ": {
        "stock_name": "NSE:KUANTUM-EQ",
        "full_stock_name": "KUANTUM PAPERS LIMITED"
    },
    "NSE:LAGNAM-EQ": {
        "stock_name": "NSE:LAGNAM-EQ",
        "full_stock_name": "LAGNAM SPINTEX LIMITED"
    },
    "NSE:LAKPRE-BZ": {
        "stock_name": "NSE:LAKPRE-BZ",
        "full_stock_name": "LAKSHMI PRE SCRE LTD"
    },
    "NSE:LAL-EQ": {
        "stock_name": "NSE:LAL-EQ",
        "full_stock_name": "LORENZINI APPARELS LTD"
    },
    "NSE:LALPATHLAB-EQ": {
        "stock_name": "NSE:LALPATHLAB-EQ",
        "full_stock_name": "DR. LAL PATH LABS LTD."
    },
    "NSE:LAMBODHARA-EQ": {
        "stock_name": "NSE:LAMBODHARA-EQ",
        "full_stock_name": "LAMBODHARA TEXTILES LTD."
    },
    "NSE:LANCORHOL-BE": {
        "stock_name": "NSE:LANCORHOL-BE",
        "full_stock_name": "LANCOR HOLDINGS LIMITED"
    },
    "NSE:LANDMARK-EQ": {
        "stock_name": "NSE:LANDMARK-EQ",
        "full_stock_name": "LANDMARK CARS LIMITED"
    },
    "NSE:LAOPALA-EQ": {
        "stock_name": "NSE:LAOPALA-EQ",
        "full_stock_name": "LA OPALA RG LIMITED"
    },
    "NSE:LASA-EQ": {
        "stock_name": "NSE:LASA-EQ",
        "full_stock_name": "LASA SUPERGENERICS LTD"
    },
    "NSE:LATENTVIEW-EQ": {
        "stock_name": "NSE:LATENTVIEW-EQ",
        "full_stock_name": "LATENT VIEW ANALYTICS LTD"
    },
    "NSE:LATTEYS-BE": {
        "stock_name": "NSE:LATTEYS-BE",
        "full_stock_name": "LATTEYS INDUSTRIES LTD"
    },
    "NSE:LAURUSLABS-EQ": {
        "stock_name": "NSE:LAURUSLABS-EQ",
        "full_stock_name": "LAURUS LABS LIMITED"
    },
    "NSE:LAXMICOT-EQ": {
        "stock_name": "NSE:LAXMICOT-EQ",
        "full_stock_name": "LAXMI COTSPIN LIMITED"
    },
    "NSE:LAXMIDENTL-EQ": {
        "stock_name": "NSE:LAXMIDENTL-EQ",
        "full_stock_name": "LAXMI DENTAL LIMITED"
    },
    "NSE:LAXMIINDIA-EQ": {
        "stock_name": "NSE:LAXMIINDIA-EQ",
        "full_stock_name": "LAXMI INDIA FINANCE LTD"
    },
    "NSE:LCCINFOTEC-BE": {
        "stock_name": "NSE:LCCINFOTEC-BE",
        "full_stock_name": "LCC INFOTECH LTD"
    },
    "NSE:LEMERITE-EQ": {
        "stock_name": "NSE:LEMERITE-EQ",
        "full_stock_name": "LE MERITE EXPORTS LIMITED"
    },
    "NSE:LEMONTREE-EQ": {
        "stock_name": "NSE:LEMONTREE-EQ",
        "full_stock_name": "LEMON TREE HOTELS LTD"
    },
    "NSE:LENSKART-EQ": {
        "stock_name": "NSE:LENSKART-EQ",
        "full_stock_name": "LENSKART SOLUTIONS LTD"
    },
    "NSE:LEXUS-EQ": {
        "stock_name": "NSE:LEXUS-EQ",
        "full_stock_name": "LEXUS GRANITO (INDIA) LTD"
    },
    "NSE:LFIC-EQ": {
        "stock_name": "NSE:LFIC-EQ",
        "full_stock_name": "LAKSHMI FIN IND CORP LTD"
    },
    "NSE:LGBBROSLTD-EQ": {
        "stock_name": "NSE:LGBBROSLTD-EQ",
        "full_stock_name": "LG BALAKRISHNAN & BROS"
    },
    "NSE:LGEINDIA-EQ": {
        "stock_name": "NSE:LGEINDIA-EQ",
        "full_stock_name": "LG ELECTRONICS INDIA LTD"
    },
    "NSE:LGHL-EQ": {
        "stock_name": "NSE:LGHL-EQ",
        "full_stock_name": "LAXMI GOLDORNA HOUSE LTD"
    },
    "NSE:LIBAS-EQ": {
        "stock_name": "NSE:LIBAS-EQ",
        "full_stock_name": "LIBAS CONSU PRODUCTS LTD"
    },
    "NSE:LIBERTSHOE-EQ": {
        "stock_name": "NSE:LIBERTSHOE-EQ",
        "full_stock_name": "LIBERTY SHOES LTD"
    },
    "NSE:LICHSGFIN-EQ": {
        "stock_name": "NSE:LICHSGFIN-EQ",
        "full_stock_name": "LIC HOUSING FINANCE LTD"
    },
    "NSE:LICI-EQ": {
        "stock_name": "NSE:LICI-EQ",
        "full_stock_name": "LIFE INSURA CORP OF INDIA"
    },
    "NSE:LICMFGOLD-EQ": {
        "stock_name": "NSE:LICMFGOLD-EQ",
        "full_stock_name": "LIC MF - LIC GOLD ETF"
    },
    "NSE:LICNFNHGP-EQ": {
        "stock_name": "NSE:LICNFNHGP-EQ",
        "full_stock_name": "LICNAMC - LICNFNHGP"
    },
    "NSE:LICNMID100-EQ": {
        "stock_name": "NSE:LICNMID100-EQ",
        "full_stock_name": "LICNAMC - LICNMID100"
    },
    "NSE:LIKHITHA-EQ": {
        "stock_name": "NSE:LIKHITHA-EQ",
        "full_stock_name": "LIKHITHA INFRASTRUC LTD"
    },
    "NSE:LINC-EQ": {
        "stock_name": "NSE:LINC-EQ",
        "full_stock_name": "LINC LIMITED"
    },
    "NSE:LINCOLN-EQ": {
        "stock_name": "NSE:LINCOLN-EQ",
        "full_stock_name": "LINCOLN PHARMA LTD"
    },
    "NSE:LINDEINDIA-EQ": {
        "stock_name": "NSE:LINDEINDIA-EQ",
        "full_stock_name": "LINDE INDIA LIMITED"
    },
    "NSE:LIQGRWBEES-EQ": {
        "stock_name": "NSE:LIQGRWBEES-EQ",
        "full_stock_name": "NIPPONAMC - LIQGRWBEES"
    },
    "NSE:LIQUID-EQ": {
        "stock_name": "NSE:LIQUID-EQ",
        "full_stock_name": "MIRAEAMC - LIQUID"
    },
    "NSE:LIQUID1-EQ": {
        "stock_name": "NSE:LIQUID1-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKLIQ"
    },
    "NSE:LIQUIDADD-EQ": {
        "stock_name": "NSE:LIQUIDADD-EQ",
        "full_stock_name": "DSPAMC - LIQUIDADD"
    },
    "NSE:LIQUIDBEES-EQ": {
        "stock_name": "NSE:LIQUIDBEES-EQ",
        "full_stock_name": "NIP IND ETF LIQUID BEES"
    },
    "NSE:LIQUIDCASE-EQ": {
        "stock_name": "NSE:LIQUIDCASE-EQ",
        "full_stock_name": "ZERODHAAMC - LIQUIDCASE"
    },
    "NSE:LIQUIDPLUS-EQ": {
        "stock_name": "NSE:LIQUIDPLUS-EQ",
        "full_stock_name": "MIRAEAMC - LIQUIDPLUS"
    },
    "NSE:LIQUIDSBI-EQ": {
        "stock_name": "NSE:LIQUIDSBI-EQ",
        "full_stock_name": "SBIAMC - LIQUIDSBI"
    },
    "NSE:LIQUIDSHRI-EQ": {
        "stock_name": "NSE:LIQUIDSHRI-EQ",
        "full_stock_name": "SHRIRAM - LIQUIDSHRI"
    },
    "NSE:LLOYDSENGG-EQ": {
        "stock_name": "NSE:LLOYDSENGG-EQ",
        "full_stock_name": "LLOYDS ENGG WORK LIMITED"
    },
    "NSE:LLOYDSENT-EQ": {
        "stock_name": "NSE:LLOYDSENT-EQ",
        "full_stock_name": "LLOYDS ENTERPRISES LTD"
    },
    "NSE:LLOYDSME-EQ": {
        "stock_name": "NSE:LLOYDSME-EQ",
        "full_stock_name": "LLOYDS METALS N ENERGY L"
    },
    "NSE:LMW-EQ": {
        "stock_name": "NSE:LMW-EQ",
        "full_stock_name": "LMW LIMITED"
    },
    "NSE:LODHA-EQ": {
        "stock_name": "NSE:LODHA-EQ",
        "full_stock_name": "LODHA DEVELOPERS LIMITED"
    },
    "NSE:LOKESHMACH-EQ": {
        "stock_name": "NSE:LOKESHMACH-EQ",
        "full_stock_name": "LOKESH MACHINES LTD"
    },
    "NSE:LORDSCHLO-EQ": {
        "stock_name": "NSE:LORDSCHLO-EQ",
        "full_stock_name": "LORDS CHLORO ALKALI LTD"
    },
    "NSE:LOTUSDEV-EQ": {
        "stock_name": "NSE:LOTUSDEV-EQ",
        "full_stock_name": "SRI LOTUS DEVLPRS N RTY L"
    },
    "NSE:LOTUSEYE-EQ": {
        "stock_name": "NSE:LOTUSEYE-EQ",
        "full_stock_name": "LOTUS EYE HOSP & INST L"
    },
    "NSE:LOVABLE-EQ": {
        "stock_name": "NSE:LOVABLE-EQ",
        "full_stock_name": "LOVABLE LINGERIE LTD"
    },
    "NSE:LOWVOL-EQ": {
        "stock_name": "NSE:LOWVOL-EQ",
        "full_stock_name": "MIRAEAMC - MANV30F"
    },
    "NSE:LOWVOL1-EQ": {
        "stock_name": "NSE:LOWVOL1-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKLOVOL"
    },
    "NSE:LOYALTEX-EQ": {
        "stock_name": "NSE:LOYALTEX-EQ",
        "full_stock_name": "LOYAL TEXTILE MILLS LTD"
    },
    "NSE:LPDC-EQ": {
        "stock_name": "NSE:LPDC-EQ",
        "full_stock_name": "LANDMARK PR.DEV.CO.LTD"
    },
    "NSE:LT-EQ": {
        "stock_name": "NSE:LT-EQ",
        "full_stock_name": "LARSEN & TOUBRO LTD."
    },
    "NSE:LTF-EQ": {
        "stock_name": "NSE:LTF-EQ",
        "full_stock_name": "L&T FINANCE LIMITED"
    },
    "NSE:LTFOODS-EQ": {
        "stock_name": "NSE:LTFOODS-EQ",
        "full_stock_name": "LT FOODS LIMITED"
    },
    "NSE:LTGILTBEES-EQ": {
        "stock_name": "NSE:LTGILTBEES-EQ",
        "full_stock_name": "NIP IND ETF LONGTERM GILT"
    },
    "NSE:LTGILTCASE-EQ": {
        "stock_name": "NSE:LTGILTCASE-EQ",
        "full_stock_name": "ZERODHAAMC - LTGILTCASE"
    },
    "NSE:LTIM-EQ": {
        "stock_name": "NSE:LTIM-EQ",
        "full_stock_name": "LTIMINDTREE LIMITED"
    },
    "NSE:LTTS-EQ": {
        "stock_name": "NSE:LTTS-EQ",
        "full_stock_name": "L&T TECHNOLOGY SER. LTD."
    },
    "NSE:LUMAXIND-EQ": {
        "stock_name": "NSE:LUMAXIND-EQ",
        "full_stock_name": "LUMAX INDUSTRIES LTD"
    },
    "NSE:LUMAXTECH-EQ": {
        "stock_name": "NSE:LUMAXTECH-EQ",
        "full_stock_name": "LUMAX AUTO TECH LTD"
    },
    "NSE:LUPIN-EQ": {
        "stock_name": "NSE:LUPIN-EQ",
        "full_stock_name": "LUPIN LIMITED"
    },
    "NSE:LUXIND-EQ": {
        "stock_name": "NSE:LUXIND-EQ",
        "full_stock_name": "LUX INDUSTRIES LIMITED"
    },
    "NSE:LXCHEM-EQ": {
        "stock_name": "NSE:LXCHEM-EQ",
        "full_stock_name": "LAXMI ORGANIC INDUS LTD"
    },
    "NSE:LYKALABS-EQ": {
        "stock_name": "NSE:LYKALABS-EQ",
        "full_stock_name": "LYKA LABS LTD"
    },
    "NSE:LYPSAGEMS-EQ": {
        "stock_name": "NSE:LYPSAGEMS-EQ",
        "full_stock_name": "LYPSA GEMS & JEWEL LTD"
    },
    "NSE:M&M-EQ": {
        "stock_name": "NSE:M&M-EQ",
        "full_stock_name": "MAHINDRA & MAHINDRA LTD"
    },
    "NSE:M&MFIN-EQ": {
        "stock_name": "NSE:M&MFIN-EQ",
        "full_stock_name": "M&M FIN. SERVICES LTD"
    },
    "NSE:MAANALU-BE": {
        "stock_name": "NSE:MAANALU-BE",
        "full_stock_name": "MAAN ALUMINIUM LIMITED"
    },
    "NSE:MACPOWER-EQ": {
        "stock_name": "NSE:MACPOWER-EQ",
        "full_stock_name": "MACPOWER CNC MACHINES LTD"
    },
    "NSE:MADHAV-EQ": {
        "stock_name": "NSE:MADHAV-EQ",
        "full_stock_name": "MADHAV MARBLE & GRANITE"
    },
    "NSE:MADHUCON-EQ": {
        "stock_name": "NSE:MADHUCON-EQ",
        "full_stock_name": "MADHUCON PROJECTS LTD."
    },
    "NSE:MADRASFERT-EQ": {
        "stock_name": "NSE:MADRASFERT-EQ",
        "full_stock_name": "MADRAS FERTILISERS LTD"
    },
    "NSE:MAFANG-EQ": {
        "stock_name": "NSE:MAFANG-EQ",
        "full_stock_name": "MIRAEAMC - MAFANG"
    },
    "NSE:MAGADSUGAR-EQ": {
        "stock_name": "NSE:MAGADSUGAR-EQ",
        "full_stock_name": "MAGADH SUGAR & ENERGY LTD"
    },
    "NSE:MAGNUM-EQ": {
        "stock_name": "NSE:MAGNUM-EQ",
        "full_stock_name": "MAGNUM VENTURES LTD."
    },
    "NSE:MAHABANK-EQ": {
        "stock_name": "NSE:MAHABANK-EQ",
        "full_stock_name": "BANK OF MAHARASHTRA"
    },
    "NSE:MAHAPEXLTD-EQ": {
        "stock_name": "NSE:MAHAPEXLTD-EQ",
        "full_stock_name": "MAHA RASHTRA APEX COPR. L"
    },
    "NSE:MAHASTEEL-BE": {
        "stock_name": "NSE:MAHASTEEL-BE",
        "full_stock_name": "MAHAMAYA STEEL INDS LTD"
    },
    "NSE:MAHEPC-EQ": {
        "stock_name": "NSE:MAHEPC-EQ",
        "full_stock_name": "MAHINDRA EPC IRRIG LTD"
    },
    "NSE:MAHESHWARI-EQ": {
        "stock_name": "NSE:MAHESHWARI-EQ",
        "full_stock_name": "MAHESHWARI LOGISTICS LTD."
    },
    "NSE:MAHKTECH-EQ": {
        "stock_name": "NSE:MAHKTECH-EQ",
        "full_stock_name": "MIRAEAMC - MAHKTECH"
    },
    "NSE:MAHLIFE-EQ": {
        "stock_name": "NSE:MAHLIFE-EQ",
        "full_stock_name": "MAHINDRA LIFESPACE DEVLTD"
    },
    "NSE:MAHLOG-EQ": {
        "stock_name": "NSE:MAHLOG-EQ",
        "full_stock_name": "MAHINDRA LOGISTIC LIMITED"
    },
    "NSE:MAHSCOOTER-EQ": {
        "stock_name": "NSE:MAHSCOOTER-EQ",
        "full_stock_name": "MAHARASHTRA SCOOTERS LTD"
    },
    "NSE:MAHSEAMLES-EQ": {
        "stock_name": "NSE:MAHSEAMLES-EQ",
        "full_stock_name": "MAHARASHTRA SEAMLESS LTD"
    },
    "NSE:MAITHANALL-EQ": {
        "stock_name": "NSE:MAITHANALL-EQ",
        "full_stock_name": "MAITHAN ALLOYS LTD"
    },
    "NSE:MAKEINDIA-EQ": {
        "stock_name": "NSE:MAKEINDIA-EQ",
        "full_stock_name": "MIRAEAMC - MAMFGETF"
    },
    "NSE:MALLCOM-EQ": {
        "stock_name": "NSE:MALLCOM-EQ",
        "full_stock_name": "MALLCOM (INDIA) LIMITED"
    },
    "NSE:MALUPAPER-EQ": {
        "stock_name": "NSE:MALUPAPER-EQ",
        "full_stock_name": "MALU PAPER MILLS LIMITED"
    },
    "NSE:MAMATA-EQ": {
        "stock_name": "NSE:MAMATA-EQ",
        "full_stock_name": "MAMATA MACHINERY LIMITED"
    },
    "NSE:MANAKALUCO-BE": {
        "stock_name": "NSE:MANAKALUCO-BE",
        "full_stock_name": "MANAK ALUMINIUM CO. LTD."
    },
    "NSE:MANAKCOAT-EQ": {
        "stock_name": "NSE:MANAKCOAT-EQ",
        "full_stock_name": "MAN COAT METAL & IND LTD"
    },
    "NSE:MANAKSIA-EQ": {
        "stock_name": "NSE:MANAKSIA-EQ",
        "full_stock_name": "MANAKSIA LTD."
    },
    "NSE:MANAKSTEEL-EQ": {
        "stock_name": "NSE:MANAKSTEEL-EQ",
        "full_stock_name": "MANAKSIA STEELS LTD"
    },
    "NSE:MANALIPETC-EQ": {
        "stock_name": "NSE:MANALIPETC-EQ",
        "full_stock_name": "MANALI PETROCHEMICALS LT"
    },
    "NSE:MANAPPURAM-EQ": {
        "stock_name": "NSE:MANAPPURAM-EQ",
        "full_stock_name": "MANAPPURAM FINANCE LTD"
    },
    "NSE:MANBA-EQ": {
        "stock_name": "NSE:MANBA-EQ",
        "full_stock_name": "MANBA FINANCE LIMITED"
    },
    "NSE:MANCREDIT-EQ": {
        "stock_name": "NSE:MANCREDIT-EQ",
        "full_stock_name": "MANGAL CREDIT N FINCORP L"
    },
    "NSE:MANGALAM-BE": {
        "stock_name": "NSE:MANGALAM-BE",
        "full_stock_name": "MANGALAM DRUG & CHEM LTD"
    },
    "NSE:MANGLMCEM-EQ": {
        "stock_name": "NSE:MANGLMCEM-EQ",
        "full_stock_name": "MANGALAM CEMENT LTD"
    },
    "NSE:MANINDS-EQ": {
        "stock_name": "NSE:MANINDS-EQ",
        "full_stock_name": "MAN INDUSTRIES (I) LTD."
    },
    "NSE:MANINFRA-EQ": {
        "stock_name": "NSE:MANINFRA-EQ",
        "full_stock_name": "MAN INFRA LTD"
    },
    "NSE:MANKIND-EQ": {
        "stock_name": "NSE:MANKIND-EQ",
        "full_stock_name": "MANKIND PHARMA LIMITED"
    },
    "NSE:MANOMAY-BE": {
        "stock_name": "NSE:MANOMAY-BE",
        "full_stock_name": "MANOMAY TEX INDIA LTD"
    },
    "NSE:MANORAMA-EQ": {
        "stock_name": "NSE:MANORAMA-EQ",
        "full_stock_name": "MANORAMA INDUSTRIES LTD"
    },
    "NSE:MANORG-EQ": {
        "stock_name": "NSE:MANORG-EQ",
        "full_stock_name": "MANGALAM ORGANICS LIMITED"
    },
    "NSE:MANUFGBEES-EQ": {
        "stock_name": "NSE:MANUFGBEES-EQ",
        "full_stock_name": "NIPPONAMC - MANUFGBEES"
    },
    "NSE:MANUGRAPH-EQ": {
        "stock_name": "NSE:MANUGRAPH-EQ",
        "full_stock_name": "MANUGRAPH INDIA LIMITED"
    },
    "NSE:MANYAVAR-EQ": {
        "stock_name": "NSE:MANYAVAR-EQ",
        "full_stock_name": "VEDANT FASHIONS LIMITED"
    },
    "NSE:MAPMYINDIA-EQ": {
        "stock_name": "NSE:MAPMYINDIA-EQ",
        "full_stock_name": "C.E. INFO SYSTEMS LIMITED"
    },
    "NSE:MARALOVER-EQ": {
        "stock_name": "NSE:MARALOVER-EQ",
        "full_stock_name": "MARAL OVERSEAS LTD"
    },
    "NSE:MARATHON-EQ": {
        "stock_name": "NSE:MARATHON-EQ",
        "full_stock_name": "MARATHON NXTGEN REALT LTD"
    },
    "NSE:MARICO-EQ": {
        "stock_name": "NSE:MARICO-EQ",
        "full_stock_name": "MARICO LIMITED"
    },
    "NSE:MARINE-EQ": {
        "stock_name": "NSE:MARINE-EQ",
        "full_stock_name": "MARINE ELECTRICAL (I) LTD"
    },
    "NSE:MARKOLINES-EQ": {
        "stock_name": "NSE:MARKOLINES-EQ",
        "full_stock_name": "MARKOLINES PAVEMENT TEC L"
    },
    "NSE:MARKSANS-EQ": {
        "stock_name": "NSE:MARKSANS-EQ",
        "full_stock_name": "MARKSANS PHARMA LIMITED"
    },
    "NSE:MARUTI-EQ": {
        "stock_name": "NSE:MARUTI-EQ",
        "full_stock_name": "MARUTI SUZUKI INDIA LTD."
    },
    "NSE:MASFIN-EQ": {
        "stock_name": "NSE:MASFIN-EQ",
        "full_stock_name": "MAS FINANCIAL SERV LTD"
    },
    "NSE:MASKINVEST-EQ": {
        "stock_name": "NSE:MASKINVEST-EQ",
        "full_stock_name": "MASK INVESTMENTS LIMITED"
    },
    "NSE:MASPTOP50-EQ": {
        "stock_name": "NSE:MASPTOP50-EQ",
        "full_stock_name": "MIRAEAMC - MASPTOP50"
    },
    "NSE:MASTEK-EQ": {
        "stock_name": "NSE:MASTEK-EQ",
        "full_stock_name": "MASTEK LTD"
    },
    "NSE:MASTERTR-EQ": {
        "stock_name": "NSE:MASTERTR-EQ",
        "full_stock_name": "MASTER TRUST LIMITED"
    },
    "NSE:MATRIMONY-EQ": {
        "stock_name": "NSE:MATRIMONY-EQ",
        "full_stock_name": "MATRIMONY.COM LIMITED"
    },
    "NSE:MAWANASUG-EQ": {
        "stock_name": "NSE:MAWANASUG-EQ",
        "full_stock_name": "MAWANA SUGARS LIMITED"
    },
    "NSE:MAXESTATES-EQ": {
        "stock_name": "NSE:MAXESTATES-EQ",
        "full_stock_name": "MAX ESTATES LIMITED"
    },
    "NSE:MAXHEALTH-EQ": {
        "stock_name": "NSE:MAXHEALTH-EQ",
        "full_stock_name": "MAX HEALTHCARE INS LTD"
    },
    "NSE:MAXIND-EQ": {
        "stock_name": "NSE:MAXIND-EQ",
        "full_stock_name": "MAX INDIA LIMITED"
    },
    "NSE:MAYURUNIQ-EQ": {
        "stock_name": "NSE:MAYURUNIQ-EQ",
        "full_stock_name": "MAYUR UNIQUOTERS LTD"
    },
    "NSE:MAZDA-EQ": {
        "stock_name": "NSE:MAZDA-EQ",
        "full_stock_name": "MAZDA LIMITED"
    },
    "NSE:MAZDOCK-EQ": {
        "stock_name": "NSE:MAZDOCK-EQ",
        "full_stock_name": "MAZAGON DOCK SHIPBUIL LTD"
    },
    "NSE:MBAPL-EQ": {
        "stock_name": "NSE:MBAPL-EQ",
        "full_stock_name": "MADHYA BHARAT AGRO P. LTD"
    },
    "NSE:MBEL-EQ": {
        "stock_name": "NSE:MBEL-EQ",
        "full_stock_name": "M AND B ENGINEERING LTD"
    },
    "NSE:MBLINFRA-EQ": {
        "stock_name": "NSE:MBLINFRA-EQ",
        "full_stock_name": "MBL INFRASTRUCTURE LTD"
    },
    "NSE:MCL-BE": {
        "stock_name": "NSE:MCL-BE",
        "full_stock_name": "MADHAV COPPER LIMITED"
    },
    "NSE:MCLEODRUSS-EQ": {
        "stock_name": "NSE:MCLEODRUSS-EQ",
        "full_stock_name": "MCLEOD RUSSEL INDIA LTD."
    },
    "NSE:MCLOUD-EQ": {
        "stock_name": "NSE:MCLOUD-EQ",
        "full_stock_name": "MAGELLANIC CLOUD LIMITED"
    },
    "NSE:MCX-EQ": {
        "stock_name": "NSE:MCX-EQ",
        "full_stock_name": "MULTI COMMODITY EXCHANGE"
    },
    "NSE:MEDANTA-EQ": {
        "stock_name": "NSE:MEDANTA-EQ",
        "full_stock_name": "GLOBAL HEALTH LIMITED"
    },
    "NSE:MEDIASSIST-EQ": {
        "stock_name": "NSE:MEDIASSIST-EQ",
        "full_stock_name": "MEDI ASSIST HEALTH SER L"
    },
    "NSE:MEDICAMEQ-EQ": {
        "stock_name": "NSE:MEDICAMEQ-EQ",
        "full_stock_name": "MEDICAMEN BIOTECH LIMITED"
    },
    "NSE:MEDICO-EQ": {
        "stock_name": "NSE:MEDICO-EQ",
        "full_stock_name": "MEDICO REMEDIES LIMITED"
    },
    "NSE:MEDPLUS-EQ": {
        "stock_name": "NSE:MEDPLUS-EQ",
        "full_stock_name": "MEDPLUS HEALTH SERV LTD"
    },
    "NSE:MEESHO-EQ": {
        "stock_name": "NSE:MEESHO-EQ",
        "full_stock_name": "MEESHO LIMITED"
    },
    "NSE:MEGASOFT-BE": {
        "stock_name": "NSE:MEGASOFT-BE",
        "full_stock_name": "MEGASOFT LTD"
    },
    "NSE:MEGASTAR-BE": {
        "stock_name": "NSE:MEGASTAR-BE",
        "full_stock_name": "MEGASTAR FOODS LIMITED"
    },
    "NSE:MEIL-EQ": {
        "stock_name": "NSE:MEIL-EQ",
        "full_stock_name": "MANGAL ELECTRICAL IND L"
    },
    "NSE:MENONBE-EQ": {
        "stock_name": "NSE:MENONBE-EQ",
        "full_stock_name": "MENON BEARINGS LIMITED"
    },
    "NSE:MEP-BZ": {
        "stock_name": "NSE:MEP-BZ",
        "full_stock_name": "MEP INFRA. DEVELOPERS LTD"
    },
    "NSE:METAL-EQ": {
        "stock_name": "NSE:METAL-EQ",
        "full_stock_name": "MIRAEAMC - METAL"
    },
    "NSE:METROBRAND-EQ": {
        "stock_name": "NSE:METROBRAND-EQ",
        "full_stock_name": "METRO BRANDS LIMITED"
    },
    "NSE:METROPOLIS-EQ": {
        "stock_name": "NSE:METROPOLIS-EQ",
        "full_stock_name": "METROPOLIS HEALTHCARE LTD"
    },
    "NSE:MFML-EQ": {
        "stock_name": "NSE:MFML-EQ",
        "full_stock_name": "MAHALAXMI FABRIC MILLS LT"
    },
    "NSE:MFSL-EQ": {
        "stock_name": "NSE:MFSL-EQ",
        "full_stock_name": "MAX FINANCIAL SERV LTD"
    },
    "NSE:MGEL-EQ": {
        "stock_name": "NSE:MGEL-EQ",
        "full_stock_name": "MANGALAM GLOBAL ENT LTD"
    },
    "NSE:MGL-EQ": {
        "stock_name": "NSE:MGL-EQ",
        "full_stock_name": "MAHANAGAR GAS LTD."
    },
    "NSE:MHLXMIRU-EQ": {
        "stock_name": "NSE:MHLXMIRU-EQ",
        "full_stock_name": "MAHALAXMI RUBTECH LIMITED"
    },
    "NSE:MHRIL-EQ": {
        "stock_name": "NSE:MHRIL-EQ",
        "full_stock_name": "MAHINDRA HOLIDAYS LTD"
    },
    "NSE:MICEL-EQ": {
        "stock_name": "NSE:MICEL-EQ",
        "full_stock_name": "MIC ELECTRONICS LTD"
    },
    "NSE:MID150-EQ": {
        "stock_name": "NSE:MID150-EQ",
        "full_stock_name": "KOTAKMAMC - MID150"
    },
    "NSE:MID150BEES-EQ": {
        "stock_name": "NSE:MID150BEES-EQ",
        "full_stock_name": "NIP IND ETF MIDCAP 150"
    },
    "NSE:MID150CASE-EQ": {
        "stock_name": "NSE:MID150CASE-EQ",
        "full_stock_name": "ZERODHAAMC - MID150CASE"
    },
    "NSE:MIDCAP-EQ": {
        "stock_name": "NSE:MIDCAP-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKMID50"
    },
    "NSE:MIDCAPADD-EQ": {
        "stock_name": "NSE:MIDCAPADD-EQ",
        "full_stock_name": "DSPAMC - MIDCAPADD"
    },
    "NSE:MIDCAPBETA-EQ": {
        "stock_name": "NSE:MIDCAPBETA-EQ",
        "full_stock_name": "UTIAMC-MIDCAPBETA"
    },
    "NSE:MIDHANI-EQ": {
        "stock_name": "NSE:MIDHANI-EQ",
        "full_stock_name": "MISHRA DHATU NIGAM LTD"
    },
    "NSE:MIDQ50ADD-EQ": {
        "stock_name": "NSE:MIDQ50ADD-EQ",
        "full_stock_name": "DSPAMC - DSPQ50ETF"
    },
    "NSE:MIDSMALL-EQ": {
        "stock_name": "NSE:MIDSMALL-EQ",
        "full_stock_name": "MIRAEAMC - MIDSMALL"
    },
    "NSE:MIDWESTLTD-EQ": {
        "stock_name": "NSE:MIDWESTLTD-EQ",
        "full_stock_name": "MIDWEST LIMITED"
    },
    "NSE:MINDACORP-EQ": {
        "stock_name": "NSE:MINDACORP-EQ",
        "full_stock_name": "MINDA CORPORATION LTD"
    },
    "NSE:MINDTECK-EQ": {
        "stock_name": "NSE:MINDTECK-EQ",
        "full_stock_name": "MINDTECK (INDIA) LIMITED"
    },
    "NSE:MIRCELECTR-EQ": {
        "stock_name": "NSE:MIRCELECTR-EQ",
        "full_stock_name": "MIRC ELECTRONICS LTD"
    },
    "NSE:MIRZAINT-EQ": {
        "stock_name": "NSE:MIRZAINT-EQ",
        "full_stock_name": "MIRZA INTERNATIONAL LIMIT"
    },
    "NSE:MITCON-EQ": {
        "stock_name": "NSE:MITCON-EQ",
        "full_stock_name": "MITCON CON & ENG SER LTD"
    },
    "NSE:MITTAL-EQ": {
        "stock_name": "NSE:MITTAL-EQ",
        "full_stock_name": "MITTAL LIFE STYLE LIMITED"
    },
    "NSE:MKPL-EQ": {
        "stock_name": "NSE:MKPL-EQ",
        "full_stock_name": "M K PROTEINS LIMITED"
    },
    "NSE:MMFL-EQ": {
        "stock_name": "NSE:MMFL-EQ",
        "full_stock_name": "MM FORGINGS LTD"
    },
    "NSE:MMP-EQ": {
        "stock_name": "NSE:MMP-EQ",
        "full_stock_name": "MMP INDUSTRIES LIMITED"
    },
    "NSE:MMTC-EQ": {
        "stock_name": "NSE:MMTC-EQ",
        "full_stock_name": "MMTC LIMITED"
    },
    "NSE:MNC-EQ": {
        "stock_name": "NSE:MNC-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKMNC"
    },
    "NSE:MOALPHA50-EQ": {
        "stock_name": "NSE:MOALPHA50-EQ",
        "full_stock_name": "MOTILALAMC - MOALPHA50"
    },
    "NSE:MOBIKWIK-EQ": {
        "stock_name": "NSE:MOBIKWIK-EQ",
        "full_stock_name": "ONE MOBIKWIK SYSTEMS LTD"
    },
    "NSE:MOCAPITAL-EQ": {
        "stock_name": "NSE:MOCAPITAL-EQ",
        "full_stock_name": "MOTILALAMC - MOCAPITAL"
    },
    "NSE:MODEFENCE-EQ": {
        "stock_name": "NSE:MODEFENCE-EQ",
        "full_stock_name": "MOTILALAMC - MODEFENCE"
    },
    "NSE:MODINATUR-EQ": {
        "stock_name": "NSE:MODINATUR-EQ",
        "full_stock_name": "MODI NATURALS LIMITED"
    },
    "NSE:MODIRUBBER-EQ": {
        "stock_name": "NSE:MODIRUBBER-EQ",
        "full_stock_name": "MODI RUBBER LTD"
    },
    "NSE:MODIS-EQ": {
        "stock_name": "NSE:MODIS-EQ",
        "full_stock_name": "MODIS NAVNIRMAN LTD"
    },
    "NSE:MODISONLTD-EQ": {
        "stock_name": "NSE:MODISONLTD-EQ",
        "full_stock_name": "MODISON LIMITED"
    },
    "NSE:MODTHREAD-EQ": {
        "stock_name": "NSE:MODTHREAD-EQ",
        "full_stock_name": "MODERN THREADS INDIA LTD"
    },
    "NSE:MOENERGY-EQ": {
        "stock_name": "NSE:MOENERGY-EQ",
        "full_stock_name": "MOTILALAMC - MOENERGY"
    },
    "NSE:MOGOLD-EQ": {
        "stock_name": "NSE:MOGOLD-EQ",
        "full_stock_name": "MOTILALAMC - MOGOLD"
    },
    "NSE:MOGSEC-EQ": {
        "stock_name": "NSE:MOGSEC-EQ",
        "full_stock_name": "MOTILALAMC - G5"
    },
    "NSE:MOHEALTH-EQ": {
        "stock_name": "NSE:MOHEALTH-EQ",
        "full_stock_name": "MOTILALAMC - MOHEALTH"
    },
    "NSE:MOHITIND-EQ": {
        "stock_name": "NSE:MOHITIND-EQ",
        "full_stock_name": "MOHIT INDUSTRIES LTD"
    },
    "NSE:MOIL-EQ": {
        "stock_name": "NSE:MOIL-EQ",
        "full_stock_name": "MOIL LIMITED"
    },
    "NSE:MOINFRA-EQ": {
        "stock_name": "NSE:MOINFRA-EQ",
        "full_stock_name": "MOTILALAMC - MOINFRA"
    },
    "NSE:MOIPO-EQ": {
        "stock_name": "NSE:MOIPO-EQ",
        "full_stock_name": "MOTILALAMC - MOIPO"
    },
    "NSE:MOKSH-EQ": {
        "stock_name": "NSE:MOKSH-EQ",
        "full_stock_name": "MOKSH ORNAMENTS LIMITED"
    },
    "NSE:MOL-EQ": {
        "stock_name": "NSE:MOL-EQ",
        "full_stock_name": "MEGHMANI ORGANICS LIMITED"
    },
    "NSE:MOLDTECH-EQ": {
        "stock_name": "NSE:MOLDTECH-EQ",
        "full_stock_name": "MOLD-TEK TECHNOLOGIES LTD"
    },
    "NSE:MOLDTKPAC-EQ": {
        "stock_name": "NSE:MOLDTKPAC-EQ",
        "full_stock_name": "MOLD-TEK PACKAGING LTD"
    },
    "NSE:MOLOWVOL-EQ": {
        "stock_name": "NSE:MOLOWVOL-EQ",
        "full_stock_name": "MOTILALAMC - MOLOWVOL"
    },
    "NSE:MOM100-EQ": {
        "stock_name": "NSE:MOM100-EQ",
        "full_stock_name": "MOTILAL OS MIDCAP100 ETF"
    },
    "NSE:MOM50-EQ": {
        "stock_name": "NSE:MOM50-EQ",
        "full_stock_name": "MOTILAL OSWAL M50 ETF"
    },
    "NSE:MOMENTUM-EQ": {
        "stock_name": "NSE:MOMENTUM-EQ",
        "full_stock_name": "BIRLASLAMC - MOMENTUM"
    },
    "NSE:MOMENTUM30-EQ": {
        "stock_name": "NSE:MOMENTUM30-EQ",
        "full_stock_name": "KOTAKMAMC - MOMENTUM30"
    },
    "NSE:MOMENTUM50-EQ": {
        "stock_name": "NSE:MOMENTUM50-EQ",
        "full_stock_name": "MOTILALAMC - MOMENTUM50"
    },
    "NSE:MOMGF-EQ": {
        "stock_name": "NSE:MOMGF-EQ",
        "full_stock_name": "MOTILALAMC - MOMGF"
    },
    "NSE:MOMIDMTM-EQ": {
        "stock_name": "NSE:MOMIDMTM-EQ",
        "full_stock_name": "MOTILALAMC - MOMIDMTM"
    },
    "NSE:MOMNC-EQ": {
        "stock_name": "NSE:MOMNC-EQ",
        "full_stock_name": "MOTILALAMC - MOMNC"
    },
    "NSE:MOMOMENTUM-EQ": {
        "stock_name": "NSE:MOMOMENTUM-EQ",
        "full_stock_name": "MOTILALAMC - MOMOMENTUM"
    },
    "NSE:MON100-EQ": {
        "stock_name": "NSE:MON100-EQ",
        "full_stock_name": "MOTILAL OS NASDAQ100 ETF"
    },
    "NSE:MON50EQUAL-EQ": {
        "stock_name": "NSE:MON50EQUAL-EQ",
        "full_stock_name": "MOTILALAMC - MON50EQUAL"
    },
    "NSE:MONARCH-EQ": {
        "stock_name": "NSE:MONARCH-EQ",
        "full_stock_name": "MONARCH NETWORTH CAP LTD"
    },
    "NSE:MONEXT50-EQ": {
        "stock_name": "NSE:MONEXT50-EQ",
        "full_stock_name": "MOTILALAMC - MONEXT50"
    },
    "NSE:MONEYBOXX-EQ": {
        "stock_name": "NSE:MONEYBOXX-EQ",
        "full_stock_name": "MONEYBOXX FINANCE LIMITED"
    },
    "NSE:MONQ50-EQ": {
        "stock_name": "NSE:MONQ50-EQ",
        "full_stock_name": "MOTILALAMC - MONQ50"
    },
    "NSE:MONTECARLO-EQ": {
        "stock_name": "NSE:MONTECARLO-EQ",
        "full_stock_name": "MONTE CARLO FASHIONS LTD."
    },
    "NSE:MOPSE-EQ": {
        "stock_name": "NSE:MOPSE-EQ",
        "full_stock_name": "MOTILALAMC - MOPSE"
    },
    "NSE:MOQUALITY-EQ": {
        "stock_name": "NSE:MOQUALITY-EQ",
        "full_stock_name": "MOTILALAMC - MOQUALITY"
    },
    "NSE:MOREALTY-EQ": {
        "stock_name": "NSE:MOREALTY-EQ",
        "full_stock_name": "MOTILALAMC - MOREALTY"
    },
    "NSE:MOREPENLAB-EQ": {
        "stock_name": "NSE:MOREPENLAB-EQ",
        "full_stock_name": "MOREPEN LAB. LTD"
    },
    "NSE:MOSCHIP-EQ": {
        "stock_name": "NSE:MOSCHIP-EQ",
        "full_stock_name": "MOSCHIP TECHNOLOGIES LTD"
    },
    "NSE:MOSERVICE-EQ": {
        "stock_name": "NSE:MOSERVICE-EQ",
        "full_stock_name": "MOTILALAMC - MOSERVICE"
    },
    "NSE:MOSILVER-EQ": {
        "stock_name": "NSE:MOSILVER-EQ",
        "full_stock_name": "MOTILALAMC - MOSILVER"
    },
    "NSE:MOSMALL250-EQ": {
        "stock_name": "NSE:MOSMALL250-EQ",
        "full_stock_name": "MOTILALAMC - MOSMALL250"
    },
    "NSE:MOTHERSON-EQ": {
        "stock_name": "NSE:MOTHERSON-EQ",
        "full_stock_name": "SAMVRDHNA MTHRSN INTL LTD"
    },
    "NSE:MOTILALOFS-EQ": {
        "stock_name": "NSE:MOTILALOFS-EQ",
        "full_stock_name": "MOTILAL OSWAL FIN LTD"
    },
    "NSE:MOTISONS-EQ": {
        "stock_name": "NSE:MOTISONS-EQ",
        "full_stock_name": "MOTISONS JEWELLERS LTD"
    },
    "NSE:MOTOGENFIN-EQ": {
        "stock_name": "NSE:MOTOGENFIN-EQ",
        "full_stock_name": "MOTOR & GENERAL FINANCE L"
    },
    "NSE:MOTOUR-EQ": {
        "stock_name": "NSE:MOTOUR-EQ",
        "full_stock_name": "MOTILALAMC - MOTOUR"
    },
    "NSE:MOVALUE-EQ": {
        "stock_name": "NSE:MOVALUE-EQ",
        "full_stock_name": "MOTILALAMC - MOVALUE"
    },
    "NSE:MPHASIS-EQ": {
        "stock_name": "NSE:MPHASIS-EQ",
        "full_stock_name": "MPHASIS LIMITED"
    },
    "NSE:MPSLTD-EQ": {
        "stock_name": "NSE:MPSLTD-EQ",
        "full_stock_name": "MPS LIMITED"
    },
    "NSE:MRF-EQ": {
        "stock_name": "NSE:MRF-EQ",
        "full_stock_name": "MRF LTD"
    },
    "NSE:MRPL-EQ": {
        "stock_name": "NSE:MRPL-EQ",
        "full_stock_name": "MRPL"
    },
    "NSE:MSCIADD-EQ": {
        "stock_name": "NSE:MSCIADD-EQ",
        "full_stock_name": "DSPAMC - MSCIADD"
    },
    "NSE:MSCIINDIA-EQ": {
        "stock_name": "NSE:MSCIINDIA-EQ",
        "full_stock_name": "KOTAKMAMC - MSCIINDIA"
    },
    "NSE:MSPL-EQ": {
        "stock_name": "NSE:MSPL-EQ",
        "full_stock_name": "MSP STEEL & POWER LTD."
    },
    "NSE:MSTCLTD-EQ": {
        "stock_name": "NSE:MSTCLTD-EQ",
        "full_stock_name": "MSTC LIMITED"
    },
    "NSE:MSUMI-EQ": {
        "stock_name": "NSE:MSUMI-EQ",
        "full_stock_name": "MOTHERSON SUMI WRNG IND L"
    },
    "NSE:MTARTECH-EQ": {
        "stock_name": "NSE:MTARTECH-EQ",
        "full_stock_name": "MTAR TECHNOLOGIES LIMITED"
    },
    "NSE:MTEDUCARE-BE": {
        "stock_name": "NSE:MTEDUCARE-BE",
        "full_stock_name": "MT EDUCARE LTD"
    },
    "NSE:MTNL-EQ": {
        "stock_name": "NSE:MTNL-EQ",
        "full_stock_name": "MAHANAGAR TELEPHONE NIGAM"
    },
    "NSE:MUFIN-EQ": {
        "stock_name": "NSE:MUFIN-EQ",
        "full_stock_name": "MUFIN GREEN FINANCE LTD"
    },
    "NSE:MUFTI-EQ": {
        "stock_name": "NSE:MUFTI-EQ",
        "full_stock_name": "CREDO BRANDS MARKETING L"
    },
    "NSE:MUKANDLTD-EQ": {
        "stock_name": "NSE:MUKANDLTD-EQ",
        "full_stock_name": "MUKAND LTD."
    },
    "NSE:MUKKA-EQ": {
        "stock_name": "NSE:MUKKA-EQ",
        "full_stock_name": "MUKKA PROTEINS LIMITED"
    },
    "NSE:MUKTAARTS-EQ": {
        "stock_name": "NSE:MUKTAARTS-EQ",
        "full_stock_name": "MUKTA ARTS LIMITED"
    },
    "NSE:MULTICAP-EQ": {
        "stock_name": "NSE:MULTICAP-EQ",
        "full_stock_name": "MIRAEAMC - MULTICAP"
    },
    "NSE:MUNJALAU-EQ": {
        "stock_name": "NSE:MUNJALAU-EQ",
        "full_stock_name": "MUNJAL AUTO IND. LTD."
    },
    "NSE:MUNJALSHOW-EQ": {
        "stock_name": "NSE:MUNJALSHOW-EQ",
        "full_stock_name": "MUNJAL SHOWA LTD"
    },
    "NSE:MURUDCERA-EQ": {
        "stock_name": "NSE:MURUDCERA-EQ",
        "full_stock_name": "MURUDESHWAR CERAMICS LTD"
    },
    "NSE:MUTHOOTCAP-EQ": {
        "stock_name": "NSE:MUTHOOTCAP-EQ",
        "full_stock_name": "MUTHOOT CAP SERV LTD"
    },
    "NSE:MUTHOOTFIN-EQ": {
        "stock_name": "NSE:MUTHOOTFIN-EQ",
        "full_stock_name": "MUTHOOT FINANCE LIMITED"
    },
    "NSE:MUTHOOTMF-EQ": {
        "stock_name": "NSE:MUTHOOTMF-EQ",
        "full_stock_name": "MUTHOOT MICROFIN LIMITED"
    },
    "NSE:MVGJL-EQ": {
        "stock_name": "NSE:MVGJL-EQ",
        "full_stock_name": "MANOJ VAIBHAV GEM N JEW L"
    },
    "NSE:MWL-EQ": {
        "stock_name": "NSE:MWL-EQ",
        "full_stock_name": "MANGALAM WORLDWIDE LTD"
    },
    "NSE:NACLIND-EQ": {
        "stock_name": "NSE:NACLIND-EQ",
        "full_stock_name": "NACL INDUSTRIES LIMITED"
    },
    "NSE:NAGAFERT-EQ": {
        "stock_name": "NSE:NAGAFERT-EQ",
        "full_stock_name": "NAGARJUN FERT AND CHE LTD"
    },
    "NSE:NAGREEKCAP-EQ": {
        "stock_name": "NSE:NAGREEKCAP-EQ",
        "full_stock_name": "NAGREEKA CAP & INFR.LTD"
    },
    "NSE:NAGREEKEXP-EQ": {
        "stock_name": "NSE:NAGREEKEXP-EQ",
        "full_stock_name": "NAGREEKA EXPORTS LTD."
    },
    "NSE:NAHARCAP-EQ": {
        "stock_name": "NSE:NAHARCAP-EQ",
        "full_stock_name": "NAHAR CAP & FIN."
    },
    "NSE:NAHARINDUS-EQ": {
        "stock_name": "NSE:NAHARINDUS-EQ",
        "full_stock_name": "NAHAR INDS ENT LTD"
    },
    "NSE:NAHARPOLY-EQ": {
        "stock_name": "NSE:NAHARPOLY-EQ",
        "full_stock_name": "NAHAR POLY FILMS LIMITED"
    },
    "NSE:NAHARSPING-EQ": {
        "stock_name": "NSE:NAHARSPING-EQ",
        "full_stock_name": "NAHAR SPINNING MILLS LTD."
    },
    "NSE:NARMADA-EQ": {
        "stock_name": "NSE:NARMADA-EQ",
        "full_stock_name": "NARMADA AGROBASE LIMITED"
    },
    "NSE:NATCAPSUQ-EQ": {
        "stock_name": "NSE:NATCAPSUQ-EQ",
        "full_stock_name": "NATURAL CAPSULES LIMITED"
    },
    "NSE:NATCOPHARM-EQ": {
        "stock_name": "NSE:NATCOPHARM-EQ",
        "full_stock_name": "NATCO PHARMA LTD."
    },
    "NSE:NATHBIOGEN-EQ": {
        "stock_name": "NSE:NATHBIOGEN-EQ",
        "full_stock_name": "NATH BIO-GENES (I) LTD"
    },
    "NSE:NATIONALUM-EQ": {
        "stock_name": "NSE:NATIONALUM-EQ",
        "full_stock_name": "NATIONAL ALUMINIUM CO LTD"
    },
    "NSE:NAUKRI-EQ": {
        "stock_name": "NSE:NAUKRI-EQ",
        "full_stock_name": "INFO EDGE (I) LTD"
    },
    "NSE:NAVA-EQ": {
        "stock_name": "NSE:NAVA-EQ",
        "full_stock_name": "NAVA LIMITED"
    },
    "NSE:NAVINFLUOR-EQ": {
        "stock_name": "NSE:NAVINFLUOR-EQ",
        "full_stock_name": "NAVIN FLUORINE INT. LTD"
    },
    "NSE:NAVKARCORP-EQ": {
        "stock_name": "NSE:NAVKARCORP-EQ",
        "full_stock_name": "NAVKAR CORPORATION LTD."
    },
    "NSE:NAVKARURB-BE": {
        "stock_name": "NSE:NAVKARURB-BE",
        "full_stock_name": "NAVKAR URBANSTRUCTURE LTD"
    },
    "NSE:NAVNETEDUL-EQ": {
        "stock_name": "NSE:NAVNETEDUL-EQ",
        "full_stock_name": "NAVNEET EDUCATION LTD"
    },
    "NSE:NAZARA-EQ": {
        "stock_name": "NSE:NAZARA-EQ",
        "full_stock_name": "NAZARA TECHNOLOGIES LTD"
    },
    "NSE:NBCC-EQ": {
        "stock_name": "NSE:NBCC-EQ",
        "full_stock_name": "NBCC (INDIA) LIMITED"
    },
    "NSE:NBIFIN-EQ": {
        "stock_name": "NSE:NBIFIN-EQ",
        "full_stock_name": "N.B.I. IND. FIN. CO. LTD"
    },
    "NSE:NCC-EQ": {
        "stock_name": "NSE:NCC-EQ",
        "full_stock_name": "NCC LIMITED"
    },
    "NSE:NCLIND-EQ": {
        "stock_name": "NSE:NCLIND-EQ",
        "full_stock_name": "NCL INDUSTRIES LIMITED"
    },
    "NSE:NDGL-EQ": {
        "stock_name": "NSE:NDGL-EQ",
        "full_stock_name": "NAGA DHUNSERI GROUP LTD"
    },
    "NSE:NDL-EQ": {
        "stock_name": "NSE:NDL-EQ",
        "full_stock_name": "NANDAN DENIM LIMITED"
    },
    "NSE:NDLVENTURE-EQ": {
        "stock_name": "NSE:NDLVENTURE-EQ",
        "full_stock_name": "NDL VENTURES LIMITED"
    },
    "NSE:NDRAUTO-EQ": {
        "stock_name": "NSE:NDRAUTO-EQ",
        "full_stock_name": "NDR AUTO COMPONENTS LTD"
    },
    "NSE:NDTV-EQ": {
        "stock_name": "NSE:NDTV-EQ",
        "full_stock_name": "NDTV LTD"
    },
    "NSE:NECCLTD-EQ": {
        "stock_name": "NSE:NECCLTD-EQ",
        "full_stock_name": "NORTH EAST CARRY CORP LTD"
    },
    "NSE:NECLIFE-BE": {
        "stock_name": "NSE:NECLIFE-BE",
        "full_stock_name": "NECTAR LIFESCIENCES LTD."
    },
    "NSE:NELCAST-EQ": {
        "stock_name": "NSE:NELCAST-EQ",
        "full_stock_name": "NELCAST LIMITED"
    },
    "NSE:NELCO-EQ": {
        "stock_name": "NSE:NELCO-EQ",
        "full_stock_name": "NELCO LTD"
    },
    "NSE:NEOGEN-EQ": {
        "stock_name": "NSE:NEOGEN-EQ",
        "full_stock_name": "NEOGEN CHEMICALS LIMITED"
    },
    "NSE:NEPHROPLUS-EQ": {
        "stock_name": "NSE:NEPHROPLUS-EQ",
        "full_stock_name": "NEPHROCARE HEALTH SERV L"
    },
    "NSE:NESCO-EQ": {
        "stock_name": "NSE:NESCO-EQ",
        "full_stock_name": "NESCO LTD."
    },
    "NSE:NESTLEIND-EQ": {
        "stock_name": "NSE:NESTLEIND-EQ",
        "full_stock_name": "NESTLE INDIA LIMITED"
    },
    "NSE:NETWEB-EQ": {
        "stock_name": "NSE:NETWEB-EQ",
        "full_stock_name": "NETWEB TECH INDIA LTD"
    },
    "NSE:NETWORK18-EQ": {
        "stock_name": "NSE:NETWORK18-EQ",
        "full_stock_name": "NETWORK18 MEDIA & INV LTD"
    },
    "NSE:NEULANDLAB-EQ": {
        "stock_name": "NSE:NEULANDLAB-EQ",
        "full_stock_name": "NEULAND LAB LTD."
    },
    "NSE:NEWGEN-EQ": {
        "stock_name": "NSE:NEWGEN-EQ",
        "full_stock_name": "NEWGEN SOFTWARE TECH LTD"
    },
    "NSE:NEXT30ADD-EQ": {
        "stock_name": "NSE:NEXT30ADD-EQ",
        "full_stock_name": "DSPAMC - NEXT30ADD"
    },
    "NSE:NEXT50-EQ": {
        "stock_name": "NSE:NEXT50-EQ",
        "full_stock_name": "MIRAEAMC - MANXT50"
    },
    "NSE:NEXT50ADD-EQ": {
        "stock_name": "NSE:NEXT50ADD-EQ",
        "full_stock_name": "DSPAMC - NEXT50ADD"
    },
    "NSE:NEXT50BETA-EQ": {
        "stock_name": "NSE:NEXT50BETA-EQ",
        "full_stock_name": "UTIAMC-NEXT50BETA"
    },
    "NSE:NEXTMEDIA-EQ": {
        "stock_name": "NSE:NEXTMEDIA-EQ",
        "full_stock_name": "NEXT MEDIAWORKS LIMITED"
    },
    "NSE:NFL-EQ": {
        "stock_name": "NSE:NFL-EQ",
        "full_stock_name": "NATIONAL FERT. LTD"
    },
    "NSE:NGIL-EQ": {
        "stock_name": "NSE:NGIL-EQ",
        "full_stock_name": "NAKODA GROUP OF IND. LTD"
    },
    "NSE:NGLFINE-EQ": {
        "stock_name": "NSE:NGLFINE-EQ",
        "full_stock_name": "NGL FINE CHEM LIMITED"
    },
    "NSE:NH-EQ": {
        "stock_name": "NSE:NH-EQ",
        "full_stock_name": "NARAYANA HRUDAYALAYA LTD."
    },
    "NSE:NHPC-EQ": {
        "stock_name": "NSE:NHPC-EQ",
        "full_stock_name": "NHPC LTD"
    },
    "NSE:NIACL-EQ": {
        "stock_name": "NSE:NIACL-EQ",
        "full_stock_name": "THE NEW INDIA ASSU CO LTD"
    },
    "NSE:NIBE-EQ": {
        "stock_name": "NSE:NIBE-EQ",
        "full_stock_name": "NIBE LIMITED"
    },
    "NSE:NIBL-EQ": {
        "stock_name": "NSE:NIBL-EQ",
        "full_stock_name": "NRB INDUS. BEARINGS LTD."
    },
    "NSE:NIF100BEES-EQ": {
        "stock_name": "NSE:NIF100BEES-EQ",
        "full_stock_name": "NIP IND ETF NIFTY 100"
    },
    "NSE:NIITLTD-EQ": {
        "stock_name": "NSE:NIITLTD-EQ",
        "full_stock_name": "NIIT LIMITED"
    },
    "NSE:NIITMTS-EQ": {
        "stock_name": "NSE:NIITMTS-EQ",
        "full_stock_name": "NIIT LEARNING SYSTEMS LTD"
    },
    "NSE:NILAINFRA-EQ": {
        "stock_name": "NSE:NILAINFRA-EQ",
        "full_stock_name": "NILA INFRASTRUCTURES LTD"
    },
    "NSE:NILASPACES-EQ": {
        "stock_name": "NSE:NILASPACES-EQ",
        "full_stock_name": "NILA SPACES LIMITED"
    },
    "NSE:NILKAMAL-EQ": {
        "stock_name": "NSE:NILKAMAL-EQ",
        "full_stock_name": "NILKAMAL LIMITED"
    },
    "NSE:NINSYS-EQ": {
        "stock_name": "NSE:NINSYS-EQ",
        "full_stock_name": "NINTEC SYSTEMS LIMITED"
    },
    "NSE:NIPPOBATRY-EQ": {
        "stock_name": "NSE:NIPPOBATRY-EQ",
        "full_stock_name": "INDO-NATIONAL LIMITED"
    },
    "NSE:NIRAJ-EQ": {
        "stock_name": "NSE:NIRAJ-EQ",
        "full_stock_name": "NIRAJ CEMENT STRUC LTD"
    },
    "NSE:NIRAJISPAT-EQ": {
        "stock_name": "NSE:NIRAJISPAT-EQ",
        "full_stock_name": "NIRAJ ISPAT IND LTD"
    },
    "NSE:NITCO-EQ": {
        "stock_name": "NSE:NITCO-EQ",
        "full_stock_name": "NITCO LIMITED"
    },
    "NSE:NITINSPIN-EQ": {
        "stock_name": "NSE:NITINSPIN-EQ",
        "full_stock_name": "NITIN SPINNERS LIMITED"
    },
    "NSE:NITIRAJ-EQ": {
        "stock_name": "NSE:NITIRAJ-EQ",
        "full_stock_name": "NITIRAJ ENGINEERS LTD"
    },
    "NSE:NIVABUPA-EQ": {
        "stock_name": "NSE:NIVABUPA-EQ",
        "full_stock_name": "NIVA BUPA HEALTH INS CO L"
    },
    "NSE:NKIND-EQ": {
        "stock_name": "NSE:NKIND-EQ",
        "full_stock_name": "NK INDUSTRIES LTD"
    },
    "NSE:NLCINDIA-EQ": {
        "stock_name": "NSE:NLCINDIA-EQ",
        "full_stock_name": "NLC INDIA LIMITED"
    },
    "NSE:NMDC-EQ": {
        "stock_name": "NSE:NMDC-EQ",
        "full_stock_name": "NMDC LTD."
    },
    "NSE:NOCIL-EQ": {
        "stock_name": "NSE:NOCIL-EQ",
        "full_stock_name": "NOCIL LIMITED"
    },
    "NSE:NOIDATOLL-EQ": {
        "stock_name": "NSE:NOIDATOLL-EQ",
        "full_stock_name": "NOIDA TOLL BRIDGE CO LTD"
    },
    "NSE:NORBTEAEXP-BE": {
        "stock_name": "NSE:NORBTEAEXP-BE",
        "full_stock_name": "NORBEN TEA &EXPORTS LTD"
    },
    "NSE:NORTHARC-EQ": {
        "stock_name": "NSE:NORTHARC-EQ",
        "full_stock_name": "NORTHERN ARC CAPITAL LTD"
    },
    "NSE:NOVAAGRI-EQ": {
        "stock_name": "NSE:NOVAAGRI-EQ",
        "full_stock_name": "NOVA AGRITECH LIMITED"
    },
    "NSE:NPBET-EQ": {
        "stock_name": "NSE:NPBET-EQ",
        "full_stock_name": "TATAAML - NPBET"
    },
    "NSE:NPST-EQ": {
        "stock_name": "NSE:NPST-EQ",
        "full_stock_name": "NETWORK PEOPLE SRV TECH L"
    },
    "NSE:NRAIL-EQ": {
        "stock_name": "NSE:NRAIL-EQ",
        "full_stock_name": "N R AGARWAL INDS LTD"
    },
    "NSE:NRBBEARING-EQ": {
        "stock_name": "NSE:NRBBEARING-EQ",
        "full_stock_name": "NRB BEARING LIMITED"
    },
    "NSE:NRL-EQ": {
        "stock_name": "NSE:NRL-EQ",
        "full_stock_name": "NUPUR RECYCLERS LIMITED"
    },
    "NSE:NSIL-EQ": {
        "stock_name": "NSE:NSIL-EQ",
        "full_stock_name": "NALWA SONS INVESTMENT LTD"
    },
    "NSE:NSLNISP-EQ": {
        "stock_name": "NSE:NSLNISP-EQ",
        "full_stock_name": "NMDC STEEL LIMITED"
    },
    "NSE:NTPC-EQ": {
        "stock_name": "NSE:NTPC-EQ",
        "full_stock_name": "NTPC LTD"
    },
    "NSE:NTPCGREEN-EQ": {
        "stock_name": "NSE:NTPCGREEN-EQ",
        "full_stock_name": "NTPC GREEN ENERGY LIMITED"
    },
    "NSE:NUCLEUS-EQ": {
        "stock_name": "NSE:NUCLEUS-EQ",
        "full_stock_name": "NUCLEUS SOFTWARE EXPORTS"
    },
    "NSE:NURECA-EQ": {
        "stock_name": "NSE:NURECA-EQ",
        "full_stock_name": "NURECA LIMITED"
    },
    "NSE:NUVAMA-EQ": {
        "stock_name": "NSE:NUVAMA-EQ",
        "full_stock_name": "NUVAMA WEALTH MANAGE LTD"
    },
    "NSE:NUVOCO-EQ": {
        "stock_name": "NSE:NUVOCO-EQ",
        "full_stock_name": "NUVOCO VISTAS CORP LTD"
    },
    "NSE:NV20-EQ": {
        "stock_name": "NSE:NV20-EQ",
        "full_stock_name": "KOTAKMAMC - KTKNV20ETF"
    },
    "NSE:NV20BEES-EQ": {
        "stock_name": "NSE:NV20BEES-EQ",
        "full_stock_name": "NIP IND ETF ETF NV20"
    },
    "NSE:NYKAA-EQ": {
        "stock_name": "NSE:NYKAA-EQ",
        "full_stock_name": "FSN E COMMERCE VENTURES"
    },
    "NSE:OAL-EQ": {
        "stock_name": "NSE:OAL-EQ",
        "full_stock_name": "ORIENTAL AROMATICS LTD"
    },
    "NSE:OBCL-EQ": {
        "stock_name": "NSE:OBCL-EQ",
        "full_stock_name": "ORISSA BENGAL CARRIER LTD"
    },
    "NSE:OBEROIRLTY-EQ": {
        "stock_name": "NSE:OBEROIRLTY-EQ",
        "full_stock_name": "OBEROI REALTY LIMITED"
    },
    "NSE:OCCLLTD-EQ": {
        "stock_name": "NSE:OCCLLTD-EQ",
        "full_stock_name": "OCCL LIMITED"
    },
    "NSE:ODIGMA-EQ": {
        "stock_name": "NSE:ODIGMA-EQ",
        "full_stock_name": "ODIGMA CONSULTANCY SOL L"
    },
    "NSE:OFSS-EQ": {
        "stock_name": "NSE:OFSS-EQ",
        "full_stock_name": "ORACLE FIN SERV SOFT LTD."
    },
    "NSE:OIL-EQ": {
        "stock_name": "NSE:OIL-EQ",
        "full_stock_name": "OIL INDIA LTD"
    },
    "NSE:OILCOUNTUB-EQ": {
        "stock_name": "NSE:OILCOUNTUB-EQ",
        "full_stock_name": "OIL COUNTRY TUBULAR LTD"
    },
    "NSE:OLAELEC-EQ": {
        "stock_name": "NSE:OLAELEC-EQ",
        "full_stock_name": "OLA ELECTRIC MOBILITY LTD"
    },
    "NSE:OLECTRA-EQ": {
        "stock_name": "NSE:OLECTRA-EQ",
        "full_stock_name": "OLECTRA GREENTECH LIMITED"
    },
    "NSE:OMAXAUTO-EQ": {
        "stock_name": "NSE:OMAXAUTO-EQ",
        "full_stock_name": "OMAX AUTOS LTD"
    },
    "NSE:OMAXE-EQ": {
        "stock_name": "NSE:OMAXE-EQ",
        "full_stock_name": "OMAXE LIMITED"
    },
    "NSE:OMFREIGHT-EQ": {
        "stock_name": "NSE:OMFREIGHT-EQ",
        "full_stock_name": "OM FREIGHT FORWARDERS LTD"
    },
    "NSE:OMINFRAL-EQ": {
        "stock_name": "NSE:OMINFRAL-EQ",
        "full_stock_name": "OM INFRA LIMITED"
    },
    "NSE:OMKARCHEM-BZ": {
        "stock_name": "NSE:OMKARCHEM-BZ",
        "full_stock_name": "OMKAR SPL CHEM LTD"
    },
    "NSE:ONELIFECAP-BE": {
        "stock_name": "NSE:ONELIFECAP-BE",
        "full_stock_name": "ONELIFE CAP ADVISORS LTD"
    },
    "NSE:ONEPOINT-EQ": {
        "stock_name": "NSE:ONEPOINT-EQ",
        "full_stock_name": "ONE POINT ONE SOL LTD"
    },
    "NSE:ONESOURCE-EQ": {
        "stock_name": "NSE:ONESOURCE-EQ",
        "full_stock_name": "ONESOURCE SPECL PHARMA L"
    },
    "NSE:ONGC-EQ": {
        "stock_name": "NSE:ONGC-EQ",
        "full_stock_name": "OIL AND NATURAL GAS CORP."
    },
    "NSE:ONMOBILE-EQ": {
        "stock_name": "NSE:ONMOBILE-EQ",
        "full_stock_name": "ONMOBILE GLOBAL LTD."
    },
    "NSE:ONWARDTEC-EQ": {
        "stock_name": "NSE:ONWARDTEC-EQ",
        "full_stock_name": "ONWARD TECHNOLOGIES LTD"
    },
    "NSE:OPTIEMUS-EQ": {
        "stock_name": "NSE:OPTIEMUS-EQ",
        "full_stock_name": "OPTIEMUS INFRACOM LTD"
    },
    "NSE:ORBTEXP-EQ": {
        "stock_name": "NSE:ORBTEXP-EQ",
        "full_stock_name": "ORBIT EXPORTS LIMITED"
    },
    "NSE:ORCHASP-EQ": {
        "stock_name": "NSE:ORCHASP-EQ",
        "full_stock_name": "ORCHASP LIMITED"
    },
    "NSE:ORCHPHARMA-EQ": {
        "stock_name": "NSE:ORCHPHARMA-EQ",
        "full_stock_name": "ORCHID PHARMA LIMITED"
    },
    "NSE:ORICONENT-BE": {
        "stock_name": "NSE:ORICONENT-BE",
        "full_stock_name": "ORICON ENTERPRISES LTD"
    },
    "NSE:ORIENTALTL-EQ": {
        "stock_name": "NSE:ORIENTALTL-EQ",
        "full_stock_name": "ORIENTAL TRIMEX LTD"
    },
    "NSE:ORIENTBELL-EQ": {
        "stock_name": "NSE:ORIENTBELL-EQ",
        "full_stock_name": "ORIENT BELL LIMITED"
    },
    "NSE:ORIENTCEM-EQ": {
        "stock_name": "NSE:ORIENTCEM-EQ",
        "full_stock_name": "ORIENT CEMENT LTD."
    },
    "NSE:ORIENTCER-EQ": {
        "stock_name": "NSE:ORIENTCER-EQ",
        "full_stock_name": "ORIENT CERATECH LIMITED"
    },
    "NSE:ORIENTELEC-EQ": {
        "stock_name": "NSE:ORIENTELEC-EQ",
        "full_stock_name": "ORIENT ELECTRIC LIMITED"
    },
    "NSE:ORIENTHOT-EQ": {
        "stock_name": "NSE:ORIENTHOT-EQ",
        "full_stock_name": "ORIENT HOTELS LTD"
    },
    "NSE:ORIENTLTD-EQ": {
        "stock_name": "NSE:ORIENTLTD-EQ",
        "full_stock_name": "ORIENT PRESS LIMITED"
    },
    "NSE:ORIENTPPR-EQ": {
        "stock_name": "NSE:ORIENTPPR-EQ",
        "full_stock_name": "ORIENT PAPER AND INDS LTD"
    },
    "NSE:ORIENTTECH-EQ": {
        "stock_name": "NSE:ORIENTTECH-EQ",
        "full_stock_name": "ORIENT TECHNOLOGIES LTD"
    },
    "NSE:ORISSAMINE-EQ": {
        "stock_name": "NSE:ORISSAMINE-EQ",
        "full_stock_name": "ORISSA MIN DEV CO LTD"
    },
    "NSE:ORKLAINDIA-EQ": {
        "stock_name": "NSE:ORKLAINDIA-EQ",
        "full_stock_name": "ORKLA INDIA LIMITED"
    },
    "NSE:ORTINGLOBE-BE": {
        "stock_name": "NSE:ORTINGLOBE-BE",
        "full_stock_name": "ORTIN GLOBAL LIMITED"
    },
    "NSE:OSIAHYPER-EQ": {
        "stock_name": "NSE:OSIAHYPER-EQ",
        "full_stock_name": "OSIA HYPER RETAIL LIMITED"
    },
    "NSE:OSWALAGRO-EQ": {
        "stock_name": "NSE:OSWALAGRO-EQ",
        "full_stock_name": "OSWAL AGRO MILLS LTD"
    },
    "NSE:OSWALGREEN-EQ": {
        "stock_name": "NSE:OSWALGREEN-EQ",
        "full_stock_name": "OSWAL GREENTECH LIMITED"
    },
    "NSE:OSWALPUMPS-EQ": {
        "stock_name": "NSE:OSWALPUMPS-EQ",
        "full_stock_name": "OSWAL PUMPS LIMITED"
    },
    "NSE:OSWALSEEDS-EQ": {
        "stock_name": "NSE:OSWALSEEDS-EQ",
        "full_stock_name": "SHREEOSWAL S AND CHE LTD"
    },
    "NSE:PACEDIGITK-EQ": {
        "stock_name": "NSE:PACEDIGITK-EQ",
        "full_stock_name": "PACE DIGITEK LIMITED"
    },
    "NSE:PAGEIND-EQ": {
        "stock_name": "NSE:PAGEIND-EQ",
        "full_stock_name": "PAGE INDUSTRIES LTD"
    },
    "NSE:PAISALO-EQ": {
        "stock_name": "NSE:PAISALO-EQ",
        "full_stock_name": "PAISALO DIGITAL LIMITED"
    },
    "NSE:PAKKA-EQ": {
        "stock_name": "NSE:PAKKA-EQ",
        "full_stock_name": "PAKKA LIMITED"
    },
    "NSE:PALASHSECU-EQ": {
        "stock_name": "NSE:PALASHSECU-EQ",
        "full_stock_name": "PALASH SECURITIES LTD"
    },
    "NSE:PALREDTEC-EQ": {
        "stock_name": "NSE:PALREDTEC-EQ",
        "full_stock_name": "PALRED TECHNOLOGIES LTD"
    },
    "NSE:PANACEABIO-EQ": {
        "stock_name": "NSE:PANACEABIO-EQ",
        "full_stock_name": "PANACEA BIOTEC LTD"
    },
    "NSE:PANACHE-EQ": {
        "stock_name": "NSE:PANACHE-EQ",
        "full_stock_name": "PANACHE DIGILIFE LIMITED"
    },
    "NSE:PANAMAPET-EQ": {
        "stock_name": "NSE:PANAMAPET-EQ",
        "full_stock_name": "PANAMA PETROCHEM LTD"
    },
    "NSE:PANSARI-BE": {
        "stock_name": "NSE:PANSARI-BE",
        "full_stock_name": "PANSARI DEVELOPERS LTD"
    },
    "NSE:PAR-EQ": {
        "stock_name": "NSE:PAR-EQ",
        "full_stock_name": "PAR DRUGS AND CHEM LTD"
    },
    "NSE:PARACABLES-EQ": {
        "stock_name": "NSE:PARACABLES-EQ",
        "full_stock_name": "PARAMOUNT COMM LTD"
    },
    "NSE:PARADEEP-EQ": {
        "stock_name": "NSE:PARADEEP-EQ",
        "full_stock_name": "PARADEEP PHOSPHATES LTD"
    },
    "NSE:PARAGMILK-EQ": {
        "stock_name": "NSE:PARAGMILK-EQ",
        "full_stock_name": "PARAG MILK FOODS LTD."
    },
    "NSE:PARAS-EQ": {
        "stock_name": "NSE:PARAS-EQ",
        "full_stock_name": "PARAS DEF AND SPCE TECH L"
    },
    "NSE:PARASPETRO-EQ": {
        "stock_name": "NSE:PARASPETRO-EQ",
        "full_stock_name": "PARAS PETROFILS LTD."
    },
    "NSE:PARKHOSPS-EQ": {
        "stock_name": "NSE:PARKHOSPS-EQ",
        "full_stock_name": "PARK MEDI WORLD LIMITED"
    },
    "NSE:PARKHOTELS-EQ": {
        "stock_name": "NSE:PARKHOTELS-EQ",
        "full_stock_name": "PARKHOTELS"
    },
    "NSE:PARSVNATH-EQ": {
        "stock_name": "NSE:PARSVNATH-EQ",
        "full_stock_name": "PARSVNATH DEVELOPER LTD"
    },
    "NSE:PASHUPATI-EQ": {
        "stock_name": "NSE:PASHUPATI-EQ",
        "full_stock_name": "PASHUPATI COTSPIN LIMITED"
    },
    "NSE:PASUPTAC-EQ": {
        "stock_name": "NSE:PASUPTAC-EQ",
        "full_stock_name": "PASUPATI ACRYLON LIMITED"
    },
    "NSE:PATANJALI-EQ": {
        "stock_name": "NSE:PATANJALI-EQ",
        "full_stock_name": "PATANJALI FOODS LIMITED"
    },
    "NSE:PATELENG-EQ": {
        "stock_name": "NSE:PATELENG-EQ",
        "full_stock_name": "PATEL ENGINEERING LTD."
    },
    "NSE:PATELRMART-EQ": {
        "stock_name": "NSE:PATELRMART-EQ",
        "full_stock_name": "PATEL RETAIL LIMITED"
    },
    "NSE:PATINTLOG-EQ": {
        "stock_name": "NSE:PATINTLOG-EQ",
        "full_stock_name": "PATEL INT. LOG. LTD"
    },
    "NSE:PAUSHAKLTD-EQ": {
        "stock_name": "NSE:PAUSHAKLTD-EQ",
        "full_stock_name": "PAUSHAK LIMITED"
    },
    "NSE:PAVNAIND-EQ": {
        "stock_name": "NSE:PAVNAIND-EQ",
        "full_stock_name": "PAVNA INDUSTRIES LIMITED"
    },
    "NSE:PAYTM-EQ": {
        "stock_name": "NSE:PAYTM-EQ",
        "full_stock_name": "ONE 97 COMMUNICATIONS LTD"
    },
    "NSE:PCBL-EQ": {
        "stock_name": "NSE:PCBL-EQ",
        "full_stock_name": "PCBL CHEMICAL LIMITED"
    },
    "NSE:PCJEWELLER-EQ": {
        "stock_name": "NSE:PCJEWELLER-EQ",
        "full_stock_name": "PC JEWELLER LTD"
    },
    "NSE:PDMJEPAPER-EQ": {
        "stock_name": "NSE:PDMJEPAPER-EQ",
        "full_stock_name": "PUDUMJEE PAPER PRO. LTD"
    },
    "NSE:PDSL-EQ": {
        "stock_name": "NSE:PDSL-EQ",
        "full_stock_name": "PDS LIMITED"
    },
    "NSE:PEARLPOLY-EQ": {
        "stock_name": "NSE:PEARLPOLY-EQ",
        "full_stock_name": "PEARL POLYMERS LTD"
    },
    "NSE:PENIND-EQ": {
        "stock_name": "NSE:PENIND-EQ",
        "full_stock_name": "PENNAR INDUSTRIES LTD"
    },
    "NSE:PENINLAND-EQ": {
        "stock_name": "NSE:PENINLAND-EQ",
        "full_stock_name": "PENINSULA LAND LIMITED"
    },
    "NSE:PERSISTENT-EQ": {
        "stock_name": "NSE:PERSISTENT-EQ",
        "full_stock_name": "PERSISTENT SYSTEMS LTD"
    },
    "NSE:PETRONET-EQ": {
        "stock_name": "NSE:PETRONET-EQ",
        "full_stock_name": "PETRONET LNG LIMITED"
    },
    "NSE:PFC-EQ": {
        "stock_name": "NSE:PFC-EQ",
        "full_stock_name": "POWER FIN CORP LTD."
    },
    "NSE:PFIZER-EQ": {
        "stock_name": "NSE:PFIZER-EQ",
        "full_stock_name": "PFIZER LTD"
    },
    "NSE:PFOCUS-EQ": {
        "stock_name": "NSE:PFOCUS-EQ",
        "full_stock_name": "PRIME FOCUS LIMITED"
    },
    "NSE:PFS-EQ": {
        "stock_name": "NSE:PFS-EQ",
        "full_stock_name": "PTC INDIA FIN SERV LTD"
    },
    "NSE:PGEL-EQ": {
        "stock_name": "NSE:PGEL-EQ",
        "full_stock_name": "PG ELECTROPLAST LTD"
    },
    "NSE:PGHH-EQ": {
        "stock_name": "NSE:PGHH-EQ",
        "full_stock_name": "P&G HYGIENE & HEALTH CARE"
    },
    "NSE:PGHL-EQ": {
        "stock_name": "NSE:PGHL-EQ",
        "full_stock_name": "PROCTER & GAMBLE HEALTH L"
    },
    "NSE:PGIL-EQ": {
        "stock_name": "NSE:PGIL-EQ",
        "full_stock_name": "PEARL GLOBAL IND LIMITED"
    },
    "NSE:PHARMABEES-EQ": {
        "stock_name": "NSE:PHARMABEES-EQ",
        "full_stock_name": "NIPPONAMC - NETFPHARMA"
    },
    "NSE:PHOENIXLTD-EQ": {
        "stock_name": "NSE:PHOENIXLTD-EQ",
        "full_stock_name": "THE PHOENIX MILLS LTD"
    },
    "NSE:PICCADIL-EQ": {
        "stock_name": "NSE:PICCADIL-EQ",
        "full_stock_name": "PICCADILY AGRO INDUSTRI L"
    },
    "NSE:PIDILITIND-EQ": {
        "stock_name": "NSE:PIDILITIND-EQ",
        "full_stock_name": "PIDILITE INDUSTRIES LTD"
    },
    "NSE:PIGL-EQ": {
        "stock_name": "NSE:PIGL-EQ",
        "full_stock_name": "POWER INSTRUMENT (G) LTD"
    },
    "NSE:PIIND-EQ": {
        "stock_name": "NSE:PIIND-EQ",
        "full_stock_name": "PI INDUSTRIES LTD"
    },
    "NSE:PILANIINVS-EQ": {
        "stock_name": "NSE:PILANIINVS-EQ",
        "full_stock_name": "PILANI INV & IND COR LTD"
    },
    "NSE:PILITA-EQ": {
        "stock_name": "NSE:PILITA-EQ",
        "full_stock_name": "PIL ITALICA LIFESTYLE LTD"
    },
    "NSE:PINELABS-EQ": {
        "stock_name": "NSE:PINELABS-EQ",
        "full_stock_name": "PINE LABS LIMITED"
    },
    "NSE:PIONEEREMB-EQ": {
        "stock_name": "NSE:PIONEEREMB-EQ",
        "full_stock_name": "PIONEER EMBROIDERIES LTD"
    },
    "NSE:PIRAMALFIN-EQ": {
        "stock_name": "NSE:PIRAMALFIN-EQ",
        "full_stock_name": "PIRAMAL FINANCE LIMITED"
    },
    "NSE:PITTIENG-EQ": {
        "stock_name": "NSE:PITTIENG-EQ",
        "full_stock_name": "PITTI ENGINEERING LIMITED"
    },
    "NSE:PIXTRANS-EQ": {
        "stock_name": "NSE:PIXTRANS-EQ",
        "full_stock_name": "PIX TRANSMISSIONS LIMITED"
    },
    "NSE:PKTEA-EQ": {
        "stock_name": "NSE:PKTEA-EQ",
        "full_stock_name": "THE P K TEA PROD CO LTD"
    },
    "NSE:PLASTIBLEN-EQ": {
        "stock_name": "NSE:PLASTIBLEN-EQ",
        "full_stock_name": "PLASTIBLENDS INDIA LTD"
    },
    "NSE:PLATIND-EQ": {
        "stock_name": "NSE:PLATIND-EQ",
        "full_stock_name": "PLATINUM INDUSTRIES LTD"
    },
    "NSE:PLAZACABLE-EQ": {
        "stock_name": "NSE:PLAZACABLE-EQ",
        "full_stock_name": "PLAZA WIRES LIMITED"
    },
    "NSE:PNB-EQ": {
        "stock_name": "NSE:PNB-EQ",
        "full_stock_name": "PUNJAB NATIONAL BANK"
    },
    "NSE:PNBGILTS-EQ": {
        "stock_name": "NSE:PNBGILTS-EQ",
        "full_stock_name": "PNB GILTS LIMITED"
    },
    "NSE:PNBHOUSING-EQ": {
        "stock_name": "NSE:PNBHOUSING-EQ",
        "full_stock_name": "PNB HOUSING FIN LTD."
    },
    "NSE:PNC-EQ": {
        "stock_name": "NSE:PNC-EQ",
        "full_stock_name": "PRITISH NANDY COMMUNICATI"
    },
    "NSE:PNCINFRA-EQ": {
        "stock_name": "NSE:PNCINFRA-EQ",
        "full_stock_name": "PNC INFRATECH LTD."
    },
    "NSE:PNGJL-EQ": {
        "stock_name": "NSE:PNGJL-EQ",
        "full_stock_name": "P N GADGIL JEWELLERS LTD"
    },
    "NSE:POCL-EQ": {
        "stock_name": "NSE:POCL-EQ",
        "full_stock_name": "PONDY OXIDES & CHEM LTD"
    },
    "NSE:PODDARMENT-EQ": {
        "stock_name": "NSE:PODDARMENT-EQ",
        "full_stock_name": "PODDAR PIGMENTS LIMITED"
    },
    "NSE:POKARNA-EQ": {
        "stock_name": "NSE:POKARNA-EQ",
        "full_stock_name": "POKARNA LIMITED"
    },
    "NSE:POLICYBZR-EQ": {
        "stock_name": "NSE:POLICYBZR-EQ",
        "full_stock_name": "PB FINTECH LIMITED"
    },
    "NSE:POLYCAB-EQ": {
        "stock_name": "NSE:POLYCAB-EQ",
        "full_stock_name": "POLYCAB INDIA LIMITED"
    },
    "NSE:POLYMED-EQ": {
        "stock_name": "NSE:POLYMED-EQ",
        "full_stock_name": "POLY MEDICURE LIMITED"
    },
    "NSE:POLYPLEX-EQ": {
        "stock_name": "NSE:POLYPLEX-EQ",
        "full_stock_name": "POLYPLEX CORPORATION LTD"
    },
    "NSE:PONNIERODE-EQ": {
        "stock_name": "NSE:PONNIERODE-EQ",
        "full_stock_name": "PONNIE SUGARS (ERODE) LTD"
    },
    "NSE:POONAWALLA-EQ": {
        "stock_name": "NSE:POONAWALLA-EQ",
        "full_stock_name": "POONAWALLA FINCORP LTD"
    },
    "NSE:POWERGRID-EQ": {
        "stock_name": "NSE:POWERGRID-EQ",
        "full_stock_name": "POWER GRID CORP. LTD."
    },
    "NSE:POWERINDIA-EQ": {
        "stock_name": "NSE:POWERINDIA-EQ",
        "full_stock_name": "HITACHI ENERGY INDIA LTD"
    },
    "NSE:POWERMECH-EQ": {
        "stock_name": "NSE:POWERMECH-EQ",
        "full_stock_name": "POWER MECH PROJECTS LTD."
    },
    "NSE:PPAP-EQ": {
        "stock_name": "NSE:PPAP-EQ",
        "full_stock_name": "PPAP AUTOMOTIVE LIMITED"
    },
    "NSE:PPL-EQ": {
        "stock_name": "NSE:PPL-EQ",
        "full_stock_name": "PRAKASH PIPES LIMITED"
    },
    "NSE:PPLPHARMA-EQ": {
        "stock_name": "NSE:PPLPHARMA-EQ",
        "full_stock_name": "PIRAMAL PHARMA LIMITED"
    },
    "NSE:PRABHA-EQ": {
        "stock_name": "NSE:PRABHA-EQ",
        "full_stock_name": "PRABHA ENERGY LIMITED"
    },
    "NSE:PRAENG-BE": {
        "stock_name": "NSE:PRAENG-BE",
        "full_stock_name": "PRAJAY ENG. SYN. LTD."
    },
    "NSE:PRAJIND-EQ": {
        "stock_name": "NSE:PRAJIND-EQ",
        "full_stock_name": "PRAJ INDUSTRIES LTD"
    },
    "NSE:PRAKASH-EQ": {
        "stock_name": "NSE:PRAKASH-EQ",
        "full_stock_name": "PRAKASH INDUSTRIES LTD"
    },
    "NSE:PRAKASHSTL-BE": {
        "stock_name": "NSE:PRAKASHSTL-BE",
        "full_stock_name": "PRAKASH STEELAGE LTD"
    },
    "NSE:PRAXIS-EQ": {
        "stock_name": "NSE:PRAXIS-EQ",
        "full_stock_name": "PRAXIS HOME RETAIL LTD"
    },
    "NSE:PRECAM-EQ": {
        "stock_name": "NSE:PRECAM-EQ",
        "full_stock_name": "PRECISION CAMSHAFTS LTD."
    },
    "NSE:PRECOT-EQ": {
        "stock_name": "NSE:PRECOT-EQ",
        "full_stock_name": "PRECOT LIMITED"
    },
    "NSE:PRECWIRE-EQ": {
        "stock_name": "NSE:PRECWIRE-EQ",
        "full_stock_name": "PRECISION WIRES INDIA LTD"
    },
    "NSE:PREMEXPLN-EQ": {
        "stock_name": "NSE:PREMEXPLN-EQ",
        "full_stock_name": "PREMIER EXPLOSIVES LTD"
    },
    "NSE:PREMIER-BE": {
        "stock_name": "NSE:PREMIER-BE",
        "full_stock_name": "PREMIER LIMITED"
    },
    "NSE:PREMIERENE-EQ": {
        "stock_name": "NSE:PREMIERENE-EQ",
        "full_stock_name": "PREMIER ENERGIES LIMITED"
    },
    "NSE:PREMIERPOL-EQ": {
        "stock_name": "NSE:PREMIERPOL-EQ",
        "full_stock_name": "PREMIER POLYFILM LTD"
    },
    "NSE:PRESTIGE-EQ": {
        "stock_name": "NSE:PRESTIGE-EQ",
        "full_stock_name": "PRESTIGE ESTATE LTD"
    },
    "NSE:PRICOLLTD-EQ": {
        "stock_name": "NSE:PRICOLLTD-EQ",
        "full_stock_name": "PRICOL LIMITED"
    },
    "NSE:PRIMESECU-EQ": {
        "stock_name": "NSE:PRIMESECU-EQ",
        "full_stock_name": "PRIME SECURITIES LIMITED"
    },
    "NSE:PRIMO-EQ": {
        "stock_name": "NSE:PRIMO-EQ",
        "full_stock_name": "PRIMO CHEMICALS LIMITED"
    },
    "NSE:PRINCEPIPE-EQ": {
        "stock_name": "NSE:PRINCEPIPE-EQ",
        "full_stock_name": "PRINCE PIPES FITTINGS LTD"
    },
    "NSE:PRITI-EQ": {
        "stock_name": "NSE:PRITI-EQ",
        "full_stock_name": "PRITI INTERNATIONAL LTD"
    },
    "NSE:PRITIKAUTO-EQ": {
        "stock_name": "NSE:PRITIKAUTO-EQ",
        "full_stock_name": "PRITIKA AUTO INDUS LTD"
    },
    "NSE:PRIVISCL-EQ": {
        "stock_name": "NSE:PRIVISCL-EQ",
        "full_stock_name": "PRIVI SPECIALITY CHE LTD"
    },
    "NSE:PROSTARM-EQ": {
        "stock_name": "NSE:PROSTARM-EQ",
        "full_stock_name": "PROSTARM INFO SYSTEMS LTD"
    },
    "NSE:PROTEAN-EQ": {
        "stock_name": "NSE:PROTEAN-EQ",
        "full_stock_name": "PROTEAN EGOV TECHNO LTD"
    },
    "NSE:PROZONER-BE": {
        "stock_name": "NSE:PROZONER-BE",
        "full_stock_name": "PROZONE REALTY LIMITED"
    },
    "NSE:PRSMJOHNSN-EQ": {
        "stock_name": "NSE:PRSMJOHNSN-EQ",
        "full_stock_name": "PRISM JOHNSON LIMITED"
    },
    "NSE:PRUDENT-EQ": {
        "stock_name": "NSE:PRUDENT-EQ",
        "full_stock_name": "PRUDENT CORP ADV SER LTD"
    },
    "NSE:PRUDMOULI-EQ": {
        "stock_name": "NSE:PRUDMOULI-EQ",
        "full_stock_name": "PRUDENTIAL SUGAR CORPORAT"
    },
    "NSE:PSB-EQ": {
        "stock_name": "NSE:PSB-EQ",
        "full_stock_name": "PUNJAB & SIND BANK"
    },
    "NSE:PSPPROJECT-EQ": {
        "stock_name": "NSE:PSPPROJECT-EQ",
        "full_stock_name": "PSP PROJECTS LIMITED"
    },
    "NSE:PSUBANK-EQ": {
        "stock_name": "NSE:PSUBANK-EQ",
        "full_stock_name": "KOTAK PSU BANK"
    },
    "NSE:PSUBANKADD-EQ": {
        "stock_name": "NSE:PSUBANKADD-EQ",
        "full_stock_name": "DSPAMC - DSPPSBKETF"
    },
    "NSE:PSUBNKBEES-EQ": {
        "stock_name": "NSE:PSUBNKBEES-EQ",
        "full_stock_name": "NIP IND ETF PSU BANK BEES"
    },
    "NSE:PTC-EQ": {
        "stock_name": "NSE:PTC-EQ",
        "full_stock_name": "PTC INDIA LIMITED"
    },
    "NSE:PTCIL-EQ": {
        "stock_name": "NSE:PTCIL-EQ",
        "full_stock_name": "PTC INDUSTRIES LIMITED"
    },
    "NSE:PTL-EQ": {
        "stock_name": "NSE:PTL-EQ",
        "full_stock_name": "PTL ENTERPRISES LTD"
    },
    "NSE:PUNJABCHEM-EQ": {
        "stock_name": "NSE:PUNJABCHEM-EQ",
        "full_stock_name": "PUNJAB CHEM & CROP PROT L"
    },
    "NSE:PURVA-EQ": {
        "stock_name": "NSE:PURVA-EQ",
        "full_stock_name": "PURAVANKARA LIMITED"
    },
    "NSE:PVP-EQ": {
        "stock_name": "NSE:PVP-EQ",
        "full_stock_name": "PVP VENTURES LIMITED"
    },
    "NSE:PVRINOX-EQ": {
        "stock_name": "NSE:PVRINOX-EQ",
        "full_stock_name": "PVR INOX LIMITED"
    },
    "NSE:PVSL-EQ": {
        "stock_name": "NSE:PVSL-EQ",
        "full_stock_name": "POPULAR VEHICLES N SER L"
    },
    "NSE:PVTBANKADD-EQ": {
        "stock_name": "NSE:PVTBANKADD-EQ",
        "full_stock_name": "DSPAMC - DSPPVBKETF"
    },
    "NSE:PWL-EQ": {
        "stock_name": "NSE:PWL-EQ",
        "full_stock_name": "PHYSICSWALLAH LIMITED"
    },
    "NSE:PYRAMID-EQ": {
        "stock_name": "NSE:PYRAMID-EQ",
        "full_stock_name": "PYRAMID TECHNOPLAST LTD"
    },
    "NSE:QGOLDHALF-EQ": {
        "stock_name": "NSE:QGOLDHALF-EQ",
        "full_stock_name": "QUANTUM GOLD FUND"
    },
    "NSE:QPOWER-EQ": {
        "stock_name": "NSE:QPOWER-EQ",
        "full_stock_name": "QUALITY POWER ELEC EQUP L"
    },
    "NSE:QUADFUTURE-EQ": {
        "stock_name": "NSE:QUADFUTURE-EQ",
        "full_stock_name": "QUADRANT FUTURE TEK LTD"
    },
    "NSE:QUALITY30-EQ": {
        "stock_name": "NSE:QUALITY30-EQ",
        "full_stock_name": "KOTAKMAMC - QUALITY30"
    },
    "NSE:QUESS-EQ": {
        "stock_name": "NSE:QUESS-EQ",
        "full_stock_name": "QUESS CORP LIMITED"
    },
    "NSE:QUICKHEAL-EQ": {
        "stock_name": "NSE:QUICKHEAL-EQ",
        "full_stock_name": "QUICK HEAL TECH LTD"
    },
    "NSE:RACE-EQ": {
        "stock_name": "NSE:RACE-EQ",
        "full_stock_name": "RACE ECO CHAIN LIMITED"
    },
    "NSE:RACLGEAR-EQ": {
        "stock_name": "NSE:RACLGEAR-EQ",
        "full_stock_name": "RACL GEARTECH LIMITED"
    },
    "NSE:RADAAN-EQ": {
        "stock_name": "NSE:RADAAN-EQ",
        "full_stock_name": "RADAAN MEDIAWORKS (I) LTD"
    },
    "NSE:RADHIKAJWE-EQ": {
        "stock_name": "NSE:RADHIKAJWE-EQ",
        "full_stock_name": "RADHIKA JEWELTECH LIMITED"
    },
    "NSE:RADIANTCMS-EQ": {
        "stock_name": "NSE:RADIANTCMS-EQ",
        "full_stock_name": "RADIANT CASH MGMT SER LTD"
    },
    "NSE:RADICO-EQ": {
        "stock_name": "NSE:RADICO-EQ",
        "full_stock_name": "RADICO KHAITAN LTD"
    },
    "NSE:RADIOCITY-EQ": {
        "stock_name": "NSE:RADIOCITY-EQ",
        "full_stock_name": "MUSIC BROADCAST LIMITED"
    },
    "NSE:RAILTEL-EQ": {
        "stock_name": "NSE:RAILTEL-EQ",
        "full_stock_name": "RAILTEL CORP OF IND LTD"
    },
    "NSE:RAIN-EQ": {
        "stock_name": "NSE:RAIN-EQ",
        "full_stock_name": "RAIN INDUSTRIES LIMITED"
    },
    "NSE:RAINBOW-EQ": {
        "stock_name": "NSE:RAINBOW-EQ",
        "full_stock_name": "RAINBOW CHILDRENS MED LTD"
    },
    "NSE:RAJESHEXPO-BZ": {
        "stock_name": "NSE:RAJESHEXPO-BZ",
        "full_stock_name": "RAJESH EXPORTS LTD"
    },
    "NSE:RAJMET-EQ": {
        "stock_name": "NSE:RAJMET-EQ",
        "full_stock_name": "RAJNANDINI METAL LIMITED"
    },
    "NSE:RAJOOENG-EQ": {
        "stock_name": "NSE:RAJOOENG-EQ",
        "full_stock_name": "RAJOO ENGINEERS LIMITED"
    },
    "NSE:RAJRATAN-EQ": {
        "stock_name": "NSE:RAJRATAN-EQ",
        "full_stock_name": "RAJRATAN GLOBAL WIRE LTD"
    },
    "NSE:RAJRILTD-BE": {
        "stock_name": "NSE:RAJRILTD-BE",
        "full_stock_name": "RAJ RAYON INDUSTRIES LTD"
    },
    "NSE:RAJSREESUG-EQ": {
        "stock_name": "NSE:RAJSREESUG-EQ",
        "full_stock_name": "RAJSHREE SUGAR & CHEMICAL"
    },
    "NSE:RAJTV-EQ": {
        "stock_name": "NSE:RAJTV-EQ",
        "full_stock_name": "RAJ TV NETWORK LTD"
    },
    "NSE:RALLIS-EQ": {
        "stock_name": "NSE:RALLIS-EQ",
        "full_stock_name": "RALLIS INDIA LTD"
    },
    "NSE:RAMANEWS-EQ": {
        "stock_name": "NSE:RAMANEWS-EQ",
        "full_stock_name": "SHREE RAMA NEWSPRINT LTD"
    },
    "NSE:RAMAPHO-EQ": {
        "stock_name": "NSE:RAMAPHO-EQ",
        "full_stock_name": "RAMA PHOSPHATES LIMITED"
    },
    "NSE:RAMASTEEL-EQ": {
        "stock_name": "NSE:RAMASTEEL-EQ",
        "full_stock_name": "RAMA STEEL TUBES LIMITED"
    },
    "NSE:RAMCOCEM-EQ": {
        "stock_name": "NSE:RAMCOCEM-EQ",
        "full_stock_name": "THE RAMCO CEMENTS LIMITED"
    },
    "NSE:RAMCOIND-EQ": {
        "stock_name": "NSE:RAMCOIND-EQ",
        "full_stock_name": "RAMCO INDUSTRIES LIMITED"
    },
    "NSE:RAMCOSYS-EQ": {
        "stock_name": "NSE:RAMCOSYS-EQ",
        "full_stock_name": "RAMCO SYSTEMS LTD."
    },
    "NSE:RAMKY-EQ": {
        "stock_name": "NSE:RAMKY-EQ",
        "full_stock_name": "RAMKY INFRA LTD"
    },
    "NSE:RAMRAT-EQ": {
        "stock_name": "NSE:RAMRAT-EQ",
        "full_stock_name": "RAM RATNA WIRES LIMITED"
    },
    "NSE:RANASUG-EQ": {
        "stock_name": "NSE:RANASUG-EQ",
        "full_stock_name": "RANA SUGARS LTD."
    },
    "NSE:RANEHOLDIN-EQ": {
        "stock_name": "NSE:RANEHOLDIN-EQ",
        "full_stock_name": "RANE HOLDINGS LIMITED"
    },
    "NSE:RATEGAIN-EQ": {
        "stock_name": "NSE:RATEGAIN-EQ",
        "full_stock_name": "RATEGAIN TRAVEL TECHN LTD"
    },
    "NSE:RATNAMANI-EQ": {
        "stock_name": "NSE:RATNAMANI-EQ",
        "full_stock_name": "RATNAMANI MET & TUB LTD."
    },
    "NSE:RATNAVEER-EQ": {
        "stock_name": "NSE:RATNAVEER-EQ",
        "full_stock_name": "RATNAVEER PRECISION ENG L"
    },
    "NSE:RAYMOND-EQ": {
        "stock_name": "NSE:RAYMOND-EQ",
        "full_stock_name": "RAYMOND LTD"
    },
    "NSE:RAYMONDLSL-EQ": {
        "stock_name": "NSE:RAYMONDLSL-EQ",
        "full_stock_name": "RAYMOND LIFESTYLE LIMITED"
    },
    "NSE:RAYMONDREL-EQ": {
        "stock_name": "NSE:RAYMONDREL-EQ",
        "full_stock_name": "RAYMOND REALTY LIMITED"
    },
    "NSE:RBA-EQ": {
        "stock_name": "NSE:RBA-EQ",
        "full_stock_name": "RESTAURANT BRAND ASIA LTD"
    },
    "NSE:RBLBANK-EQ": {
        "stock_name": "NSE:RBLBANK-EQ",
        "full_stock_name": "RBL BANK LIMITED"
    },
    "NSE:RBZJEWEL-EQ": {
        "stock_name": "NSE:RBZJEWEL-EQ",
        "full_stock_name": "RBZ JEWELLERS LIMITED"
    },
    "NSE:RCF-EQ": {
        "stock_name": "NSE:RCF-EQ",
        "full_stock_name": "RASHTRIYA CHEMICALS & FER"
    },
    "NSE:RCOM-BE": {
        "stock_name": "NSE:RCOM-BE",
        "full_stock_name": "RELIANCE COMMUNICATIONS L"
    },
    "NSE:RECLTD-EQ": {
        "stock_name": "NSE:RECLTD-EQ",
        "full_stock_name": "REC LIMITED"
    },
    "NSE:REDINGTON-EQ": {
        "stock_name": "NSE:REDINGTON-EQ",
        "full_stock_name": "REDINGTON LIMITED"
    },
    "NSE:REDTAPE-EQ": {
        "stock_name": "NSE:REDTAPE-EQ",
        "full_stock_name": "REDTAPE LIMITED"
    },
    "NSE:REFEX-EQ": {
        "stock_name": "NSE:REFEX-EQ",
        "full_stock_name": "REFEX INDUSTRIES LIMITED"
    },
    "NSE:REGAAL-EQ": {
        "stock_name": "NSE:REGAAL-EQ",
        "full_stock_name": "REGAAL RESOURCES LIMITED"
    },
    "NSE:REGENCERAM-EQ": {
        "stock_name": "NSE:REGENCERAM-EQ",
        "full_stock_name": "REGENCY CERAMICS LTD."
    },
    "NSE:RELAXO-EQ": {
        "stock_name": "NSE:RELAXO-EQ",
        "full_stock_name": "RELAXO FOOT LTD."
    },
    "NSE:RELCHEMQ-EQ": {
        "stock_name": "NSE:RELCHEMQ-EQ",
        "full_stock_name": "RELIANCE CHEMOTEX IND LTD"
    },
    "NSE:RELIABLE-BE": {
        "stock_name": "NSE:RELIABLE-BE",
        "full_stock_name": "RELIABLE DATA SERVICE LTD"
    },
    "NSE:RELIANCE-EQ": {
        "stock_name": "NSE:RELIANCE-EQ",
        "full_stock_name": "RELIANCE INDUSTRIES LTD"
    },
    "NSE:RELIGARE-EQ": {
        "stock_name": "NSE:RELIGARE-EQ",
        "full_stock_name": "RELIGARE ENTER. LTD."
    },
    "NSE:RELTD-EQ": {
        "stock_name": "NSE:RELTD-EQ",
        "full_stock_name": "RAVINDRA ENERGY LIMITED"
    },
    "NSE:REMSONSIND-EQ": {
        "stock_name": "NSE:REMSONSIND-EQ",
        "full_stock_name": "REMSONS INDUSTRIES LTD"
    },
    "NSE:RENUKA-EQ": {
        "stock_name": "NSE:RENUKA-EQ",
        "full_stock_name": "SHREE RENUKA SUGARS LTD"
    },
    "NSE:REPCOHOME-EQ": {
        "stock_name": "NSE:REPCOHOME-EQ",
        "full_stock_name": "REPCO HOME FINANCE LTD"
    },
    "NSE:REPL-EQ": {
        "stock_name": "NSE:REPL-EQ",
        "full_stock_name": "RUDRABHISHEK ENTERP LTD"
    },
    "NSE:REPRO-EQ": {
        "stock_name": "NSE:REPRO-EQ",
        "full_stock_name": "REPRO INDIA LIMITED"
    },
    "NSE:RESPONIND-EQ": {
        "stock_name": "NSE:RESPONIND-EQ",
        "full_stock_name": "RESPONSIVE INDUSTRIES LTD"
    },
    "NSE:RETAIL-EQ": {
        "stock_name": "NSE:RETAIL-EQ",
        "full_stock_name": "JHS SVENDGAARD RETAIL V L"
    },
    "NSE:RGL-EQ": {
        "stock_name": "NSE:RGL-EQ",
        "full_stock_name": "RENAISSANCE GLOBAL LTD"
    },
    "NSE:RHETAN-EQ": {
        "stock_name": "NSE:RHETAN-EQ",
        "full_stock_name": "RHETAN TMT LIMITED"
    },
    "NSE:RHFL-BZ": {
        "stock_name": "NSE:RHFL-BZ",
        "full_stock_name": "RELIANCE HOME FINANCE LTD"
    },
    "NSE:RHIM-EQ": {
        "stock_name": "NSE:RHIM-EQ",
        "full_stock_name": "RHI MAGNESITA INDIA LTD"
    },
    "NSE:RHL-EQ": {
        "stock_name": "NSE:RHL-EQ",
        "full_stock_name": "ROBUST HOTELS LIMITED"
    },
    "NSE:RICOAUTO-EQ": {
        "stock_name": "NSE:RICOAUTO-EQ",
        "full_stock_name": "RICO AUTO INDUSTRIES LTD"
    },
    "NSE:RIIL-EQ": {
        "stock_name": "NSE:RIIL-EQ",
        "full_stock_name": "RELIANCE INDUSTRIAL INFRA"
    },
    "NSE:RISHABH-EQ": {
        "stock_name": "NSE:RISHABH-EQ",
        "full_stock_name": "RISHABH INSTRUMENTS LTD"
    },
    "NSE:RITCO-EQ": {
        "stock_name": "NSE:RITCO-EQ",
        "full_stock_name": "RITCO LOGISTICS LIMITED"
    },
    "NSE:RITES-EQ": {
        "stock_name": "NSE:RITES-EQ",
        "full_stock_name": "RITES LIMITED"
    },
    "NSE:RKDL-EQ": {
        "stock_name": "NSE:RKDL-EQ",
        "full_stock_name": "RAVI KUMAR DIST. LTD."
    },
    "NSE:RKEC-EQ": {
        "stock_name": "NSE:RKEC-EQ",
        "full_stock_name": "RKEC PROJECTS LIMITED"
    },
    "NSE:RKFORGE-EQ": {
        "stock_name": "NSE:RKFORGE-EQ",
        "full_stock_name": "RAMKRISHNA FORGINGS LTD"
    },
    "NSE:RKSWAMY-EQ": {
        "stock_name": "NSE:RKSWAMY-EQ",
        "full_stock_name": "R K SWAMY LIMITED"
    },
    "NSE:RMDRIP-EQ": {
        "stock_name": "NSE:RMDRIP-EQ",
        "full_stock_name": "R M DRIP & SPRINK SYS LTD"
    },
    "NSE:RML-EQ": {
        "stock_name": "NSE:RML-EQ",
        "full_stock_name": "RANE (MADRAS) LIMITED"
    },
    "NSE:RNBDENIMS-EQ": {
        "stock_name": "NSE:RNBDENIMS-EQ",
        "full_stock_name": "R&B DENIMS LIMITED"
    },
    "NSE:ROHLTD-EQ": {
        "stock_name": "NSE:ROHLTD-EQ",
        "full_stock_name": "ROYAL ORCHID HOTELS LTD"
    },
    "NSE:ROLEXRINGS-EQ": {
        "stock_name": "NSE:ROLEXRINGS-EQ",
        "full_stock_name": "ROLEX RINGS LIMITED"
    },
    "NSE:ROLLT-BE": {
        "stock_name": "NSE:ROLLT-BE",
        "full_stock_name": "ROLLATAINERS LIMITED"
    },
    "NSE:ROML-EQ": {
        "stock_name": "NSE:ROML-EQ",
        "full_stock_name": "RAJ OIL MILLS LIMITED"
    },
    "NSE:ROSSARI-EQ": {
        "stock_name": "NSE:ROSSARI-EQ",
        "full_stock_name": "ROSSARI BIOTECH LIMITED"
    },
    "NSE:ROSSELLIND-EQ": {
        "stock_name": "NSE:ROSSELLIND-EQ",
        "full_stock_name": "ROSSELL INDIA LIMITED"
    },
    "NSE:ROSSTECH-EQ": {
        "stock_name": "NSE:ROSSTECH-EQ",
        "full_stock_name": "ROSSELL TECHSYS LIMITED"
    },
    "NSE:ROTO-EQ": {
        "stock_name": "NSE:ROTO-EQ",
        "full_stock_name": "ROTO PUMPS LIMITED"
    },
    "NSE:ROUTE-EQ": {
        "stock_name": "NSE:ROUTE-EQ",
        "full_stock_name": "ROUTE MOBILE LIMITED"
    },
    "NSE:RPEL-EQ": {
        "stock_name": "NSE:RPEL-EQ",
        "full_stock_name": "RAGHAV PRODUCTIVITY ENH L"
    },
    "NSE:RPGLIFE-EQ": {
        "stock_name": "NSE:RPGLIFE-EQ",
        "full_stock_name": "RPG LIFE SCIENCES LTD"
    },
    "NSE:RPOWER-EQ": {
        "stock_name": "NSE:RPOWER-EQ",
        "full_stock_name": "RELIANCE POWER LTD."
    },
    "NSE:RPPINFRA-EQ": {
        "stock_name": "NSE:RPPINFRA-EQ",
        "full_stock_name": "R.P.P INFRA PROJECTS LTD"
    },
    "NSE:RPPL-EQ": {
        "stock_name": "NSE:RPPL-EQ",
        "full_stock_name": "RAJSHREE POLYPACK LTD"
    },
    "NSE:RPSGVENT-EQ": {
        "stock_name": "NSE:RPSGVENT-EQ",
        "full_stock_name": "RPSG VENTURES LIMITED"
    },
    "NSE:RPTECH-EQ": {
        "stock_name": "NSE:RPTECH-EQ",
        "full_stock_name": "RASHI PERIPHERALS LIMITED"
    },
    "NSE:RRKABEL-EQ": {
        "stock_name": "NSE:RRKABEL-EQ",
        "full_stock_name": "R R KABEL LIMITED"
    },
    "NSE:RSSOFTWARE-EQ": {
        "stock_name": "NSE:RSSOFTWARE-EQ",
        "full_stock_name": "R. S. SOFTWARE (INDIA) LI"
    },
    "NSE:RSWM-EQ": {
        "stock_name": "NSE:RSWM-EQ",
        "full_stock_name": "RSWM LIMITED"
    },
    "NSE:RSYSTEMS-EQ": {
        "stock_name": "NSE:RSYSTEMS-EQ",
        "full_stock_name": "R SYS INTERNATIONAL LTD"
    },
    "NSE:RTNINDIA-EQ": {
        "stock_name": "NSE:RTNINDIA-EQ",
        "full_stock_name": "RATTANINDIA ENT LIMITED"
    },
    "NSE:RTNPOWER-EQ": {
        "stock_name": "NSE:RTNPOWER-EQ",
        "full_stock_name": "RATTANINDIA POWER LIMITED"
    },
    "NSE:RUBFILA-EQ": {
        "stock_name": "NSE:RUBFILA-EQ",
        "full_stock_name": "RUBFILA INTERNATIONAL LTD"
    },
    "NSE:RUBICON-EQ": {
        "stock_name": "NSE:RUBICON-EQ",
        "full_stock_name": "RUBICON RESEARCH LIMITED"
    },
    "NSE:RUBYMILLS-EQ": {
        "stock_name": "NSE:RUBYMILLS-EQ",
        "full_stock_name": "THE RUBY MILLS LTD"
    },
    "NSE:RUCHINFRA-EQ": {
        "stock_name": "NSE:RUCHINFRA-EQ",
        "full_stock_name": "RUCHI INFRASTRUCTURE LTD"
    },
    "NSE:RUCHIRA-EQ": {
        "stock_name": "NSE:RUCHIRA-EQ",
        "full_stock_name": "RUCHIRA PAPERS LIMITED"
    },
    "NSE:RUDRA-EQ": {
        "stock_name": "NSE:RUDRA-EQ",
        "full_stock_name": "RUDRA GLOBAL INFRA PROD L"
    },
    "NSE:RUPA-EQ": {
        "stock_name": "NSE:RUPA-EQ",
        "full_stock_name": "RUPA & COMPANY LTD"
    },
    "NSE:RUSHIL-EQ": {
        "stock_name": "NSE:RUSHIL-EQ",
        "full_stock_name": "RUSHIL DECOR LIMITED"
    },
    "NSE:RUSTOMJEE-EQ": {
        "stock_name": "NSE:RUSTOMJEE-EQ",
        "full_stock_name": "KEYSTONE REALTORS LIMITED"
    },
    "NSE:RVHL-EQ": {
        "stock_name": "NSE:RVHL-EQ",
        "full_stock_name": "RAVINDER HEIGHTS LIMITED"
    },
    "NSE:RVNL-EQ": {
        "stock_name": "NSE:RVNL-EQ",
        "full_stock_name": "RAIL VIKAS NIGAM LIMITED"
    },
    "NSE:RVTH-EQ": {
        "stock_name": "NSE:RVTH-EQ",
        "full_stock_name": "REVATHI EQUIPMENT INDIA L"
    },
    "NSE:S&SPOWER-EQ": {
        "stock_name": "NSE:S&SPOWER-EQ",
        "full_stock_name": "S&S POWER SWITCHGEARS LTD"
    },
    "NSE:SAATVIKGL-EQ": {
        "stock_name": "NSE:SAATVIKGL-EQ",
        "full_stock_name": "SAATVIK GREEN ENERGY LTD"
    },
    "NSE:SABEVENTS-BE": {
        "stock_name": "NSE:SABEVENTS-BE",
        "full_stock_name": "SAB EVENTS & GOVERNANCE"
    },
    "NSE:SABTNL-BE": {
        "stock_name": "NSE:SABTNL-BE",
        "full_stock_name": "SRI ADHIKARI BRO TELE N L"
    },
    "NSE:SADBHAV-BE": {
        "stock_name": "NSE:SADBHAV-BE",
        "full_stock_name": "SADBHAV ENGINEERING LTD"
    },
    "NSE:SADBHIN-EQ": {
        "stock_name": "NSE:SADBHIN-EQ",
        "full_stock_name": "SADBHAV INFRA PROJ LTD."
    },
    "NSE:SADHNANIQ-EQ": {
        "stock_name": "NSE:SADHNANIQ-EQ",
        "full_stock_name": "SADHANA NITROCHEM LIMITED"
    },
    "NSE:SAFARI-EQ": {
        "stock_name": "NSE:SAFARI-EQ",
        "full_stock_name": "SAFARI IND (INDIA) LTD"
    },
    "NSE:SAGARDEEP-EQ": {
        "stock_name": "NSE:SAGARDEEP-EQ",
        "full_stock_name": "SAGARDEEP ALLOYS LIMITED"
    },
    "NSE:SAGCEM-EQ": {
        "stock_name": "NSE:SAGCEM-EQ",
        "full_stock_name": "SAGAR CEMENTS LIMITED"
    },
    "NSE:SAGILITY-EQ": {
        "stock_name": "NSE:SAGILITY-EQ",
        "full_stock_name": "SAGILITY LIMITED"
    },
    "NSE:SAHYADRI-EQ": {
        "stock_name": "NSE:SAHYADRI-EQ",
        "full_stock_name": "SAHYADRI INDUSTRIES LTD"
    },
    "NSE:SAIL-EQ": {
        "stock_name": "NSE:SAIL-EQ",
        "full_stock_name": "STEEL AUTHORITY OF INDIA"
    },
    "NSE:SAILIFE-EQ": {
        "stock_name": "NSE:SAILIFE-EQ",
        "full_stock_name": "SAI LIFE SCIENCES LIMITED"
    },
    "NSE:SAKAR-EQ": {
        "stock_name": "NSE:SAKAR-EQ",
        "full_stock_name": "SAKAR HEALTHCARE LIMITED"
    },
    "NSE:SAKHTISUG-EQ": {
        "stock_name": "NSE:SAKHTISUG-EQ",
        "full_stock_name": "SAKTHI SUGARS LTD"
    },
    "NSE:SAKSOFT-EQ": {
        "stock_name": "NSE:SAKSOFT-EQ",
        "full_stock_name": "SAKSOFT LIMITED"
    },
    "NSE:SAKUMA-EQ": {
        "stock_name": "NSE:SAKUMA-EQ",
        "full_stock_name": "SAKUMA EXPORTS LIMITED"
    },
    "NSE:SALASAR-EQ": {
        "stock_name": "NSE:SALASAR-EQ",
        "full_stock_name": "SALASAR TECHNO ENGG. LTD."
    },
    "NSE:SALONA-EQ": {
        "stock_name": "NSE:SALONA-EQ",
        "full_stock_name": "SALONA COTSPIN LTD."
    },
    "NSE:SALSTEEL-BE": {
        "stock_name": "NSE:SALSTEEL-BE",
        "full_stock_name": "S.A.L. STEEL LTD."
    },
    "NSE:SALZERELEC-EQ": {
        "stock_name": "NSE:SALZERELEC-EQ",
        "full_stock_name": "SALZER ELECTRONICS LTD"
    },
    "NSE:SAMBHAAV-BE": {
        "stock_name": "NSE:SAMBHAAV-BE",
        "full_stock_name": "SAMBHAAV MEDIA LTD"
    },
    "NSE:SAMBHV-EQ": {
        "stock_name": "NSE:SAMBHV-EQ",
        "full_stock_name": "SAMBHV STEEL TUBES LTD"
    },
    "NSE:SAMHI-EQ": {
        "stock_name": "NSE:SAMHI-EQ",
        "full_stock_name": "SAMHI HOTELS LIMITED"
    },
    "NSE:SAMMAANCAP-EQ": {
        "stock_name": "NSE:SAMMAANCAP-EQ",
        "full_stock_name": "SAMMAAN CAPITAL LIMITED"
    },
    "NSE:SAMPANN-EQ": {
        "stock_name": "NSE:SAMPANN-EQ",
        "full_stock_name": "SAMPANN UTPADAN INDIA LTD"
    },
    "NSE:SANATHAN-EQ": {
        "stock_name": "NSE:SANATHAN-EQ",
        "full_stock_name": "SANATHAN TEXTILES LIMITED"
    },
    "NSE:SANCO-BZ": {
        "stock_name": "NSE:SANCO-BZ",
        "full_stock_name": "SANCO INDUSTRIES LIMITED"
    },
    "NSE:SANDESH-EQ": {
        "stock_name": "NSE:SANDESH-EQ",
        "full_stock_name": "SANDESH LTD"
    },
    "NSE:SANDHAR-EQ": {
        "stock_name": "NSE:SANDHAR-EQ",
        "full_stock_name": "SANDHAR TECHNOLOGIES LTD"
    },
    "NSE:SANDUMA-EQ": {
        "stock_name": "NSE:SANDUMA-EQ",
        "full_stock_name": "SANDUR MANG & IRON ORES L"
    },
    "NSE:SANGAMIND-EQ": {
        "stock_name": "NSE:SANGAMIND-EQ",
        "full_stock_name": "SANGAM (INDIA) LTD"
    },
    "NSE:SANGHIIND-EQ": {
        "stock_name": "NSE:SANGHIIND-EQ",
        "full_stock_name": "SANGHI INDUSTRIES LTD"
    },
    "NSE:SANGHVIMOV-EQ": {
        "stock_name": "NSE:SANGHVIMOV-EQ",
        "full_stock_name": "SANGHVI MOVERS LTD"
    },
    "NSE:SANGINITA-EQ": {
        "stock_name": "NSE:SANGINITA-EQ",
        "full_stock_name": "SANGINITA CHEMICALS LTD"
    },
    "NSE:SANOFI-EQ": {
        "stock_name": "NSE:SANOFI-EQ",
        "full_stock_name": "SANOFI INDIA LIMITED"
    },
    "NSE:SANOFICONR-EQ": {
        "stock_name": "NSE:SANOFICONR-EQ",
        "full_stock_name": "SANOFI CONS HEALTHC IND L"
    },
    "NSE:SANSERA-EQ": {
        "stock_name": "NSE:SANSERA-EQ",
        "full_stock_name": "SANSERA ENGINEERING LTD"
    },
    "NSE:SANSTAR-EQ": {
        "stock_name": "NSE:SANSTAR-EQ",
        "full_stock_name": "SANSTAR LIMITED"
    },
    "NSE:SANWARIA-BZ": {
        "stock_name": "NSE:SANWARIA-BZ",
        "full_stock_name": "SANWARIA CONSUMER LIMITED"
    },
    "NSE:SAPPHIRE-EQ": {
        "stock_name": "NSE:SAPPHIRE-EQ",
        "full_stock_name": "SAPPHIRE FOODS INDIA LTD"
    },
    "NSE:SARDAEN-EQ": {
        "stock_name": "NSE:SARDAEN-EQ",
        "full_stock_name": "SARDA ENERGY & MIN LTD"
    },
    "NSE:SAREGAMA-EQ": {
        "stock_name": "NSE:SAREGAMA-EQ",
        "full_stock_name": "SAREGAMA INDIA LIMITED"
    },
    "NSE:SARLAPOLY-EQ": {
        "stock_name": "NSE:SARLAPOLY-EQ",
        "full_stock_name": "SARLA PERF. FIBERS LTD"
    },
    "NSE:SARVESHWAR-EQ": {
        "stock_name": "NSE:SARVESHWAR-EQ",
        "full_stock_name": "SARVESHWAR FOODS LIMITED"
    },
    "NSE:SASKEN-EQ": {
        "stock_name": "NSE:SASKEN-EQ",
        "full_stock_name": "SASKEN TECHNOLOGIES LTD"
    },
    "NSE:SASTASUNDR-EQ": {
        "stock_name": "NSE:SASTASUNDR-EQ",
        "full_stock_name": "SASTASUNDAR VENTURES LTD"
    },
    "NSE:SATIA-EQ": {
        "stock_name": "NSE:SATIA-EQ",
        "full_stock_name": "SATIA INDUSTRIES LIMITED"
    },
    "NSE:SATIN-EQ": {
        "stock_name": "NSE:SATIN-EQ",
        "full_stock_name": "SATIN CREDIT NET LTD"
    },
    "NSE:SAURASHCEM-EQ": {
        "stock_name": "NSE:SAURASHCEM-EQ",
        "full_stock_name": "SAURASHTRA CEMENT LIMITED"
    },
    "NSE:SBC-EQ": {
        "stock_name": "NSE:SBC-EQ",
        "full_stock_name": "SBC EXPORTS LIMITED"
    },
    "NSE:SBCL-EQ": {
        "stock_name": "NSE:SBCL-EQ",
        "full_stock_name": "SHIVALIK BIMETAL CON. LTD"
    },
    "NSE:SBFC-EQ": {
        "stock_name": "NSE:SBFC-EQ",
        "full_stock_name": "SBFC FINANCE LIMITED"
    },
    "NSE:SBGLP-EQ": {
        "stock_name": "NSE:SBGLP-EQ",
        "full_stock_name": "SURATWWALA BUS GROUP LTD"
    },
    "NSE:SBIBPB-EQ": {
        "stock_name": "NSE:SBIBPB-EQ",
        "full_stock_name": "SBIAMC - SBIBPB"
    },
    "NSE:SBICARD-EQ": {
        "stock_name": "NSE:SBICARD-EQ",
        "full_stock_name": "SBI CARDS & PAY SER LTD"
    },
    "NSE:SBILIFE-EQ": {
        "stock_name": "NSE:SBILIFE-EQ",
        "full_stock_name": "SBI LIFE INSURANCE CO LTD"
    },
    "NSE:SBIN-EQ": {
        "stock_name": "NSE:SBIN-EQ",
        "full_stock_name": "STATE BANK OF INDIA"
    },
    "NSE:SBISILVER-EQ": {
        "stock_name": "NSE:SBISILVER-EQ",
        "full_stock_name": "SBIAMC - SBISILVER"
    },
    "NSE:SCHAEFFLER-EQ": {
        "stock_name": "NSE:SCHAEFFLER-EQ",
        "full_stock_name": "SCHAEFFLER INDIA LIMITED"
    },
    "NSE:SCHAND-EQ": {
        "stock_name": "NSE:SCHAND-EQ",
        "full_stock_name": "S CHAND AND COMPANY LTD"
    },
    "NSE:SCHNEIDER-EQ": {
        "stock_name": "NSE:SCHNEIDER-EQ",
        "full_stock_name": "SCHNEIDER ELECTRIC INFRA"
    },
    "NSE:SCI-EQ": {
        "stock_name": "NSE:SCI-EQ",
        "full_stock_name": "SHIPPING CORP OF INDIA LT"
    },
    "NSE:SCILAL-EQ": {
        "stock_name": "NSE:SCILAL-EQ",
        "full_stock_name": "SHIPPING CORP OF ILA LTD"
    },
    "NSE:SCODATUBES-EQ": {
        "stock_name": "NSE:SCODATUBES-EQ",
        "full_stock_name": "SCODA TUBES LIMITED"
    },
    "NSE:SCPL-EQ": {
        "stock_name": "NSE:SCPL-EQ",
        "full_stock_name": "SHEETAL COOL PRODUCTS LTD"
    },
    "NSE:SDBL-EQ": {
        "stock_name": "NSE:SDBL-EQ",
        "full_stock_name": "SOM DIST & BREW LTD"
    },
    "NSE:SDL26BEES-EQ": {
        "stock_name": "NSE:SDL26BEES-EQ",
        "full_stock_name": "RELCAPAMC-NETFSDL26"
    },
    "NSE:SEAMECLTD-EQ": {
        "stock_name": "NSE:SEAMECLTD-EQ",
        "full_stock_name": "SEAMEC LIMITED"
    },
    "NSE:SECMARK-EQ": {
        "stock_name": "NSE:SECMARK-EQ",
        "full_stock_name": "SECMARK CONSULTANCY LTD"
    },
    "NSE:SECURKLOUD-BE": {
        "stock_name": "NSE:SECURKLOUD-BE",
        "full_stock_name": "SECUREKLOUD TECH LIMITED"
    },
    "NSE:SEJALLTD-EQ": {
        "stock_name": "NSE:SEJALLTD-EQ",
        "full_stock_name": "SEJAL GLASS LIMITED"
    },
    "NSE:SELECTIPO-EQ": {
        "stock_name": "NSE:SELECTIPO-EQ",
        "full_stock_name": "MIRAEAMC - SELECTIPO"
    },
    "NSE:SELMC-BE": {
        "stock_name": "NSE:SELMC-BE",
        "full_stock_name": "SEL MANUFACTURING CO LTD"
    },
    "NSE:SEMAC-EQ": {
        "stock_name": "NSE:SEMAC-EQ",
        "full_stock_name": "SEMAC CONSTRUCTION LTD"
    },
    "NSE:SENCO-EQ": {
        "stock_name": "NSE:SENCO-EQ",
        "full_stock_name": "SENCO GOLD LIMITED"
    },
    "NSE:SENORES-EQ": {
        "stock_name": "NSE:SENORES-EQ",
        "full_stock_name": "SENORES PHARMACEUTICALS L"
    },
    "NSE:SENSEXADD-EQ": {
        "stock_name": "NSE:SENSEXADD-EQ",
        "full_stock_name": "DSPAMC - DSPSENXETF"
    },
    "NSE:SENSEXBETA-EQ": {
        "stock_name": "NSE:SENSEXBETA-EQ",
        "full_stock_name": "UTIAMC-SENSEXBETA"
    },
    "NSE:SEPC-EQ": {
        "stock_name": "NSE:SEPC-EQ",
        "full_stock_name": "SEPC LIMITED"
    },
    "NSE:SERVOTECH-EQ": {
        "stock_name": "NSE:SERVOTECH-EQ",
        "full_stock_name": "SERVOTECH REN POW SYS LTD"
    },
    "NSE:SESHAPAPER-EQ": {
        "stock_name": "NSE:SESHAPAPER-EQ",
        "full_stock_name": "SESHASAYEE PAPER & BOARDS"
    },
    "NSE:SETCO-EQ": {
        "stock_name": "NSE:SETCO-EQ",
        "full_stock_name": "SETCO AUTOMOTIVE LTD"
    },
    "NSE:SETL-EQ": {
        "stock_name": "NSE:SETL-EQ",
        "full_stock_name": "STANDARD ENGNG TCNLGY LTD"
    },
    "NSE:SETUINFRA-BZ": {
        "stock_name": "NSE:SETUINFRA-BZ",
        "full_stock_name": "SETUBANDHAN INFRA LTD"
    },
    "NSE:SEYAIND-BE": {
        "stock_name": "NSE:SEYAIND-BE",
        "full_stock_name": "SEYA INDUSTRIES LIMITED"
    },
    "NSE:SFL-EQ": {
        "stock_name": "NSE:SFL-EQ",
        "full_stock_name": "SHEELA FOAM LIMITED"
    },
    "NSE:SGFIN-EQ": {
        "stock_name": "NSE:SGFIN-EQ",
        "full_stock_name": "SG FINSERVE LIMITED"
    },
    "NSE:SGIL-EQ": {
        "stock_name": "NSE:SGIL-EQ",
        "full_stock_name": "SYNERGY GREEN IND. LTD"
    },
    "NSE:SGL-EQ": {
        "stock_name": "NSE:SGL-EQ",
        "full_stock_name": "STL GLOBAL LIMITED"
    },
    "NSE:SGMART-EQ": {
        "stock_name": "NSE:SGMART-EQ",
        "full_stock_name": "SG MART LIMITED"
    },
    "NSE:SHADOWFAX-EQ": {
        "stock_name": "NSE:SHADOWFAX-EQ",
        "full_stock_name": "SHADOWFAX TECHNOLOGIES L"
    },
    "NSE:SHAH-EQ": {
        "stock_name": "NSE:SHAH-EQ",
        "full_stock_name": "SHAH METACORP LIMITED"
    },
    "NSE:SHAHALLOYS-EQ": {
        "stock_name": "NSE:SHAHALLOYS-EQ",
        "full_stock_name": "SHAH ALLOYS LIMITED"
    },
    "NSE:SHAILY-EQ": {
        "stock_name": "NSE:SHAILY-EQ",
        "full_stock_name": "SHAILY ENG PLASTICS LTD"
    },
    "NSE:SHAKTIPUMP-EQ": {
        "stock_name": "NSE:SHAKTIPUMP-EQ",
        "full_stock_name": "SHAKTI PUMPS (I) LTD"
    },
    "NSE:SHALBY-EQ": {
        "stock_name": "NSE:SHALBY-EQ",
        "full_stock_name": "SHALBY LIMITED"
    },
    "NSE:SHALPAINTS-EQ": {
        "stock_name": "NSE:SHALPAINTS-EQ",
        "full_stock_name": "SHALIM PAINTS LTD"
    },
    "NSE:SHANKARA-EQ": {
        "stock_name": "NSE:SHANKARA-EQ",
        "full_stock_name": "SHANKARA BLDG PRODUCT LTD"
    },
    "NSE:SHANTI-EQ": {
        "stock_name": "NSE:SHANTI-EQ",
        "full_stock_name": "SHANTI OVERSEAS INDIA LTD"
    },
    "NSE:SHANTIGEAR-EQ": {
        "stock_name": "NSE:SHANTIGEAR-EQ",
        "full_stock_name": "SHANTHI GEARS LTD"
    },
    "NSE:SHANTIGOLD-EQ": {
        "stock_name": "NSE:SHANTIGOLD-EQ",
        "full_stock_name": "SHANTI GOLD INTERNATION L"
    },
    "NSE:SHARDACROP-EQ": {
        "stock_name": "NSE:SHARDACROP-EQ",
        "full_stock_name": "SHARDA CROPCHEM LTD."
    },
    "NSE:SHARDAMOTR-EQ": {
        "stock_name": "NSE:SHARDAMOTR-EQ",
        "full_stock_name": "SHARDA MOTOR INDS LTD"
    },
    "NSE:SHAREINDIA-EQ": {
        "stock_name": "NSE:SHAREINDIA-EQ",
        "full_stock_name": "SHARE IND. SECURITIES LTD"
    },
    "NSE:SHARIABEES-EQ": {
        "stock_name": "NSE:SHARIABEES-EQ",
        "full_stock_name": "NIP IND ETF SHARIAH BEES"
    },
    "NSE:SHEKHAWATI-EQ": {
        "stock_name": "NSE:SHEKHAWATI-EQ",
        "full_stock_name": "SHEKHAWATI INDUSTRIES LTD"
    },
    "NSE:SHEMAROO-EQ": {
        "stock_name": "NSE:SHEMAROO-EQ",
        "full_stock_name": "SHEMAROO ENTER. LTD."
    },
    "NSE:SHILCTECH-EQ": {
        "stock_name": "NSE:SHILCTECH-EQ",
        "full_stock_name": "SHILCHAR TECHNOLOGIES LTD"
    },
    "NSE:SHILPAMED-EQ": {
        "stock_name": "NSE:SHILPAMED-EQ",
        "full_stock_name": "SHILPA MEDICARE LTD"
    },
    "NSE:SHIVALIK-EQ": {
        "stock_name": "NSE:SHIVALIK-EQ",
        "full_stock_name": "SHIVALIK RASAYAN LIMITED"
    },
    "NSE:SHIVAMAUTO-EQ": {
        "stock_name": "NSE:SHIVAMAUTO-EQ",
        "full_stock_name": "SHIVAM AUTO.LTD"
    },
    "NSE:SHIVAMILLS-EQ": {
        "stock_name": "NSE:SHIVAMILLS-EQ",
        "full_stock_name": "SHIVA MILLS LIMITED"
    },
    "NSE:SHIVATEX-EQ": {
        "stock_name": "NSE:SHIVATEX-EQ",
        "full_stock_name": "SHIVA TEXYARN LIMITED"
    },
    "NSE:SHIVAUM-EQ": {
        "stock_name": "NSE:SHIVAUM-EQ",
        "full_stock_name": "SHIV AUM STEELS LIMITED"
    },
    "NSE:SHK-EQ": {
        "stock_name": "NSE:SHK-EQ",
        "full_stock_name": "S H KELKAR AND CO. LTD."
    },
    "NSE:SHOPERSTOP-EQ": {
        "stock_name": "NSE:SHOPERSTOP-EQ",
        "full_stock_name": "SHOPPERS STOP LIMITED"
    },
    "NSE:SHRADHA-EQ": {
        "stock_name": "NSE:SHRADHA-EQ",
        "full_stock_name": "SHRADHA INFRAPROJECTS LTD"
    },
    "NSE:SHREDIGCEM-EQ": {
        "stock_name": "NSE:SHREDIGCEM-EQ",
        "full_stock_name": "SHREE DIGVIJAY CEM CO LTD"
    },
    "NSE:SHREECEM-EQ": {
        "stock_name": "NSE:SHREECEM-EQ",
        "full_stock_name": "SHREE CEMENT LIMITED"
    },
    "NSE:SHREEJISPG-EQ": {
        "stock_name": "NSE:SHREEJISPG-EQ",
        "full_stock_name": "SHREEJI SHIPPING GLOBAL L"
    },
    "NSE:SHREEPUSHK-EQ": {
        "stock_name": "NSE:SHREEPUSHK-EQ",
        "full_stock_name": "SHRE PUSH CHEM & FERT LTD"
    },
    "NSE:SHREERAMA-EQ": {
        "stock_name": "NSE:SHREERAMA-EQ",
        "full_stock_name": "SHREE RAMA MULTI TECH LTD"
    },
    "NSE:SHRENIK-BZ": {
        "stock_name": "NSE:SHRENIK-BZ",
        "full_stock_name": "SHRENIK LIMITED"
    },
    "NSE:SHREYANIND-EQ": {
        "stock_name": "NSE:SHREYANIND-EQ",
        "full_stock_name": "SHREYANS INDUSTRIES LTD"
    },
    "NSE:SHRINGARMS-EQ": {
        "stock_name": "NSE:SHRINGARMS-EQ",
        "full_stock_name": "SHRINGAR HOU OF MANGALS L"
    },
    "NSE:SHRIPISTON-EQ": {
        "stock_name": "NSE:SHRIPISTON-EQ",
        "full_stock_name": "SHRIRAM PIST. & RING LTD"
    },
    "NSE:SHRIRAMFIN-EQ": {
        "stock_name": "NSE:SHRIRAMFIN-EQ",
        "full_stock_name": "SHRIRAM FINANCE LIMITED"
    },
    "NSE:SHRIRAMPPS-EQ": {
        "stock_name": "NSE:SHRIRAMPPS-EQ",
        "full_stock_name": "SHRIRAM PROPERTIES LTD"
    },
    "NSE:SHYAMCENT-BE": {
        "stock_name": "NSE:SHYAMCENT-BE",
        "full_stock_name": "SHYAM CENTURY FERROUS LTD"
    },
    "NSE:SHYAMMETL-EQ": {
        "stock_name": "NSE:SHYAMMETL-EQ",
        "full_stock_name": "SHYAM METALICS AND ENGY L"
    },
    "NSE:SHYAMTEL-EQ": {
        "stock_name": "NSE:SHYAMTEL-EQ",
        "full_stock_name": "SHYAM TELECOM LIMITED"
    },
    "NSE:SICALLOG-BE": {
        "stock_name": "NSE:SICALLOG-BE",
        "full_stock_name": "SICAL LOGISTICS LIMITED"
    },
    "NSE:SIEMENS-EQ": {
        "stock_name": "NSE:SIEMENS-EQ",
        "full_stock_name": "SIEMENS LTD"
    },
    "NSE:SIGACHI-EQ": {
        "stock_name": "NSE:SIGACHI-EQ",
        "full_stock_name": "SIGACHI INDUSTRIES LTD"
    },
    "NSE:SIGIND-EQ": {
        "stock_name": "NSE:SIGIND-EQ",
        "full_stock_name": "SIGNET INDUSTRIES LIMITED"
    },
    "NSE:SIGMA-EQ": {
        "stock_name": "NSE:SIGMA-EQ",
        "full_stock_name": "SIGMA SOLVE LIMITED"
    },
    "NSE:SIGNATURE-EQ": {
        "stock_name": "NSE:SIGNATURE-EQ",
        "full_stock_name": "SIGNATUREGLOBAL INDIA LTD"
    },
    "NSE:SIGNPOST-EQ": {
        "stock_name": "NSE:SIGNPOST-EQ",
        "full_stock_name": "SIGNPOST INDIA LIMITED"
    },
    "NSE:SIKKO-BE": {
        "stock_name": "NSE:SIKKO-BE",
        "full_stock_name": "SIKKO INDUSTRIES LIMITED"
    },
    "NSE:SIL-EQ": {
        "stock_name": "NSE:SIL-EQ",
        "full_stock_name": "STANDARD INDUSTRIES LTD."
    },
    "NSE:SILGO-EQ": {
        "stock_name": "NSE:SILGO-EQ",
        "full_stock_name": "SILGO RETAIL LIMITED"
    },
    "NSE:SILINV-EQ": {
        "stock_name": "NSE:SILINV-EQ",
        "full_stock_name": "SIL INVESTMENTS LIMITED"
    },
    "NSE:SILLYMONKS-BE": {
        "stock_name": "NSE:SILLYMONKS-BE",
        "full_stock_name": "SILLY MONKS ENTERTAIN LTD"
    },
    "NSE:SILVER-EQ": {
        "stock_name": "NSE:SILVER-EQ",
        "full_stock_name": "BIRLASLAMC - SILVER"
    },
    "NSE:SILVER1-EQ": {
        "stock_name": "NSE:SILVER1-EQ",
        "full_stock_name": "KOTAKMAMC - KOTAKSILVE"
    },
    "NSE:SILVER360-EQ": {
        "stock_name": "NSE:SILVER360-EQ",
        "full_stock_name": "360ONEAMC - SILVER360"
    },
    "NSE:SILVERADD-EQ": {
        "stock_name": "NSE:SILVERADD-EQ",
        "full_stock_name": "DSPAMC - DSPSILVETF"
    },
    "NSE:SILVERAG-EQ": {
        "stock_name": "NSE:SILVERAG-EQ",
        "full_stock_name": "MIRAEAMC - MASILVER"
    },
    "NSE:SILVERBEES-EQ": {
        "stock_name": "NSE:SILVERBEES-EQ",
        "full_stock_name": "NIPPONAMC - NETFSILVER"
    },
    "NSE:SILVERBETA-EQ": {
        "stock_name": "NSE:SILVERBETA-EQ",
        "full_stock_name": "UTIAMC-SILVERBETA"
    },
    "NSE:SILVERBND-EQ": {
        "stock_name": "NSE:SILVERBND-EQ",
        "full_stock_name": "BANDHANAMC - SILVERBND"
    },
    "NSE:SILVERCASE-EQ": {
        "stock_name": "NSE:SILVERCASE-EQ",
        "full_stock_name": "ZERODHAAMC - SILVERCASE"
    },
    "NSE:SILVERTUC-EQ": {
        "stock_name": "NSE:SILVERTUC-EQ",
        "full_stock_name": "SILVER TOUCH TECHNO LTD"
    },
    "NSE:SIMBHALS-BZ": {
        "stock_name": "NSE:SIMBHALS-BZ",
        "full_stock_name": "SIMBHAOLI SUGARS LTD."
    },
    "NSE:SIMPLEXINF-EQ": {
        "stock_name": "NSE:SIMPLEXINF-EQ",
        "full_stock_name": "SIMPLEX INFRASTRUCTURES L"
    },
    "NSE:SINCLAIR-EQ": {
        "stock_name": "NSE:SINCLAIR-EQ",
        "full_stock_name": "SINCLAIRS HOTELS LIMITED"
    },
    "NSE:SINDHUTRAD-EQ": {
        "stock_name": "NSE:SINDHUTRAD-EQ",
        "full_stock_name": "SINDHU TRADE LINKS LTD"
    },
    "NSE:SINTERCOM-EQ": {
        "stock_name": "NSE:SINTERCOM-EQ",
        "full_stock_name": "SINTERCOM INDIA LIMITED"
    },
    "NSE:SIRCA-EQ": {
        "stock_name": "NSE:SIRCA-EQ",
        "full_stock_name": "SIRCA PAINT INDIA LIMITED"
    },
    "NSE:SIS-EQ": {
        "stock_name": "NSE:SIS-EQ",
        "full_stock_name": "SIS LIMITED"
    },
    "NSE:SITINET-BZ": {
        "stock_name": "NSE:SITINET-BZ",
        "full_stock_name": "SITI NETWORKS LIMITED"
    },
    "NSE:SIYSIL-EQ": {
        "stock_name": "NSE:SIYSIL-EQ",
        "full_stock_name": "SIYARAM SILK MILLS LTD"
    },
    "NSE:SJS-EQ": {
        "stock_name": "NSE:SJS-EQ",
        "full_stock_name": "SJS ENTERPRISES LIMITED"
    },
    "NSE:SJVN-EQ": {
        "stock_name": "NSE:SJVN-EQ",
        "full_stock_name": "SJVN LTD"
    },
    "NSE:SKFINDIA-EQ": {
        "stock_name": "NSE:SKFINDIA-EQ",
        "full_stock_name": "SKF INDIA LTD"
    },
    "NSE:SKFINDUS-EQ": {
        "stock_name": "NSE:SKFINDUS-EQ",
        "full_stock_name": "SKF IND (INDUSTRIAL) LTD"
    },
    "NSE:SKIPPER-EQ": {
        "stock_name": "NSE:SKIPPER-EQ",
        "full_stock_name": "SKIPPER LIMITED"
    },
    "NSE:SKMEGGPROD-EQ": {
        "stock_name": "NSE:SKMEGGPROD-EQ",
        "full_stock_name": "SKM EGG PROD EXPORT(I) LT"
    },
    "NSE:SKYGOLD-EQ": {
        "stock_name": "NSE:SKYGOLD-EQ",
        "full_stock_name": "SKY GOLD AND DIAMONDS LTD"
    },
    "NSE:SMALL250-EQ": {
        "stock_name": "NSE:SMALL250-EQ",
        "full_stock_name": "MIRAEAMC - SMALL250"
    },
    "NSE:SMALLADD-EQ": {
        "stock_name": "NSE:SMALLADD-EQ",
        "full_stock_name": "DSPAMC - SMALLADD"
    },
    "NSE:SMALLCAP-EQ": {
        "stock_name": "NSE:SMALLCAP-EQ",
        "full_stock_name": "MIRAEAMC - SMALLCAP"
    },
    "NSE:SMARTLINK-EQ": {
        "stock_name": "NSE:SMARTLINK-EQ",
        "full_stock_name": "SMARTLINK HOLDINGS LTD"
    },
    "NSE:SMARTWORKS-EQ": {
        "stock_name": "NSE:SMARTWORKS-EQ",
        "full_stock_name": "SMARTWORKS COWORKING SP L"
    },
    "NSE:SMCGLOBAL-EQ": {
        "stock_name": "NSE:SMCGLOBAL-EQ",
        "full_stock_name": "SMC GLOBAL SECURITIES LTD"
    },
    "NSE:SML100CASE-EQ": {
        "stock_name": "NSE:SML100CASE-EQ",
        "full_stock_name": "ZERODHAAMC - SML100CASE"
    },
    "NSE:SMLMAH-EQ": {
        "stock_name": "NSE:SMLMAH-EQ",
        "full_stock_name": "SML MAHINDRA LIMITED"
    },
    "NSE:SMLT-EQ": {
        "stock_name": "NSE:SMLT-EQ",
        "full_stock_name": "SARTHAK METALS LIMITED"
    },
    "NSE:SMSPHARMA-EQ": {
        "stock_name": "NSE:SMSPHARMA-EQ",
        "full_stock_name": "SMS PHARMACEUTICALS LTD."
    },
    "NSE:SNOWMAN-EQ": {
        "stock_name": "NSE:SNOWMAN-EQ",
        "full_stock_name": "SNOWMAN LOGISTICS LTD."
    },
    "NSE:SNXT30BEES-EQ": {
        "stock_name": "NSE:SNXT30BEES-EQ",
        "full_stock_name": "NIPPONAMC - SNXT30BEES"
    },
    "NSE:SNXT50BETA-EQ": {
        "stock_name": "NSE:SNXT50BETA-EQ",
        "full_stock_name": "UTIAMC-SNXT50BETA"
    },
    "NSE:SOBHA-EQ": {
        "stock_name": "NSE:SOBHA-EQ",
        "full_stock_name": "SOBHA LIMITED"
    },
    "NSE:SOFTTECH-EQ": {
        "stock_name": "NSE:SOFTTECH-EQ",
        "full_stock_name": "SOFTTECH ENGINEERS LTD"
    },
    "NSE:SOLARA-EQ": {
        "stock_name": "NSE:SOLARA-EQ",
        "full_stock_name": "SOLARA ACTIVE PHA SCI LTD"
    },
    "NSE:SOLARINDS-EQ": {
        "stock_name": "NSE:SOLARINDS-EQ",
        "full_stock_name": "SOLAR INDUSTRIES (I) LTD"
    },
    "NSE:SOLARWORLD-EQ": {
        "stock_name": "NSE:SOLARWORLD-EQ",
        "full_stock_name": "SOLARWORLD ENERGY SOL LTD"
    },
    "NSE:SOLEX-EQ": {
        "stock_name": "NSE:SOLEX-EQ",
        "full_stock_name": "SOLEX ENERGY LIMITED"
    },
    "NSE:SOMANYCERA-EQ": {
        "stock_name": "NSE:SOMANYCERA-EQ",
        "full_stock_name": "SOMANY CERAMICS LIMITED"
    },
    "NSE:SOMATEX-BE": {
        "stock_name": "NSE:SOMATEX-BE",
        "full_stock_name": "SOMA TEXTILEI NDUSTRIES L"
    },
    "NSE:SOMICONVEY-EQ": {
        "stock_name": "NSE:SOMICONVEY-EQ",
        "full_stock_name": "SOMI CONVEYOR BELT. LTD."
    },
    "NSE:SONACOMS-EQ": {
        "stock_name": "NSE:SONACOMS-EQ",
        "full_stock_name": "SONA BLW PRECISION FRGS L"
    },
    "NSE:SONAMLTD-EQ": {
        "stock_name": "NSE:SONAMLTD-EQ",
        "full_stock_name": "SONAM LIMITED"
    },
    "NSE:SONATSOFTW-EQ": {
        "stock_name": "NSE:SONATSOFTW-EQ",
        "full_stock_name": "SONATA SOFTWARE LTD"
    },
    "NSE:SOTL-EQ": {
        "stock_name": "NSE:SOTL-EQ",
        "full_stock_name": "SAVITA OIL TECHNOLO. LTD"
    },
    "NSE:SOUTHBANK-EQ": {
        "stock_name": "NSE:SOUTHBANK-EQ",
        "full_stock_name": "THE SOUTH INDIAN BANK LTD"
    },
    "NSE:SOUTHWEST-BE": {
        "stock_name": "NSE:SOUTHWEST-BE",
        "full_stock_name": "SOUTH WEST PINNACLE LTD"
    },
    "NSE:SPAL-EQ": {
        "stock_name": "NSE:SPAL-EQ",
        "full_stock_name": "S. P. APPARELS LIMITED"
    },
    "NSE:SPANDANA-EQ": {
        "stock_name": "NSE:SPANDANA-EQ",
        "full_stock_name": "SPANDANA SPHOORTY FIN LTD"
    },
    "NSE:SPARC-EQ": {
        "stock_name": "NSE:SPARC-EQ",
        "full_stock_name": "SUN PHARMA ADV.RES.CO.LTD"
    },
    "NSE:SPCENET-EQ": {
        "stock_name": "NSE:SPCENET-EQ",
        "full_stock_name": "SPACENET ENTERS IND LTD"
    },
    "NSE:SPECIALITY-EQ": {
        "stock_name": "NSE:SPECIALITY-EQ",
        "full_stock_name": "SPECIALITY REST LTD"
    },
    "NSE:SPECTRUM-EQ": {
        "stock_name": "NSE:SPECTRUM-EQ",
        "full_stock_name": "SPECTRUM ELECTRIC IND LTD"
    },
    "NSE:SPENCERS-EQ": {
        "stock_name": "NSE:SPENCERS-EQ",
        "full_stock_name": "SPENCER S RETAIL LIMITED"
    },
    "NSE:SPIC-EQ": {
        "stock_name": "NSE:SPIC-EQ",
        "full_stock_name": "SPIC LTD"
    },
    "NSE:SPLIL-EQ": {
        "stock_name": "NSE:SPLIL-EQ",
        "full_stock_name": "SPL INDUSTRIES LIMITED"
    },
    "NSE:SPLPETRO-EQ": {
        "stock_name": "NSE:SPLPETRO-EQ",
        "full_stock_name": "SUPREME PETROCHEM LIMITED"
    },
    "NSE:SPMLINFRA-EQ": {
        "stock_name": "NSE:SPMLINFRA-EQ",
        "full_stock_name": "SPML INFRA LIMITED"
    },
    "NSE:SPORTKING-EQ": {
        "stock_name": "NSE:SPORTKING-EQ",
        "full_stock_name": "SPORTKING INDIA LIMITED"
    },
    "NSE:SRD-EQ": {
        "stock_name": "NSE:SRD-EQ",
        "full_stock_name": "SHANKAR LAL RAMPAL LTD"
    },
    "NSE:SREEL-EQ": {
        "stock_name": "NSE:SREEL-EQ",
        "full_stock_name": "SREELEATHERS LIMITED"
    },
    "NSE:SRF-EQ": {
        "stock_name": "NSE:SRF-EQ",
        "full_stock_name": "SRF LTD"
    },
    "NSE:SRGHFL-EQ": {
        "stock_name": "NSE:SRGHFL-EQ",
        "full_stock_name": "SRG HOUSING FINANCE L"
    },
    "NSE:SRHHYPOLTD-EQ": {
        "stock_name": "NSE:SRHHYPOLTD-EQ",
        "full_stock_name": "SREE RAYALSEEMA HHP LTD."
    },
    "NSE:SRM-EQ": {
        "stock_name": "NSE:SRM-EQ",
        "full_stock_name": "SRM CONTRACTORS LIMITED"
    },
    "NSE:SRPL-BZ": {
        "stock_name": "NSE:SRPL-BZ",
        "full_stock_name": "SHREE RAM PROTEINS LTD."
    },
    "NSE:SSDL-EQ": {
        "stock_name": "NSE:SSDL-EQ",
        "full_stock_name": "SARASWATI SAREE DEPOT LTD"
    },
    "NSE:SSWL-EQ": {
        "stock_name": "NSE:SSWL-EQ",
        "full_stock_name": "STEEL STRIPS WHEELS LTD."
    },
    "NSE:STALLION-EQ": {
        "stock_name": "NSE:STALLION-EQ",
        "full_stock_name": "STALLION IND FLUOROCHEM L"
    },
    "NSE:STANLEY-EQ": {
        "stock_name": "NSE:STANLEY-EQ",
        "full_stock_name": "STANLEY LIFESTYLES LTD"
    },
    "NSE:STAR-EQ": {
        "stock_name": "NSE:STAR-EQ",
        "full_stock_name": "STRIDES PHARMA SCI LTD"
    },
    "NSE:STARCEMENT-EQ": {
        "stock_name": "NSE:STARCEMENT-EQ",
        "full_stock_name": "STAR CEMENT LIMITED"
    },
    "NSE:STARHEALTH-EQ": {
        "stock_name": "NSE:STARHEALTH-EQ",
        "full_stock_name": "STAR HEALTH & AL INS CO L"
    },
    "NSE:STARPAPER-EQ": {
        "stock_name": "NSE:STARPAPER-EQ",
        "full_stock_name": "STAR PAPER MILLS LTD"
    },
    "NSE:STARTECK-EQ": {
        "stock_name": "NSE:STARTECK-EQ",
        "full_stock_name": "STARTECK FINANCE LIMITED"
    },
    "NSE:STCINDIA-EQ": {
        "stock_name": "NSE:STCINDIA-EQ",
        "full_stock_name": "THE STATE TRADING CORPN"
    },
    "NSE:STEELCAS-EQ": {
        "stock_name": "NSE:STEELCAS-EQ",
        "full_stock_name": "STEELCAST LIMITED"
    },
    "NSE:STEELCITY-EQ": {
        "stock_name": "NSE:STEELCITY-EQ",
        "full_stock_name": "STEEL CITY SECURITIES LTD"
    },
    "NSE:STEELXIND-EQ": {
        "stock_name": "NSE:STEELXIND-EQ",
        "full_stock_name": "STEEL EXCHANGE INDIA LTD"
    },
    "NSE:STEL-EQ": {
        "stock_name": "NSE:STEL-EQ",
        "full_stock_name": "STEL HOLDINGS LIMITED"
    },
    "NSE:STERTOOLS-EQ": {
        "stock_name": "NSE:STERTOOLS-EQ",
        "full_stock_name": "STERLING TOOLS LIMITED"
    },
    "NSE:STLNETWORK-EQ": {
        "stock_name": "NSE:STLNETWORK-EQ",
        "full_stock_name": "STL NETWORKS LIMITED"
    },
    "NSE:STLTECH-EQ": {
        "stock_name": "NSE:STLTECH-EQ",
        "full_stock_name": "STERLITE TECHNOLOGIES LTD"
    },
    "NSE:STOVEKRAFT-EQ": {
        "stock_name": "NSE:STOVEKRAFT-EQ",
        "full_stock_name": "STOVE KRAFT LIMITED"
    },
    "NSE:STUDDS-EQ": {
        "stock_name": "NSE:STUDDS-EQ",
        "full_stock_name": "STUDDS ACCESSORIES LTD"
    },
    "NSE:STYL-EQ": {
        "stock_name": "NSE:STYL-EQ",
        "full_stock_name": "SESHAASAI TECHNOLOGIES L"
    },
    "NSE:STYLAMIND-EQ": {
        "stock_name": "NSE:STYLAMIND-EQ",
        "full_stock_name": "STYLAM INDUSTRIES LIMITED"
    },
    "NSE:STYLEBAAZA-EQ": {
        "stock_name": "NSE:STYLEBAAZA-EQ",
        "full_stock_name": "BAAZAR STYLE RETAIL LTD"
    },
    "NSE:STYRENIX-EQ": {
        "stock_name": "NSE:STYRENIX-EQ",
        "full_stock_name": "STYRENIX PERFORMANCE LTD"
    },
    "NSE:SUBEXLTD-EQ": {
        "stock_name": "NSE:SUBEXLTD-EQ",
        "full_stock_name": "SUBEX LTD"
    },
    "NSE:SUBROS-EQ": {
        "stock_name": "NSE:SUBROS-EQ",
        "full_stock_name": "SUBROS LIMITED"
    },
    "NSE:SUDARCOLOR-EQ": {
        "stock_name": "NSE:SUDARCOLOR-EQ",
        "full_stock_name": "SUDARSHAN COLORNT IND LTD"
    },
    "NSE:SUDARSCHEM-EQ": {
        "stock_name": "NSE:SUDARSCHEM-EQ",
        "full_stock_name": "SUDARSHAN CHEMICAL INDS L"
    },
    "NSE:SUDEEPPHRM-EQ": {
        "stock_name": "NSE:SUDEEPPHRM-EQ",
        "full_stock_name": "SUDEEP PHARMA LIMITED"
    },
    "NSE:SUKHJITS-EQ": {
        "stock_name": "NSE:SUKHJITS-EQ",
        "full_stock_name": "SUKHJIT STARCH & CHEM LTD"
    },
    "NSE:SULA-EQ": {
        "stock_name": "NSE:SULA-EQ",
        "full_stock_name": "SULA VINEYARDS LIMITED"
    },
    "NSE:SUMEETINDS-EQ": {
        "stock_name": "NSE:SUMEETINDS-EQ",
        "full_stock_name": "SUMEET IND LIMITED"
    },
    "NSE:SUMICHEM-EQ": {
        "stock_name": "NSE:SUMICHEM-EQ",
        "full_stock_name": "SUMITOMO CHEM INDIA LTD"
    },
    "NSE:SUMIT-EQ": {
        "stock_name": "NSE:SUMIT-EQ",
        "full_stock_name": "SUMIT WOODS LIMITED"
    },
    "NSE:SUMMITSEC-EQ": {
        "stock_name": "NSE:SUMMITSEC-EQ",
        "full_stock_name": "SUMMIT SECURITIES LTD"
    },
    "NSE:SUNCLAY-EQ": {
        "stock_name": "NSE:SUNCLAY-EQ",
        "full_stock_name": "SUNDARAM CLAYTON LIMITED"
    },
    "NSE:SUNDARAM-EQ": {
        "stock_name": "NSE:SUNDARAM-EQ",
        "full_stock_name": "SUNDARAM MULTI PAP LTD"
    },
    "NSE:SUNDARMFIN-EQ": {
        "stock_name": "NSE:SUNDARMFIN-EQ",
        "full_stock_name": "SUNDARAM FINANCE LTD"
    },
    "NSE:SUNDRMBRAK-EQ": {
        "stock_name": "NSE:SUNDRMBRAK-EQ",
        "full_stock_name": "SUNDARAM BRAK LININGS LTD"
    },
    "NSE:SUNDRMFAST-EQ": {
        "stock_name": "NSE:SUNDRMFAST-EQ",
        "full_stock_name": "SUNDRAM FASTENERS LTD"
    },
    "NSE:SUNDROP-EQ": {
        "stock_name": "NSE:SUNDROP-EQ",
        "full_stock_name": "SUNDROP BRANDS LIMITED"
    },
    "NSE:SUNFLAG-EQ": {
        "stock_name": "NSE:SUNFLAG-EQ",
        "full_stock_name": "SUNFLAG IRON AND STEEL CO"
    },
    "NSE:SUNPHARMA-EQ": {
        "stock_name": "NSE:SUNPHARMA-EQ",
        "full_stock_name": "SUN PHARMACEUTICAL IND L"
    },
    "NSE:SUNTECK-EQ": {
        "stock_name": "NSE:SUNTECK-EQ",
        "full_stock_name": "SUNTECK REALTY LIMITED"
    },
    "NSE:SUNTV-EQ": {
        "stock_name": "NSE:SUNTV-EQ",
        "full_stock_name": "SUN TV NETWORK LIMITED"
    },
    "NSE:SUPERHOUSE-EQ": {
        "stock_name": "NSE:SUPERHOUSE-EQ",
        "full_stock_name": "SUPERHOUSE LIMITED"
    },
    "NSE:SUPERSPIN-EQ": {
        "stock_name": "NSE:SUPERSPIN-EQ",
        "full_stock_name": "SUPER SPINNING MILLS LTD"
    },
    "NSE:SUPRAJIT-EQ": {
        "stock_name": "NSE:SUPRAJIT-EQ",
        "full_stock_name": "SUPRAJIT ENGINEERING LTD"
    },
    "NSE:SUPREME-EQ": {
        "stock_name": "NSE:SUPREME-EQ",
        "full_stock_name": "SUPREME HOLDIN N HOSP I L"
    },
    "NSE:SUPREMEIND-EQ": {
        "stock_name": "NSE:SUPREMEIND-EQ",
        "full_stock_name": "SUPREME INDUSTRIES LTD"
    },
    "NSE:SUPREMEINF-BZ": {
        "stock_name": "NSE:SUPREMEINF-BZ",
        "full_stock_name": "SUPREME INFRA. LTD"
    },
    "NSE:SUPRIYA-EQ": {
        "stock_name": "NSE:SUPRIYA-EQ",
        "full_stock_name": "SUPRIYA LIFESCIENCE LTD"
    },
    "NSE:SURAJEST-EQ": {
        "stock_name": "NSE:SURAJEST-EQ",
        "full_stock_name": "SURAJ ESTATE DEVELOPERS L"
    },
    "NSE:SURAJLTD-EQ": {
        "stock_name": "NSE:SURAJLTD-EQ",
        "full_stock_name": "SURAJ LIMITED"
    },
    "NSE:SURAKSHA-EQ": {
        "stock_name": "NSE:SURAKSHA-EQ",
        "full_stock_name": "SURAKSHA DIAGNOSTIC LTD"
    },
    "NSE:SURANASOL-EQ": {
        "stock_name": "NSE:SURANASOL-EQ",
        "full_stock_name": "SURANA SOLAR LIMITED"
    },
    "NSE:SURANAT&P-EQ": {
        "stock_name": "NSE:SURANAT&P-EQ",
        "full_stock_name": "SURANA TELECOM AND POW LT"
    },
    "NSE:SURYALAXMI-EQ": {
        "stock_name": "NSE:SURYALAXMI-EQ",
        "full_stock_name": "SURYALAKSHMI COT MIL LTD"
    },
    "NSE:SURYAROSNI-EQ": {
        "stock_name": "NSE:SURYAROSNI-EQ",
        "full_stock_name": "SURYA ROSHNI LTD"
    },
    "NSE:SURYODAY-EQ": {
        "stock_name": "NSE:SURYODAY-EQ",
        "full_stock_name": "SURYODAY SMALL FIN BK LTD"
    },
    "NSE:SUTLEJTEX-EQ": {
        "stock_name": "NSE:SUTLEJTEX-EQ",
        "full_stock_name": "SUTLEJ TEXT & INDUS LTD"
    },
    "NSE:SUVEN-EQ": {
        "stock_name": "NSE:SUVEN-EQ",
        "full_stock_name": "SUVEN LIFE SCIENCES LTD"
    },
    "NSE:SUVIDHAA-EQ": {
        "stock_name": "NSE:SUVIDHAA-EQ",
        "full_stock_name": "SUVIDHAA INFOSERVE LTD"
    },
    "NSE:SUYOG-EQ": {
        "stock_name": "NSE:SUYOG-EQ",
        "full_stock_name": "SUYOG TELEMATICS LIMITED"
    },
    "NSE:SUZLON-EQ": {
        "stock_name": "NSE:SUZLON-EQ",
        "full_stock_name": "SUZLON ENERGY LIMITED"
    },
    "NSE:SVLL-EQ": {
        "stock_name": "NSE:SVLL-EQ",
        "full_stock_name": "SHREE VASU LOGISTICS LTD"
    },
    "NSE:SVPGLOB-BE": {
        "stock_name": "NSE:SVPGLOB-BE",
        "full_stock_name": "SVP GLOBAL TEXTILES LTD"
    },
    "NSE:SWANCORP-EQ": {
        "stock_name": "NSE:SWANCORP-EQ",
        "full_stock_name": "SWAN CORP LIMITED"
    },
    "NSE:SWARAJENG-EQ": {
        "stock_name": "NSE:SWARAJENG-EQ",
        "full_stock_name": "SWARAJ ENGINES LTD"
    },
    "NSE:SWELECTES-EQ": {
        "stock_name": "NSE:SWELECTES-EQ",
        "full_stock_name": "SWELECT ENERGY SYS LTD"
    },
    "NSE:SWIGGY-EQ": {
        "stock_name": "NSE:SWIGGY-EQ",
        "full_stock_name": "SWIGGY LIMITED"
    },
    "NSE:SWSOLAR-EQ": {
        "stock_name": "NSE:SWSOLAR-EQ",
        "full_stock_name": "STRLNG & WIL REN ENE LTD"
    },
    "NSE:SYMPHONY-EQ": {
        "stock_name": "NSE:SYMPHONY-EQ",
        "full_stock_name": "SYMPHONY LIMITED"
    },
    "NSE:SYNCOMF-EQ": {
        "stock_name": "NSE:SYNCOMF-EQ",
        "full_stock_name": "SYNCOM FORMU (I) LTD"
    },
    "NSE:SYNGENE-EQ": {
        "stock_name": "NSE:SYNGENE-EQ",
        "full_stock_name": "SYNGENE INTERNATIONAL LTD"
    },
    "NSE:SYRMA-EQ": {
        "stock_name": "NSE:SYRMA-EQ",
        "full_stock_name": "SYRMA SGS TECHNOLOGY LTD"
    },
    "NSE:SYSTMTXC-EQ": {
        "stock_name": "NSE:SYSTMTXC-EQ",
        "full_stock_name": "SYSTEMATIX CORP SERVICE L"
    },
    "NSE:TAINWALCHM-EQ": {
        "stock_name": "NSE:TAINWALCHM-EQ",
        "full_stock_name": "TAINWALA CHEMICAL AND PLA"
    },
    "NSE:TAJGVK-EQ": {
        "stock_name": "NSE:TAJGVK-EQ",
        "full_stock_name": "TAJ GVK HOTELS & RESORTS"
    },
    "NSE:TAKE-BE": {
        "stock_name": "NSE:TAKE-BE",
        "full_stock_name": "TAKE SOLUTIONS LTD"
    },
    "NSE:TALBROAUTO-EQ": {
        "stock_name": "NSE:TALBROAUTO-EQ",
        "full_stock_name": "TALBROS AUTO. COMP. LTD"
    },
    "NSE:TANLA-EQ": {
        "stock_name": "NSE:TANLA-EQ",
        "full_stock_name": "TANLA PLATFORMS LIMITED"
    },
    "NSE:TARACHAND-EQ": {
        "stock_name": "NSE:TARACHAND-EQ",
        "full_stock_name": "TARA CHAND INFRA SOLN LTD"
    },
    "NSE:TARAPUR-EQ": {
        "stock_name": "NSE:TARAPUR-EQ",
        "full_stock_name": "TARAPUR TRANSFORMERS LTD"
    },
    "NSE:TARC-EQ": {
        "stock_name": "NSE:TARC-EQ",
        "full_stock_name": "TARC LIMITED"
    },
    "NSE:TARIL-EQ": {
        "stock_name": "NSE:TARIL-EQ",
        "full_stock_name": "TRANS & RECTI. LTD"
    },
    "NSE:TARMAT-EQ": {
        "stock_name": "NSE:TARMAT-EQ",
        "full_stock_name": "TARMAT LIMITED"
    },
    "NSE:TARSONS-EQ": {
        "stock_name": "NSE:TARSONS-EQ",
        "full_stock_name": "TARSONS PRODUCTS LIMITED"
    },
    "NSE:TASTYBITE-EQ": {
        "stock_name": "NSE:TASTYBITE-EQ",
        "full_stock_name": "TASTY BITE EATABLES LTD"
    },
    "NSE:TATACAP-EQ": {
        "stock_name": "NSE:TATACAP-EQ",
        "full_stock_name": "TATA CAPITAL LIMITED"
    },
    "NSE:TATACHEM-EQ": {
        "stock_name": "NSE:TATACHEM-EQ",
        "full_stock_name": "TATA CHEMICALS LTD"
    },
    "NSE:TATACOMM-EQ": {
        "stock_name": "NSE:TATACOMM-EQ",
        "full_stock_name": "TATA COMMUNICATIONS LTD"
    },
    "NSE:TATACONSUM-EQ": {
        "stock_name": "NSE:TATACONSUM-EQ",
        "full_stock_name": "TATA CONSUMER PRODUCT LTD"
    },
    "NSE:TATAELXSI-EQ": {
        "stock_name": "NSE:TATAELXSI-EQ",
        "full_stock_name": "TATA ELXSI LIMITED"
    },
    "NSE:TATAGOLD-EQ": {
        "stock_name": "NSE:TATAGOLD-EQ",
        "full_stock_name": "TATAAML-TATAGOLD"
    },
    "NSE:TATAINVEST-EQ": {
        "stock_name": "NSE:TATAINVEST-EQ",
        "full_stock_name": "TATA INVESTMENT CORP LTD"
    },
    "NSE:TATAPOWER-EQ": {
        "stock_name": "NSE:TATAPOWER-EQ",
        "full_stock_name": "TATA POWER CO LTD"
    },
    "NSE:TATASTEEL-EQ": {
        "stock_name": "NSE:TATASTEEL-EQ",
        "full_stock_name": "TATA STEEL LIMITED"
    },
    "NSE:TATATECH-EQ": {
        "stock_name": "NSE:TATATECH-EQ",
        "full_stock_name": "TATA TECHNOLOGIES LIMITED"
    },
    "NSE:TATSILV-EQ": {
        "stock_name": "NSE:TATSILV-EQ",
        "full_stock_name": "TATAAML-TATSILV"
    },
    "NSE:TATVA-EQ": {
        "stock_name": "NSE:TATVA-EQ",
        "full_stock_name": "TATVA CHIN PHARM CHEM LTD"
    },
    "NSE:TBOTEK-EQ": {
        "stock_name": "NSE:TBOTEK-EQ",
        "full_stock_name": "TBO TEK LIMITED"
    },
    "NSE:TBZ-EQ": {
        "stock_name": "NSE:TBZ-EQ",
        "full_stock_name": "TRIB BHIMJI ZAVERI LTD"
    },
    "NSE:TCI-EQ": {
        "stock_name": "NSE:TCI-EQ",
        "full_stock_name": "TRANSPORT CORPN OF INDIA"
    },
    "NSE:TCIEXP-EQ": {
        "stock_name": "NSE:TCIEXP-EQ",
        "full_stock_name": "TCI EXPRESS LIMITED"
    },
    "NSE:TCIFINANCE-BE": {
        "stock_name": "NSE:TCIFINANCE-BE",
        "full_stock_name": "TCIFINANCELTD-ROLL SETT"
    },
    "NSE:TCPLPACK-EQ": {
        "stock_name": "NSE:TCPLPACK-EQ",
        "full_stock_name": "TCPL PACKAGING LIMITED"
    },
    "NSE:TCS-EQ": {
        "stock_name": "NSE:TCS-EQ",
        "full_stock_name": "TATA CONSULTANCY SERV LT"
    },
    "NSE:TDPOWERSYS-EQ": {
        "stock_name": "NSE:TDPOWERSYS-EQ",
        "full_stock_name": "TD POWER SYSTEMS LTD."
    },
    "NSE:TEAMGTY-EQ": {
        "stock_name": "NSE:TEAMGTY-EQ",
        "full_stock_name": "TEAM INDIA GUARANTY LTD"
    },
    "NSE:TEAMLEASE-EQ": {
        "stock_name": "NSE:TEAMLEASE-EQ",
        "full_stock_name": "TEAMLEASE SERVICES LTD."
    },
    "NSE:TECH-EQ": {
        "stock_name": "NSE:TECH-EQ",
        "full_stock_name": "BIRLASLAMC - TECH"
    },
    "NSE:TECHM-EQ": {
        "stock_name": "NSE:TECHM-EQ",
        "full_stock_name": "TECH MAHINDRA LIMITED"
    },
    "NSE:TECHNOE-EQ": {
        "stock_name": "NSE:TECHNOE-EQ",
        "full_stock_name": "TECHNO ELEC & ENG CO. LTD"
    },
    "NSE:TECILCHEM-EQ": {
        "stock_name": "NSE:TECILCHEM-EQ",
        "full_stock_name": "TECIL CHEMICALS"
    },
    "NSE:TEGA-EQ": {
        "stock_name": "NSE:TEGA-EQ",
        "full_stock_name": "TEGA INDUSTRIES LIMITED"
    },
    "NSE:TEJASNET-EQ": {
        "stock_name": "NSE:TEJASNET-EQ",
        "full_stock_name": "TEJAS NETWORKS LIMITED"
    },
    "NSE:TEMBO-EQ": {
        "stock_name": "NSE:TEMBO-EQ",
        "full_stock_name": "TEMBO GLOBAL IND LTD"
    },
    "NSE:TENNIND-EQ": {
        "stock_name": "NSE:TENNIND-EQ",
        "full_stock_name": "TENNECO CLEAN AIR INDIA L"
    },
    "NSE:TERASOFT-EQ": {
        "stock_name": "NSE:TERASOFT-EQ",
        "full_stock_name": "TERA SOFTWARE LIMITED"
    },
    "NSE:TEXINFRA-EQ": {
        "stock_name": "NSE:TEXINFRA-EQ",
        "full_stock_name": "TEXMACO INFRA & HOLDG LTD"
    },
    "NSE:TEXMOPIPES-EQ": {
        "stock_name": "NSE:TEXMOPIPES-EQ",
        "full_stock_name": "TEXMO PIPE & PRODUCTS LTD"
    },
    "NSE:TEXRAIL-EQ": {
        "stock_name": "NSE:TEXRAIL-EQ",
        "full_stock_name": "TEXMACO RAIL & ENG. LTD."
    },
    "NSE:TFCILTD-EQ": {
        "stock_name": "NSE:TFCILTD-EQ",
        "full_stock_name": "TOURISM FINANCE CORP. OF"
    },
    "NSE:TFL-EQ": {
        "stock_name": "NSE:TFL-EQ",
        "full_stock_name": "TRANSWARRANTY FIN. LTD."
    },
    "NSE:TGBHOTELS-EQ": {
        "stock_name": "NSE:TGBHOTELS-EQ",
        "full_stock_name": "TGB BANQUETS&HOTELS LTD"
    },
    "NSE:THANGAMAYL-EQ": {
        "stock_name": "NSE:THANGAMAYL-EQ",
        "full_stock_name": "THANGAMAYIL JEWELLERY LTD"
    },
    "NSE:THEINVEST-EQ": {
        "stock_name": "NSE:THEINVEST-EQ",
        "full_stock_name": "THE INVEST TRUST OF IND L"
    },
    "NSE:THEJO-EQ": {
        "stock_name": "NSE:THEJO-EQ",
        "full_stock_name": "THEJO ENGINEERING LIMITED"
    },
    "NSE:THELEELA-EQ": {
        "stock_name": "NSE:THELEELA-EQ",
        "full_stock_name": "LEELA PALACES HOTEL LTD"
    },
    "NSE:THEMISMED-EQ": {
        "stock_name": "NSE:THEMISMED-EQ",
        "full_stock_name": "THEMIS MEDICARE LTD."
    },
    "NSE:THERMAX-EQ": {
        "stock_name": "NSE:THERMAX-EQ",
        "full_stock_name": "THERMAX LTD"
    },
    "NSE:THOMASCOOK-EQ": {
        "stock_name": "NSE:THOMASCOOK-EQ",
        "full_stock_name": "THOMAS COOK (INDIA) LTD"
    },
    "NSE:THOMASCOTT-EQ": {
        "stock_name": "NSE:THOMASCOTT-EQ",
        "full_stock_name": "THOMAS SCOTT (INDIA) LTD"
    },
    "NSE:THYROCARE-EQ": {
        "stock_name": "NSE:THYROCARE-EQ",
        "full_stock_name": "THYROCARE TECH LTD"
    },
    "NSE:TI-EQ": {
        "stock_name": "NSE:TI-EQ",
        "full_stock_name": "TILAKNAGAR INDUSTRIES LTD"
    },
    "NSE:TICL-BE": {
        "stock_name": "NSE:TICL-BE",
        "full_stock_name": "TWAMEV CONS AND INFRA LTD"
    },
    "NSE:TIGERLOGS-EQ": {
        "stock_name": "NSE:TIGERLOGS-EQ",
        "full_stock_name": "TIGER LOGISTICS (INDIA) L"
    },
    "NSE:TIIL-EQ": {
        "stock_name": "NSE:TIIL-EQ",
        "full_stock_name": "TECHNOCRAFT IND LTD"
    },
    "NSE:TIINDIA-EQ": {
        "stock_name": "NSE:TIINDIA-EQ",
        "full_stock_name": "TUBE INVEST OF INDIA LTD"
    },
    "NSE:TIJARIA-EQ": {
        "stock_name": "NSE:TIJARIA-EQ",
        "full_stock_name": "TIJARIA POLYPIPES LTD"
    },
    "NSE:TIL-EQ": {
        "stock_name": "NSE:TIL-EQ",
        "full_stock_name": "TIL LTD"
    },
    "NSE:TIMETECHNO-EQ": {
        "stock_name": "NSE:TIMETECHNO-EQ",
        "full_stock_name": "TIME TECHNOPLAST LTD."
    },
    "NSE:TIMKEN-EQ": {
        "stock_name": "NSE:TIMKEN-EQ",
        "full_stock_name": "TIMKEN INDIA LTD."
    },
    "NSE:TINNARUBR-EQ": {
        "stock_name": "NSE:TINNARUBR-EQ",
        "full_stock_name": "TINNA RUBBER AND INFR LTD"
    },
    "NSE:TIPSFILMS-EQ": {
        "stock_name": "NSE:TIPSFILMS-EQ",
        "full_stock_name": "TIPS FILMS LIMITED"
    },
    "NSE:TIPSMUSIC-EQ": {
        "stock_name": "NSE:TIPSMUSIC-EQ",
        "full_stock_name": "TIPS MUSIC LIMITED"
    },
    "NSE:TIRUMALCHM-EQ": {
        "stock_name": "NSE:TIRUMALCHM-EQ",
        "full_stock_name": "THIRUMALAI CHEMICALS LTD"
    },
    "NSE:TIRUPATIFL-EQ": {
        "stock_name": "NSE:TIRUPATIFL-EQ",
        "full_stock_name": "TIRUPATI FORGE LIMITED"
    },
    "NSE:TITAGARH-EQ": {
        "stock_name": "NSE:TITAGARH-EQ",
        "full_stock_name": "TITAGARH RAIL SYSTEMS LTD"
    },
    "NSE:TITAN-EQ": {
        "stock_name": "NSE:TITAN-EQ",
        "full_stock_name": "TITAN COMPANY LIMITED"
    },
    "NSE:TMB-EQ": {
        "stock_name": "NSE:TMB-EQ",
        "full_stock_name": "TAMILNAD MERCA BANK LTD"
    },
    "NSE:TMCV-EQ": {
        "stock_name": "NSE:TMCV-EQ",
        "full_stock_name": "TATA MOTORS LIMITED"
    },
    "NSE:TMPV-EQ": {
        "stock_name": "NSE:TMPV-EQ",
        "full_stock_name": "TATA MOTORS PASS VEH LTD"
    },
    "NSE:TNPETRO-EQ": {
        "stock_name": "NSE:TNPETRO-EQ",
        "full_stock_name": "TAMILNADU PETROPRODUCTS L"
    },
    "NSE:TNPL-EQ": {
        "stock_name": "NSE:TNPL-EQ",
        "full_stock_name": "TAMILNADU NEWSPRT & PAPER"
    },
    "NSE:TNTELE-EQ": {
        "stock_name": "NSE:TNTELE-EQ",
        "full_stock_name": "TAMILNADU TELECOMMUNICATI"
    },
    "NSE:TOKYOPLAST-EQ": {
        "stock_name": "NSE:TOKYOPLAST-EQ",
        "full_stock_name": "TOKYO PLAST INTL LTD"
    },
    "NSE:TOLINS-EQ": {
        "stock_name": "NSE:TOLINS-EQ",
        "full_stock_name": "TOLINS TYRES LIMITED"
    },
    "NSE:TOP100CASE-EQ": {
        "stock_name": "NSE:TOP100CASE-EQ",
        "full_stock_name": "ZERODHAAMC - TOP100CASE"
    },
    "NSE:TOP10ADD-EQ": {
        "stock_name": "NSE:TOP10ADD-EQ",
        "full_stock_name": "DSPAMC - TOP10ADD"
    },
    "NSE:TOP20-EQ": {
        "stock_name": "NSE:TOP20-EQ",
        "full_stock_name": "MIRAEAMC - TOP20"
    },
    "NSE:TORNTPHARM-EQ": {
        "stock_name": "NSE:TORNTPHARM-EQ",
        "full_stock_name": "TORRENT PHARMACEUTICALS L"
    },
    "NSE:TORNTPOWER-EQ": {
        "stock_name": "NSE:TORNTPOWER-EQ",
        "full_stock_name": "TORRENT POWER LTD"
    },
    "NSE:TOTAL-EQ": {
        "stock_name": "NSE:TOTAL-EQ",
        "full_stock_name": "TOTAL TRANSPORT SYS LTD"
    },
    "NSE:TOUCHWOOD-EQ": {
        "stock_name": "NSE:TOUCHWOOD-EQ",
        "full_stock_name": "TOUCHWOOD ENTERTAIN LTD."
    },
    "NSE:TPHQ-EQ": {
        "stock_name": "NSE:TPHQ-EQ",
        "full_stock_name": "TEAMO PRODUCTIONS HQ LTD"
    },
    "NSE:TPLPLASTEH-EQ": {
        "stock_name": "NSE:TPLPLASTEH-EQ",
        "full_stock_name": "TPL PLASTECH LIMITED"
    },
    "NSE:TRACXN-EQ": {
        "stock_name": "NSE:TRACXN-EQ",
        "full_stock_name": "TRACXN TECHNOLOGIES LTD"
    },
    "NSE:TRANSRAILL-EQ": {
        "stock_name": "NSE:TRANSRAILL-EQ",
        "full_stock_name": "TRANSRAIL LIGHTING LTD"
    },
    "NSE:TRANSWORLD-EQ": {
        "stock_name": "NSE:TRANSWORLD-EQ",
        "full_stock_name": "TRANSWORLD SHIP LINES LTD"
    },
    "NSE:TRAVELFOOD-EQ": {
        "stock_name": "NSE:TRAVELFOOD-EQ",
        "full_stock_name": "TRAVEL FOOD SERVICES LTD"
    },
    "NSE:TREEHOUSE-EQ": {
        "stock_name": "NSE:TREEHOUSE-EQ",
        "full_stock_name": "TREE HOUSE EDU LTD"
    },
    "NSE:TREJHARA-BE": {
        "stock_name": "NSE:TREJHARA-BE",
        "full_stock_name": "TREJHARA SOLUTIONS LTD"
    },
    "NSE:TREL-EQ": {
        "stock_name": "NSE:TREL-EQ",
        "full_stock_name": "TRANSINDIA REAL ESTATE L"
    },
    "NSE:TRENT-EQ": {
        "stock_name": "NSE:TRENT-EQ",
        "full_stock_name": "TRENT LTD"
    },
    "NSE:TRF-EQ": {
        "stock_name": "NSE:TRF-EQ",
        "full_stock_name": "TRF LIMITED"
    },
    "NSE:TRIDENT-EQ": {
        "stock_name": "NSE:TRIDENT-EQ",
        "full_stock_name": "TRIDENT LIMITED"
    },
    "NSE:TRIGYN-EQ": {
        "stock_name": "NSE:TRIGYN-EQ",
        "full_stock_name": "TRIGYN TECHNOLOGIES LTD"
    },
    "NSE:TRITURBINE-EQ": {
        "stock_name": "NSE:TRITURBINE-EQ",
        "full_stock_name": "TRIVENI TURBINE LIMITED"
    },
    "NSE:TRIVENI-EQ": {
        "stock_name": "NSE:TRIVENI-EQ",
        "full_stock_name": "TRIVENI ENGG. & INDS. LTD"
    },
    "NSE:TRU-EQ": {
        "stock_name": "NSE:TRU-EQ",
        "full_stock_name": "TRUCAP FINANCE LIMITED"
    },
    "NSE:TRUALT-EQ": {
        "stock_name": "NSE:TRUALT-EQ",
        "full_stock_name": "TRUALT BIOENERGY LIMITED"
    },
    "NSE:TSFINV-EQ": {
        "stock_name": "NSE:TSFINV-EQ",
        "full_stock_name": "TSF INVESTMENTS LIMITED"
    },
    "NSE:TTKHLTCARE-EQ": {
        "stock_name": "NSE:TTKHLTCARE-EQ",
        "full_stock_name": "TTK HEALTHCARE LIMITED"
    },
    "NSE:TTKPRESTIG-EQ": {
        "stock_name": "NSE:TTKPRESTIG-EQ",
        "full_stock_name": "TTK PRESTIGE LTD"
    },
    "NSE:TTL-EQ": {
        "stock_name": "NSE:TTL-EQ",
        "full_stock_name": "T T LIMITED"
    },
    "NSE:TTML-EQ": {
        "stock_name": "NSE:TTML-EQ",
        "full_stock_name": "TATA TELESERV(MAHARASTRA)"
    },
    "NSE:TVSELECT-BE": {
        "stock_name": "NSE:TVSELECT-BE",
        "full_stock_name": "TVS ELECTRONICS LTD"
    },
    "NSE:TVSHLTD-EQ": {
        "stock_name": "NSE:TVSHLTD-EQ",
        "full_stock_name": "TVS HOLDINGS LIMITED"
    },
    "NSE:TVSMOTOR-EQ": {
        "stock_name": "NSE:TVSMOTOR-EQ",
        "full_stock_name": "TVS MOTOR COMPANY  LTD"
    },
    "NSE:TVSSCS-EQ": {
        "stock_name": "NSE:TVSSCS-EQ",
        "full_stock_name": "TVS SUPPLY CHAIN SOL L"
    },
    "NSE:TVSSRICHAK-EQ": {
        "stock_name": "NSE:TVSSRICHAK-EQ",
        "full_stock_name": "TVS SRICHAKRA LIMITED"
    },
    "NSE:TVTODAY-EQ": {
        "stock_name": "NSE:TVTODAY-EQ",
        "full_stock_name": "TV TODAY NETWORK LTD"
    },
    "NSE:TVVISION-BE": {
        "stock_name": "NSE:TVVISION-BE",
        "full_stock_name": "TV VISION LIMITED"
    },
    "NSE:UBL-EQ": {
        "stock_name": "NSE:UBL-EQ",
        "full_stock_name": "UNITED BREWERIES LTD"
    },
    "NSE:UCAL-EQ": {
        "stock_name": "NSE:UCAL-EQ",
        "full_stock_name": "UCAL LIMITED"
    },
    "NSE:UCOBANK-EQ": {
        "stock_name": "NSE:UCOBANK-EQ",
        "full_stock_name": "UCO BANK"
    },
    "NSE:UDS-EQ": {
        "stock_name": "NSE:UDS-EQ",
        "full_stock_name": "UPDATER SERVICES LIMITED"
    },
    "NSE:UFBL-EQ": {
        "stock_name": "NSE:UFBL-EQ",
        "full_stock_name": "UNITED FOODBRANDS LIMITED"
    },
    "NSE:UFLEX-EQ": {
        "stock_name": "NSE:UFLEX-EQ",
        "full_stock_name": "UFLEX LIMITED"
    },
    "NSE:UFO-EQ": {
        "stock_name": "NSE:UFO-EQ",
        "full_stock_name": "UFO MOVIEZ INDIA LTD."
    },
    "NSE:UGARSUGAR-EQ": {
        "stock_name": "NSE:UGARSUGAR-EQ",
        "full_stock_name": "THE UGAR SUGAR WORKS LTD"
    },
    "NSE:UGROCAP-EQ": {
        "stock_name": "NSE:UGROCAP-EQ",
        "full_stock_name": "UGRO CAPITAL LIMITED"
    },
    "NSE:UJJIVANSFB-EQ": {
        "stock_name": "NSE:UJJIVANSFB-EQ",
        "full_stock_name": "UJJIVAN SMALL FINANC BANK"
    },
    "NSE:ULTRACEMCO-EQ": {
        "stock_name": "NSE:ULTRACEMCO-EQ",
        "full_stock_name": "ULTRATECH CEMENT LIMITED"
    },
    "NSE:UMAEXPORTS-EQ": {
        "stock_name": "NSE:UMAEXPORTS-EQ",
        "full_stock_name": "UMA EXPORTS LIMITED"
    },
    "NSE:UMESLTD-EQ": {
        "stock_name": "NSE:UMESLTD-EQ",
        "full_stock_name": "USHA MARTIN EDU & SOL LTD"
    },
    "NSE:UNICHEMLAB-EQ": {
        "stock_name": "NSE:UNICHEMLAB-EQ",
        "full_stock_name": "UNICHEM LABORATORIES LTD"
    },
    "NSE:UNIDT-EQ": {
        "stock_name": "NSE:UNIDT-EQ",
        "full_stock_name": "UNITED DRILLING TOOLS LTD"
    },
    "NSE:UNIECOM-EQ": {
        "stock_name": "NSE:UNIECOM-EQ",
        "full_stock_name": "UNICOMMERCE ESOLUTIONS L"
    },
    "NSE:UNIENTER-EQ": {
        "stock_name": "NSE:UNIENTER-EQ",
        "full_stock_name": "UNIPHOS ENTERPRISES LTD"
    },
    "NSE:UNIINFO-EQ": {
        "stock_name": "NSE:UNIINFO-EQ",
        "full_stock_name": "UNIINFO TELECOM SERVI LTD"
    },
    "NSE:UNIMECH-EQ": {
        "stock_name": "NSE:UNIMECH-EQ",
        "full_stock_name": "UNIMECH AEROSPACE N MFG L"
    },
    "NSE:UNIONBANK-EQ": {
        "stock_name": "NSE:UNIONBANK-EQ",
        "full_stock_name": "UNION BANK OF INDIA"
    },
    "NSE:UNIONGOLD-EQ": {
        "stock_name": "NSE:UNIONGOLD-EQ",
        "full_stock_name": "UNIONAMC - UNIONGOLD"
    },
    "NSE:UNIPARTS-EQ": {
        "stock_name": "NSE:UNIPARTS-EQ",
        "full_stock_name": "UNIPARTS INDIA LIMITED"
    },
    "NSE:UNITDSPR-EQ": {
        "stock_name": "NSE:UNITDSPR-EQ",
        "full_stock_name": "UNITED SPIRITS LIMITED"
    },
    "NSE:UNITECH-EQ": {
        "stock_name": "NSE:UNITECH-EQ",
        "full_stock_name": "UNITECH LTD"
    },
    "NSE:UNITEDPOLY-BE": {
        "stock_name": "NSE:UNITEDPOLY-BE",
        "full_stock_name": "UNITED POLYFAB GUJ. LTD."
    },
    "NSE:UNITEDTEA-EQ": {
        "stock_name": "NSE:UNITEDTEA-EQ",
        "full_stock_name": "UNITED NILGIRI TEA LTD"
    },
    "NSE:UNIVASTU-EQ": {
        "stock_name": "NSE:UNIVASTU-EQ",
        "full_stock_name": "UNIVASTU INDIA LIMITED"
    },
    "NSE:UNIVCABLES-EQ": {
        "stock_name": "NSE:UNIVCABLES-EQ",
        "full_stock_name": "UNIVERSAL CABLES LTD"
    },
    "NSE:UNIVPHOTO-EQ": {
        "stock_name": "NSE:UNIVPHOTO-EQ",
        "full_stock_name": "UNIVERSUS IMAGINGS LTD"
    },
    "NSE:UNOMINDA-EQ": {
        "stock_name": "NSE:UNOMINDA-EQ",
        "full_stock_name": "UNO MINDA LIMITED"
    },
    "NSE:UPL-EQ": {
        "stock_name": "NSE:UPL-EQ",
        "full_stock_name": "UPL LIMITED"
    },
    "NSE:URAVIDEF-EQ": {
        "stock_name": "NSE:URAVIDEF-EQ",
        "full_stock_name": "URAVI DEFENCE &TECH LTD"
    },
    "NSE:URBANCO-EQ": {
        "stock_name": "NSE:URBANCO-EQ",
        "full_stock_name": "URBAN COMPANY LIMITED"
    },
    "NSE:URJA-EQ": {
        "stock_name": "NSE:URJA-EQ",
        "full_stock_name": "URJA GLOBAL LIMITED"
    },
    "NSE:USHAMART-EQ": {
        "stock_name": "NSE:USHAMART-EQ",
        "full_stock_name": "USHA MARTIN LTD."
    },
    "NSE:USK-EQ": {
        "stock_name": "NSE:USK-EQ",
        "full_stock_name": "UDAYSHIVAKUMAR INFRA LTD"
    },
    "NSE:UTIAMC-EQ": {
        "stock_name": "NSE:UTIAMC-EQ",
        "full_stock_name": "UTI ASSET MNGMT CO LTD"
    },
    "NSE:UTKARSHBNK-EQ": {
        "stock_name": "NSE:UTKARSHBNK-EQ",
        "full_stock_name": "UTKARSH SMALL FIN BANK L"
    },
    "NSE:UTLSOLAR-EQ": {
        "stock_name": "NSE:UTLSOLAR-EQ",
        "full_stock_name": "FUJIYAMA POWER SYSTEMS L"
    },
    "NSE:UTTAMSUGAR-EQ": {
        "stock_name": "NSE:UTTAMSUGAR-EQ",
        "full_stock_name": "UTTAM SUGAR MILLS LTD."
    },
    "NSE:UYFINCORP-BE": {
        "stock_name": "NSE:UYFINCORP-BE",
        "full_stock_name": "U. Y. FINCORP LIMITED"
    },
    "NSE:V2RETAIL-EQ": {
        "stock_name": "NSE:V2RETAIL-EQ",
        "full_stock_name": "V2 RETAIL LIMITED"
    },
    "NSE:VADILALIND-EQ": {
        "stock_name": "NSE:VADILALIND-EQ",
        "full_stock_name": "VADILAL INDUSTRIES LTD"
    },
    "NSE:VAIBHAVGBL-EQ": {
        "stock_name": "NSE:VAIBHAVGBL-EQ",
        "full_stock_name": "VAIBHAV GLOBAL LIMITED"
    },
    "NSE:VAISHALI-EQ": {
        "stock_name": "NSE:VAISHALI-EQ",
        "full_stock_name": "VAISHALI PHARMA LIMITED"
    },
    "NSE:VAKRANGEE-EQ": {
        "stock_name": "NSE:VAKRANGEE-EQ",
        "full_stock_name": "VAKRANGEE LIMITED"
    },
    "NSE:VALIANTLAB-EQ": {
        "stock_name": "NSE:VALIANTLAB-EQ",
        "full_stock_name": "VALIANT LABORATORIES LTD"
    },
    "NSE:VALIANTORG-EQ": {
        "stock_name": "NSE:VALIANTORG-EQ",
        "full_stock_name": "VALIANT ORGANICS LIMITED"
    },
    "NSE:VARDHACRLC-EQ": {
        "stock_name": "NSE:VARDHACRLC-EQ",
        "full_stock_name": "VARDHAMAN ACRYLICS LTD"
    },
    "NSE:VARDMNPOLY-EQ": {
        "stock_name": "NSE:VARDMNPOLY-EQ",
        "full_stock_name": "VARDHMAN POLYTEX LTD."
    },
    "NSE:VARROC-EQ": {
        "stock_name": "NSE:VARROC-EQ",
        "full_stock_name": "VARROC ENGINEERING LTD."
    },
    "NSE:VASCONEQ-EQ": {
        "stock_name": "NSE:VASCONEQ-EQ",
        "full_stock_name": "VASCON ENGINEERS LTD"
    },
    "NSE:VASWANI-EQ": {
        "stock_name": "NSE:VASWANI-EQ",
        "full_stock_name": "VASWANI IND LTD"
    },
    "NSE:VBL-EQ": {
        "stock_name": "NSE:VBL-EQ",
        "full_stock_name": "VARUN BEVERAGES LIMITED"
    },
    "NSE:VCL-BE": {
        "stock_name": "NSE:VCL-BE",
        "full_stock_name": "VAXTEX COTFAB LIMITED"
    },
    "NSE:VEDL-EQ": {
        "stock_name": "NSE:VEDL-EQ",
        "full_stock_name": "VEDANTA LIMITED"
    },
    "NSE:VEEDOL-EQ": {
        "stock_name": "NSE:VEEDOL-EQ",
        "full_stock_name": "VEEDOL CORPORATION LTD"
    },
    "NSE:VENKEYS-EQ": {
        "stock_name": "NSE:VENKEYS-EQ",
        "full_stock_name": "VENKY S (INDIA) LIMITED"
    },
    "NSE:VENTIVE-EQ": {
        "stock_name": "NSE:VENTIVE-EQ",
        "full_stock_name": "VENTIVE HOSPITALITY LTD"
    },
    "NSE:VENUSPIPES-EQ": {
        "stock_name": "NSE:VENUSPIPES-EQ",
        "full_stock_name": "VENUS PIPES & TUBES LTD"
    },
    "NSE:VENUSREM-BE": {
        "stock_name": "NSE:VENUSREM-BE",
        "full_stock_name": "VENUS REMEDIES LIMITED"
    },
    "NSE:VERANDA-EQ": {
        "stock_name": "NSE:VERANDA-EQ",
        "full_stock_name": "VERANDA LEARNING SOL LTD"
    },
    "NSE:VERTOZ-EQ": {
        "stock_name": "NSE:VERTOZ-EQ",
        "full_stock_name": "VERTOZ LIMITED"
    },
    "NSE:VESUVIUS-EQ": {
        "stock_name": "NSE:VESUVIUS-EQ",
        "full_stock_name": "VESUVIUS INDIA LTD"
    },
    "NSE:VETO-EQ": {
        "stock_name": "NSE:VETO-EQ",
        "full_stock_name": "VETO SWITCHGEAR CABLE LTD"
    },
    "NSE:VGL-EQ": {
        "stock_name": "NSE:VGL-EQ",
        "full_stock_name": "VARVEE GLOBAL LIMITED"
    },
    "NSE:VGUARD-EQ": {
        "stock_name": "NSE:VGUARD-EQ",
        "full_stock_name": "V-GUARD IND LTD."
    },
    "NSE:VHL-EQ": {
        "stock_name": "NSE:VHL-EQ",
        "full_stock_name": "VARDHMAN HOLDINGS LIMITED"
    },
    "NSE:VHLTD-BE": {
        "stock_name": "NSE:VHLTD-BE",
        "full_stock_name": "VICEROY HOTELS LIMITED"
    },
    "NSE:VIDHIING-EQ": {
        "stock_name": "NSE:VIDHIING-EQ",
        "full_stock_name": "VIDHI SPCLTY F INGRDNTS L"
    },
    "NSE:VIDYAWIRES-EQ": {
        "stock_name": "NSE:VIDYAWIRES-EQ",
        "full_stock_name": "VIDYA WIRES LIMITED"
    },
    "NSE:VIJAYA-EQ": {
        "stock_name": "NSE:VIJAYA-EQ",
        "full_stock_name": "VIJAYA DIAGNOSTIC CEN LTD"
    },
    "NSE:VIJIFIN-EQ": {
        "stock_name": "NSE:VIJIFIN-EQ",
        "full_stock_name": "VIJI FINANCE LIMITED"
    },
    "NSE:VIKASECO-EQ": {
        "stock_name": "NSE:VIKASECO-EQ",
        "full_stock_name": "VIKAS ECOTECH LIMITED"
    },
    "NSE:VIKASLIFE-EQ": {
        "stock_name": "NSE:VIKASLIFE-EQ",
        "full_stock_name": "VIKAS LIFECARE LIMITED"
    },
    "NSE:VIKRAMSOLR-EQ": {
        "stock_name": "NSE:VIKRAMSOLR-EQ",
        "full_stock_name": "VIKRAM SOLAR LIMITED"
    },
    "NSE:VIKRAN-EQ": {
        "stock_name": "NSE:VIKRAN-EQ",
        "full_stock_name": "VIKRAN ENGINEERING LTD"
    },
    "NSE:VIMTALABS-EQ": {
        "stock_name": "NSE:VIMTALABS-EQ",
        "full_stock_name": "VIMTA LABS LIMITED"
    },
    "NSE:VINATIORGA-EQ": {
        "stock_name": "NSE:VINATIORGA-EQ",
        "full_stock_name": "VINATI ORGANICS LTD"
    },
    "NSE:VINCOFE-EQ": {
        "stock_name": "NSE:VINCOFE-EQ",
        "full_stock_name": "VINTAGE COFFEE N BVRGS L"
    },
    "NSE:VINDHYATEL-EQ": {
        "stock_name": "NSE:VINDHYATEL-EQ",
        "full_stock_name": "VINDHYA TELELINKS LTD"
    },
    "NSE:VINEETLAB-EQ": {
        "stock_name": "NSE:VINEETLAB-EQ",
        "full_stock_name": "VINEET LABORATORIES LTD"
    },
    "NSE:VINNY-EQ": {
        "stock_name": "NSE:VINNY-EQ",
        "full_stock_name": "VINNY OVERSEAS LIMITED"
    },
    "NSE:VINYLINDIA-EQ": {
        "stock_name": "NSE:VINYLINDIA-EQ",
        "full_stock_name": "VINYL CHEMICALS (I) LTD."
    },
    "NSE:VIPCLOTHNG-EQ": {
        "stock_name": "NSE:VIPCLOTHNG-EQ",
        "full_stock_name": "VIP CLOTHING LIMITED"
    },
    "NSE:VIPIND-EQ": {
        "stock_name": "NSE:VIPIND-EQ",
        "full_stock_name": "VIP INDUSTRIES LTD"
    },
    "NSE:VIPULLTD-BE": {
        "stock_name": "NSE:VIPULLTD-BE",
        "full_stock_name": "VIPUL LIMITED"
    },
    "NSE:VIRINCHI-EQ": {
        "stock_name": "NSE:VIRINCHI-EQ",
        "full_stock_name": "VIRINCHI LIMITED"
    },
    "NSE:VISAKAIND-EQ": {
        "stock_name": "NSE:VISAKAIND-EQ",
        "full_stock_name": "VISAKA INDUSTRIES LIMITED"
    },
    "NSE:VISASTEEL-EQ": {
        "stock_name": "NSE:VISASTEEL-EQ",
        "full_stock_name": "VISA STEEL LIMITED"
    },
    "NSE:VISHNU-EQ": {
        "stock_name": "NSE:VISHNU-EQ",
        "full_stock_name": "VISHNU CHEMICALS LIMITED"
    },
    "NSE:VISHWARAJ-EQ": {
        "stock_name": "NSE:VISHWARAJ-EQ",
        "full_stock_name": "VISHWARAJ SUGAR IND LTD"
    },
    "NSE:VIVIDHA-EQ": {
        "stock_name": "NSE:VIVIDHA-EQ",
        "full_stock_name": "VISAGAR POLYTEX LTD"
    },
    "NSE:VIVIMEDLAB-EQ": {
        "stock_name": "NSE:VIVIMEDLAB-EQ",
        "full_stock_name": "VIVIMED LABS LIMITED"
    },
    "NSE:VIYASH-EQ": {
        "stock_name": "NSE:VIYASH-EQ",
        "full_stock_name": "VIYASH SCIENTIFIC LIMITED"
    },
    "NSE:VLEGOV-EQ": {
        "stock_name": "NSE:VLEGOV-EQ",
        "full_stock_name": "VL E GOV AND IT SOL LTD"
    },
    "NSE:VLSFINANCE-EQ": {
        "stock_name": "NSE:VLSFINANCE-EQ",
        "full_stock_name": "VLS FINANCE LTD"
    },
    "NSE:VMART-EQ": {
        "stock_name": "NSE:VMART-EQ",
        "full_stock_name": "VMART RETAIL LTD"
    },
    "NSE:VMM-EQ": {
        "stock_name": "NSE:VMM-EQ",
        "full_stock_name": "VISHAL MEGA MART LIMITED"
    },
    "NSE:VMSTMT-EQ": {
        "stock_name": "NSE:VMSTMT-EQ",
        "full_stock_name": "VMS TMT LIMITED"
    },
    "NSE:VOLTAMP-EQ": {
        "stock_name": "NSE:VOLTAMP-EQ",
        "full_stock_name": "VOLTAMP TRANSFORMERS LTD"
    },
    "NSE:VOLTAS-EQ": {
        "stock_name": "NSE:VOLTAS-EQ",
        "full_stock_name": "VOLTAS LTD"
    },
    "NSE:VPRPL-EQ": {
        "stock_name": "NSE:VPRPL-EQ",
        "full_stock_name": "VISHNU PRAKASH R PUNGLI L"
    },
    "NSE:VRAJ-EQ": {
        "stock_name": "NSE:VRAJ-EQ",
        "full_stock_name": "VRAJ IRON AND STEEL LTD"
    },
    "NSE:VRLLOG-EQ": {
        "stock_name": "NSE:VRLLOG-EQ",
        "full_stock_name": "VRL LOGISTICS LIMITED"
    },
    "NSE:VSSL-EQ": {
        "stock_name": "NSE:VSSL-EQ",
        "full_stock_name": "VARDHMAN SPC STEEL LTD"
    },
    "NSE:VSTIND-EQ": {
        "stock_name": "NSE:VSTIND-EQ",
        "full_stock_name": "VST INDUSTRIES LTD"
    },
    "NSE:VSTL-EQ": {
        "stock_name": "NSE:VSTL-EQ",
        "full_stock_name": "VIBHOR STEEL TUBES LTD"
    },
    "NSE:VSTTILLERS-EQ": {
        "stock_name": "NSE:VSTTILLERS-EQ",
        "full_stock_name": "VST TILLERS TRACTORS LTD"
    },
    "NSE:VTL-EQ": {
        "stock_name": "NSE:VTL-EQ",
        "full_stock_name": "VARDHMAN TEXTILES LIMITED"
    },
    "NSE:WAAREEENER-EQ": {
        "stock_name": "NSE:WAAREEENER-EQ",
        "full_stock_name": "WAAREE ENERGIES LIMITED"
    },
    "NSE:WAAREEINDO-BE": {
        "stock_name": "NSE:WAAREEINDO-BE",
        "full_stock_name": "INDOSOLAR LIMITED"
    },
    "NSE:WAAREERTL-EQ": {
        "stock_name": "NSE:WAAREERTL-EQ",
        "full_stock_name": "WAAREE RENEWABLE TECH LTD"
    },
    "NSE:WABAG-EQ": {
        "stock_name": "NSE:WABAG-EQ",
        "full_stock_name": "VA TECH WABAG LTD"
    },
    "NSE:WAKEFIT-EQ": {
        "stock_name": "NSE:WAKEFIT-EQ",
        "full_stock_name": "WAKEFIT INNOVATIONS LTD"
    },
    "NSE:WALCHANNAG-EQ": {
        "stock_name": "NSE:WALCHANNAG-EQ",
        "full_stock_name": "WALCHANDNAGAR INDUSTRIES"
    },
    "NSE:WANBURY-EQ": {
        "stock_name": "NSE:WANBURY-EQ",
        "full_stock_name": "WANBURY LIMITED"
    },
    "NSE:WCIL-EQ": {
        "stock_name": "NSE:WCIL-EQ",
        "full_stock_name": "WESTERN CARRIERS (IND) L"
    },
    "NSE:WEALTH-EQ": {
        "stock_name": "NSE:WEALTH-EQ",
        "full_stock_name": "WEALTH FRST PORT. MG. LTD"
    },
    "NSE:WEBELSOLAR-EQ": {
        "stock_name": "NSE:WEBELSOLAR-EQ",
        "full_stock_name": "WEBSOL ENERGY SYSTEM LTD"
    },
    "NSE:WEIZMANIND-EQ": {
        "stock_name": "NSE:WEIZMANIND-EQ",
        "full_stock_name": "WEIZMANN LTD"
    },
    "NSE:WEL-EQ": {
        "stock_name": "NSE:WEL-EQ",
        "full_stock_name": "WONDER ELECTRICALS LTD"
    },
    "NSE:WELCORP-EQ": {
        "stock_name": "NSE:WELCORP-EQ",
        "full_stock_name": "WELSPUN CORP LIMITED"
    },
    "NSE:WELENT-EQ": {
        "stock_name": "NSE:WELENT-EQ",
        "full_stock_name": "WELSPUN ENTERPRISES LTD."
    },
    "NSE:WELINV-EQ": {
        "stock_name": "NSE:WELINV-EQ",
        "full_stock_name": "WELSPUN INV & COMM LTD"
    },
    "NSE:WELSPUNLIV-EQ": {
        "stock_name": "NSE:WELSPUNLIV-EQ",
        "full_stock_name": "WELSPUN LIVING LIMITED"
    },
    "NSE:WENDT-EQ": {
        "stock_name": "NSE:WENDT-EQ",
        "full_stock_name": "WENDT (INDIA) LIMITED"
    },
    "NSE:WESTLIFE-EQ": {
        "stock_name": "NSE:WESTLIFE-EQ",
        "full_stock_name": "WESTLIFE FOODWORLD LTD"
    },
    "NSE:WEWIN-EQ": {
        "stock_name": "NSE:WEWIN-EQ",
        "full_stock_name": "WE WIN LIMITED"
    },
    "NSE:WEWORK-EQ": {
        "stock_name": "NSE:WEWORK-EQ",
        "full_stock_name": "WEWORK INDIA MANAGEMENT L"
    },
    "NSE:WHEELS-EQ": {
        "stock_name": "NSE:WHEELS-EQ",
        "full_stock_name": "WHEELS INDIA LTD"
    },
    "NSE:WHIRLPOOL-EQ": {
        "stock_name": "NSE:WHIRLPOOL-EQ",
        "full_stock_name": "WHIRLPOOL OF INDIA LTD"
    },
    "NSE:WILLAMAGOR-EQ": {
        "stock_name": "NSE:WILLAMAGOR-EQ",
        "full_stock_name": "WILLIAMSON MAGOR"
    },
    "NSE:WINDLAS-EQ": {
        "stock_name": "NSE:WINDLAS-EQ",
        "full_stock_name": "WINDLAS BIOTECH LIMITED"
    },
    "NSE:WINDMACHIN-EQ": {
        "stock_name": "NSE:WINDMACHIN-EQ",
        "full_stock_name": "WINDSOR MACHINES LIMITED"
    },
    "NSE:WINSOME-BZ": {
        "stock_name": "NSE:WINSOME-BZ",
        "full_stock_name": "WINSOME YARNS LIMITED"
    },
    "NSE:WIPL-EQ": {
        "stock_name": "NSE:WIPL-EQ",
        "full_stock_name": "THE WESTERN INDIA PLY LTD"
    },
    "NSE:WIPRO-EQ": {
        "stock_name": "NSE:WIPRO-EQ",
        "full_stock_name": "WIPRO LTD"
    },
    "NSE:WOCKPHARMA-EQ": {
        "stock_name": "NSE:WOCKPHARMA-EQ",
        "full_stock_name": "WOCKHARDT LIMITED"
    },
    "NSE:WONDERLA-EQ": {
        "stock_name": "NSE:WONDERLA-EQ",
        "full_stock_name": "WONDERLA HOLIDAYS LTD."
    },
    "NSE:WORTHPERI-EQ": {
        "stock_name": "NSE:WORTHPERI-EQ",
        "full_stock_name": "WORTH PERIPHERALS LIMITED"
    },
    "NSE:WSI-EQ": {
        "stock_name": "NSE:WSI-EQ",
        "full_stock_name": "W.S.INDUSTRIES (I) LTD."
    },
    "NSE:WSTCSTPAPR-EQ": {
        "stock_name": "NSE:WSTCSTPAPR-EQ",
        "full_stock_name": "WEST COAST PAPER MILLS LT"
    },
    "NSE:XCHANGING-EQ": {
        "stock_name": "NSE:XCHANGING-EQ",
        "full_stock_name": "XCHANGING SOLUTIONS LTD"
    },
    "NSE:XELPMOC-EQ": {
        "stock_name": "NSE:XELPMOC-EQ",
        "full_stock_name": "XELPMOC DESIGN & TECH LTD"
    },
    "NSE:XPROINDIA-EQ": {
        "stock_name": "NSE:XPROINDIA-EQ",
        "full_stock_name": "XPRO INDIA LIMITED"
    },
    "NSE:XTGLOBAL-EQ": {
        "stock_name": "NSE:XTGLOBAL-EQ",
        "full_stock_name": "XTGLOBAL INFOTECH LIMITED"
    },
    "NSE:YASHO-EQ": {
        "stock_name": "NSE:YASHO-EQ",
        "full_stock_name": "YASHO INDUSTRIES LIMITED"
    },
    "NSE:YATHARTH-EQ": {
        "stock_name": "NSE:YATHARTH-EQ",
        "full_stock_name": "YATHARTH HOSP & TRA C S L"
    },
    "NSE:YATRA-EQ": {
        "stock_name": "NSE:YATRA-EQ",
        "full_stock_name": "YATRA ONLINE LIMITED"
    },
    "NSE:YESBANK-EQ": {
        "stock_name": "NSE:YESBANK-EQ",
        "full_stock_name": "YES BANK LIMITED"
    },
    "NSE:YUKEN-EQ": {
        "stock_name": "NSE:YUKEN-EQ",
        "full_stock_name": "YUKEN INDIA LIMITED"
    },
    "NSE:ZAGGLE-EQ": {
        "stock_name": "NSE:ZAGGLE-EQ",
        "full_stock_name": "ZAGGLE PREPA OCEAN SER L"
    },
    "NSE:ZEEL-EQ": {
        "stock_name": "NSE:ZEEL-EQ",
        "full_stock_name": "ZEE ENTERTAINMENT ENT LTD"
    },
    "NSE:ZEELEARN-EQ": {
        "stock_name": "NSE:ZEELEARN-EQ",
        "full_stock_name": "ZEE LEARN LIMITED"
    },
    "NSE:ZEEMEDIA-EQ": {
        "stock_name": "NSE:ZEEMEDIA-EQ",
        "full_stock_name": "ZEE MEDIA CORPORATION LTD"
    },
    "NSE:ZENITHEXPO-EQ": {
        "stock_name": "NSE:ZENITHEXPO-EQ",
        "full_stock_name": "ZENITH EXPORTS LTD"
    },
    "NSE:ZENITHSTL-EQ": {
        "stock_name": "NSE:ZENITHSTL-EQ",
        "full_stock_name": "ZENITH STEEL PIP IND LTD"
    },
    "NSE:ZENSARTECH-EQ": {
        "stock_name": "NSE:ZENSARTECH-EQ",
        "full_stock_name": "ZENSAR TECHNOLOGIES  LTD"
    },
    "NSE:ZENTEC-EQ": {
        "stock_name": "NSE:ZENTEC-EQ",
        "full_stock_name": "ZEN TECHNOLOGIES LIMITED"
    },
    "NSE:ZFCVINDIA-EQ": {
        "stock_name": "NSE:ZFCVINDIA-EQ",
        "full_stock_name": "ZF COM VE CTR SYS IND LTD"
    },
    "NSE:ZIMLAB-EQ": {
        "stock_name": "NSE:ZIMLAB-EQ",
        "full_stock_name": "ZIM LABORATORIES LIMITED"
    },
    "NSE:ZODIAC-EQ": {
        "stock_name": "NSE:ZODIAC-EQ",
        "full_stock_name": "ZODIAC ENERGY LIMITED"
    },
    "NSE:ZODIACLOTH-EQ": {
        "stock_name": "NSE:ZODIACLOTH-EQ",
        "full_stock_name": "ZODIAC CLOTHING CO. LTD."
    },
    "NSE:ZOTA-EQ": {
        "stock_name": "NSE:ZOTA-EQ",
        "full_stock_name": "ZOTA HEALTH CARE LIMITED"
    },
    "NSE:ZUARI-EQ": {
        "stock_name": "NSE:ZUARI-EQ",
        "full_stock_name": "ZUARI AGRO CHEMICALS LTD"
    },
    "NSE:ZUARIIND-EQ": {
        "stock_name": "NSE:ZUARIIND-EQ",
        "full_stock_name": "ZUARI INDUSTRIES LIMITED"
    },
    "NSE:ZYDUSLIFE-EQ": {
        "stock_name": "NSE:ZYDUSLIFE-EQ",
        "full_stock_name": "ZYDUS LIFESCIENCES LTD"
    },
    "NSE:ZYDUSWELL-EQ": {
        "stock_name": "NSE:ZYDUSWELL-EQ",
        "full_stock_name": "ZYDUS WELLNESS LIMITED"
    }
}

// Helper function to clean stock symbols
export function getCleanStockSymbol(stockName: string): string {
    return stockName
        .replace('NSE:', '')
        .replace('-EQ', '')
        .replace('&', 'and')
        .toLowerCase();
}

// Helper to get all stock symbols
export function getAllStockSymbols(): string[] {
    return Object.keys(totalstocks).map(getCleanStockSymbol);
}

// Helper to get full stock data by clean symbol
export function getStockBySymbol(cleanSymbol: string): StockData | undefined {
    const originalKey = Object.keys(totalstocks).find(
        key => getCleanStockSymbol(key) === cleanSymbol.toLowerCase()
    );
    return originalKey ? totalstocks[originalKey] : undefined;
}

// Type guard with correct type predicate
export function isValidStockKey(key: unknown): key is string {
    return typeof key === 'string' && key in totalstocks;
}

// Stocks in Nifty50
const nifty50StocksJson = {
    "NSE:ADANIENT-EQ": 100,
    "NSE:ADANIPORTS-EQ": 100,
    "NSE:APOLLOHOSP-EQ": 100,
    "NSE:ASIANPAINT-EQ": 100,
    "NSE:AXISBANK-EQ": 100,
    "NSE:BAJAJ-AUTO-EQ": 100,
    "NSE:BAJFINANCE-EQ": 100,
    "NSE:BAJAJFINSV-EQ": 100,
    "NSE:BPCL-EQ": 100,
    "NSE:BHARTIARTL-EQ": 100,
    "NSE:BRITANNIA-EQ": 100,
    "NSE:CIPLA-EQ": 100,
    "NSE:COALINDIA-EQ": 100,
    "NSE:DIVISLAB-EQ": 100,
    "NSE:DRREDDY-EQ": 100,
    "NSE:EICHERMOT-EQ": 100,
    "NSE:GRASIM-EQ": 100,
    "NSE:HCLTECH-EQ": 100,
    "NSE:HDFCBANK-EQ": 100,
    "NSE:HDFCLIFE-EQ": 100,
    "NSE:HEROMOTOCO-EQ": 100,
    "NSE:HINDALCO-EQ": 100,
    "NSE:HINDUNILVR-EQ": 100,
    "NSE:ICICIBANK-EQ": 100,
    "NSE:ITC-EQ": 100,
    "NSE:INDUSINDBK-EQ": 100,
    "NSE:INFY-EQ": 100,
    "NSE:JSWSTEEL-EQ": 100,
    "NSE:KOTAKBANK-EQ": 100,
    "NSE:LTIM-EQ": 100,
    "NSE:LT-EQ": 100,
    "NSE:M&M-EQ": 100,
    "NSE:MARUTI-EQ": 100,
    "NSE:NTPC-EQ": 100,
    "NSE:NESTLEIND-EQ": 100,
    "NSE:ONGC-EQ": 100,
    "NSE:POWERGRID-EQ": 100,
    "NSE:RELIANCE-EQ": 100,
    "NSE:SBILIFE-EQ": 100,
    "NSE:SBIN-EQ": 100,
    "NSE:SUNPHARMA-EQ": 100,
    "NSE:TCS-EQ": 100,
    "NSE:TATACONSUM-EQ": 100,
    "NSE:TATAMOTORS-EQ": 100,
    "NSE:TATASTEEL-EQ": 100,
    "NSE:TECHM-EQ": 100,
    "NSE:TITAN-EQ": 100,
    "NSE:UPL-EQ": 100,
    "NSE:ULTRACEMCO-EQ": 100,
    "NSE:WIPRO-EQ": 100
  };
  
  // Stocks in Nifty200
  const nifty200StocksJson = {
    "NSE:NAUKRI-EQ": 100,
    "NSE:M&M-EQ": 100,
    "NSE:DIXON-EQ": 100,
    "NSE:MAZDOCK-EQ": 100,
    "NSE:CGPOWER-EQ": 100,
    "NSE:RVNL-EQ": 100,
    "NSE:PETRONET-EQ": 100,
    "NSE:DELHIVERY-EQ": 100,
    "NSE:SUPREMEIND-EQ": 100,
    "NSE:GAIL-EQ": 100,
    "NSE:INDUSTOWER-EQ": 100,
    "NSE:APOLLOTYRE-EQ": 100,
    "NSE:JSWINFRA-EQ": 100,
    "NSE:ONGC-EQ": 100,
    "NSE:TATAMTRDVR-EQ": 100,
    "NSE:GRASIM-EQ": 100,
    "NSE:APLAPOLLO-EQ": 100,
    "NSE:OBEROIRLTY-EQ": 100,
    "NSE:VEDL-EQ": 100,
    "NSE:TATAMOTORS-EQ": 100,
    "NSE:VBL-EQ": 100,
    "NSE:MOTHERSON-EQ": 100,
    "NSE:JSWENERGY-EQ": 100,
    "NSE:INDIGO-EQ": 100,
    "NSE:ABCAPITAL-EQ": 100,
    "NSE:JINDALSTEL-EQ": 100,
    "NSE:MANKIND-EQ": 100,
    "NSE:IRFC-EQ": 100,
    "NSE:SAIL-EQ": 100,
    "NSE:BANKINDIA-EQ": 100,
    "NSE:FORTIS-EQ": 100,
    "NSE:ZYDUSLIFE-EQ": 100,
    "NSE:AUROPHARMA-EQ": 100,
    "NSE:CANBK-EQ": 100,
    "NSE:GODREJPROP-EQ": 100,
    "NSE:KALYANKJIL-EQ": 100,
    "NSE:NMDC-EQ": 100,
    "NSE:NYKAA-EQ": 100,
    "NSE:BEL-EQ": 100,
    "NSE:DEEPAKNTR-EQ": 100,
    "NSE:ESCORTS-EQ": 100,
    "NSE:BALKRISIND-EQ": 100,
    "NSE:COALINDIA-EQ": 100,
    "NSE:LUPIN-EQ": 100,
    "NSE:ZEEL-EQ": 100,
    "NSE:UPL-EQ": 100,
    "NSE:ACC-EQ": 100,
    "NSE:TATASTEEL-EQ": 100,
    "NSE:POLYCAB-EQ": 100,
    "NSE:ASHOKLEY-EQ": 100,
    "NSE:PFC-EQ": 100,
    "NSE:BPCL-EQ": 100,
    "NSE:PIIND-EQ": 100,
    "NSE:SIEMENS-EQ": 100,
    "NSE:BANDHANBNK-EQ": 100,
    "NSE:FACT-EQ": 100,
    "NSE:LTTS-EQ": 100,
    "NSE:LICHSGFIN-EQ": 100,
    "NSE:IPCALAB-EQ": 100,
    "NSE:BDL-EQ": 100,
    "NSE:GMRINFRA-EQ": 100,
    "NSE:DLF-EQ": 100,
    "NSE:INDHOTEL-EQ": 100,
    "NSE:SYNGENE-EQ": 100,
    "NSE:TVSMOTOR-EQ": 100,
    "NSE:LALPATHLAB-EQ": 100,
    "NSE:TATACHEM-EQ": 100,
    "NSE:BAJAJ-AUTO-EQ": 100,
    "NSE:NHPC-EQ": 100,
    "NSE:OIL-EQ": 100,
    "NSE:CUMMINSIND-EQ": 100,
    "NSE:ABFRL-EQ": 100,
    "NSE:SUNTV-EQ": 100,
    "NSE:SRF-EQ": 100,
    "NSE:YESBANK-EQ": 100,
    "NSE:MFSL-EQ": 100,
    "NSE:BIOCON-EQ": 100,
    "NSE:IOC-EQ": 100,
    "NSE:TATAPOWER-EQ": 100,
    "NSE:SBIN-EQ": 100,
    "NSE:IDBI-EQ": 100,
    "NSE:TORNTPOWER-EQ": 100,
    "NSE:DMART-EQ": 100,
    "NSE:PERSISTENT-EQ": 100,
    "NSE:IDFCFIRSTB-EQ": 100,
    "NSE:IRCTC-EQ": 100,
    "NSE:PEL-EQ": 100,
    "NSE:JIOFIN-EQ": 100,
    "NSE:LAURUSLABS-EQ": 100,
    "NSE:HAVELLS-EQ": 100,
    "NSE:AUBANK-EQ": 100,
    "NSE:BANKBARODA-EQ": 100,
    "NSE:APOLLOHOSP-EQ": 100,
    "NSE:HINDALCO-EQ": 100,
    "NSE:BOSCHLTD-EQ": 100,
    "NSE:ULTRACEMCO-EQ": 100,
    "NSE:SJVN-EQ": 100,
    "NSE:GUJGASLTD-EQ": 100,
    "NSE:HEROMOTOCO-EQ": 100,
    "NSE:BHARATFORG-EQ": 100,
    "NSE:POONAWALLA-EQ": 100,
    "NSE:DALBHARAT-EQ": 100,
    "NSE:POWERGRID-EQ": 100,
    "NSE:MAHABANK-EQ": 100,
    "NSE:LICI-EQ": 100,
    "NSE:TATAELXSI-EQ": 100,
    "NSE:ASTRAL-EQ": 100,
    "NSE:SBICARD-EQ": 100,
    "NSE:RECLTD-EQ": 100,
    "NSE:ATGL-EQ": 100,
    "NSE:NTPC-EQ": 100,
    "NSE:BHEL-EQ": 100,
    "NSE:ICICIPRULI-EQ": 100,
    "NSE:HINDPETRO-EQ": 100,
    "NSE:SHREECEM-EQ": 100,
    "NSE:KOTAKBANK-EQ": 100,
    "NSE:PAYTM-EQ": 100,
    "NSE:DIVISLAB-EQ": 100,
    "NSE:TECHM-EQ": 100,
    "NSE:ITC-EQ": 100,
    "NSE:IDEA-EQ": 100,
    "NSE:PNB-EQ": 100,
    "NSE:BHARTIARTL-EQ": 100,
    "NSE:TORNTPHARM-EQ": 100,
    "NSE:PAGEIND-EQ": 100,
    "NSE:PRESTIGE-EQ": 100,
    "NSE:EICHERMOT-EQ": 100,
    "NSE:MRF-EQ": 100,
    "NSE:IGL-EQ": 100,
    "NSE:COFORGE-EQ": 100,
    "NSE:PIDILITIND-EQ": 100,
    "NSE:TATACOMM-EQ": 100,
    "NSE:LTIM-EQ": 100,
    "NSE:BSE-EQ": 100,
    "NSE:M&MFIN-EQ": 100,
    "NSE:ICICIGI-EQ": 100,
    "NSE:TATATECH-EQ": 100,
    "NSE:JSWSTEEL-EQ": 100,
    "NSE:LODHA-EQ": 100,
    "NSE:FEDERALBNK-EQ": 100,
    "NSE:MARUTI-EQ": 100,
    "NSE:AMBUJACEM-EQ": 100,
    "NSE:TIINDIA-EQ": 100,
    "NSE:SHRIRAMFIN-EQ": 100,
    "NSE:CHOLAFIN-EQ": 100,
    "NSE:JUBLFOOD-EQ": 100,
    "NSE:BAJAJHLDNG-EQ": 100,
    "NSE:BERGEPAINT-EQ": 100,
    "NSE:ALKEM-EQ": 100,
    "NSE:CIPLA-EQ": 100,
    "NSE:ADANIENT-EQ": 100,
    "NSE:ABB-EQ": 100,
    "NSE:HDFCLIFE-EQ": 100,
    "NSE:GLAND-EQ": 100,
    "NSE:MPHASIS-EQ": 100,
    "NSE:RELIANCE-EQ": 100,
    "NSE:POLICYBZR-EQ": 100,
    "NSE:WIPRO-EQ": 100,
    "NSE:DRREDDY-EQ": 100,
    "NSE:UNIONBANK-EQ": 100,
    "NSE:ZOMATO-EQ": 100,
    "NSE:OFSS-EQ": 100,
    "NSE:LTF-EQ": 100,
    "NSE:TRENT-EQ": 100,
    "NSE:HDFCBANK-EQ": 100,
    "NSE:ADANIENSOL-EQ": 100,
    "NSE:BAJFINANCE-EQ": 100,
    "NSE:TATACONSUM-EQ": 100,
    "NSE:TITAN-EQ": 100,
    "NSE:PATANJALI-EQ": 100,
    "NSE:MCDOWELL-N-EQ": 100,
    "NSE:HCLTECH-EQ": 100,
    "NSE:BRITANNIA-EQ": 100,
    "NSE:COLPAL-EQ": 100,
    "NSE:DABUR-EQ": 100,
    "NSE:TCS-EQ": 100,
    "NSE:LT-EQ": 100,
    "NSE:SUNPHARMA-EQ": 100,
    "NSE:MARICO-EQ": 100,
    "NSE:HDFCAMC-EQ": 100,
    "NSE:ICICIBANK-EQ": 100,
    "NSE:BAJAJFINSV-EQ": 100,
    "NSE:SONACOMS-EQ": 100,
    "NSE:GODREJCP-EQ": 100,
    "NSE:ADANIPORTS-EQ": 100,
    "NSE:ASIANPAINT-EQ": 100,
    "NSE:INFY-EQ": 100,
    "NSE:NESTLEIND-EQ": 100,
    "NSE:INDIANB-EQ": 100,
    "NSE:INDUSINDBK-EQ": 100,
    "NSE:ADANIGREEN-EQ": 100,
    "NSE:HINDUNILVR-EQ": 100,
    "NSE:KPITTECH-EQ": 100,
    "NSE:AXISBANK-EQ": 100,
    "NSE:SUZLON-EQ": 100,
    "NSE:ADANIPOWER-EQ": 100,
    "NSE:SBILIFE-EQ": 100,
    "NSE:MAXHEALTH-EQ": 100,
    "NSE:HAL-EQ": 100,
    "NSE:VOLTAS-EQ": 100,
    "NSE:CONCOR-EQ": 100
  };

  interface Nifty50Stocks {
    [key: string]: number;
  }

  export const convertNifty50Stocks = (nifty50Json: Nifty50Stocks): string[] => {
    return Object.keys(nifty50Json).map(stockKey => {
      // Extract the stock name from the key
      // The format is "NSE:STOCKNAME-EQ", so we split by ':' and '-'
  
      // const parts = stockKey.split(':');
      // if (parts.length > 1) {
      //   const stockParts = parts[1].split('-');
      //   return stockParts[0]; // Return just the stock name
      // }
      return stockKey; // Fallback to the full key if it doesn't match the expected format
    });
  };


  export const NIFTY50_STOCKS = convertNifty50Stocks(nifty50StocksJson);

  export const NIFTY200_STOCKS = convertNifty50Stocks(nifty200StocksJson);




export const fullSectorData: DataSectorModel[] = [
    { sectorname: "Advertising", sectorsvg: "media.svg", sectorpcnt: 0 },
    { sectorname: "Aerospace & Defense", sectorsvg: "aerospace.svg", sectorpcnt: 0 },
    { sectorname: "Agricultural & Farm Machinery", sectorsvg: "general-industrials.svg", sectorpcnt: 0 },
    { sectorname: "Agro Chemicals & Fertilizers", sectorsvg: "fertilizers.svg", sectorpcnt: 0 },
    { sectorname: "Agro Products", sectorsvg: "fertilizers.svg", sectorpcnt: 0 },
    { sectorname: "Airlines", sectorsvg: "transportation.svg", sectorpcnt: 0 },
    { sectorname: "Apparels", sectorsvg: "textiles-apparels-accessories.svg", sectorpcnt: 0 },
    { sectorname: "Asset Management", sectorsvg: "banking-and-finance.svg", sectorpcnt: 0 },
    { sectorname: "Auto - 2 & 3 Wheelers", sectorsvg: "twowheeler.svg", sectorpcnt: 0 },
    { sectorname: "Auto - 4w", sectorsvg: "automobiles-auto-components.svg", sectorpcnt: 0 },
    { sectorname: "Auto Ancillaries", sectorsvg: "automobiles-auto-components.svg", sectorpcnt: 0 },
    { sectorname: "Banks", sectorsvg: "banking-and-finance.svg", sectorpcnt: 0 },
    { sectorname: "Batteries", sectorsvg: "hardware-technology-equipment.svg", sectorpcnt: 0 },
    { sectorname: "Biotechnology & Medical Research", sectorsvg: "pharmaceuticals-biotechnology.svg", sectorpcnt: 0 },
    { sectorname: "Breweries & Distilleries", sectorsvg: "food-beverages-tobacco.svg", sectorpcnt: 0 },
    { sectorname: "Broadcasting & Entertainment", sectorsvg: "media.svg", sectorpcnt: 0 },
    { sectorname: "Business Support Services", sectorsvg: "consumer-durables.svg", sectorpcnt: 0 },
    { sectorname: "Capital Markets", sectorsvg: "banking-and-finance.svg", sectorpcnt: 0 },
    { sectorname: "Cement", sectorsvg: "cement-and-construction.svg", sectorpcnt: 0 },
    { sectorname: "Ceramics tiles sanitaryware", sectorsvg: "ceramics.svg", sectorpcnt: 0 },
    { sectorname: "Commodity Chemicals", sectorsvg: "chemicals-petrochemicals.svg", sectorpcnt: 0 },
    { sectorname: "Construction & Engineering", sectorsvg: "construction.svg", sectorpcnt: 0 },
    { sectorname: "Construction Supplies & Fixtures", sectorsvg: "construction.svg", sectorpcnt: 0 },
    { sectorname: "Consumer Electronics & Appliances", sectorsvg: "software-services.svg", sectorpcnt: 0 },
    { sectorname: "Diversified", sectorsvg: "software-services.svg", sectorpcnt: 0 },
    { sectorname: "Credit Rating Agencies", sectorsvg: "banking-and-finance.svg", sectorpcnt: 0 },
    { sectorname: "Diversified Chemicals", sectorsvg: "chemicals-petrochemicals.svg", sectorpcnt: 0 },
    { sectorname: "Dyes & Pigments", sectorsvg: "chemicals-petrochemicals.svg", sectorpcnt: 0 },
    { sectorname: "E-commerce & Listing", sectorsvg: "software-services.svg", sectorpcnt: 0 },
    { sectorname: "Edible Oils & Solvent Extraction", sectorsvg: "fertilizers.svg", sectorpcnt: 0 },
    { sectorname: "Education Services", sectorsvg: "realty.svg", sectorpcnt: 0 },
    { sectorname: "Electrical - Equipment components", sectorsvg: "echips.svg", sectorpcnt: 0 },
    { sectorname: "Electrodes - Graphites", sectorsvg: "echips.svg", sectorpcnt: 0 },
    { sectorname: "Electronics - Equipment components", sectorsvg: "echips.svg", sectorpcnt: 0 },
    { sectorname: "Employment Services", sectorsvg: "employment.svg", sectorpcnt: 0 },
    { sectorname: "Engineering - Heavy", sectorsvg: "general-industrials.svg", sectorpcnt: 0 },
    { sectorname: "Entertainment Production", sectorsvg: "media.svg", sectorpcnt: 0 },
    { sectorname: "Finance & Investments", sectorsvg: "banking-and-finance.svg", sectorpcnt: 0 },
    { sectorname: "Food Aggregator", sectorsvg: "food-beverages-tobacco.svg", sectorpcnt: 0 },
    { sectorname: "Food Products", sectorsvg: "fmcg.svg", sectorpcnt: 0 },
    { sectorname: "Footwear", sectorsvg: "footwear.svg", sectorpcnt: 0 },
    { sectorname: "Gas Distribution", sectorsvg: "oil-gas.svg", sectorpcnt: 0 },
    { sectorname: "General Insurance", sectorsvg: "insurance.svg", sectorpcnt: 0 },
    { sectorname: "Glass Products", sectorsvg: "hardware-technology-equipment.svg", sectorpcnt: 0 },
    { sectorname: "Granite", sectorsvg: "ceramics.svg", sectorpcnt: 0 },
    { sectorname: "Health Services And Equipment", sectorsvg: "healthcare-equipment-supplies.svg", sectorpcnt: 0 },
    { sectorname: "Heavy Electrical Equipment", sectorsvg: "hardware-technology-equipment.svg", sectorpcnt: 0 },
    { sectorname: "Home Furnishing", sectorsvg: "house.svg", sectorpcnt: 0 },
    { sectorname: "Hospitals & Diagnostic Centres", sectorsvg: "hospitality.svg", sectorpcnt: 0 },
    { sectorname: "Hotels", sectorsvg: "hotel.svg", sectorpcnt: 0 },
    { sectorname: "Housewares", sectorsvg: "houseware.svg", sectorpcnt: 0 },
    { sectorname: "Housing Finance", sectorsvg: "finance.svg", sectorpcnt: 0 },
    { sectorname: "Industrial Machinery, Equipment & Goods", sectorsvg: "general-industrials.svg", sectorpcnt: 0 },
    { sectorname: "Investment Banking & Brokerage Services", sectorsvg: "banking-and-finance.svg", sectorpcnt: 0 },
    { sectorname: "Iron & Steel", sectorsvg: "metals-mining.svg", sectorpcnt: 0 },
    { sectorname: "It Services & Consulting", sectorsvg: "software-services.svg", sectorpcnt: 0 },
    { sectorname: "It Training Services", sectorsvg: "software-services.svg", sectorpcnt: 0 },
    { sectorname: "Jewellery, Watches & Other Accessories", sectorsvg: "watch.svg", sectorpcnt: 0 },
    { sectorname: "Leisure & Recreation", sectorsvg: "transportation.svg", sectorpcnt: 0 },
    { sectorname: "Life Insurance", sectorsvg: "insurance.svg", sectorpcnt: 0 },
    { sectorname: "Logistics", sectorsvg: "transportation.svg", sectorpcnt: 0 },
    { sectorname: "Lubricants", sectorsvg: "hardware-technology-equipment.svg", sectorpcnt: 0 },
    { sectorname: "Mining minerals", sectorsvg: "metals-mining.svg", sectorpcnt: 0 },
    { sectorname: "Miscellaneous", sectorsvg: "others.svg", sectorpcnt: 0 },
    { sectorname: "Nbfc", sectorsvg: "banking-and-finance.svg", sectorpcnt: 0 },
    { sectorname: "Networking Services", sectorsvg: "telecom-services.svg", sectorpcnt: 0 },
    { sectorname: "Non Ferrous Metals", sectorsvg: "metals-mining.svg", sectorpcnt: 0 },
    { sectorname: "Oil & Gas - Equipment & Services", sectorsvg: "oil-gas.svg", sectorpcnt: 0 },
    { sectorname: "Oil & Gas - Refining & Marketing", sectorsvg: "oil-gas.svg", sectorpcnt: 0 },
    { sectorname: "Oil & Gas Exploration And Production", sectorsvg: "oil-gas.svg", sectorpcnt: 0 },
    { sectorname: "Outsourced Services", sectorsvg: "consumerdurables.svg", sectorpcnt: 0 },
    { sectorname: "Packaging", sectorsvg: "plasticproducts.svg", sectorpcnt: 0 },
    { sectorname: "Paints varnishes", sectorsvg: "chemicals-petrochemicals.svg", sectorpcnt: 0 },
    { sectorname: "Paper Products", sectorsvg: "paper.svg", sectorpcnt: 0 },
    { sectorname: "Personal Products", sectorsvg: "consumerdurables.svg", sectorpcnt: 0 },
    { sectorname: "Petrochemicals", sectorsvg: "chemicals-petrochemicals.svg", sectorpcnt: 0 },
    { sectorname: "Pharmaceuticals", sectorsvg: "pharmaceuticals-biotechnology.svg", sectorpcnt: 0 },
    { sectorname: "Power", sectorsvg: "power.svg", sectorpcnt: 0 },
    { sectorname: "Printing & Publishing", sectorsvg: "media.svg", sectorpcnt: 0 },
    { sectorname: "Real Estate Investment Trusts", sectorsvg: "realty.svg", sectorpcnt: 0 },
    { sectorname: "Realty", sectorsvg: "realty.svg", sectorpcnt: 0 },
    { sectorname: "Refineries", sectorsvg: "oil-gas.svg", sectorpcnt: 0 },
    { sectorname: "Renewable Energy", sectorsvg: "power.svg", sectorpcnt: 0 },
    { sectorname: "Retail", sectorsvg: "fmcg.svg", sectorpcnt: 0 },
    { sectorname: "Rubber Products", sectorsvg: "plasticproducts.svg", sectorpcnt: 0 },
    { sectorname: "Shipping", sectorsvg: "shipping.svg", sectorpcnt: 0 },
    { sectorname: "Shipbuilding & Maintenance", sectorsvg: "shipping.svg", sectorpcnt: 0 },
    { sectorname: "Software Services", sectorsvg: "software-services.svg", sectorpcnt: 0 },
    { sectorname: "Sugar", sectorsvg: "fertilizers.svg", sectorpcnt: 0 },
    { sectorname: "Telecom - Equipment & Infra", sectorsvg: "telecom.svg", sectorpcnt: 0 },
    { sectorname: "Telecom Services", sectorsvg: "telecom-services.svg", sectorpcnt: 0 },
    { sectorname: "Testing labs", sectorsvg: "lab.svg", sectorpcnt: 0 },
    { sectorname: "Textiles", sectorsvg: "textiles-apparels-accessories.svg", sectorpcnt: 0 },
    { sectorname: "Tobacco Products", sectorsvg: "fmcg.svg", sectorpcnt: 0 },
    { sectorname: "Tourism", sectorsvg: "hotel.svg", sectorpcnt: 0 },
    { sectorname: "Tyres", sectorsvg: "tyre.svg", sectorpcnt: 0 },
    { sectorname: "Water Distribution", sectorsvg: "power.svg", sectorpcnt: 0 },
    { sectorname: "Wood Products", sectorsvg: "woodproducts.svg", sectorpcnt: 0 }
  ];
  
  
  export const convertToSectorOptions = (sectorData: DataSectorModel[]): string[] => {
    return sectorData.map(sector => sector.sectorname);
  };
  
  // Usage
  export const SECTOR_OPTIONS = convertToSectorOptions(fullSectorData);
  