async function testOSRM() {
  const points = [
    { latitude: 14.5843, longitude: 121.0573 }, // MMDA Head Office
    { latitude: 14.5847, longitude: 121.0567 }, // EDSA corner Julia Vargas
    { latitude: 14.5888, longitude: 121.0583 }, // Ortigas Station
    { latitude: 14.5956, longitude: 121.0586 }, // EDSA Corinthian
    { latitude: 14.6083, longitude: 121.0560 }, // Santolan Station
    { latitude: 14.6150, longitude: 121.0535 }, // EDSA P. Tuazon
    { latitude: 14.6186, longitude: 121.0519 }, // Cubao Station
    { latitude: 14.6265, longitude: 121.0475 }, // EDSA Nepa Q-Mart
    { latitude: 14.6346, longitude: 121.0435 }, // GMA Kamuning Station
    { latitude: 14.6355, longitude: 121.0430 }, // Studio 7 DICT
  ];
  
  const coordsStr = points.map(p => `${p.longitude},${p.latitude}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/foot/${coordsStr}?overview=full&geometries=geojson`;
  
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.code);
    if (data.routes && data.routes.length > 0) {
      console.log('Got coordinates:', data.routes[0].geometry.coordinates.length);
      // Let's print out the distance to see if it's reasonable (~6km)
      console.log('Distance:', data.routes[0].distance);
    }
  } catch (e) {
    console.error(e);
  }
}

testOSRM();
