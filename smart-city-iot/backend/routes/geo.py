"""
geo.py — Country/State/City/Area hierarchy.
Uses hardcoded data (instant, no external API).
Uses Nominatim for real neighborhoods.
"""

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/geo", tags=["Geo"])

_area_cache: dict = {}

GEO_DATA = {
    "Afghanistan": {"Kabul": ["Kabul","Herat","Kandahar"],"Herat": ["Herat","Shindand"]},
    "Albania": {"Tirana": ["Tirana","Durrës","Vlorë"],"Durrës": ["Durrës","Shijak"]},
    "Algeria": {"Algiers": ["Algiers","Blida","Boumerdès"],"Oran": ["Oran","Mostaganem"],"Constantine": ["Constantine","Skikda"]},
    "Argentina": {"Buenos Aires": ["Buenos Aires","La Plata","Mar del Plata","Quilmes"],"Córdoba": ["Córdoba","Villa Carlos Paz"],"Santa Fe": ["Rosario","Santa Fe"],"Mendoza": ["Mendoza","San Rafael"],"Tucumán": ["San Miguel de Tucumán"]},
    "Australia": {"New South Wales": ["Sydney","Newcastle","Wollongong","Parramatta"],"Victoria": ["Melbourne","Geelong","Ballarat","Bendigo"],"Queensland": ["Brisbane","Gold Coast","Sunshine Coast","Townsville","Cairns"],"Western Australia": ["Perth","Fremantle","Bunbury","Mandurah"],"South Australia": ["Adelaide","Mount Gambier","Whyalla"],"Tasmania": ["Hobart","Launceston","Devonport"],"Northern Territory": ["Darwin","Alice Springs"],"Australian Capital Territory": ["Canberra"]},
    "Austria": {"Vienna": ["Vienna"],"Styria": ["Graz","Leoben"],"Upper Austria": ["Linz","Wels"],"Salzburg": ["Salzburg"],"Tyrol": ["Innsbruck"]},
    "Bangladesh": {"Dhaka": ["Dhaka","Narayanganj","Gazipur"],"Chittagong": ["Chittagong","Cox's Bazar"],"Sylhet": ["Sylhet"],"Rajshahi": ["Rajshahi"],"Khulna": ["Khulna"]},
    "Belgium": {"Brussels": ["Brussels","Schaerbeek","Anderlecht"],"Flanders": ["Antwerp","Ghent","Bruges","Leuven"],"Wallonia": ["Liège","Charleroi","Namur"]},
    "Bolivia": {"La Paz": ["La Paz","El Alto"],"Santa Cruz": ["Santa Cruz"],"Cochabamba": ["Cochabamba"]},
    "Brazil": {"São Paulo": ["São Paulo","Campinas","Santos","Guarulhos","Sorocaba","Ribeirão Preto"],"Rio de Janeiro": ["Rio de Janeiro","Niterói","Nova Iguaçu","Duque de Caxias"],"Minas Gerais": ["Belo Horizonte","Uberlândia","Juiz de Fora"],"Bahia": ["Salvador","Feira de Santana"],"Paraná": ["Curitiba","Londrina","Maringá"],"Rio Grande do Sul": ["Porto Alegre","Caxias do Sul","Pelotas"],"Pernambuco": ["Recife","Caruaru"],"Ceará": ["Fortaleza","Caucaia"],"Amazonas": ["Manaus"],"Goiás": ["Goiânia"]},
    "Canada": {"Ontario": ["Toronto","Ottawa","Mississauga","Hamilton","Brampton","London","Kitchener","Windsor"],"Quebec": ["Montreal","Quebec City","Laval","Gatineau","Sherbrooke"],"British Columbia": ["Vancouver","Surrey","Burnaby","Richmond","Victoria","Kelowna"],"Alberta": ["Calgary","Edmonton","Red Deer","Lethbridge"],"Manitoba": ["Winnipeg","Brandon"],"Saskatchewan": ["Saskatoon","Regina"],"Nova Scotia": ["Halifax","Sydney"],"New Brunswick": ["Moncton","Saint John","Fredericton"],"Newfoundland and Labrador": ["St. John's","Corner Brook"],"Prince Edward Island": ["Charlottetown"]},
    "Chile": {"Santiago": ["Santiago","Puente Alto","Maipú","La Florida"],"Valparaíso": ["Valparaíso","Viña del Mar"],"Biobío": ["Concepción","Talcahuano"]},
    "China": {"Beijing": ["Beijing","Haidian","Chaoyang","Dongcheng"],"Shanghai": ["Shanghai","Pudong","Jing'an","Yangpu"],"Guangdong": ["Guangzhou","Shenzhen","Dongguan","Foshan","Zhuhai"],"Sichuan": ["Chengdu","Mianyang"],"Zhejiang": ["Hangzhou","Ningbo","Wenzhou"],"Jiangsu": ["Nanjing","Suzhou","Wuxi","Changzhou"],"Hubei": ["Wuhan","Yichang"],"Shandong": ["Jinan","Qingdao"],"Henan": ["Zhengzhou","Luoyang"],"Shaanxi": ["Xi'an"],"Fujian": ["Fuzhou","Xiamen"],"Chongqing": ["Chongqing"],"Liaoning": ["Shenyang","Dalian"],"Heilongjiang": ["Harbin"]},
    "Colombia": {"Cundinamarca": ["Bogotá","Soacha"],"Antioquia": ["Medellín","Bello","Envigado"],"Valle del Cauca": ["Cali","Palmira"],"Atlántico": ["Barranquilla","Soledad"],"Santander": ["Bucaramanga","Floridablanca"]},
    "Egypt": {"Cairo": ["Cairo","Giza","Helwan","New Cairo"],"Alexandria": ["Alexandria"],"Giza": ["Giza"],"Luxor": ["Luxor"],"Aswan": ["Aswan"],"Port Said": ["Port Said"]},
    "Ethiopia": {"Addis Ababa": ["Addis Ababa"],"Oromia": ["Adama","Jimma"],"Amhara": ["Bahir Dar","Gondar"]},
    "France": {"Île-de-France": ["Paris","Versailles","Boulogne-Billancourt","Saint-Denis"],"Auvergne-Rhône-Alpes": ["Lyon","Grenoble","Saint-Étienne"],"Nouvelle-Aquitaine": ["Bordeaux","Limoges"],"Occitanie": ["Toulouse","Montpellier"],"Hauts-de-France": ["Lille","Amiens"],"Provence-Alpes-Côte d'Azur": ["Marseille","Nice","Toulon"],"Grand Est": ["Strasbourg","Reims","Metz"],"Bretagne": ["Rennes","Brest"],"Normandie": ["Rouen","Caen"],"Pays de la Loire": ["Nantes","Angers"]},
    "Germany": {"Bavaria": ["Munich","Nuremberg","Augsburg","Regensburg"],"North Rhine-Westphalia": ["Cologne","Düsseldorf","Dortmund","Essen","Duisburg","Bochum","Bonn","Münster"],"Baden-Württemberg": ["Stuttgart","Karlsruhe","Mannheim","Freiburg","Heidelberg"],"Berlin": ["Berlin"],"Hamburg": ["Hamburg"],"Hesse": ["Frankfurt","Wiesbaden","Kassel"],"Saxony": ["Leipzig","Dresden","Chemnitz"],"Lower Saxony": ["Hanover","Braunschweig","Wolfsburg"],"Rhineland-Palatinate": ["Mainz","Koblenz"]},
    "Ghana": {"Greater Accra": ["Accra","Tema"],"Ashanti": ["Kumasi"],"Northern": ["Tamale"]},
    "Greece": {"Attica": ["Athens","Piraeus","Peristeri"],"Central Macedonia": ["Thessaloniki","Kavala"],"Crete": ["Heraklion","Chania"]},
    "India": {
        "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Thane","Navi Mumbai","Kolhapur"],
        "Uttar Pradesh": ["Lucknow","Kanpur","Agra","Varanasi","Allahabad","Meerut","Ghaziabad","Noida","Mathura"],
        "Karnataka": ["Bangalore","Mysore","Hubli","Mangalore","Belgaum","Davangere"],
        "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode"],
        "West Bengal": ["Kolkata","Howrah","Asansol","Durgapur","Siliguri"],
        "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar"],
        "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Gandhinagar"],
        "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Bikaner"],
        "Delhi": ["New Delhi","Dwarka","Rohini","Janakpuri","Connaught Place","Saket","Noida Extension"],
        "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Mohali"],
        "Haryana": ["Faridabad","Gurgaon","Panipat","Ambala","Hisar"],
        "Madhya Pradesh": ["Bhopal","Indore","Jabalpur","Gwalior","Ujjain"],
        "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Tirupati"],
        "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur"],
        "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam"],
        "Odisha": ["Bhubaneswar","Cuttack","Rourkela"],
        "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro"],
        "Assam": ["Guwahati","Silchar","Dibrugarh"],
        "Uttarakhand": ["Dehradun","Haridwar","Roorkee","Rishikesh"],
        "Himachal Pradesh": ["Shimla","Dharamshala","Solan","Manali"],
        "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa"],
        "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Durg"],
        "Jammu and Kashmir": ["Srinagar","Jammu","Anantnag"],
        "Tripura": ["Agartala","Dharmanagar"],
        "Meghalaya": ["Shillong","Tura"],
        "Manipur": ["Imphal"],
        "Nagaland": ["Kohima","Dimapur"],
        "Sikkim": ["Gangtok"],
    },
    "Indonesia": {"Jakarta": ["Jakarta","South Jakarta","North Jakarta","West Jakarta","East Jakarta"],"West Java": ["Bandung","Bekasi","Depok","Bogor"],"East Java": ["Surabaya","Malang","Kediri"],"Central Java": ["Semarang","Solo","Yogyakarta"],"North Sumatra": ["Medan","Pematang Siantar"],"Bali": ["Denpasar","Kuta","Ubud"]},
    "Iran": {"Tehran": ["Tehran","Karaj"],"Isfahan": ["Isfahan","Kashan"],"Fars": ["Shiraz"],"Razavi Khorasan": ["Mashhad"],"East Azerbaijan": ["Tabriz"]},
    "Iraq": {"Baghdad": ["Baghdad"],"Basra": ["Basra"],"Nineveh": ["Mosul"],"Erbil": ["Erbil"]},
    "Ireland": {"Leinster": ["Dublin","Drogheda","Dundalk"],"Munster": ["Cork","Limerick","Waterford"],"Connacht": ["Galway","Sligo"]},
    "Israel": {"Tel Aviv": ["Tel Aviv","Ramat Gan","Petah Tikva"],"Jerusalem": ["Jerusalem"],"Haifa": ["Haifa"]},
    "Italy": {"Lombardy": ["Milan","Brescia","Bergamo","Monza","Como"],"Lazio": ["Rome","Latina"],"Campania": ["Naples","Salerno"],"Sicily": ["Palermo","Catania","Messina"],"Veneto": ["Venice","Verona","Padua"],"Piedmont": ["Turin","Novara"],"Emilia-Romagna": ["Bologna","Modena","Parma"],"Tuscany": ["Florence","Prato","Pisa"],"Puglia": ["Bari","Taranto"]},
    "Japan": {"Tokyo": ["Tokyo","Shinjuku","Shibuya","Minato","Adachi"],"Osaka": ["Osaka","Sakai","Toyonaka"],"Kanagawa": ["Yokohama","Kawasaki"],"Aichi": ["Nagoya","Toyota"],"Hokkaido": ["Sapporo","Asahikawa","Hakodate"],"Fukuoka": ["Fukuoka","Kitakyushu"],"Kyoto": ["Kyoto"],"Hyogo": ["Kobe","Himeji"],"Miyagi": ["Sendai"],"Hiroshima": ["Hiroshima","Fukuyama"]},
    "Kenya": {"Nairobi": ["Nairobi","Westlands","Karen","Kibera"],"Mombasa": ["Mombasa","Malindi"],"Kisumu": ["Kisumu"],"Nakuru": ["Nakuru","Eldoret"]},
    "Malaysia": {"Selangor": ["Shah Alam","Petaling Jaya","Subang Jaya","Klang"],"Kuala Lumpur": ["Kuala Lumpur","Chow Kit","Bangsar","Bukit Bintang"],"Penang": ["George Town","Butterworth"],"Johor": ["Johor Bahru","Batu Pahat"],"Perak": ["Ipoh","Taiping"],"Sabah": ["Kota Kinabalu","Sandakan"],"Sarawak": ["Kuching","Miri"]},
    "Mexico": {"Mexico City": ["Mexico City","Iztapalapa","Coyoacán","Tlalpan"],"Jalisco": ["Guadalajara","Zapopan","Puerto Vallarta"],"Nuevo León": ["Monterrey","San Nicolás de los Garza","Apodaca"],"State of Mexico": ["Ecatepec","Nezahualcóyotl","Toluca"],"Puebla": ["Puebla","Tehuacán"],"Guanajuato": ["León","Irapuato","Celaya"],"Veracruz": ["Veracruz","Xalapa"],"Chihuahua": ["Ciudad Juárez","Chihuahua City"],"Baja California": ["Tijuana","Mexicali"],"Sonora": ["Hermosillo"]},
    "Morocco": {"Casablanca-Settat": ["Casablanca","Mohammedia"],"Rabat-Salé-Kénitra": ["Rabat","Salé"],"Marrakech-Safi": ["Marrakech"],"Fès-Meknès": ["Fes","Meknes"],"Tanger-Tétouan-Al Hoceïma": ["Tangier"]},
    "Nepal": {"Bagmati": ["Kathmandu","Lalitpur","Bhaktapur"],"Gandaki": ["Pokhara"],"Lumbini": ["Butwal"]},
    "Netherlands": {"North Holland": ["Amsterdam","Haarlem","Alkmaar"],"South Holland": ["Rotterdam","The Hague","Leiden","Dordrecht"],"Utrecht": ["Utrecht","Amersfoort"],"North Brabant": ["Eindhoven","Tilburg","Breda"],"Gelderland": ["Nijmegen","Arnhem"]},
    "New Zealand": {"Auckland": ["Auckland","Manukau","North Shore"],"Wellington": ["Wellington","Lower Hutt"],"Canterbury": ["Christchurch"],"Waikato": ["Hamilton"]},
    "Nigeria": {"Lagos": ["Lagos","Ikeja","Surulere","Victoria Island","Lekki","Apapa"],"Kano": ["Kano"],"Rivers": ["Port Harcourt"],"Oyo": ["Ibadan","Ogbomosho"],"FCT": ["Abuja"],"Anambra": ["Onitsha","Awka"]},
    "Norway": {"Oslo": ["Oslo","Bærum"],"Vestland": ["Bergen"],"Trøndelag": ["Trondheim"],"Rogaland": ["Stavanger","Sandnes"]},
    "Pakistan": {"Punjab": ["Lahore","Faisalabad","Rawalpindi","Gujranwala","Multan","Sialkot"],"Sindh": ["Karachi","Hyderabad","Sukkur"],"Khyber Pakhtunkhwa": ["Peshawar","Mardan","Abbottabad"],"Balochistan": ["Quetta","Gwadar"],"Islamabad Capital Territory": ["Islamabad"]},
    "Peru": {"Lima": ["Lima","Callao","San Juan de Lurigancho"],"Arequipa": ["Arequipa"],"La Libertad": ["Trujillo"]},
    "Philippines": {"Metro Manila": ["Manila","Quezon City","Caloocan","Makati","Pasig","Taguig"],"Calabarzon": ["Antipolo","Bacoor","Calamba"],"Central Luzon": ["Angeles","Olongapo","Malolos"],"Davao Region": ["Davao City","Tagum"],"Central Visayas": ["Cebu City","Mandaue","Lapu-Lapu"]},
    "Poland": {"Masovian": ["Warsaw","Radom"],"Silesian": ["Katowice","Częstochowa","Sosnowiec","Gliwice"],"Lesser Poland": ["Kraków","Tarnów"],"Greater Poland": ["Poznań","Kalisz"],"Lower Silesian": ["Wrocław"],"Łódź": ["Łódź"],"Pomeranian": ["Gdańsk","Gdynia"]},
    "Portugal": {"Lisbon": ["Lisbon","Sintra","Amadora","Oeiras","Cascais"],"Porto": ["Porto","Braga","Matosinhos"],"Algarve": ["Faro","Portimão"]},
    "Romania": {"Bucharest": ["Bucharest"],"Cluj": ["Cluj-Napoca"],"Iași": ["Iași"],"Timiș": ["Timișoara"],"Brașov": ["Brașov"]},
    "Russia": {"Moscow": ["Moscow"],"Saint Petersburg": ["Saint Petersburg"],"Novosibirsk Oblast": ["Novosibirsk"],"Tatarstan": ["Kazan","Naberezhnye Chelny"],"Krasnodar Krai": ["Krasnodar","Sochi"],"Rostov Oblast": ["Rostov-on-Don"],"Nizhny Novgorod Oblast": ["Nizhny Novgorod"]},
    "Saudi Arabia": {"Riyadh": ["Riyadh","Al Kharj"],"Mecca": ["Mecca","Jeddah","Taif"],"Medina": ["Medina","Yanbu"],"Eastern Province": ["Dammam","Al Khobar","Dhahran","Jubail"],"Asir": ["Abha"]},
    "South Africa": {"Gauteng": ["Johannesburg","Pretoria","Soweto","Sandton"],"Western Cape": ["Cape Town","Stellenbosch","George"],"KwaZulu-Natal": ["Durban","Pietermaritzburg"],"Eastern Cape": ["Port Elizabeth","East London"]},
    "South Korea": {"Seoul": ["Seoul","Gangnam","Mapo","Jongno","Nowon"],"Gyeonggi-do": ["Suwon","Seongnam","Bucheon","Goyang","Yongin"],"Busan": ["Busan","Haeundae"],"Incheon": ["Incheon"],"Daegu": ["Daegu"],"Daejeon": ["Daejeon"]},
    "Spain": {"Community of Madrid": ["Madrid","Móstoles","Alcalá de Henares","Fuenlabrada"],"Catalonia": ["Barcelona","Hospitalet de Llobregat","Badalona","Terrassa"],"Andalusia": ["Seville","Málaga","Córdoba","Granada"],"Valencia": ["Valencia","Alicante"],"Basque Country": ["Bilbao","San Sebastián"],"Galicia": ["Vigo","A Coruña"]},
    "Sweden": {"Stockholm": ["Stockholm","Solna","Sundbyberg"],"Västra Götaland": ["Gothenburg","Borås"],"Skåne": ["Malmö","Helsingborg","Lund"]},
    "Switzerland": {"Zurich": ["Zurich","Winterthur"],"Bern": ["Bern","Biel","Thun"],"Geneva": ["Geneva"],"Basel-Stadt": ["Basel"],"Vaud": ["Lausanne"]},
    "Taiwan": {"Taipei": ["Taipei","Zhongzheng","Daan","Xinyi"],"New Taipei": ["New Taipei","Banqiao"],"Taoyuan": ["Taoyuan"],"Taichung": ["Taichung"],"Kaohsiung": ["Kaohsiung"]},
    "Tanzania": {"Dar es Salaam": ["Dar es Salaam","Kinondoni","Ilala"],"Mwanza": ["Mwanza"],"Arusha": ["Arusha"]},
    "Thailand": {"Bangkok": ["Bangkok","Lat Phrao","Don Mueang","Min Buri"],"Chiang Mai": ["Chiang Mai"],"Chonburi": ["Pattaya","Chonburi","Laem Chabang"],"Songkhla": ["Hat Yai"]},
    "Turkey": {"Istanbul": ["Istanbul","Kadıköy","Beşiktaş","Şişli","Üsküdar","Fatih","Ümraniye","Pendik"],"Ankara": ["Ankara","Çankaya","Keçiören"],"İzmir": ["İzmir","Buca","Bornova"],"Bursa": ["Bursa"],"Antalya": ["Antalya"],"Adana": ["Adana"]},
    "Ukraine": {"Kyiv": ["Kyiv","Brovary"],"Kharkiv": ["Kharkiv"],"Dnipro": ["Dnipro","Kryvyi Rih"],"Odessa": ["Odessa"],"Lviv": ["Lviv"]},
    "United Arab Emirates": {"Dubai": ["Dubai","Deira","Bur Dubai","Jumeirah","Dubai Marina","Downtown Dubai","Jebel Ali"],"Abu Dhabi": ["Abu Dhabi","Al Ain","Mussafah","Khalifa City"],"Sharjah": ["Sharjah"],"Ajman": ["Ajman"],"Ras Al Khaimah": ["Ras Al Khaimah"]},
    "United Kingdom": {"England": ["London","Birmingham","Manchester","Leeds","Liverpool","Sheffield","Bristol","Newcastle","Leicester","Coventry","Nottingham","Southampton","Brighton","Oxford","Cambridge"],"Scotland": ["Glasgow","Edinburgh","Aberdeen","Dundee","Inverness"],"Wales": ["Cardiff","Swansea","Newport"],"Northern Ireland": ["Belfast","Londonderry"]},
    "United States": {
        "Alabama": ["Birmingham","Montgomery","Huntsville","Mobile","Tuscaloosa"],
        "Alaska": ["Anchorage","Fairbanks","Juneau"],
        "Arizona": ["Phoenix","Tucson","Mesa","Chandler","Scottsdale","Gilbert","Tempe","Peoria"],
        "Arkansas": ["Little Rock","Fort Smith","Fayetteville"],
        "California": ["Los Angeles","San Diego","San Jose","San Francisco","Fresno","Sacramento","Long Beach","Oakland","Bakersfield","Anaheim","Irvine","Riverside","Stockton"],
        "Colorado": ["Denver","Colorado Springs","Aurora","Fort Collins","Lakewood","Boulder"],
        "Connecticut": ["Bridgeport","New Haven","Hartford","Stamford"],
        "Delaware": ["Wilmington","Dover","Newark"],
        "Florida": ["Jacksonville","Miami","Tampa","Orlando","St. Petersburg","Tallahassee","Fort Lauderdale","Port St. Lucie","Cape Coral","Palm Bay","Lakeland"],
        "Georgia": ["Atlanta","Augusta","Columbus","Macon","Savannah","Athens"],
        "Hawaii": ["Honolulu","Hilo","Kailua"],
        "Idaho": ["Boise","Nampa","Meridian","Idaho Falls"],
        "Illinois": ["Chicago","Aurora","Joliet","Rockford","Springfield","Naperville","Peoria"],
        "Indiana": ["Indianapolis","Fort Wayne","Evansville","South Bend","Bloomington"],
        "Iowa": ["Des Moines","Cedar Rapids","Davenport","Sioux City"],
        "Kansas": ["Wichita","Overland Park","Kansas City","Topeka"],
        "Kentucky": ["Louisville","Lexington","Bowling Green","Owensboro"],
        "Louisiana": ["New Orleans","Baton Rouge","Shreveport","Lafayette"],
        "Maine": ["Portland","Lewiston","Bangor"],
        "Maryland": ["Baltimore","Frederick","Rockville","Gaithersburg","Annapolis"],
        "Massachusetts": ["Boston","Worcester","Springfield","Cambridge","Lowell","Brockton"],
        "Michigan": ["Detroit","Grand Rapids","Warren","Ann Arbor","Lansing","Flint"],
        "Minnesota": ["Minneapolis","St. Paul","Rochester","Duluth","Bloomington"],
        "Mississippi": ["Jackson","Gulfport","Hattiesburg","Biloxi"],
        "Missouri": ["Kansas City","St. Louis","Springfield","Columbia"],
        "Montana": ["Billings","Missoula","Great Falls","Bozeman"],
        "Nebraska": ["Omaha","Lincoln","Bellevue","Grand Island"],
        "Nevada": ["Las Vegas","Henderson","Reno","North Las Vegas"],
        "New Hampshire": ["Manchester","Nashua","Concord"],
        "New Jersey": ["Newark","Jersey City","Paterson","Elizabeth","Edison","Woodbridge","Trenton"],
        "New Mexico": ["Albuquerque","Las Cruces","Rio Rancho","Santa Fe"],
        "New York": ["New York City","Buffalo","Rochester","Yonkers","Syracuse","Albany"],
        "North Carolina": ["Charlotte","Raleigh","Greensboro","Durham","Winston-Salem","Fayetteville"],
        "North Dakota": ["Fargo","Bismarck","Grand Forks"],
        "Ohio": ["Columbus","Cleveland","Cincinnati","Toledo","Akron","Dayton"],
        "Oklahoma": ["Oklahoma City","Tulsa","Norman","Broken Arrow","Edmond"],
        "Oregon": ["Portland","Salem","Eugene","Gresham","Hillsboro","Beaverton","Bend"],
        "Pennsylvania": ["Philadelphia","Pittsburgh","Allentown","Erie","Reading","Scranton","Harrisburg"],
        "Rhode Island": ["Providence","Cranston","Warwick","Pawtucket"],
        "South Carolina": ["Columbia","Charleston","North Charleston","Greenville"],
        "South Dakota": ["Sioux Falls","Rapid City"],
        "Tennessee": ["Memphis","Nashville","Knoxville","Chattanooga","Clarksville"],
        "Texas": ["Houston","San Antonio","Dallas","Austin","Fort Worth","El Paso","Arlington","Corpus Christi","Plano","Laredo","Lubbock","Garland","Irving","Amarillo","Frisco","McKinney"],
        "Utah": ["Salt Lake City","West Valley City","Provo","West Jordan","Orem"],
        "Vermont": ["Burlington","Essex","South Burlington"],
        "Virginia": ["Virginia Beach","Norfolk","Chesapeake","Richmond","Newport News","Alexandria"],
        "Washington": ["Seattle","Spokane","Tacoma","Vancouver","Bellevue","Kent","Everett","Renton","Bellingham","Kirkland"],
        "West Virginia": ["Charleston","Huntington","Parkersburg","Morgantown"],
        "Wisconsin": ["Milwaukee","Madison","Green Bay","Kenosha","Racine","Appleton"],
        "Wyoming": ["Cheyenne","Casper","Laramie"],
        "Washington D.C.": ["Washington","Georgetown","Capitol Hill","Dupont Circle"],
    },
    "Venezuela": {"Capital District": ["Caracas","Petare"],"Zulia": ["Maracaibo"],"Carabobo": ["Valencia"]},
    "Vietnam": {"Hanoi": ["Hanoi","Hoàn Kiếm","Đống Đa","Long Biên"],"Ho Chi Minh City": ["Ho Chi Minh City","District 1","Bình Thạnh","Tân Bình"],"Da Nang": ["Da Nang"],"Hai Phong": ["Hai Phong"],"Can Tho": ["Can Tho"],"Khanh Hoa": ["Nha Trang"]},
}


