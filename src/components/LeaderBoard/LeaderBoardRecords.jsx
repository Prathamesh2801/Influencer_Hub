import { useEffect, useState } from "react";
import { getAllScores } from "../../api/ScoreBoard/ScoreBoardAPI";
import toast from "react-hot-toast";

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
        toast.error(error.response?.data?.Message || "Failed to Fetch Scores");
        console.error("API error:", error);
      }
    }

    fetchScores();
  }, []);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-[#E4007C]">ScoreBoard</h1>
          <p className="mt-2 text-sm text-[#FF2D99]">
            A list of all the users in your ScoreBoard including their
            Rank,name, videos, score .
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root rounded-xl border border-[#E4007C] p-5">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
            <table className="min-w-full divide-y bg-[#FFC3E2] divide-gray-300 border-2 border-pink-300   ">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-[#E4007C] sm:pl-3"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-[#E4007C]"
                  >
                    Creator Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-[#E4007C]"
                  >
                    Total Videos
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-[#E4007C]"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {scores.map((user, index) => (
                  <tr key={index} className="even:bg-[#FFF1F7]">
                    <td className="py-4 pr-3 pl-4 text-sm font-medium text-black sm:pl-3">
                      {user.rank}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {user.username}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {user.total_videos}
                    </td>
                    <td className="px-3 py-4 text-md font-bold text-[#E4007C]">
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
