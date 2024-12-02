import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useApiService } from "../../service/ApiProvider";
import { findEvent, findTicketType } from "../../util/helperfunctions";
import { useSettings } from "../../SettingsContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SalesReports() {
  const { fetchTickets, fetchAllTicketTypes, fetchEvents, fetchReport } =
    useApiService();

  const { darkMode } = useSettings();

  const [stats, setStats] = useState([
    { name: "Total Events", value: 0 },
    { name: "Tickets Sold", value: 0 },
    { name: "Tickets Used", value: 0 },
    { name: "Total Revenue", value: 0 },
  ]);

  const currencyFormatter = (value) => {
    return Number(value).toLocaleString("fi-FI", {
      style: "currency",
      currency: "EUR",
    });
  };

  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [events, ticketTypes, tickets, report] = await Promise.all([
          fetchEvents(),
          fetchAllTicketTypes(),
          fetchTickets(),
          fetchReport(),
        ]);

        // Calculate stats
        const ticketsUsed = tickets.filter((ticket) => ticket.usedAt).length;
        setStats([
          { name: "Total Events", value: events?.length },
          { name: "Tickets Sold", value: tickets?.length },
          { name: "Tickets Used", value: ticketsUsed },
          {
            name: "Total Revenue",
            value: currencyFormatter(
              tickets?.reduce((acc, t) => acc + t.price, 0).toFixed(2)
            ),
          },
        ]);

        // Sort report data by event names
        const sortedReport = report.sort((a, b) => {
          const eventA = findEvent(a.eventId, events)?.name || "";
          const eventB = findEvent(b.eventId, events)?.name || "";
          return eventA.localeCompare(eventB);
        });

        setReportData(
          sortedReport.reduce((acc, row, index, array) => {
            const eventName =
              findEvent(row.eventId, events)?.name || "Unknown Event";
            const ticketTypeName =
              findTicketType(row.ticketTypeId, ticketTypes)?.name ||
              "Unknown Ticket Type";

            acc.push({
              eventName,
              ticketTypeName,
              ticketsSold: row.ticketsSold,
              totalRevenue: row.totalRevenue.toFixed(2),
              isTotalRow: false,
            });

            const isLastRowForEvent =
              index === array.length - 1 ||
              row.eventId !== array[index + 1].eventId;

            if (isLastRowForEvent) {
              const eventRows = array.filter((r) => r.eventId === row.eventId);
              const eventTicketsSold = eventRows.reduce(
                (sum, r) => sum + r.ticketsSold,
                0
              );
              const eventTicketsTotal = findEvent(
                row.eventId,
                events
              )?.totalTickets;
              const eventTotalRevenue = eventRows.reduce(
                (sum, r) => sum + r.totalRevenue,
                0
              );

              acc.push({
                eventName,
                ticketTypeName: "Total",
                ticketsSold: eventTicketsSold,
                ticketsTotal: eventTicketsTotal,
                totalRevenue: eventTotalRevenue.toFixed(2),
                isTotalRow: true,
              });
            }

            return acc;
          }, [])
        );

        console.log("Report data loaded:", reportData);
        console.log("events", events);
        console.log("ticketTypes", ticketTypes);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [fetchEvents, fetchTickets, fetchReport, fetchAllTicketTypes]);

  const columnDefs = [
    { headerName: "Event", field: "eventName", sortable: true, filter: true },
    {
      headerName: "Ticket Type",
      field: "ticketTypeName",
      sortable: true,
      filter: true,
    },
    { headerName: "Tickets Sold", field: "ticketsSold", sortable: true },
    { headerName: "Total Tickets", field: "ticketsTotal", sortable: true },
    {
      headerName: "Revenue",
      field: "totalRevenue",
      sortable: true,
      valueFormatter: (params) => currencyFormatter(params.value),
    },
  ];

  return (
    <main>
      {/* Stats Section */}
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

      {/* Sales Report Table */}
      <div className="border-t border-white/10 pt-11">
        <h2 className="px-4 text-base/7 font-semibold text-white sm:px-6 lg:px-8">
          Sales Reports
        </h2>
        <div
          className={`ag-theme-material ${
            darkMode ? "ag-theme-material-dark" : ""
          }`}
        >
          <AgGridReact
            rowData={reportData}
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
            }}
            animateRows={true}
            getRowStyle={(params) => {
              if (params.data.isTotalRow) {
                return { fontWeight: "bold", backgroundColor: "#2244cc44" };
              }
            }}
          />
        </div>
      </div>
    </main>
  );
}
