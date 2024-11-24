export default function ExampleBarcode({
  example,
  barcodeProperty,
  setBarcode,
  fetchTicketData,
}) {
  if (!example) return null;

  const handleExampleClick = () => {
    const exampleBarcode = example[barcodeProperty];
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
          {example[barcodeProperty]}
        </button>
      </p>
    </div>
  );
}
