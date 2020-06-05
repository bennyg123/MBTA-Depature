import "whatwg-fetch";
import React, { ChangeEvent, useState, useEffect } from "react";
import { COMMUTER_RAIL_STOPS, SCHEDULE_API_URL, parseSchedule } from "./utils";

const ROUTES = Object.keys(COMMUTER_RAIL_STOPS);

export default () => {
  // State variables to hold the selected route and selected stop
  const [selectedRoute, setSelectedRoute] = useState("Fairmount");
  const [selectedStop, setSelectedStop] = useState(
    COMMUTER_RAIL_STOPS["Fairmount"][0]
  );

  // state variable to hold the data
  const [schedule, setSchedule] = useState<any>();

  // Handler to set the selected route and default stop
  const handleRouteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoute(e.target.value);
    setSelectedStop(COMMUTER_RAIL_STOPS[selectedRoute][0]);
  };

  // Handler to set the selected stop
  const handleStopChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStop(e.target.value);
  };

  // Whenever the selected stop has changed, we fire an api call to the mbta api and set the results in the
  // schedule object after parsing
  useEffect(() => {
    fetch(`${SCHEDULE_API_URL}?filter[stop]=${selectedStop}&sort=arrival_time`)
      .then((response) => response.json())
      .then((schedule) => setSchedule(parseSchedule(schedule)));
  }, [selectedStop]);

  return (
    <div>
      <label htmlFor="routes">{`Please select a Route: `}</label>
      <select name="routes" id="routes" onChange={handleRouteChange}>
        {ROUTES.map((route) => (
          <option value={route} selected={route === selectedRoute}>
            {route}
          </option>
        ))}
      </select>

      <br />

      <label htmlFor="stops">{`Please select a Stop: `}</label>
      <select name="stops" id="stops" onChange={handleStopChange}>
        {COMMUTER_RAIL_STOPS[selectedRoute].map((stop) => (
          <option value={stop}>{stop}</option>
        ))}
      </select>

      {schedule && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div>
            <h3>Inbound</h3>
            {Object.keys(schedule["inbound"]).map((stops) => (
              <React.Fragment key={stops}>
                <h5>{stops.split("-")[1]}</h5>
                {schedule["inbound"][stops].map(
                  (r) =>
                    r.arrivalTime && (
                      <React.Fragment key={r.trip}>
                        <div>Inbound To: <b>{r.headingTo}</b></div>
                        <div>Arriving At: <b>{r.arrivalTime}</b></div>
                        <div>Trip ID: <b>{r.trip}</b></div>
                        <br />
                      </React.Fragment>
                    )
                )}
              </React.Fragment>
            ))}
          </div>

          <div>
            <h3>Outbound</h3>
            {Object.keys(schedule["outbound"]).map((stops) => (
              <React.Fragment key={stops}>
                <h5>{stops.split("-")[1]}</h5>
                {schedule["outbound"][stops].map(
                  (r) =>
                    r.arrivalTime && (
                      <React.Fragment key={r.trip}>
                        <div>Outbound To: <b>{r.headingTo}</b></div>
                        <div>Arriving At: <b>{r.arrivalTime}</b></div>
                        <div>Trip ID: <b>{r.trip}</b></div>
                        <br />
                      </React.Fragment>
                    )
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
