// All the ID's for the commuter rails and the id's for the stops
export const COMMUTER_RAIL_STOPS = {
  Fairmount: [
    "Foxboro",
    "Dedham Corp Center",
    "Readville",
    "Fairmount",
    "Blue Hill Avenue",
    "Morton Street",
    "Talbot Avenue",
    "Four Corners / Geneva",
    "Uphams Corner",
    "Newmarket",
    "South Station",
  ],
  Fitchburg: [
    "Wachusett",
    "Fitchburg",
    "North Leominster",
    "Shirley",
    "Ayer",
    "Littleton / Rte 495",
    "South Acton",
    "West Concord",
    "Concord",
    "Lincoln",
    "Kendal Green",
    "Brandeis/ Roberts",
    "Waltham",
    "Waverley",
    "Belmont",
    "Porter Square",
    "North Station",
  ],
  Worcester: [
    "Worcester",
    "Grafton",
    "Westborough",
    "Southborough",
    "Ashland",
    "Framingham",
    "West Natick",
    "Natick Center",
    "Wellesley Square",
    "Wellesley Hills",
    "Wellesley Farms",
    "Auburndale",
    "West Newton",
    "Newtonville",
    "Boston Landing",
    "Yawkey",
    "Back Bay",
    "South Station",
  ],
  Franklin: [
    "Forge Park / 495",
    "Franklin",
    "Norfolk",
    "Walpole",
    "Windsor Gardens",
    "Norwood Central",
    "Norwood Depot",
    "Islington",
    "Dedham Corp Center",
    "Endicott",
    "Readville",
    "Ruggles",
    "Back Bay",
    "South Station",
    "Foxboro",
    "Fairmount",
    "Blue Hill Avenue",
    "Morton Street",
    "Talbot Avenue",
    "Four Corners / Geneva",
    "Uphams Corner",
    "Newmarket",
  ],
  Greenbush: [
    "Greenbush",
    "North Scituate",
    "Cohasset",
    "Nantasket Junction",
    "West Hingham",
    "East Weymouth",
    "Weymouth Landing/ East Braintree",
    "Quincy Center",
    "JFK/UMASS",
    "South Station",
    "Greenbush-S",
    "North Scituate-S",
    "Cohasset-S",
    "Nantasket Junction-S",
    "West Hingham-S",
    "East Weymouth-S",
    "Weymouth Landing / East Braintree-S",
    "38671",
    "121",
    "South Station-S",
  ],
  Haverhill: [
    "Haverhill",
    "Bradford",
    "Lawrence",
    "Andover",
    "Ballardvale",
    "North Wilmington",
    "Reading",
    "Wakefield",
    "Greenwood",
    "Melrose Highlands",
    "Melrose Cedar Park",
    "Wyoming Hill",
    "Malden Center",
    "North Station",
  ],
  Kingston: [
    "Kingston",
    "Halifax",
    "Hanson",
    "Whitman",
    "Abington",
    "South Weymouth",
    "Braintree",
    "Quincy Center",
    "JFK/UMASS",
    "South Station",
    "Plymouth",
  ],
  Lowell: [
    "Lowell",
    "North Billerica",
    "Wilmington",
    "Anderson/ Woburn",
    "Winchester Center",
    "Wedgemere",
    "West Medford",
    "North Station",
  ],
  Middleborough: [
    "South Station",
    "JFK/UMASS",
    "Quincy Center",
    "Braintree",
    "Holbrook/ Randolph",
    "Montello",
    "Brockton",
    "Campello",
    "Bridgewater",
    "Middleborough/ Lakeville",
  ],
  Needham: [
    "South Station",
    "Back Bay",
    "Ruggles",
    "Forest Hills",
    "Roslindale Village",
    "Bellevue",
    "Highland",
    "West Roxbury",
    "Hersey",
    "Needham Junction",
    "Needham Center",
    "Needham Heights",
  ],
  Newburyport: [
    "Rockport",
    "Gloucester",
    "West Gloucester",
    "Manchester",
    "Beverly Farms",
    "Montserrat",
    "Beverly",
    "Salem",
    "Swampscott",
    "Lynn",
    "River Works / GE Employees Only",
    "Chelsea",
    "North Station",
    "Newburyport",
    "Rowley",
    "Ipswich",
    "Hamilton/ Wenham",
    "North Beverly",
  ],
  Providence: [
    "South Station",
    "Back Bay",
    "Ruggles",
    "Hyde Park",
    "Route 128",
    "Canton Junction",
    "Sharon",
    "Mansfield",
    "Attleboro",
    "South Attleboro",
    "Providence",
    "Wickford Junction",
    "TF Green Airport",
    "Stoughton",
    "Canton Center",
  ],
};

// API Constant
export const SCHEDULE_API_URL = "https://api-v3.mbta.com/schedules";

// Formates a date time string to 12 hour time format
const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

// Takes in the schedule object and returns a parsed object to be displayed
export function parseSchedule(response: {
  data: [
    {
      attributes: {
        arrival_time: string;
        depature_time: string | null;
        direction_id: number;
      };
      relationships: {
        route: {
          data: {
            id: string;
          };
        };
        stop: {
          data: {
            id: string;
          };
        };
        trip: {
          data: {
            id: string;
          };
        };
      };
    }
  ];
}) {
  let inbound = {};
  let outbound = {};

  response.data.forEach((r) => {
    const route = r.relationships.route.data.id.split("-")[1];
    const stops = COMMUTER_RAIL_STOPS[route];

    if (!inbound[r.relationships.route.data.id]) {
      inbound[r.relationships.route.data.id] = [];
    }

    if (!outbound[r.relationships.route.data.id]) {
      outbound[r.relationships.route.data.id] = [];
    }

    if (r.attributes.direction_id === 1) {
      // inbound
      inbound[r.relationships.route.data.id].push({
        headingTo: stops[stops.length - 1],
        arrivalTime:
          r.attributes.arrival_time &&
          formatAMPM(new Date(r.attributes.arrival_time)),
        direction: "Inbound",
        trip: r.relationships.trip.data.id,
      });
    } else {
      outbound[r.relationships.route.data.id].push({
        headingTo: stops[0],
        arrivalTime:
          r.attributes.arrival_time &&
          formatAMPM(new Date(r.attributes.arrival_time)),
        direction: "Outbound",
        trip: r.relationships.trip.data.id,
      });
    }
  });

  return {
    inbound,
    outbound,
  };
}
