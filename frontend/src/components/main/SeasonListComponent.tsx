import { useSearchParams } from "react-router-dom";
import type { Season } from "../../types";
import EditButton from "./EditButton";
import { useContext, useState } from "react";
import { PORTAL } from "../../App";
import ReactDOM from "react-dom"

type SeasonListProps = {
  seasonList: Season[];
};

const SeasonListComponent = ({ seasonList }: SeasonListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useContext(PORTAL);

  return (
    <div
      style={{ gridArea: "box-4" }}
      className="bg-[#2c293c] border-l border-gray-700 p-4 overflow-y-auto"
    >
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-rose-100 mb-4">Seasons</h2>
          {isAdmin && <EditButton type="addSeason" />}
        </div>
        <ul className="space-y-4">
          {seasonList && seasonList.length > 0 ? (
            seasonList.map((season) => (
              <li key={season.id}>
                <div
                  className="bg-[#2d2a3a]/80 backdrop-blur-md p-4 rounded-lg shadow border border-gray-700 hover:border-rose-400 transition-colors duration-200"
                  onClick={() => {
                    if (searchParams.get("sid") !== String(season.id)) {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set("sid", String(season.id));
                        return newParams;
                      });
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-base font-semibold text-rose-100">
                        Season {season.seasonNumber}
                      </span>{" "}
                    </div>
                    {season.isFinished ? (
                      <span className="text-sm text-green-400 ml-2">Finished</span>
                    ) : (
                      <span className="text-sm text-yellow-400 ml-2">Ongoing</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400 mt-2">
                      <p>
                        <strong>Start:</strong>{" "}
                        {new Date(season.startedAiring).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End:</strong>{" "}
                        {new Date(season.finishedAiring).toLocaleDateString()}
                      </p>
                    </div>
                    {/* 🔧 Add Edit Button for this season */}
                    {isAdmin && <EditButton type="season" season={season} />}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No seasons available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SeasonListComponent;
