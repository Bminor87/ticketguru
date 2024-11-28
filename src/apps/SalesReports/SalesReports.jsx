import { useEffect, useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { formatDateTime, countDuration } from "../../util/helperfunctions";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

const statsTemplate = [
  { name: "Total Events", value: 0 },
  { name: "Total Venues", value: 0 },
  { name: "Total Tickets", value: 0 },
  { name: "Tickets Sold", value: 0 },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SalesReports() {
  const { fetchEvents, fetchVenues, fetchTickets } = useApiService();
  const [stats, setStats] = useState(statsTemplate);
  const [activityItems, setActivityItems] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [events, venues, tickets] = await Promise.all([
          fetchEvents(),
          fetchVenues(),
          fetchTickets(),
        ]);

        const ticketsUsed = tickets.filter((ticket) => ticket.usedAt).length;

        setStats([
          { name: "Total Events", value: events.length },
          { name: "Total Venues", value: venues.length },
          { name: "Tickets sold", value: tickets.length },
          { name: "Tickets used", value: ticketsUsed },
        ]);

        setActivityItems([
          ...events.map((event) => ({
            user: { name: event.name, imageUrl: "" },
            id: event.id,
            type: "Event",
            status: new Date(event.endsAt) > new Date() ? "Active" : "Inactive",
            duration: `${countDuration(event.beingsAt, event.endsAt) || 0} hrs`,
            date: formatDateTime(event.beginsAt) || "Unknown",
            dateTime: event.beginsAt || "",
          })),
        ]);
      } catch (error) {
        console.error("Error loading statistics and activities:", error);
      }
    };

    loadStats();
  }, [fetchEvents, fetchVenues, fetchTickets]);

  return (
    <main>
      <header>
        <div className="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, statIdx) => (
            <div
              key={stat.name}
              className={classNames(
                statIdx % 2 === 1
                  ? "sm:border-l"
                  : statIdx === 2
                  ? "lg:border-l"
                  : "",
                "border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8"
              )}
            >
              <p className="text-sm/6 font-medium text-gray-400">{stat.name}</p>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {stat.value}
                </span>
              </p>
            </div>
          ))}
        </div>
      </header>

      <div className="border-t border-white/10 pt-11">
        <h2 className="px-4 text-base/7 font-semibold text-white sm:px-6 lg:px-8">
          Latest Events
        </h2>
        <table className="mt-6 w-full whitespace-nowrap text-left">
          <colgroup>
            <col className="w-full sm:w-4/12" />
            <col className="lg:w-4/12" />
            <col className="lg:w-2/12" />
            <col className="lg:w-1/12" />
            <col className="lg:w-1/12" />
          </colgroup>
          <thead className="border-b border-white/10 text-sm/6 text-white">
            <tr>
              <th
                scope="col"
                className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
              >
                Tickets sold
              </th>
              <th
                scope="col"
                className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
              >
                Status
              </th>
              <th
                scope="col"
                className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
              >
                Type
              </th>
              <th
                scope="col"
                className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
              >
                Duration
              </th>
              <th
                scope="col"
                className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {activityItems.map((item) => (
              <tr key={item.id}>
                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                  <div className="flex items-center gap-x-4">
                    <div className="truncate text-sm/6 font-medium text-white">
                      {item.user.name}
                    </div>
                  </div>
                </td>
                <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                  <div className="font-mono text-sm/6 text-gray-400"></div>
                </td>
                <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                  <div className="font-mono text-sm/6 text-gray-400">
                    {item.status}
                  </div>
                </td>
                <td className="py-4 pl-0 pr-4 text-sm/6 sm:pr-8 lg:pr-20">
                  <div className="text-white">{item.type}</div>
                </td>
                <td className="hidden py-4 pl-0 pr-8 text-sm/6 text-gray-400 md:table-cell lg:pr-20">
                  {item.duration}
                </td>
                <td className="hidden py-4 pl-0 pr-4 text-right text-sm/6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
