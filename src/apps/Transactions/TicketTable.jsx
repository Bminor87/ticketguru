export default function TicketTable({ tickets }) {
  const styles = {
    header: {
      border: "1px solid #ddd",
      padding: "8px",
      backgroundColor: "#2e2e2e",
      textAlign: "left",
    },
    cell: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
    },
  };
  return (
    <table
      style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}
    >
      <thead>
        <tr>
          <th style={styles.header}>ID</th>
          <th style={styles.header}>Barcode</th>
          <th style={styles.header}>Used At</th>
          <th style={styles.header}>Price (€)</th>
          <th style={styles.header}>Sale ID</th>
          <th style={styles.header}>Ticket Type ID</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td style={styles.cell}>{ticket.id}</td>
            <td style={styles.cell}>{ticket.barcode}</td>
            <td style={styles.cell}>{ticket.usedAt || "Not Used"}</td>
            <td style={styles.cell}>{ticket.price.toFixed(2)}</td>
            <td style={styles.cell}>{ticket.saleId}</td>
            <td style={styles.cell}>{ticket.ticketTypeId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
