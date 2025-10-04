const fs = require('fs')
const path = require('path')

// Ensure the public/api directory exists
const apiDir = path.join(__dirname, '..', 'public', 'api')
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true })
}

// Generate additional missions data
const generateMissions = () => {
  const missions = [
    {
      id: 'james-webb',
      name: 'James Webb Space Telescope',
      description: 'The most powerful space telescope ever built, designed to study the formation of stars and planets.',
      launchYear: 2021,
      launchDate: '2021-12-25',
      status: 'Active',
      type: 'Space Telescope',
      launchVehicle: 'Ariane 5',
      launchSite: 'Guiana Space Centre',
      duration: '10+ years',
      cost: '$10 billion',
      objectives: [
        'Study the formation of stars and planets',
        'Investigate the origins of life',
        'Observe the first galaxies formed after the Big Bang'
      ],
      achievements: [
        'Successfully deployed in space',
        'Captured first deep field images',
        'Discovered new exoplanets'
      ],
      website: 'https://webb.nasa.gov',
      nasaPage: 'https://www.nasa.gov/mission_pages/webb/main/index.html',
      wikiPage: 'https://en.wikipedia.org/wiki/James_Webb_Space_Telescope',
      image: '/assets/missions/james-webb.jpg'
    },
    {
      id: 'perseverance',
      name: 'Mars Perseverance Rover',
      description: 'A Mars rover designed to search for signs of ancient life and collect samples for future return to Earth.',
      launchYear: 2020,
      launchDate: '2020-07-30',
      status: 'Active',
      type: 'Mars Rover',
      launchVehicle: 'Atlas V',
      launchSite: 'Cape Canaveral',
      duration: '2+ years',
      cost: '$2.7 billion',
      objectives: [
        'Search for signs of ancient microbial life',
        'Collect and cache Martian rock and soil samples',
        'Test technologies for future human exploration'
      ],
      achievements: [
        'Successfully landed on Mars',
        'Deployed Ingenuity helicopter',
        'Collected first rock samples'
      ],
      website: 'https://mars.nasa.gov/mars2020',
      nasaPage: 'https://www.nasa.gov/perseverance',
      wikiPage: 'https://en.wikipedia.org/wiki/Perseverance_(rover)',
      image: '/assets/missions/perseverance.jpg'
    },
    {
      id: 'artemis-i',
      name: 'Artemis I',
      description: 'The first integrated test of NASA\'s deep space exploration systems.',
      launchYear: 2022,
      launchDate: '2022-11-16',
      status: 'Completed',
      type: 'Lunar Mission',
      launchVehicle: 'Space Launch System',
      launchSite: 'Kennedy Space Center',
      duration: '25 days',
      cost: '$4.1 billion',
      objectives: [
        'Test the Space Launch System rocket',
        'Test the Orion spacecraft',
        'Demonstrate deep space exploration capabilities'
      ],
      achievements: [
        'Successful launch and mission completion',
        'Orion spacecraft traveled 1.4 million miles',
        'Validated systems for future crewed missions'
      ],
      website: 'https://www.nasa.gov/artemis-1',
      nasaPage: 'https://www.nasa.gov/artemis-1',
      wikiPage: 'https://en.wikipedia.org/wiki/Artemis_1',
      image: '/assets/missions/artemis-i.jpg'
    },
    {
      id: 'dart',
      name: 'DART Mission',
      description: 'The first mission to test planetary defense by deflecting an asteroid.',
      launchYear: 2021,
      launchDate: '2021-11-24',
      status: 'Completed',
      type: 'Planetary Defense',
      launchVehicle: 'Falcon 9',
      launchSite: 'Vandenberg Space Force Base',
      duration: '10 months',
      cost: '$324 million',
      objectives: [
        'Test kinetic impactor technique',
        'Deflect asteroid Didymos',
        'Demonstrate planetary defense capabilities'
      ],
      achievements: [
        'Successfully impacted asteroid Dimorphos',
        'Changed asteroid\'s orbit by 32 minutes',
        'Proved kinetic impactor technique works'
      ],
      website: 'https://dart.jhuapl.edu',
      nasaPage: 'https://www.nasa.gov/planetarydefense/dart',
      wikiPage: 'https://en.wikipedia.org/wiki/Double_Asteroid_Redirection_Test',
      image: '/assets/missions/dart.jpg'
    },
    {
      id: 'hubble',
      name: 'Hubble Space Telescope',
      description: 'A space telescope that has revolutionized our understanding of the universe.',
      launchYear: 1990,
      launchDate: '1990-04-24',
      status: 'Active',
      type: 'Space Telescope',
      launchVehicle: 'Space Shuttle Discovery',
      launchSite: 'Kennedy Space Center',
      duration: '30+ years',
      cost: '$4.7 billion',
      objectives: [
        'Study the universe in visible and ultraviolet light',
        'Investigate cosmic phenomena',
        'Support other space missions'
      ],
      achievements: [
        'Captured iconic images of the universe',
        'Helped determine the age of the universe',
        'Discovered new galaxies and phenomena'
      ],
      website: 'https://hubblesite.org',
      nasaPage: 'https://www.nasa.gov/mission_pages/hubble/main/index.html',
      wikiPage: 'https://en.wikipedia.org/wiki/Hubble_Space_Telescope',
      image: '/assets/missions/hubble.jpg'
    },
    {
      id: 'cassini-huygens',
      name: 'Cassini-Huygens',
      description: 'A mission to study Saturn and its moons, including the Huygens probe to Titan.',
      launchYear: 1997,
      launchDate: '1997-10-15',
      status: 'Completed',
      type: 'Planetary Mission',
      launchVehicle: 'Titan IVB',
      launchSite: 'Cape Canaveral',
      duration: '20 years',
      cost: '$3.26 billion',
      objectives: [
        'Study Saturn and its rings',
        'Explore Saturn\'s moons',
        'Land Huygens probe on Titan'
      ],
      achievements: [
        'Discovered new moons of Saturn',
        'Found evidence of subsurface ocean on Enceladus',
        'Successfully landed on Titan'
      ],
      website: 'https://solarsystem.nasa.gov/missions/cassini/overview',
      nasaPage: 'https://www.nasa.gov/mission_pages/cassini/main/index.html',
      wikiPage: 'https://en.wikipedia.org/wiki/Cassini%E2%80%93Huygens',
      image: '/assets/missions/cassini.jpg'
    }
  ]

  return missions
}

