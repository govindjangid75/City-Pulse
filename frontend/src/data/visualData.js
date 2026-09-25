/**
 * CityPulse Visual Assets, Indian City Registry, Photography, and Telemetry Data
 * Curated for a modern Bento Grid UI experience with high visual impact.
 */

export const INDIAN_CITIES = {
  'delhi-ncr': {
    id: 'delhi-ncr',
    name: 'Delhi NCR (National Capital Region)',
    state: 'Delhi NCR',
    center: [28.5447, 77.3331],
    zoom: 12,
    tagline: 'Yamuna Flood Basin & Ring Road Mobility Network',
    activeIncidents: 4,
    healthScore: 84
  },
  'jaipur': {
    id: 'jaipur',
    name: 'Jaipur Smart City',
    state: 'Rajasthan',
    center: [26.9124, 75.7873],
    zoom: 12,
    tagline: 'Mansarovar & Walled Heritage Civic Pulse',
    activeIncidents: 1,
    healthScore: 92
  },
  'mumbai': {
    id: 'mumbai',
    name: 'Mumbai Metropolitan',
    state: 'Maharashtra',
    center: [19.0760, 72.8777],
    zoom: 12,
    tagline: 'Coastal Coastal Road, Local Trains & Monsoons',
    activeIncidents: 3,
    healthScore: 78
  },
  'bengaluru': {
    id: 'bengaluru',
    name: 'Bengaluru Urban',
    state: 'Karnataka',
    center: [12.9716, 77.5946],
    zoom: 12,
    tagline: 'Outer Ring Road, Namma Metro & Tech Corridors',
    activeIncidents: 2,
    healthScore: 88
  }
}

