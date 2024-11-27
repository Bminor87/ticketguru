export default function ErrorMessage({ error, errorCode }) {
  if (!error) return null;

  // TODO: Make this better for general use

  return (
    <div className="mt-5 text-sm text-red-600">
      <p>{error.message}</p>
      {error.code === errorCode && <p>Ticket already used!</p>}
    </div>
  );
}
