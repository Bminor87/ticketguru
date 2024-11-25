export default function ExampleBarcode({
  example,
  setBarcode,
  fetchTicketData,
}) {
  if (!example) return null;

  const handleExampleClick = () => {
    const exampleBarcode = example?.barcode;
    setBarcode(exampleBarcode);
    fetchTicketData(exampleBarcode);
  };

  return (
    <div className="mt-5 text-sm text-gray-500">
      <p>
        Try this:{" "}
        <button
          onClick={handleExampleClick}
          className="text-indigo-600 hover:underline"
        >
          {example?.barcode}
        </button>
      </p>
    </div>
  );
}