export const INDIAN_STATES_AND_CITIES = {
  'Delhi NCR': [
    { id: 'delhi-ncr', name: 'New Delhi (Central & Ring Road)', state: 'Delhi NCR', center: [28.6139, 77.2090], zoom: 12, aqi: 142, aqiStatus: 'Moderate', temp: '26°C', weather: 'Partly Cloudy', rainProb: '15%', wind: '14 km/h NW', humidity: '58%', trafficSpeed: '32 km/h', congestion: 'Moderate', transitStatus: 'DMRC Blue/Yellow Active', incidents: 3, healthScore: 84, population: '32.9M', district: 'National Capital Territory' },
    { id: 'noida', name: 'Noida (Sector 62 & Expressway)', state: 'Delhi NCR', center: [28.5721, 77.3562], zoom: 12, aqi: 128, aqiStatus: 'Moderate', temp: '26.5°C', weather: 'Sunny', rainProb: '10%', wind: '12 km/h NW', humidity: '54%', trafficSpeed: '46 km/h', congestion: 'Smooth', transitStatus: 'Aqua & Blue Line Sync', incidents: 1, healthScore: 89, population: '1.2M', district: 'Gautam Buddha Nagar' },
    { id: 'gurugram', name: 'Gurugram (Cyber City & DLF)', state: 'Delhi NCR', center: [28.4595, 77.0266], zoom: 12, aqi: 156, aqiStatus: 'Unhealthy for Sensitive', temp: '27°C', weather: 'Hazy', rainProb: '20%', wind: '15 km/h W', humidity: '60%', trafficSpeed: '22 km/h', congestion: 'Heavy', transitStatus: 'Rapid Metro Operational', incidents: 4, healthScore: 76, population: '1.5M', district: 'Gurugram' },
    { id: 'ghaziabad', name: 'Ghaziabad (Indirapuram & NH24)', state: 'Delhi NCR', center: [28.6692, 77.4538], zoom: 12, aqi: 168, aqiStatus: 'Poor', temp: '26°C', weather: 'Moderate', rainProb: '10%', wind: '10 km/h NW', humidity: '59%', trafficSpeed: '30 km/h', congestion: 'Moderate', transitStatus: 'Red Line & RRTS Active', incidents: 2, healthScore: 79, population: '2.4M', district: 'Ghaziabad' },
    { id: 'faridabad', name: 'Faridabad Industrial Corridor', state: 'Delhi NCR', center: [28.4089, 77.3178], zoom: 12, aqi: 145, aqiStatus: 'Moderate', temp: '27°C', weather: 'Clear', rainProb: '5%', wind: '11 km/h W', humidity: '52%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'Violet Line Normal', incidents: 2, healthScore: 82, population: '1.9M', district: 'Faridabad' }
  ],
  'Maharashtra': [
    { id: 'mumbai', name: 'Mumbai (South & Bandra Coastal)', state: 'Maharashtra', center: [19.0760, 72.8777], zoom: 12, aqi: 68, aqiStatus: 'Satisfactory', temp: '29°C', weather: 'Humid & Coastal Breeze', rainProb: '35%', wind: '22 km/h W', humidity: '78%', trafficSpeed: '18 km/h', congestion: 'Heavy', transitStatus: 'Local Trains & Metro 3 Active', incidents: 3, healthScore: 78, population: '20.9M', district: 'Mumbai Metropolitan' },
    { id: 'pune', name: 'Pune (Hinjawadi Tech & Koregaon)', state: 'Maharashtra', center: [18.5204, 73.8567], zoom: 12, aqi: 52, aqiStatus: 'Good', temp: '24°C', weather: 'Pleasant & Mild', rainProb: '10%', wind: '14 km/h SW', humidity: '62%', trafficSpeed: '32 km/h', congestion: 'Moderate', transitStatus: 'Pune Metro Line 1 & 2', incidents: 1, healthScore: 91, population: '7.4M', district: 'Pune District' },
    { id: 'nagpur', name: 'Nagpur (Zero Mile Hub)', state: 'Maharashtra', center: [21.1458, 79.0882], zoom: 12, aqi: 48, aqiStatus: 'Good', temp: '28°C', weather: 'Clear Sky', rainProb: '5%', wind: '10 km/h E', humidity: '45%', trafficSpeed: '50 km/h', congestion: 'Smooth', transitStatus: 'Maha Metro On Time', incidents: 0, healthScore: 95, population: '2.9M', district: 'Nagpur' },
    { id: 'thane', name: 'Thane Lake City', state: 'Maharashtra', center: [19.2183, 72.9781], zoom: 12, aqi: 74, aqiStatus: 'Satisfactory', temp: '29°C', weather: 'Partly Sunny', rainProb: '25%', wind: '16 km/h SW', humidity: '74%', trafficSpeed: '26 km/h', congestion: 'Moderate', transitStatus: 'Central Line Transit', incidents: 2, healthScore: 83, population: '2.2M', district: 'Thane' },
    { id: 'nashik', name: 'Nashik (Godavari Basin)', state: 'Maharashtra', center: [19.9975, 73.7898], zoom: 12, aqi: 42, aqiStatus: 'Good', temp: '23°C', weather: 'Cool Breeze', rainProb: '10%', wind: '12 km/h SW', humidity: '55%', trafficSpeed: '52 km/h', congestion: 'Smooth', transitStatus: 'City Bus Normal', incidents: 0, healthScore: 96, population: '1.8M', district: 'Nashik' }
  ],
  'Karnataka': [
    { id: 'bengaluru', name: 'Bengaluru (Outer Ring Rd & Whitefield)', state: 'Karnataka', center: [12.9716, 77.5946], zoom: 12, aqi: 45, aqiStatus: 'Good', temp: '22°C', weather: 'Pleasant & Overcast', rainProb: '20%', wind: '16 km/h SW', humidity: '65%', trafficSpeed: '16 km/h', congestion: 'Heavy', transitStatus: 'Namma Metro Purple/Green', incidents: 2, healthScore: 88, population: '13.1M', district: 'Bengaluru Urban' },
    { id: 'mysuru', name: 'Mysuru Heritage Smart City', state: 'Karnataka', center: [12.2958, 76.6394], zoom: 12, aqi: 32, aqiStatus: 'Clean & Good', temp: '23°C', weather: 'Clear & Clean', rainProb: '5%', wind: '10 km/h S', humidity: '58%', trafficSpeed: '45 km/h', congestion: 'Smooth', transitStatus: 'Clean Electric Buses', incidents: 0, healthScore: 98, population: '1.3M', district: 'Mysuru' },
    { id: 'mangalore', name: 'Mangaluru Coastal Port', state: 'Karnataka', center: [12.9141, 74.8560], zoom: 12, aqi: 38, aqiStatus: 'Good', temp: '28°C', weather: 'Sea Breeze', rainProb: '30%', wind: '18 km/h W', humidity: '82%', trafficSpeed: '40 km/h', congestion: 'Smooth', transitStatus: 'Port Mobility Smooth', incidents: 1, healthScore: 93, population: '700K', district: 'Dakshina Kannada' },
    { id: 'hubballi', name: 'Hubballi-Dharwad Twin City', state: 'Karnataka', center: [15.3647, 75.1240], zoom: 12, aqi: 40, aqiStatus: 'Good', temp: '26°C', weather: 'Sunny', rainProb: '10%', wind: '12 km/h W', humidity: '52%', trafficSpeed: '48 km/h', congestion: 'Smooth', transitStatus: 'BRTS Green Corridor Active', incidents: 0, healthScore: 94, population: '1.1M', district: 'Dharwad' }
  ],
  'Rajasthan': [
    { id: 'jaipur', name: 'Jaipur (Pink City & Mansarovar)', state: 'Rajasthan', center: [26.9124, 75.7873], zoom: 12, aqi: 82, aqiStatus: 'Satisfactory', temp: '28°C', weather: 'Dry & Sunny', rainProb: '0%', wind: '12 km/h NE', humidity: '38%', trafficSpeed: '38 km/h', congestion: 'Smooth', transitStatus: 'Jaipur Metro Line 1 Normal', incidents: 1, healthScore: 92, population: '4.1M', district: 'Jaipur' },
    { id: 'jodhpur', name: 'Jodhpur Sun City', state: 'Rajasthan', center: [26.2389, 73.0243], zoom: 12, aqi: 75, aqiStatus: 'Satisfactory', temp: '29°C', weather: 'Sunny', rainProb: '0%', wind: '14 km/h N', humidity: '32%', trafficSpeed: '46 km/h', congestion: 'Smooth', transitStatus: 'City Transit Normal', incidents: 0, healthScore: 94, population: '1.5M', district: 'Jodhpur' },
    { id: 'udaipur', name: 'Udaipur City of Lakes', state: 'Rajasthan', center: [24.5854, 73.7125], zoom: 12, aqi: 44, aqiStatus: 'Good', temp: '25°C', weather: 'Pleasant Breeze', rainProb: '5%', wind: '10 km/h NE', humidity: '46%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'Lake Area Eco-Transit', incidents: 0, healthScore: 97, population: '650K', district: 'Udaipur' },
    { id: 'kota', name: 'Kota Chambal Riverfront', state: 'Rajasthan', center: [25.2138, 75.8648], zoom: 12, aqi: 62, aqiStatus: 'Satisfactory', temp: '28°C', weather: 'Clear', rainProb: '5%', wind: '11 km/h E', humidity: '42%', trafficSpeed: '36 km/h', congestion: 'Moderate', transitStatus: 'Riverfront Corridor Flow', incidents: 1, healthScore: 90, population: '1.2M', district: 'Kota' }
  ],
  'Tamil Nadu': [
    { id: 'chennai', name: 'Chennai (Marina & OMR Corridor)', state: 'Tamil Nadu', center: [13.0827, 80.2707], zoom: 12, aqi: 58, aqiStatus: 'Good', temp: '30°C', weather: 'Humid & Coastal', rainProb: '25%', wind: '20 km/h SE', humidity: '76%', trafficSpeed: '28 km/h', congestion: 'Moderate', transitStatus: 'CMRL Metro Line 1 & 2', incidents: 2, healthScore: 85, population: '11.5M', district: 'Chennai' },
    { id: 'coimbatore', name: 'Coimbatore (Tech & Industry)', state: 'Tamil Nadu', center: [11.0168, 76.9558], zoom: 12, aqi: 36, aqiStatus: 'Clean', temp: '24°C', weather: 'Mild & Breezy', rainProb: '15%', wind: '12 km/h W', humidity: '64%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'Electric Fleet Active', incidents: 0, healthScore: 96, population: '2.8M', district: 'Coimbatore' },
    { id: 'madurai', name: 'Madurai Temple City', state: 'Tamil Nadu', center: [9.9252, 78.1198], zoom: 12, aqi: 48, aqiStatus: 'Good', temp: '31°C', weather: 'Sunny', rainProb: '10%', wind: '14 km/h S', humidity: '60%', trafficSpeed: '38 km/h', congestion: 'Smooth', transitStatus: 'Heritage Transit Normal', incidents: 1, healthScore: 91, population: '1.7M', district: 'Madurai' }
  ],
  'Telangana & AP': [
    { id: 'hyderabad', name: 'Hyderabad (Hitec City & Cyberabad)', state: 'Telangana & AP', center: [17.3850, 78.4867], zoom: 12, aqi: 62, aqiStatus: 'Satisfactory', temp: '26°C', weather: 'Partly Cloudy', rainProb: '15%', wind: '14 km/h SE', humidity: '58%', trafficSpeed: '28 km/h', congestion: 'Moderate', transitStatus: 'Hyderabad Metro 3 Lines', incidents: 2, healthScore: 87, population: '10.5M', district: 'Hyderabad' },
    { id: 'visakhapatnam', name: 'Visakhapatnam Port City', state: 'Telangana & AP', center: [17.6868, 83.2185], zoom: 12, aqi: 45, aqiStatus: 'Good', temp: '29°C', weather: 'Coastal Wind', rainProb: '20%', wind: '22 km/h E', humidity: '75%', trafficSpeed: '44 km/h', congestion: 'Smooth', transitStatus: 'BRTS & Port Transit', incidents: 0, healthScore: 94, population: '2.3M', district: 'Visakhapatnam' },
    { id: 'vijayawada', name: 'Vijayawada (Krishna Basin)', state: 'Telangana & AP', center: [16.5062, 80.6480], zoom: 12, aqi: 52, aqiStatus: 'Good', temp: '30°C', weather: 'Sunny', rainProb: '10%', wind: '12 km/h SE', humidity: '66%', trafficSpeed: '38 km/h', congestion: 'Smooth', transitStatus: 'Arterial Corridor Active', incidents: 1, healthScore: 90, population: '1.5M', district: 'NTR District' }
  ],
  'Gujarat': [
    { id: 'ahmedabad', name: 'Ahmedabad (Sabarmati Riverfront)', state: 'Gujarat', center: [23.0225, 72.5714], zoom: 12, aqi: 95, aqiStatus: 'Satisfactory', temp: '29°C', weather: 'Dry & Clear', rainProb: '0%', wind: '15 km/h NW', humidity: '42%', trafficSpeed: '32 km/h', congestion: 'Moderate', transitStatus: 'Ahmedabad Metro & Janmarg', incidents: 2, healthScore: 86, population: '8.4M', district: 'Ahmedabad' },
    { id: 'surat', name: 'Surat Diamond & Textile City', state: 'Gujarat', center: [21.1702, 72.8311], zoom: 12, aqi: 65, aqiStatus: 'Satisfactory', temp: '30°C', weather: 'Humid & Clear', rainProb: '10%', wind: '18 km/h SW', humidity: '68%', trafficSpeed: '40 km/h', congestion: 'Smooth', transitStatus: 'BRTS Network Active', incidents: 1, healthScore: 91, population: '7.8M', district: 'Surat' },
    { id: 'vadodara', name: 'Vadodara Cultural Capital', state: 'Gujarat', center: [22.3072, 73.1812], zoom: 12, aqi: 58, aqiStatus: 'Good', temp: '28°C', weather: 'Sunny', rainProb: '0%', wind: '12 km/h W', humidity: '48%', trafficSpeed: '45 km/h', congestion: 'Smooth', transitStatus: 'City Mobility Normal', incidents: 0, healthScore: 93, population: '2.1M', district: 'Vadodara' }
  ],
  'Uttar Pradesh': [
    { id: 'lucknow', name: 'Lucknow (Gomti Nagar & Hazratganj)', state: 'Uttar Pradesh', center: [26.8467, 80.9462], zoom: 12, aqi: 118, aqiStatus: 'Moderate', temp: '27°C', weather: 'Hazy Sun', rainProb: '5%', wind: '10 km/h E', humidity: '55%', trafficSpeed: '30 km/h', congestion: 'Moderate', transitStatus: 'Lucknow Metro Operational', incidents: 2, healthScore: 84, population: '3.8M', district: 'Lucknow' },
    { id: 'varanasi', name: 'Varanasi (Kashi Corridor & Ghats)', state: 'Uttar Pradesh', center: [25.3176, 82.9739], zoom: 12, aqi: 105, aqiStatus: 'Moderate', temp: '27.5°C', weather: 'Clear', rainProb: '0%', wind: '8 km/h E', humidity: '50%', trafficSpeed: '20 km/h', congestion: 'Dense', transitStatus: 'Ropeway & Heritage Transit', incidents: 2, healthScore: 82, population: '1.6M', district: 'Varanasi' },
    { id: 'kanpur', name: 'Kanpur Industrial Hub', state: 'Uttar Pradesh', center: [26.4499, 80.3319], zoom: 12, aqi: 135, aqiStatus: 'Moderate', temp: '27°C', weather: 'Partly Sunny', rainProb: '5%', wind: '11 km/h NE', humidity: '56%', trafficSpeed: '28 km/h', congestion: 'Moderate', transitStatus: 'Kanpur Metro Orange Line', incidents: 3, healthScore: 79, population: '3.2M', district: 'Kanpur Nagar' },
    { id: 'agra', name: 'Agra (Taj Heritage Corridor)', state: 'Uttar Pradesh', center: [27.1767, 78.0081], zoom: 12, aqi: 98, aqiStatus: 'Satisfactory', temp: '28°C', weather: 'Sunny', rainProb: '0%', wind: '12 km/h NW', humidity: '44%', trafficSpeed: '36 km/h', congestion: 'Smooth', transitStatus: 'Agra Metro Yellow Line', incidents: 1, healthScore: 88, population: '2.0M', district: 'Agra' }
  ],
  'West Bengal': [
    { id: 'kolkata', name: 'Kolkata (Howrah & Salt Lake Sector V)', state: 'West Bengal', center: [22.5726, 88.3639], zoom: 12, aqi: 88, aqiStatus: 'Satisfactory', temp: '28°C', weather: 'Humid & Overcast', rainProb: '30%', wind: '15 km/h S', humidity: '80%', trafficSpeed: '20 km/h', congestion: 'Dense', transitStatus: 'Kolkata Underwater Metro', incidents: 3, healthScore: 80, population: '15.1M', district: 'Kolkata' },
    { id: 'siliguri', name: 'Siliguri Corridor & Dooars', state: 'West Bengal', center: [26.7271, 88.3953], zoom: 12, aqi: 35, aqiStatus: 'Clean', temp: '22°C', weather: 'Foothills Breeze', rainProb: '20%', wind: '10 km/h N', humidity: '70%', trafficSpeed: '45 km/h', congestion: 'Smooth', transitStatus: 'Highway Transit Flow', incidents: 0, healthScore: 97, population: '900K', district: 'Darjeeling & Jalpaiguri' }
  ],
  'Madhya Pradesh': [
    { id: 'indore', name: 'Indore (Cleanest City of India)', state: 'Madhya Pradesh', center: [22.7196, 75.8577], zoom: 12, aqi: 38, aqiStatus: 'Clean & Pristine', temp: '25°C', weather: 'Clear Sky', rainProb: '0%', wind: '12 km/h W', humidity: '46%', trafficSpeed: '44 km/h', congestion: 'Smooth', transitStatus: 'iBus BRTS & Metro Yellow Line', incidents: 0, healthScore: 99, population: '3.3M', district: 'Indore' },
    { id: 'bhopal', name: 'Bhopal City of Lakes', state: 'Madhya Pradesh', center: [23.2599, 77.4126], zoom: 12, aqi: 48, aqiStatus: 'Good', temp: '26°C', weather: 'Pleasant', rainProb: '5%', wind: '11 km/h NW', humidity: '52%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'Bhopal Metro Line 1 Active', incidents: 1, healthScore: 94, population: '2.4M', district: 'Bhopal' }
  ],
  'Kerala': [
    { id: 'kochi', name: 'Kochi (Marine Drive & Water Metro)', state: 'Kerala', center: [9.9312, 76.2673], zoom: 12, aqi: 30, aqiStatus: 'Good', temp: '28°C', weather: 'Coastal Wind', rainProb: '40%', wind: '20 km/h SW', humidity: '84%', trafficSpeed: '32 km/h', congestion: 'Moderate', transitStatus: 'Kochi Water Metro & Rail', incidents: 1, healthScore: 96, population: '2.1M', district: 'Ernakulam' },
    { id: 'trivandrum', name: 'Thiruvananthapuram Capital', state: 'Kerala', center: [8.5241, 76.9366], zoom: 12, aqi: 28, aqiStatus: 'Clean', temp: '29°C', weather: 'Coastal Breeze', rainProb: '30%', wind: '18 km/h S', humidity: '78%', trafficSpeed: '40 km/h', congestion: 'Smooth', transitStatus: 'KSRTC Electric Fleet', incidents: 0, healthScore: 98, population: '1.2M', district: 'Thiruvananthapuram' }
  ],
  'Punjab & Chandigarh': [
    { id: 'chandigarh', name: 'Chandigarh (The City Beautiful)', state: 'Punjab & Chandigarh', center: [30.7333, 76.7794], zoom: 12, aqi: 52, aqiStatus: 'Good', temp: '24°C', weather: 'Pleasant & Clean', rainProb: '0%', wind: '10 km/h N', humidity: '48%', trafficSpeed: '50 km/h', congestion: 'Smooth', transitStatus: 'CTU Green Buses', incidents: 0, healthScore: 97, population: '1.2M', district: 'Chandigarh UT' },
    { id: 'amritsar', name: 'Amritsar Heritage Core', state: 'Punjab & Chandigarh', center: [31.6340, 74.8723], zoom: 12, aqi: 85, aqiStatus: 'Satisfactory', temp: '25°C', weather: 'Clear', rainProb: '0%', wind: '12 km/h NW', humidity: '52%', trafficSpeed: '34 km/h', congestion: 'Moderate', transitStatus: 'BRTS Corridor', incidents: 1, healthScore: 90, population: '1.4M', district: 'Amritsar' }
  ],
  'Himachal & Uttarakhand': [
    { id: 'shimla', name: 'Shimla Ridge & Mall Road', state: 'Himachal & Uttarakhand', center: [31.1048, 77.1734], zoom: 13, aqi: 20, aqiStatus: 'Pure Mountain Air', temp: '16°C', weather: 'Crisp & Cool', rainProb: '10%', wind: '14 km/h N', humidity: '55%', trafficSpeed: '22 km/h', congestion: 'Pedestrian / Slow', transitStatus: 'Toy Train & Electric Cabs', incidents: 0, healthScore: 99, population: '220K', district: 'Shimla' },
    { id: 'dehradun', name: 'Dehradun Valley & Mussoorie Gate', state: 'Himachal & Uttarakhand', center: [30.3165, 78.0322], zoom: 12, aqi: 42, aqiStatus: 'Good', temp: '22°C', weather: 'Pleasant Valley Breeze', rainProb: '15%', wind: '11 km/h NE', humidity: '60%', trafficSpeed: '40 km/h', congestion: 'Smooth', transitStatus: 'Valley Smart Buses', incidents: 0, healthScore: 96, population: '800K', district: 'Dehradun' }
  ],
  'Bihar & Jharkhand': [
    { id: 'patna', name: 'Patna (Ganga Riverfront & Boring Rd)', state: 'Bihar & Jharkhand', center: [25.5941, 85.1376], zoom: 12, aqi: 125, aqiStatus: 'Moderate', temp: '27°C', weather: 'Hazy', rainProb: '5%', wind: '8 km/h E', humidity: '62%', trafficSpeed: '26 km/h', congestion: 'Moderate', transitStatus: 'Patna Metro Construction', incidents: 2, healthScore: 81, population: '2.5M', district: 'Patna' },
    { id: 'ranchi', name: 'Ranchi Smart Plateau', state: 'Bihar & Jharkhand', center: [23.3441, 85.3096], zoom: 12, aqi: 45, aqiStatus: 'Good', temp: '23°C', weather: 'Cool & Pleasant', rainProb: '10%', wind: '12 km/h E', humidity: '58%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'City Mobility Normal', incidents: 0, healthScore: 95, population: '1.4M', district: 'Ranchi' }
  ],
  'Odisha': [
    { id: 'bhubaneswar', name: 'Bhubaneswar Temple & IT Hub', state: 'Odisha', center: [20.2961, 85.8245], zoom: 12, aqi: 48, aqiStatus: 'Good', temp: '28°C', weather: 'Sunny & Warm', rainProb: '15%', wind: '14 km/h SE', humidity: '68%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'Mo Bus Network Active', incidents: 1, healthScore: 94, population: '1.1M', district: 'Khurda' }
  ],
  'Goa': [
    { id: 'panaji', name: 'Panaji (Mandovi Riverfront)', state: 'Goa', center: [15.4909, 73.8278], zoom: 13, aqi: 24, aqiStatus: 'Pristine & Clean', temp: '29°C', weather: 'Tropical Sea Breeze', rainProb: '25%', wind: '16 km/h SW', humidity: '76%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'Ferry & EV Shuttle Active', incidents: 0, healthScore: 98, population: '115K', district: 'North Goa' },
    { id: 'margao', name: 'Margao Cultural Hub', state: 'Goa', center: [15.2832, 73.9862], zoom: 13, aqi: 28, aqiStatus: 'Good', temp: '29°C', weather: 'Partly Sunny', rainProb: '20%', wind: '14 km/h W', humidity: '74%', trafficSpeed: '40 km/h', congestion: 'Smooth', transitStatus: 'Konkan Rail Connect', incidents: 0, healthScore: 97, population: '105K', district: 'South Goa' }
  ],
  'Jammu & Kashmir': [
    { id: 'srinagar', name: 'Srinagar (Dal Lake & Boulevard)', state: 'Jammu & Kashmir', center: [34.0837, 74.7973], zoom: 12, aqi: 18, aqiStatus: 'Pure Alpine Air', temp: '14°C', weather: 'Crisp & Mountain Clear', rainProb: '10%', wind: '8 km/h NW', humidity: '50%', trafficSpeed: '30 km/h', congestion: 'Smooth', transitStatus: 'Electric Smart Bus Active', incidents: 0, healthScore: 99, population: '1.4M', district: 'Srinagar' },
    { id: 'jammu', name: 'Jammu (Tawi River Basin)', state: 'Jammu & Kashmir', center: [32.7266, 74.8570], zoom: 12, aqi: 42, aqiStatus: 'Good', temp: '24°C', weather: 'Clear Sky', rainProb: '5%', wind: '10 km/h NE', humidity: '48%', trafficSpeed: '38 km/h', congestion: 'Smooth', transitStatus: 'Smart Mobility Corridor', incidents: 0, healthScore: 95, population: '700K', district: 'Jammu' }
  ],
  'Chhattisgarh': [
    { id: 'raipur', name: 'Raipur (Nava Raipur Smart City)', state: 'Chhattisgarh', center: [21.2514, 81.6296], zoom: 12, aqi: 56, aqiStatus: 'Satisfactory', temp: '28°C', weather: 'Sunny & Warm', rainProb: '5%', wind: '10 km/h E', humidity: '52%', trafficSpeed: '46 km/h', congestion: 'Smooth', transitStatus: 'BRTS Express Active', incidents: 1, healthScore: 92, population: '1.8M', district: 'Raipur' }
  ],
  'Andhra Pradesh': [
    { id: 'visakhapatnam', name: 'Visakhapatnam (Smart Port & Beach Rd)', state: 'Andhra Pradesh', center: [17.6868, 83.2185], zoom: 12, aqi: 45, aqiStatus: 'Good', temp: '29°C', weather: 'Coastal Breeze', rainProb: '20%', wind: '22 km/h E', humidity: '75%', trafficSpeed: '44 km/h', congestion: 'Smooth', transitStatus: 'BRTS & Port Corridor', incidents: 0, healthScore: 94, population: '2.3M', district: 'Visakhapatnam' },
    { id: 'vijayawada', name: 'Vijayawada (Prakasam Barrage)', state: 'Andhra Pradesh', center: [16.5062, 80.6480], zoom: 12, aqi: 52, aqiStatus: 'Good', temp: '30°C', weather: 'Sunny', rainProb: '10%', wind: '12 km/h SE', humidity: '66%', trafficSpeed: '38 km/h', congestion: 'Smooth', transitStatus: 'Arterial Transit Flow', incidents: 1, healthScore: 90, population: '1.5M', district: 'NTR District' },
    { id: 'tirupati', name: 'Tirupati Heritage Valley', state: 'Andhra Pradesh', center: [13.6288, 79.4192], zoom: 12, aqi: 36, aqiStatus: 'Good', temp: '29°C', weather: 'Pleasant & Warm', rainProb: '15%', wind: '14 km/h S', humidity: '62%', trafficSpeed: '40 km/h', congestion: 'Smooth', transitStatus: 'Pilgrim EV Mobility Fleet', incidents: 0, healthScore: 96, population: '460K', district: 'Tirupati' }
  ],
  'Haryana': [
    { id: 'gurugram', name: 'Gurugram Cyber Hub & Golf Course Rd', state: 'Haryana', center: [28.4595, 77.0266], zoom: 12, aqi: 156, aqiStatus: 'Unhealthy for Sensitive', temp: '27°C', weather: 'Hazy Sun', rainProb: '20%', wind: '15 km/h W', humidity: '60%', trafficSpeed: '22 km/h', congestion: 'Heavy', transitStatus: 'Rapid Metro & Gurugaman', incidents: 4, healthScore: 76, population: '1.5M', district: 'Gurugram' },
    { id: 'faridabad', name: 'Faridabad Industrial Expressway', state: 'Haryana', center: [28.4089, 77.3178], zoom: 12, aqi: 145, aqiStatus: 'Moderate', temp: '27°C', weather: 'Clear', rainProb: '5%', wind: '11 km/h W', humidity: '52%', trafficSpeed: '42 km/h', congestion: 'Smooth', transitStatus: 'Violet Line Normal', incidents: 2, healthScore: 82, population: '1.9M', district: 'Faridabad' },
    { id: 'panipat', name: 'Panipat Textile Hub', state: 'Haryana', center: [29.3909, 76.9635], zoom: 12, aqi: 138, aqiStatus: 'Moderate', temp: '26°C', weather: 'Sunny', rainProb: '5%', wind: '12 km/h NW', humidity: '50%', trafficSpeed: '44 km/h', congestion: 'Smooth', transitStatus: 'NH44 Mobility Flow', incidents: 1, healthScore: 84, population: '500K', district: 'Panipat' }
  ]
}

/**
 * Find city in curated preset database by name or keyword
 */
export function findIndianCityInPresets(searchTerm) {
  if (!searchTerm || typeof searchTerm !== 'string') return null
  const query = searchTerm.trim().toLowerCase()
  
  for (const [stateName, cities] of Object.entries(INDIAN_STATES_AND_CITIES)) {
    for (const city of cities) {
      if (
        city.name.toLowerCase().includes(query) ||
        city.id.toLowerCase().includes(query) ||
        (city.district && city.district.toLowerCase().includes(query)) ||
        stateName.toLowerCase().includes(query)
      ) {
        return { ...city, state: stateName }
      }
    }
  }
  return null
}

/**
 * Fetch real live meteorology and geographic coordinates for any custom Indian city
 */
export async function resolveCustomCityLive(query) {
  if (!query || !query.trim()) return null
  const cleanQuery = query.trim()

  // 1. First check preset dictionary for instant lock
  const presetMatch = findIndianCityInPresets(cleanQuery)
  if (presetMatch) {
    // Also attempt to fetch real live Open-Meteo weather for exact preset lat/lng
    try {
      const [lat, lng] = presetMatch.center
      const meteoRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`
      )
      if (meteoRes.ok) {
        const meteoData = await meteoRes.json()
        const cur = meteoData.current
        if (cur) {
          const weatherDesc = getWeatherDescriptionFromCode(cur.weather_code)
          return {
            ...presetMatch,
            temp: `${Math.round(cur.temperature_2m)}°C`,
            weather: weatherDesc,
            wind: `${Math.round(cur.wind_speed_10m)} km/h`,
            humidity: `${Math.round(cur.relative_humidity_2m)}%`,
            rainProb: cur.precipitation > 0 ? `${Math.min(95, Math.round(cur.precipitation * 25))}%` : '5%',
            liveMeteo: true
          }
        }
      }
    } catch (e) {
      console.warn('Open-Meteo live query skipped, using preset baseline:', e)
    }
    return presetMatch
  }

  // 2. Query OpenStreetMap Nominatim for Indian coordinate resolution
  try {
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery + ', India')}&format=json&addressdetails=1&limit=1`
    const geoRes = await fetch(geoUrl, {
      headers: { 'Accept-Language': 'en' }
    })
    
    if (geoRes.ok) {
      const geoResults = await geoRes.json()
      if (geoResults && geoResults.length > 0) {
        const item = geoResults[0]
        const lat = parseFloat(item.lat)
        const lng = parseFloat(item.lon)
        const addr = item.address || {}
        const detectedState = addr.state || addr.state_district || 'India'
        const detectedDistrict = addr.county || addr.state_district || addr.city || cleanQuery

        // 3. Fetch real live weather from Open-Meteo
        let liveTemp = '26°C'
        let liveWeather = 'Clear & Pleasant'
        let liveWind = '12 km/h'
        let liveHumidity = '55%'
        let liveRainProb = '10%'

        try {
          const meteoRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`
          )
          if (meteoRes.ok) {
            const meteoData = await meteoRes.json()
            const cur = meteoData.current
            if (cur) {
              liveTemp = `${Math.round(cur.temperature_2m)}°C`
              liveWeather = getWeatherDescriptionFromCode(cur.weather_code)
              liveWind = `${Math.round(cur.wind_speed_10m)} km/h`
              liveHumidity = `${Math.round(cur.relative_humidity_2m)}%`
              liveRainProb = cur.precipitation > 0 ? `${Math.min(95, Math.round(cur.precipitation * 25))}%` : '5%'
            }
          }
        } catch (meteoErr) {
          console.warn('Open-Meteo fetch error:', meteoErr)
        }

        // Synthesize realistic civic baseline for newly searched city
        const estimatedAqi = Math.round(40 + Math.random() * 80)
        const aqiCategory = estimatedAqi < 50 ? 'Good' : estimatedAqi < 100 ? 'Satisfactory' : 'Moderate'

        return {
          id: cleanQuery.toLowerCase().replace(/\s+/g, '-'),
          name: `${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)} (${detectedDistrict})`,
          state: detectedState,
          district: detectedDistrict,
          center: [lat, lng],
          zoom: 12,
          aqi: estimatedAqi,
          aqiStatus: aqiCategory,
          temp: liveTemp,
          weather: liveWeather,
          rainProb: liveRainProb,
          wind: liveWind,
          humidity: liveHumidity,
          trafficSpeed: '38 km/h',
          congestion: 'Smooth',
          transitStatus: 'City Mobility & State Transport Active',
          incidents: Math.floor(Math.random() * 2),
          healthScore: Math.round(88 + Math.random() * 10),
          population: 'Regional Urban Zone',
          liveMeteo: true,
          isCustomSearch: true
        }
      }
    }
  } catch (err) {
    console.error('Nominatim search failed:', err)
  }

  return null
}

function getWeatherDescriptionFromCode(code) {
  if (code === 0) return 'Clear & Sunny Sky'
  if (code === 1 || code === 2) return 'Mainly Clear & Pleasant'
  if (code === 3) return 'Partly Overcast'
  if (code >= 45 && code <= 48) return 'Hazy & Mild Fog'
  if (code >= 51 && code <= 55) return 'Light Drizzle / Showers'
  if (code >= 61 && code <= 65) return 'Active Rainfall Cell'
  if (code >= 80 && code <= 82) return 'Moderate Rain Showers'
  if (code >= 95) return 'Thunderstorm Activity'
  return 'Clear & Sunny'
}


export const SECTOR_VISUALS = {
  'zone-1': {
    id: 'zone-1',
    name: 'North Uptown & Yamuna Riverfront',
    district: 'Noida Sector 62 / Mayur Vihar Bayside',
    code: 'SEC-01',
    coords: '28.6280° N, 77.3649° E',
    lat: 28.6280,
    lng: 77.3649,
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80',
    tags: ['Yamuna Basin', 'Residential Tech Hub', 'Metro Line'],
    population: '242,500',
    landmarks: ['Sector 62 Tech Park', 'Yamuna Expressway Gate', 'Bayside Terminal'],
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950/40 via-slate-900 to-slate-950',
    accentBorder: 'border-cyan-500/40'
  },
  'zone-2': {
    id: 'zone-2',
    name: 'West Park Transit Corridor',
    district: 'Connaught Place & Ring Road Arterial',
    code: 'SEC-02',
    coords: '28.6315° N, 77.2167° E',
    lat: 28.6315,
    lng: 77.2167,
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=400&q=80',
    tags: ['Delhi Metro Hub', 'Inner Ring Road', 'Commercial Plaza'],
    population: '318,200',
    landmarks: ['Rajiv Chowk Metro Interchange', 'Barakhamba Boulevard', 'Central Park'],
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    accentBorder: 'border-emerald-500/40'
  },
  'zone-3': {
    id: 'zone-3',
    name: 'Downtown Civic Core',
    district: 'ITO & Pragati Maidan Underpass',
    code: 'SEC-03',
    coords: '28.6248° N, 77.2435° E',
    lat: 28.6248,
    lng: 77.2435,
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=80',
    tags: ['Underpass Drainage', 'Civic Headquarters', 'High Traffic'],
    population: '286,000',
    landmarks: ['Pragati Maidan Tunnel', 'ITO Crossing', 'Vikas Marg Flyover'],
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950/40 via-slate-900 to-slate-950',
    accentBorder: 'border-amber-500/40'
  },
  'zone-4': {
    id: 'zone-4',
    name: 'East River Industrial Grid',
    district: 'Okhla Phase III & Patparganj Logistics',
    code: 'SEC-04',
    coords: '28.5355° N, 77.2715° E',
    lat: 28.5355,
    lng: 77.2715,
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=400&q=80',
    tags: ['400kV Power Grid', 'Cargo Logistics', 'Industrial Depot'],
    population: '144,000',
    landmarks: ['Okhla Substation 4', 'Patparganj Inland Container Depot', 'Industrial Gate 5'],
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-950/40 via-slate-900 to-slate-950',
    accentBorder: 'border-purple-500/40'
  }
}

export const CITIZEN_PHOTO_FEED = [
  {
    id: 'rep-01',
    zone: 'zone-3',
    zoneName: 'Downtown Civic Core (ITO Underpass)',
    category: 'Flooding & Drainage',
    icon: 'Droplets',
    title: 'Pragati Maidan Underpass Waterlogging (1.2m)',
    description: 'Severe storm runoff accumulation near the south underpass ramp. Two sedans stalled, traffic diverted via Ring Road.',
    photo: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    timeAgo: '4 mins ago',
    verified: true,
    upvotes: 42,
    severity: 'high',
    status: 'In Progress',
    coordinates: '28.6248° N, 77.2435° E',
    lat: 28.6248,
    lng: 77.2435
  },
  {
    id: 'rep-02',
    zone: 'zone-3',
    zoneName: 'Downtown Civic Core',
    category: 'Traffic Infrastructure',
    icon: 'AlertTriangle',
    title: 'Traffic Signals Out at ITO & Vikas Marg',
    description: 'Flashing dark signals creating gridlock across 4 intersections following power fluctuation.',
    photo: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    timeAgo: '12 mins ago',
    verified: true,
    upvotes: 28,
    severity: 'medium',
    status: 'Dispatched',
    coordinates: '28.6290° N, 77.2410° E',
    lat: 28.6290,
    lng: 77.2410
  },
  {
    id: 'rep-03',
    zone: 'zone-2',
    zoneName: 'West Park Transit Corridor',
    category: 'Transit Line',
    icon: 'Train',
    title: 'Delhi Metro Blue Line Overhead Cable Inspection',
    description: 'Tree branch fallen across overhead power line near Rajiv Chowk. Trains running 15 min delays.',
    photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    timeAgo: '19 mins ago',
    verified: true,
    upvotes: 19,
    severity: 'medium',
    status: 'Crew En Route',
    coordinates: '28.6328° N, 77.2195° E',
    lat: 28.6328,
    lng: 77.2195
  },
  {
    id: 'rep-04',
    zone: 'zone-4',
    zoneName: 'East River Industrial Grid',
    category: 'Power & Utility',
    icon: 'Zap',
    title: 'Substation Transformer Sparking near Okhla Phase 3',
    description: 'Audible hum and sparks observed on utility pole. Grid monitoring team notified.',
    photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    timeAgo: '35 mins ago',
    verified: true,
    upvotes: 35,
    severity: 'high',
    status: 'Investigating',
    coordinates: '28.5360° N, 77.2720° E',
    lat: 28.5360,
    lng: 77.2720
  },
  {
    id: 'rep-05',
    zone: 'zone-1',
    zoneName: 'North Uptown & Yamuna Riverfront',
    category: 'Air & Environment',
    icon: 'Wind',
    title: 'High Yamuna Flood Water Level Alert near Okhla Barrage',
    description: 'Water level reached 205.33m warning mark due to upstream discharge. Coastal alert active.',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    timeAgo: '48 mins ago',
    verified: true,
    upvotes: 14,
    severity: 'low',
    status: 'Monitoring',
    coordinates: '28.6295° N, 77.3620° E',
    lat: 28.6295,
    lng: 77.3620
  }
]

export const SAMPLE_UPLOAD_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    label: 'Flooded Road / Underpass'
  },
  {
    url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    label: 'Traffic Signal Outage'
  },
  {
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    label: 'Transformer / Power Spark'
  },
  {
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    label: 'Metro Transit Delay'
  },
  {
    url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
    label: 'Road Pothole / Hazard'
  }
]

export const TRANSIT_LINES_DATA = [
  {
    id: 'line-m1',
    name: 'Delhi Metro Blue Line (Noida Electronic City - Dwarka)',
    type: 'Metro Rail',
    color: '#3b82f6',
    status: 'Normal',
    speed: '48 km/h',
    punctuality: '98%',
    stations: ['Noida Sec 62', 'Mayur Vihar', 'Mandi House', 'Rajiv Chowk'],
    activeDelays: 0
  },
  {
    id: 'line-m2',
    name: 'Delhi Metro Yellow Line (Samaypur Badli - Millennium City)',
    type: 'Metro Rail',
    color: '#eab308',
    status: 'Delay (+18 min)',
    speed: '22 km/h',
    punctuality: '74%',
    stations: ['Kashmere Gate', 'Chandni Chowk', 'Rajiv Chowk', 'Hauz Khas'],
    activeDelays: 2,
    issue: 'Water accumulation on track switch near Pragati Maidan tunnel'
  },
  {
    id: 'line-m3',
    name: 'DTC Electric Rapid Transit Bus (Ring Road Express)',
    type: 'Electric Bus',
    color: '#10b981',
    status: 'Normal',
    speed: '38 km/h',
    punctuality: '92%',
    stations: ['ISBT Kashmere Gate', 'ITO', 'AIIMS', 'Dhaula Kuan'],
    activeDelays: 0
  }
]

export const OFFICIAL_RESPONDER_UNITS = [
  {
    id: 'NDRF-12',
    name: 'NDRF / Delhi Fire Service (High-Cap Pump 12)',
    type: 'Disaster Drainage',
    status: 'On Scene',
    location: 'ITO & Pragati Maidan Underpass (Zone 3)',
    eta: 'Active',
    assignedIncident: 'P1 Flash Flood Waterlogging (1.2m)',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'DTP-04',
    name: 'Delhi Traffic Police Mobile Unit 4',
    type: 'Traffic Ops',
    status: 'En Route',
    location: 'Vikas Marg / Ring Road Flyover',
    eta: '4 mins',
    assignedIncident: 'Traffic Diversion & Perimeter',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'BSES-02',
    name: 'BSES / Tata Power Grid Rapid Unit 2',
    type: 'Utility Grid',
    status: 'Standby',
    location: 'Okhla Phase III Substation (Zone 4)',
    eta: 'Available',
    assignedIncident: 'None (Monitoring 400kV Transformer #4)',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'PCR-08',
    name: 'Delhi Police PCR Van 8',
    type: 'Public Safety',
    status: 'On Scene',
    location: 'Connaught Place Outer Circle',
    eta: 'Active',
    assignedIncident: 'Citizen Safety & Pedestrian Guidance',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  }
]

export const SIMULATION_SCENARIOS = [
  {
    id: 'storm_flood',
    title: 'Monsoon Cloudburst & Underpass Surge',
    zone: 'zone-3',
    icon: 'CloudLightning',
    category: 'Severe Weather + Transit',
    badge: 'High Impact Demo',
    color: 'from-rose-500/20 to-amber-500/20 border-rose-500/40',
    description: 'Simulates 58mm/h heavy monsoon rainfall, ITO underpass waterlogging, 311 complaint spike, and Blue Line delay.'
  },
  {
    id: 'power_outage',
    title: 'Okhla Substation Grid Outage',
    zone: 'zone-4',
    icon: 'ZapOff',
    category: 'Infrastructure Failure',
    badge: 'Cross-Domain',
    color: 'from-amber-500/20 to-purple-500/20 border-amber-500/40',
    description: 'Triggers 400kV transformer trip, dark traffic signals on Mathura Road, industrial complaint influx.'
  },
  {
    id: 'rush_hour_congestion',
    title: 'Peak Ring Road Gridlock',
    zone: 'zone-2',
    icon: 'Car',
    category: 'Mobility Bottleneck',
    badge: 'Traffic Co-occurrence',
    color: 'from-sky-500/20 to-emerald-500/20 border-sky-500/40',
    description: 'Spikes traffic congestion to 88% on Connaught Place / Ring Road, triggers DTC bus delays.'
  },
  {
    id: 'heat_wave',
    title: 'Summer Heat & PM2.5 AQI Spike',
    zone: 'zone-1',
    icon: 'SunMedium',
    category: 'Environment & Health',
    badge: 'Environmental',
    color: 'from-orange-500/20 to-red-500/20 border-orange-500/40',
    description: 'Elevates temperature to 42°C, spikes AQI PM2.5 to 220 (Severe), and generates public health advisories.'
  }
]

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
}