// Generate additional exoplanets data
const generateExoplanets = () => {
  const exoplanets = [
    {
      id: 'kepler-452b',
      name: 'Kepler-452b',
      discoveryYear: 2015,
      mass: 5.0,
      radius: 1.6,
      distance: 1400,
      temperature: 265,
      type: 'Super-Earth',
      habitable: true,
      starType: 'G-type',
      orbitalPeriod: 385,
      description: 'A potentially habitable exoplanet orbiting a Sun-like star.'
    },
    {
      id: 'proxima-centauri-b',
      name: 'Proxima Centauri b',
      discoveryYear: 2016,
      mass: 1.3,
      radius: 1.1,
      distance: 4.2,
      temperature: 234,
      type: 'Terrestrial',
      habitable: true,
      starType: 'M-type',
      orbitalPeriod: 11.2,
      description: 'The closest known exoplanet to Earth, potentially habitable.'
    },
    {
      id: 'trappist-1e',
      name: 'TRAPPIST-1e',
      discoveryYear: 2017,
      mass: 0.7,
      radius: 0.9,
      distance: 40,
      temperature: 251,
      type: 'Terrestrial',
      habitable: true,
      starType: 'M-type',
      orbitalPeriod: 6.1,
      description: 'One of seven Earth-sized planets in the TRAPPIST-1 system.'
    },
    {
      id: 'hd-209458-b',
      name: 'HD 209458 b',
      discoveryYear: 1999,
      mass: 0.7,
      radius: 1.4,
      distance: 159,
      temperature: 1130,
      type: 'Hot Jupiter',
      habitable: false,
      starType: 'G-type',
      orbitalPeriod: 3.5,
      description: 'The first exoplanet discovered by the transit method.'
    },
    {
      id: 'wasp-12b',
      name: 'WASP-12b',
      discoveryYear: 2008,
      mass: 1.4,
      radius: 1.9,
      distance: 870,
      temperature: 2250,
      type: 'Hot Jupiter',
      habitable: false,
      starType: 'G-type',
      orbitalPeriod: 1.1,
      description: 'An extremely hot exoplanet with a very short orbital period.'
    },
    {
      id: 'kepler-22b',
      name: 'Kepler-22b',
      discoveryYear: 2011,
      mass: 6.4,
      radius: 2.4,
      distance: 600,
      temperature: 262,
      type: 'Super-Earth',
      habitable: true,
      starType: 'G-type',
      orbitalPeriod: 290,
      description: 'The first confirmed exoplanet in the habitable zone of a Sun-like star.'
    }
  ]

  return exoplanets
}