@router.get("/countries")
def countries():
    return {"countries": sorted(GEO_DATA.keys())}


@router.get("/states")
def states(country: str):
    s = sorted(GEO_DATA.get(country, {}).keys())
    if not s:
        raise HTTPException(404, f"No states found for '{country}'")
    return {"country": country, "states": s}


@router.get("/cities")
def cities(country: str, state: str):
    c = sorted(GEO_DATA.get(country, {}).get(state, []))
    if not c:
        raise HTTPException(404, f"No cities for '{state}', '{country}'")
    return {"country": country, "state": state, "cities": c}


@router.get("/areas")
async def areas(city: str, state: str = "", country: str = ""):
    key = f"{city}::{state}::{country}"
    if key in _area_cache:
        return {"city": city, "areas": _area_cache[key]}

    area_names = []
    query = ", ".join(filter(None, [city, state, country]))
    try:
        async with httpx.AsyncClient(timeout=10, headers={"User-Agent": "SmartCityIoT/3.0"}) as c:
            r = await c.get("https://nominatim.openstreetmap.org/search", params={
                "q": query, "format": "json", "limit": 50, "addressdetails": 1,
            })
            seen = set()
            for item in r.json():
                addr = item.get("address", {})
                for k in ("suburb","neighbourhood","city_district","quarter","borough","town","village"):
                    name = addr.get(k)
                    if name and name not in seen and len(name) > 1:
                        seen.add(name); area_names.append(name); break
    except Exception:
        pass

    final = sorted(set(area_names))[:40] or [
        f"{city} Central", f"{city} North", f"{city} South",
        f"{city} East", f"{city} West", f"{city} Downtown",
        f"{city} Industrial Zone", f"{city} Airport District",
    ]
    _area_cache[key] = final
    return {"city": city, "state": state, "country": country, "areas": final}


@router.get("/geocode")
async def geocode(city: str, state: str = "", country: str = ""):
    query = ", ".join(filter(None, [city, state, country]))
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.get("https://geocoding-api.open-meteo.com/v1/search",
                params={"name": query, "count": 5, "language": "en", "format": "json"})
            results = r.json().get("results", [])
        if not results:
            async with httpx.AsyncClient(timeout=10) as c:
                r = await c.get("https://geocoding-api.open-meteo.com/v1/search",
                    params={"name": city, "count": 3, "language": "en", "format": "json"})
                results = r.json().get("results", [])
        if not results:
            raise HTTPException(404, f"Could not geocode '{query}'")
        best = results[0]
        return {"city": city, "state": state, "country": country,
                "lat": best["latitude"], "lon": best["longitude"],
                "timezone": best.get("timezone", "UTC")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
