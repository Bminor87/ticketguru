import React from "react";

const SalesReports = () => {
  const dummyData = [
    { id: 1, item: "Product A", quantity: 10, total: 100 },
    { id: 2, item: "Product B", quantity: 5, total: 50 },
    { id: 3, item: "Product C", quantity: 8, total: 80 },
  ];

  return (
    <div>
      <h1>Sales Reports</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.item}</td>
              <td>{report.quantity}</td>
              <td>{report.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReports;