// Generate additional satellites data
const generateSatellites = () => {
  const satellites = [
    {
      id: 'iss',
      name: 'International Space Station',
      type: 'Space Station',
      altitude: 408,
      inclination: 51.6,
      period: 93,
      velocity: 7.66,
      launchDate: '1998-11-20',
      status: 'Active',
      country: 'International',
      description: 'A modular space station in low Earth orbit.',
      latitude: 51.6,
      longitude: 0,
      image: '/assets/satellites/iss.jpg'
    },
    {
      id: 'hubble',
      name: 'Hubble Space Telescope',
      type: 'Space Telescope',
      altitude: 540,
      inclination: 28.5,
      period: 95,
      velocity: 7.5,
      launchDate: '1990-04-24',
      status: 'Active',
      country: 'USA',
      description: 'A space telescope that has revolutionized astronomy.',
      latitude: 28.5,
      longitude: 0,
      image: '/assets/satellites/hubble.jpg'
    },
    {
      id: 'gps-iiia-01',
      name: 'GPS IIIA-01',
      type: 'Navigation',
      altitude: 20200,
      inclination: 55,
      period: 720,
      velocity: 3.87,
      launchDate: '2018-12-23',
      status: 'Active',
      country: 'USA',
      description: 'First satellite in the GPS III constellation.',
      latitude: 55,
      longitude: 0,
      image: '/assets/satellites/gps.jpg'
    },
    {
      id: 'landsat-9',
      name: 'Landsat 9',
      type: 'Earth Observation',
      altitude: 705,
      inclination: 98.2,
      period: 99,
      velocity: 7.5,
      launchDate: '2021-09-27',
      status: 'Active',
      country: 'USA',
      description: 'Earth observation satellite for land monitoring.',
      latitude: 98.2,
      longitude: 0,
      image: '/assets/satellites/landsat.jpg'
    },
    {
      id: 'starlink-1',
      name: 'Starlink-1',
      type: 'Communication',
      altitude: 550,
      inclination: 53,
      period: 95,
      velocity: 7.5,
      launchDate: '2019-05-24',
      status: 'Active',
      country: 'USA',
      description: 'Part of SpaceX\'s satellite internet constellation.',
      latitude: 53,
      longitude: 0,
      image: '/assets/satellites/starlink.jpg'
    }
  ]

  return satellites
}

// Write the data files
const writeDataFiles = () => {
  try {
    // Write missions data
    const missionsData = generateMissions()
    fs.writeFileSync(
      path.join(apiDir, 'missions.json'),
      JSON.stringify(missionsData, null, 2)
    )
    console.log('✅ Generated missions.json with', missionsData.length, 'missions')

    // Write exoplanets data
    const exoplanetsData = generateExoplanets()
    fs.writeFileSync(
      path.join(apiDir, 'exoplanets.json'),
      JSON.stringify(exoplanetsData, null, 2)
    )
    console.log('✅ Generated exoplanets.json with', exoplanetsData.length, 'exoplanets')

    // Write satellites data
    const satellitesData = generateSatellites()
    fs.writeFileSync(
      path.join(apiDir, 'satellites.json'),
      JSON.stringify(satellitesData, null, 2)
    )
    console.log('✅ Generated satellites.json with', satellitesData.length, 'satellites')

    console.log('\n🎉 All sample data files generated successfully!')
    console.log('📁 Files created in:', apiDir)
  } catch (error) {
    console.error('❌ Error generating sample data:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  console.log('🚀 Generating NASA Explorer sample data...\n')
  writeDataFiles()
}

module.exports = {
  generateMissions,
  generateExoplanets,
  generateSatellites
}