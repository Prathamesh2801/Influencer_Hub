import { useEffect, useState } from "react";
import { getAllScores } from "../../api/ScoreBoard/ScoreBoardAPI";

export default function LeaderBoardRecords() {
  const [scores, setScores] = useState([]);
  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await getAllScores();
        if (response.data?.Status) {
          setScores(response.data.Data);
        } else {
          console.error("Failed to fetch scores:", response.data?.Message);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    }

    fetchScores();
  }, []);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">ScoreBoard</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your ScoreBoard including their
            Rank,name, videos, score .
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div> */}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 border-2 border-pink-300  ">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Creator Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total Videos
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {scores.map((user, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-3">
                      {user.rank}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {user.username}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {user.total_videos}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {user.total_score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
